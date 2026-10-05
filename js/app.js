let PLAN_SCORE={c:0,t:0};
let CURRENT_PLAN=null;

function fenFromSans(sans){let fen=INIT;for(const san of sans){const u=san2uci(fen,san);if(!u)return fen;fen=applyUci(fen,u);}return fen;}
function renderPlanInfo(p){
  document.getElementById('planinfo').innerHTML=`<div style="font-family:'Playfair Display',serif;color:var(--acc);font-size:1rem;margin-bottom:6px">${p.title}</div>
  <div class="planmeta"><div class="planbox"><b>Your goal</b><span>${p.goal}</span></div><div class="planbox"><b>Pawn breaks</b><span>${p.breaks}</span></div><div class="planbox"><b>Piece map</b><span>${p.pieces}</span></div><div class="planbox"><b>Opponent wants</b><span>${p.opp}</span></div><div class="planbox"><b>Trigger</b><span>${p.trigger}</span></div><div class="planbox"><b>Common mistake</b><span>${p.mistake}</span></div></div>
  <div class="tagrow"><span class="tag">${p.side}</span><span class="tag">${p.eco}</span><span class="tag">plan-first training</span></div>`;
}
function startPlanQuiz(){
  CURRENT_PLAN=PLAN_DB[Math.floor(Math.random()*PLAN_DB.length)];
  FEN=fenFromSans(CURRENT_PLAN.sans);HIST=[FEN];SANS=[];SEL=null;LDOTS=[];LF=null;LT=null;
  FLIPPED=CURRENT_PLAN.side==='Black';drawBoard();drawMoveList();
  document.getElementById('opname').textContent=CURRENT_PLAN.title;
  document.getElementById('opeco').textContent=CURRENT_PLAN.eco;
  document.getElementById('note').innerHTML='<em>Plan training: understand the position before calculating moves.</em>';
  document.getElementById('planq').innerHTML='<strong>'+CURRENT_PLAN.q+'</strong>';
  renderPlanInfo(CURRENT_PLAN);
  const el=document.getElementById('planopts');el.innerHTML='';
  const order=CURRENT_PLAN.opts.map((x,i)=>({x,i})).sort(()=>Math.random()-.5);
  order.forEach(o=>{const b=document.createElement('button');b.className='qopt';b.textContent=o.x;b.onclick=()=>{
    if(b.dataset.done)return;PLAN_SCORE.t++;el.querySelectorAll('.qopt').forEach(x=>{x.dataset.done='1';x.onclick=null;});
    if(o.i===CURRENT_PLAN.a){b.classList.add('right');PLAN_SCORE.c++;setStat('✓ Correct — now read the blueprint and connect the plan to the board.','ok');}
    else{b.classList.add('wrong');[...el.children].forEach(x=>{if(x.textContent===CURRENT_PLAN.opts[CURRENT_PLAN.a])x.classList.add('right')});setStat('✗ Not the main plan. Study the blueprint before the next position.','bad');}
    document.getElementById('psc').textContent=PLAN_SCORE.c+' / '+PLAN_SCORE.t;
    localStorage.setItem('chesstool_plan_score',JSON.stringify(PLAN_SCORE));
  };el.appendChild(b);});
}
function loadProgress(){try{const x=JSON.parse(localStorage.getItem('chesstool_plan_score')||'null');if(x&&Number.isFinite(x.c)&&Number.isFinite(x.t))PLAN_SCORE=x;}catch(e){}document.getElementById('psc').textContent=PLAN_SCORE.c+' / '+PLAN_SCORE.t;}


// ─── POSITION-BASED REPERTOIRE INDEX ───────────────────────────────────────
// FEN halfmove/fullmove counters are not part of chess-position identity.
// Using the first four fields lets equivalent move orders transpose cleanly.
function repertoirePositionKey(fen){
  return (fen||'').split(/\s+/).slice(0,4).join(' ');
}
const REPERTOIRE_POSITION_INDEX=(()=>{
  const idx={};
  for(const line of DLINES){
    let fen=INIT;
    for(let ply=0;ply<line.sans.length;ply++){
      const san=line.sans[ply],key=repertoirePositionKey(fen);
      const u=san2uci(fen,san);
      if(!u)break;
      const next=applyUci(fen,u),nextKey=repertoirePositionKey(next);
      if(!idx[key])idx[key]={moves:{},lines:new Set()};
      idx[key].moves[san]={nextKey,lineId:line.id,color:line.color,ply};
      idx[key].lines.add(line.id);
      if(!idx[nextKey])idx[nextKey]={moves:{},lines:new Set()};
      idx[nextKey].lines.add(line.id);
      fen=next;
    }
  }
  return idx;
})();
function repertoireMoveStatus(fen,san){
  try{
    const key=repertoirePositionKey(fen),node=REPERTOIRE_POSITION_INDEX[key];
    if(node?.moves?.[san])return{inBook:true,transposition:false,lineId:node.moves[san].lineId};
    const u=san2uci(fen,san);
    if(!u)return{inBook:false,transposition:false};
    const nextKey=repertoirePositionKey(applyUci(fen,u));
    const nextNode=REPERTOIRE_POSITION_INDEX[nextKey];
    // If the move lands directly on a stored repertoire position, recognize it
    // as a transposition even if this exact SAN was not stored from this move order.
    if(nextNode&&nextNode.lines.size)return{inBook:true,transposition:true,lineId:[...nextNode.lines][0]};
  }catch(e){}
  return{inBook:false,transposition:false};
}
function isRepertoireMove(fen,san){return repertoireMoveStatus(fen,san).inBook;}

// ─── PERSISTENT MISTAKE TRENDS · V2.20 ─────────────────────────────────────
const MISTAKE_LOG_KEY='chesstool_mistake_log_v1';
const MISTAKE_LOG_MAX_GAMES=60;
let TREND_FILTER='';
let MISTAKE_REPLAY=null; // V2.26: fresh-verified replay state; cached review best is advisory only
let MISTAKE_DRILL={items:[],index:0,solved:0,attempts:0};
function loadMistakeLog(){
  try{const x=JSON.parse(localStorage.getItem(MISTAKE_LOG_KEY)||'[]');return Array.isArray(x)?x:[];}catch(e){return[];}
}
let MISTAKE_GAMES=loadMistakeLog();
function mistakePhase(ply,inBook){
  const n=Math.floor(ply/2)+1;
  if(inBook||n<=8)return'Opening';
  if(n<=20)return'Early middlegame';
  if(n<=35)return'Middlegame';
  return'Endgame';
}
function evalImpact(beforeEval,afterEval,mover,grade){
  if(beforeEval?.kind==='mate'){
    const hadMate=(mover==='w'&&beforeEval.value>0)||(mover==='b'&&beforeEval.value<0);
    const stillMate=afterEval?.kind==='mate'&&((mover==='w'&&afterEval.value>0)||(mover==='b'&&afterEval.value<0));
    if(hadMate&&!stillMate)return 12;
  }
  if(afterEval?.kind==='mate'){
    const getsMated=(mover==='w'&&afterEval.value<0)||(mover==='b'&&afterEval.value>0);
    if(getsMated)return 15;
  }
  if(beforeEval?.kind==='cp'&&afterEval?.kind==='cp')
    return Math.max(0,mover==='w'?beforeEval.value-afterEval.value:afterEval.value-beforeEval.value);
  return({Inaccuracy:.5,Mistake:1.5,Miss:2.5,Blunder:3.5}[grade]||.5);
}
function severityWeight(grade,impact){
  // Impact drives the long-term trend more than the label. This prevents five
  // tiny inaccuracies from outweighing one game-changing tactical blunder.
  const g={Inaccuracy:.35,Mistake:1.0,Miss:1.5,Blunder:2.0}[grade]||.35;
  const imp=Math.max(0,impact||0);
  if(imp>=12)return 12;                 // mate / missed forced mate
  return +(g+Math.min(8,imp)*1.15).toFixed(2);
}
function evalForMover(ev,mover){
  if(!ev)return null;
  if(ev.kind==='mate'){
    const good=(mover==='w'&&ev.value>0)||(mover==='b'&&ev.value<0);
    return good?100:-100;
  }
  if(ev.kind==='cp')return mover==='w'?ev.value:-ev.value;
  return null;
}
function alreadyDecisivelyLost(beforeEval,mover){
  const v=evalForMover(beforeEval,mover);
  return v!=null&&v<=-6;
}
function shouldLogMistake(grade,impact,inBook,beforeEval=null,afterEval=null,mover=null){
  if(!['Inaccuracy','Mistake','Miss','Blunder'].includes(grade))return false;
  if(inBook)return false; // Book is never a mistake category.

  // Garbage-time filter: once the mover is already decisively lost, later
  // engine-label noise should not become a permanent bad habit. The moves
  // that CAUSED the collapse remain logged because their before-eval was not lost.
  if(mover&&alreadyDecisivelyLost(beforeEval,mover))return false;

  if(grade==='Inaccuracy')return impact>=.75; // filter engine-noise inaccuracies
  if(grade==='Mistake')return impact>=.45;
  return true;
}
function mistakeTheme(category){
  const map={
    'Rook placement / coordination':'Coordination & threat awareness',
    'Piece activity / coordination':'Coordination & threat awareness',
    'Queen placement / coordination':'Coordination & threat awareness',
    'Hanging / undefended piece':'Coordination & threat awareness',
    'Missed opponent threat':'Coordination & threat awareness',
    'Tactical oversight':'Calculation & forcing moves',
    'Calculation / exchanges':'Calculation & forcing moves',
    'Missed tactic':'Calculation & forcing moves',
    'Missed forced mate':'Calculation & forcing moves',
    'King safety / mate threat':'King safety & forcing threats',
    'King placement / safety':'King safety & forcing threats',
    'Central pawn / structure decision':'Pawn structure & timing',
    'Pawn structure / technique':'Pawn structure & timing',
    'Pawn / endgame technique':'Pawn structure & timing',
    'Premature attack / pawn weakening':'Pawn structure & timing',
    'Premature queen move / tempo':'Planning & tempi',
    'Positional decision / plan':'Planning & tempi'
  };
  return map[category]||'Planning & tempi';
}
function themeAdvice(theme){
  const advice={
    'Coordination & threat awareness':'Before making an active-looking move, identify the opponent’s strongest check, capture, and threat. Then ask whether your move improves the whole position without leaving a defender, file, diagonal, or piece overloaded.',
    'Calculation & forcing moves':'Before committing, calculate checks and captures for both sides through the end of the forcing sequence—not just your first idea.',
    'King safety & forcing threats':'Before changing king safety, scan checks, mating nets, open files/diagonals, and escape squares.',
    'Pawn structure & timing':'Before a pawn move, ask what squares, files, and piece routes it changes permanently, and whether the timing helps your pieces more than the opponent’s.',
    'Planning & tempi':'When there is no forcing tactic, improve the worst piece and avoid spending a tempo on a move that does not address the opponent’s plan.'
  };
  return advice[theme]||'Pause before committing and compare your move with the opponent’s strongest forcing reply.';
}
function exactTacticalText(txt,words){
  return words.some(w=>txt.includes(w));
}
function mistakeCategory(entry,beforeFen,afterFen,grade,explanation,beforeEval,afterEval,plyIndex,impact=0){
  const txt=(explanation||'').toLowerCase(),mover=parseFen(beforeFen).turn;
  const moveNo=Math.floor(plyIndex/2)+1;

  // Mate categories only trigger from actual engine mate state or explicit
  // whole-word mate language. V2.20 accidentally matched "estimated" because
  // it contains the letters "mate".
  if(beforeEval?.kind==='mate'){
    const had=(mover==='w'&&beforeEval.value>0)||(mover==='b'&&beforeEval.value<0);
    const kept=afterEval?.kind==='mate'&&((mover==='w'&&afterEval.value>0)||(mover==='b'&&afterEval.value<0));
    if(had&&!kept)return'Missed forced mate';
  }
  if(afterEval?.kind==='mate'){
    const bad=(mover==='w'&&afterEval.value<0)||(mover==='b'&&afterEval.value>0);
    if(bad)return'King safety / mate threat';
  }
  if(/\b(checkmate|mate|mating)\b/.test(txt))return'King safety / mate threat';

  if(exactTacticalText(txt,['captures the piece you just moved','loose piece','undefended piece','wins a piece','can be captured']))
    return'Hanging / undefended piece';

  if(exactTacticalText(txt,['forcing capture','capture/recapture','full capture','exchange sequence']))
    return'Calculation / exchanges';

  if(exactTacticalText(txt,['forcing reply','direct threat','opponent has the','missed opponent']))
    return'Missed opponent threat';

  if(grade==='Miss')return'Missed tactic';

  try{
    const {bd}=parseFen(beforeFen),from=entry.uci.slice(0,2),to=entry.uci.slice(2,4);
    const ff=from.charCodeAt(0)-97,fr=+from[1]-1,pc=GP(bd,fr,ff);
    const P=pc&&pc.toUpperCase();

    if(P==='Q'&&moveNo<=15)return'Premature queen move / tempo';

    if(P==='P'){
      if(['f','g','h'].includes(to[0])){
        // Pawn pushes near the king deserve their own bucket instead of being
        // mislabeled as generic king-safety errors.
        return moveNo<=30?'Premature attack / pawn weakening':(mistakePhase(plyIndex,false)==='Endgame'?'Pawn / endgame technique':'Pawn structure / technique');
      }
      if(['c','d','e'].includes(to[0])&&moveNo<=22)return'Central pawn / structure decision';
      if(moveNo>35)return'Pawn / endgame technique';
    }

    if(P==='R')return'Rook placement / coordination';
    if(P==='N'||P==='B')return'Piece activity / coordination';
    if(P==='K')return'King placement / safety';
    if(P==='Q')return'Queen placement / coordination';
  }catch(e){}

  // Prefer a concrete chess diagnosis over the old catch-all "Decision quality".
  // Captures usually represent calculation/exchange choices; quiet moves that
  // cannot be identified more specifically remain a positional-decision bucket.
  try{
    const {bd}=parseFen(beforeFen),to=entry.uci.slice(2,4),tf=to.charCodeAt(0)-97,tr=+to[1]-1;
    if(GP(bd,tr,tf))return'Calculation / exchanges';
  }catch(e){}
  if(impact>=1.5||grade==='Blunder')return'Tactical oversight';
  return'Positional decision / plan';
}
function gameFingerprint(){return BOT_LOG.map(e=>e.uci).join('-');}
function reviewedGameResult(){
  try{const fen=REVIEW_FENS[REVIEW_FENS.length-1]||FEN,turn=parseFen(fen).turn,lm=legalMoves(fen);if(lm.length)return'completed';if(!inCheck(fen,turn))return'draw';const userSide=BOT_GAME_COLOR==='white'?'w':'b';return turn===userSide?'loss':'win';}catch(e){return'completed';}
}
function whiteEvalToSide(ev,side){
  if(!ev)return null;
  if(ev.kind==='mate'){
    const whiteWinning=ev.value>0;
    const good=side==='w'?whiteWinning:!whiteWinning;
    return good?100:-100;
  }
  if(ev.kind==='cp')return side==='w'?ev.value:-ev.value;
  return null;
}
function reviewedGameSummary(){
  const side=BOT_GAME_COLOR==='white'?'w':'b', vals=[];
  REVIEW_RESULTS.forEach(r=>{
    const ev=r?.qualityAfter||r?.evalAfter||null,v=whiteEvalToSide(ev,side);
    if(v!=null)vals.push(v);
  });
  let reachedWinning=false,blownAdvantage=false,seenWin=false;
  vals.forEach(v=>{if(v>=1.5){reachedWinning=true;seenWin=true;}else if(seenWin&&v<=.25)blownAdvantage=true;});
  return {plyCount:BOT_LOG.length,maxEval:vals.length?Math.max(...vals):null,minEval:vals.length?Math.min(...vals):null,reachedWinning,blownAdvantage};
}
function gameProgressStats(g){
  const errs=(g.errors||[]),serious=errs.filter(x=>['Mistake','Miss','Blunder'].includes(x.grade));
  const major=errs.filter(x=>['Blunder','Miss'].includes(x.grade)||(x.impact||0)>=2);
  const first=serious.slice().sort((a,b)=>(a.ply||0)-(b.ply||0))[0]||null;
  const firstMajor=major.slice().sort((a,b)=>(a.ply||0)-(b.ply||0))[0]||null;
  const firstMove=first?Math.floor((first.ply||0)/2)+1:null;
  const firstMajorMove=firstMajor?Math.floor((firstMajor.ply||0)/2)+1:null;
  const before=first?evalForMover(first.beforeEval||null,first.mover||(first.fen?parseFen(first.fen).turn:null)):null;
  return {
    meaningful:errs.length,serious:serious.length,
    early:errs.filter(x=>(x.phase||mistakePhase(x.ply||0,false))==='Early middlegame').length,
    coordination:errs.filter(x=>(x.theme||mistakeTheme(x.category))==='Coordination & threat awareness').length,
    firstMove,firstBefore:before,
    clean:major.length===0,
    cleanStretch:firstMajorMove!=null?Math.max(0,firstMajorMove-1):(g.summary?.plyCount?Math.ceil(g.summary.plyCount/2):null),
    reachedWinning:!!g.summary?.reachedWinning,blownAdvantage:!!g.summary?.blownAdvantage,
    converted:!!g.summary?.reachedWinning&&g.result==='win',hasSummary:!!g.summary
  };
}
function pctDelta(a,b){if(!Number.isFinite(a)||!Number.isFinite(b)||Math.abs(b)<1e-9)return null;return (a-b)/Math.abs(b)*100;}
function fmtDelta(v,lowerBetter=true){
  if(v==null||!Number.isFinite(v))return '—';
  const improved=lowerBetter?v<0:v>0;
  return '<span class="'+(improved?'trendgood':(Math.abs(v)<3?'trendflat':'trendbad'))+'">'+(v>0?'↑ ':'↓ ')+Math.abs(v).toFixed(0)+'%</span>';
}
function average(a){const x=a.filter(Number.isFinite);return x.length?x.reduce((s,v)=>s+v,0)/x.length:null;}
function progressComparisonHtml(games){
  const ordered=games.slice().sort((a,b)=>(b.ts||0)-(a.ts||0));
  const recent=ordered.slice(0,10),previous=ordered.slice(10,20);
  if(recent.length<3)return '';
  const R=recent.map(gameProgressStats),P=previous.map(gameProgressStats);
  const rSer=average(R.map(x=>x.serious)),pSer=average(P.map(x=>x.serious));
  const rMean=average(R.map(x=>x.meaningful)),pMean=average(P.map(x=>x.meaningful));
  const rEarly=average(R.map(x=>x.early)),pEarly=average(P.map(x=>x.early));
  const rCoord=average(R.map(x=>x.coordination)),pCoord=average(P.map(x=>x.coordination));
  const rFirst=average(R.map(x=>x.firstMove)),pFirst=average(P.map(x=>x.firstMove));
  const rClean=R.filter(x=>x.clean).length/recent.length*100,pClean=P.length?P.filter(x=>x.clean).length/P.length*100:null;
  const rStretch=average(R.map(x=>x.cleanStretch)),pStretch=average(P.map(x=>x.cleanStretch));
  const rLongest=Math.max(0,...R.map(x=>x.cleanStretch).filter(Number.isFinite)),pLongest=P.length?Math.max(0,...P.map(x=>x.cleanStretch).filter(Number.isFinite)):null;
  const rBefore=average(R.map(x=>x.firstBefore)),pBefore=average(P.map(x=>x.firstBefore));
  const summarized=recent.filter(g=>g.summary),winReached=summarized.filter(g=>g.summary?.reachedWinning);
  const conversion=winReached.length?winReached.filter(g=>g.result==='win').length/winReached.length*100:null;
  const blown=winReached.length?winReached.filter(g=>g.summary?.blownAdvantage).length/winReached.length*100:null;
  const ds=pSer!=null?pctDelta(rSer,pSer):null,dc=pCoord!=null?pctDelta(rCoord,pCoord):null,df=pFirst!=null?pctDelta(rFirst,pFirst):null;
  let score=0,signals=0;[[ds,true],[dc,true],[df,false]].forEach(([v,lower])=>{if(v==null)return;signals++; if((lower&&v<-8)||(!lower&&v>8))score++; else if((lower&&v>8)||(!lower&&v<-8))score--;});
  const label=!previous.length?'Building baseline':score>=2?'Improving':score<=-2?'Needs attention':'Mixed / steady';
  const cls=label==='Improving'?'progressgood':(label==='Needs attention'?'progressbad':'');
  const metric=(name,val,prev,delta,lower=true,suffix='')=>'<div class="progressmetric"><span>'+name+'</span><b>'+(val==null?'—':val.toFixed(1)+suffix)+'</b><small>'+(previous.length?(prev==null?'No prior baseline':('Prev '+prev.toFixed(1)+suffix+' · '+fmtDelta(delta,lower))):'Need 10 more games for comparison')+'</small></div>';
  const extras='<div class="progressmetric"><span>Clean games</span><b>'+Math.round(rClean)+'%</b><small>'+(pClean==null?'No prior baseline':'Prev '+Math.round(pClean)+'% · '+fmtDelta(pctDelta(rClean,pClean),false,false))+'</small></div>'+ 
    '<div class="progressmetric"><span>Winning positions converted</span><b>'+(conversion==null?'Building data':Math.round(conversion)+'%')+'</b><small>'+(conversion==null?'Available for reviews completed after this update':('Blown advantage rate '+Math.round(blown||0)+'%'))+'</small></div>';
  return '<div class="progressbox"><div class="progresshead"><span>Recent form · last '+recent.length+(previous.length?' vs previous '+previous.length:'')+'</span><b class="'+cls+'">'+label+'</b></div><div class="progressgrid">'+
    metric('Serious errors / game',rSer,pSer,ds,true)+metric('Meaningful errors / game',rMean,pMean,pMean!=null?pctDelta(rMean,pMean):null,true)+
    metric('First serious error',rFirst,pFirst,df,false,' mv')+metric('Avg eval before first serious',rBefore,pBefore,pBefore!=null?pctDelta(rBefore,pBefore):null,false,'')+
    metric('Early middlegame errors / game',rEarly,pEarly,pEarly!=null?pctDelta(rEarly,pEarly):null,true)+metric('Coordination errors / game',rCoord,pCoord,dc,true)+
    metric('Longest clean stretch',rLongest,pLongest,pLongest!=null?pctDelta(rLongest,pLongest):null,false,' mv')+extras+
    '</div></div>';
}
function recentWeaknessHtml(games,all){
  const ordered=games.slice().sort((a,b)=>(b.ts||0)-(a.ts||0)),recentIds=new Set(ordered.slice(0,10).map(g=>g.id)),prevIds=new Set(ordered.slice(10,20).map(g=>g.id));
  if(prevIds.size<3)return '';
  const counts=ids=>{const m={};all.filter(x=>ids.has(x.gameId)).forEach(x=>m[x.category]=(m[x.category]||0)+1);return m;};
  const r=counts(recentIds),p=counts(prevIds),rg=Math.max(1,recentIds.size),pg=Math.max(1,prevIds.size);
  const emerging=Object.keys(r).map(k=>({k,rr:r[k]/rg,pr:(p[k]||0)/pg,n:r[k]})).filter(x=>x.n>=2&&x.rr>x.pr*1.45&&x.rr-x.pr>=.15).sort((a,b)=>(b.rr-b.pr)-(a.rr-a.pr))[0];
  if(!emerging)return '<div class="trendnote"><b>Recent weakness:</b> No new habit is spiking versus your previous 10 games.</div>';
  return '<div class="trendnote"><b>Emerging issue:</b> '+emerging.k+' is showing up more often recently ('+emerging.n+' times in the last '+recentIds.size+' games).</div>';
}
function saveMistakeTrends(){
  if(!BOT_LOG.length||!REVIEW_RESULTS.length)return;
  const fp=gameFingerprint(),errors=[];
  BOT_LOG.forEach((e,i)=>{
    if(e.byBot)return;const r=REVIEW_RESULTS[i];if(!r||!['Inaccuracy','Mistake','Miss','Blunder'].includes(r.grade))return;
    const before=REVIEW_FENS[i],after=REVIEW_FENS[i+1],mover=parseFen(before).turn,impact=evalImpact(r.beforeEval||null,r.qualityAfter||null,mover,r.grade),inBook=!!r.inBook;
    if(!shouldLogMistake(r.grade,impact,inBook,r.beforeEval||null,r.qualityAfter||null,mover))return;
    const category=mistakeCategory(e,before,after,r.grade,r.explanation,r.beforeEval||null,r.qualityAfter||null,i,impact);
    errors.push({move:reviewMoveLabel(i),san:e.san,grade:r.grade,category,theme:mistakeTheme(category),phase:mistakePhase(i,inBook),impact:+impact.toFixed(2),weight:severityWeight(r.grade,impact),best:r.bestSan||'',explanation:(r.explanation||'').slice(0,420),fen:before,ply:i,ts:Date.now(),beforeEval:r.beforeEval||null,afterEval:r.qualityAfter||null,mover});
  });
  const game={id:fp,ts:Date.now(),bot:BOT_LABEL,color:BOT_GAME_COLOR,result:reviewedGameResult(),summary:reviewedGameSummary(),errors};
  const existing=MISTAKE_GAMES.findIndex(g=>g.id===fp);if(existing>=0)MISTAKE_GAMES[existing]=game;else MISTAKE_GAMES.push(game);
  MISTAKE_GAMES=MISTAKE_GAMES.slice(-MISTAKE_LOG_MAX_GAMES);try{localStorage.setItem(MISTAKE_LOG_KEY,JSON.stringify(MISTAKE_GAMES));}catch(e){}renderMistakeTrends();
}
function normalizedTrendErrors(){
  return MISTAKE_GAMES.flatMap(g=>(g.errors||[]).map(x=>{
    const impact=Number.isFinite(x.impact)?x.impact:({Inaccuracy:.5,Mistake:1.5,Miss:2.5,Blunder:3.5}[x.grade]||.5);
    let category=x.category||'Positional decision / plan';

    // Normalize old category names and, where possible, re-run the current
    // semantic classifier from the saved position.
    if(category==='Pawn break / central decision')category='Central pawn / structure decision';
    if(category==='Decision quality')category='Positional decision / plan';
    if(x.fen&&Number.isFinite(x.ply)&&x.san){
      try{
        const u=san2uci(x.fen,x.san);
        if(u){
          const after=applyUci(x.fen,u);
          category=mistakeCategory({uci:u,san:x.san},x.fen,after,x.grade,x.explanation||'',x.beforeEval||null,x.afterEval||null,x.ply,impact);
        }
      }catch(e){}
    }
    const mover=x.mover||(x.fen?parseFen(x.fen).turn:null);
    return {...x,category,theme:mistakeTheme(category),gameTs:g.ts,gameId:g.id,bot:g.bot,phase:x.phase||mistakePhase(x.ply||0,false),impact,weight:severityWeight(x.grade,impact),mover};
  }).filter(x=>shouldLogMistake(x.grade,x.impact,false,x.beforeEval||null,x.afterEval||null,x.mover||null)));
}

function trendView(category){TREND_FILTER=TREND_FILTER===category?'':category;renderMistakeTrends();}
function replayEvalForMover(ev,mover){
  if(!ev)return null;
  if(ev.kind==='mate'){
    const good=(mover==='w'&&ev.value>0)||(mover==='b'&&ev.value<0);
    return good?100:-100;
  }
  if(ev.kind==='cp')return mover==='w'?ev.value:-ev.value;
  return null;
}
function replayEvalLoss(bestEval,candidateEval,mover){
  const b=replayEvalForMover(bestEval,mover),c=replayEvalForMover(candidateEval,mover);
  if(b==null||c==null)return null;
  if(Math.abs(b)>=90||Math.abs(c)>=90)return Math.max(0,b-c);
  return Math.max(0,b-c);
}
function replayReplyDescription(afterFen,replyUci){
  if(!replyUci||!isLegalEngineMove(afterFen,replyUci))return'';
  try{
    const san=uci2san(afterFen,replyUci);
    const purpose=movePurpose(afterFen,replyUci);
    return san+(purpose?' — '+purpose:'');
  }catch(e){return'';}
}
function trendViewPosition(gameId,ply){
  const g=MISTAKE_GAMES.find(x=>x.id===gameId),e=g?.errors?.find(x=>x.ply===ply);if(!e?.fen)return;
  const cachedBest=e.best?san2uci(e.fen,e.best):null;
  MISTAKE_REPLAY={
    gameId,ply,fen:e.fen,cachedBestUci:cachedBest,cachedBestSan:e.best||'',
    bestUci:null,bestSan:'',bestEval:null,playedSan:e.san||'',move:e.move||'',
    attempts:0,validating:true,checking:false
  };
  BOT_ACTIVE=false;BOT_THINKING=false;PRACTICE_LOCK=true;
  FEN=e.fen;HIST=[e.fen];SANS=[];FLIPPED=g.color==='black';SEL=null;LDOTS=[];LF=null;LT=null;
  refreshPanel();drawBoard();drawMoveList();
  const prompt=(MODE==='mistakes'?'Mistake Drill: ':'Replay ')+e.move+' '+e.san+'. Freshly verifying this position with Stockfish before you solve it…';
  setStat(prompt,'info');setCoach(prompt);
  document.getElementById('board')?.scrollIntoView({behavior:'smooth',block:'center'});

  sfAnalyzePositionFresh(e.fen,15,res=>{
    const r=MISTAKE_REPLAY;if(!r||r.gameId!==gameId||r.ply!==ply)return;
    r.validating=false;PRACTICE_LOCK=false;
    if(!res){
      const msg='Fresh verification was unavailable. Replay is paused rather than trusting the cached review move.';
      setStat(msg,'bad');setCoach(msg);r.checking=true;return;
    }
    const ev=infoWhiteEval(e.fen,res.info);evaluationPerspectiveSanity(e.fen,res.info,ev);
    r.bestUci=res.best;r.bestSan=uci2san(e.fen,res.best)||'';r.bestEval=ev;
    const changed=r.cachedBestUci&&r.cachedBestUci!==r.bestUci;
    const msg=(r.drill?'Mistake Drill verified. Find the strongest move.':'Position freshly verified. Find the strongest move.')+
      (changed?' The fresh search changed the old cached recommendation, so Replay will use the new analysis.':'');
    setStat(msg,'info');setCoach(msg);
  });
}
function buildMistakeDrillItems(){
  const games=MISTAKE_GAMES.slice().sort((a,b)=>(b.ts||0)-(a.ts||0)),items=[],seen=new Set();
  games.forEach(g=>{
    (g.errors||[]).forEach(e=>{
      if(!e.fen||seen.has(e.fen))return;
      const impact=Number.isFinite(e.impact)?e.impact:0;
      if(!(['Blunder','Miss'].includes(e.grade)||impact>=1.5))return;
      if(shouldLogMistake(e.grade,impact,false,e.beforeEval||null,e.afterEval||null,e.mover||(e.fen?parseFen(e.fen).turn:null))===false)return;
      seen.add(e.fen);items.push({gameId:g.id,ply:e.ply,grade:e.grade,impact,move:e.move||'',san:e.san||'',category:e.category||'',ts:g.ts||0});
    });
  });
  items.sort((a,b)=>(b.impact-a.impact)||((b.ts||0)-(a.ts||0)));
  // Keep the drill varied while still prioritizing the most painful positions.
  const top=items.slice(0,40);
  for(let i=top.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[top[i],top[j]]=[top[j],top[i]];}
  return top;
}
function updateMistakeDrillCard(){
  const count=document.getElementById('mdcount'),score=document.getElementById('mdscore'),meta=document.getElementById('mdmeta'),next=document.getElementById('mdnext');
  const total=MISTAKE_DRILL.items.length,pos=total?Math.min(MISTAKE_DRILL.index+1,total):0;
  if(count)count.textContent=total?pos+' / '+total:'0 positions';
  if(score)score.textContent=MISTAKE_DRILL.solved+' solved · '+MISTAKE_DRILL.attempts+' attempts';
  const item=MISTAKE_DRILL.items[MISTAKE_DRILL.index];
  if(meta)meta.textContent=item?((item.grade||'Mistake')+' · '+(item.category||'Saved mistake')+' · '+(item.impact>=12?'decisive':item.impact.toFixed(1)+' pawn impact')):'Complete and review bot games to build your mistake drill.';
  if(next)next.classList.add('hidden');
}
function startMistakeDrillPosition(index=0){
  if(!MISTAKE_DRILL.items.length){MISTAKE_DRILL.items=buildMistakeDrillItems();MISTAKE_DRILL.index=0;}
  if(!MISTAKE_DRILL.items.length){
    MISTAKE_REPLAY=null;fullReset();setStat('No serious saved mistakes yet. Complete Game Reviews first.','info');setCoach('Mistake Drill will automatically use your saved blunders, misses, and high-impact mistakes.');updateMistakeDrillCard();return;
  }
  MISTAKE_DRILL.index=((index%MISTAKE_DRILL.items.length)+MISTAKE_DRILL.items.length)%MISTAKE_DRILL.items.length;
  const item=MISTAKE_DRILL.items[MISTAKE_DRILL.index];
  trendViewPosition(item.gameId,item.ply);
  if(MISTAKE_REPLAY){MISTAKE_REPLAY.drill=true;MISTAKE_REPLAY.drillItem=item;}
  setStat('Mistake Drill '+(MISTAKE_DRILL.index+1)+'/'+MISTAKE_DRILL.items.length+' — find the best move.','info');
  setCoach('This is a position from one of your own serious mistakes. Solve it from scratch; Stockfish freshly verifies the answer.');
  updateMistakeDrillCard();
}
function nextMistakeDrill(){
  if(!MISTAKE_DRILL.items.length)return startMistakeDrillPosition(0);
  startMistakeDrillPosition(MISTAKE_DRILL.index+1);
}
function reshuffleMistakeDrill(){
  MISTAKE_DRILL.items=buildMistakeDrillItems();MISTAKE_DRILL.index=0;MISTAKE_DRILL.solved=0;MISTAKE_DRILL.attempts=0;startMistakeDrillPosition(0);
}
function mistakeReplayClick(rank,file){
  const r=MISTAKE_REPLAY;if(!r||r.validating||r.checking)return;
  const {bd,turn}=parseFen(FEN),p=GP(bd,rank,file);
  if(SEL){
    const hit=LDOTS.find(d=>d.r===rank&&d.f===file);
    if(hit){handleMistakeReplayMove(hit.uci);return;}
    if(p&&friendly(p,turn)){SEL={r:rank,f:file};LDOTS=getLegalDots(rank,file);drawBoard();return;}
    SEL=null;LDOTS=[];drawBoard();return;
  }
  if(p&&friendly(p,turn)){SEL={r:rank,f:file};LDOTS=getLegalDots(rank,file);drawBoard();}
}
function resetReplayPosition(r,delay=0){
  setTimeout(()=>{
    if(!MISTAKE_REPLAY||MISTAKE_REPLAY!==r)return;
    FEN=r.fen;HIST=[r.fen];SANS=[];SEL=null;LDOTS=[];LF=null;LT=null;
    r.checking=false;PRACTICE_LOCK=false;
    refreshPanel();drawBoard();drawMoveList();
  },delay);
}
function handleMistakeReplayMove(uci){
  const r=MISTAKE_REPLAY;if(!r||r.validating||r.checking)return;
  const originalFen=r.fen,mover=parseFen(originalFen).turn,san=uci2san(originalFen,uci);
  if(!san)return;
  r.attempts++;if(r.drill){MISTAKE_DRILL.attempts++;updateMistakeDrillCard();}r.checking=true;PRACTICE_LOCK=true;
  setLastUci(uci);
  const afterFen=applyUci(originalFen,uci);
  FEN=afterFen;HIST=[originalFen,afterFen];SANS=[san];SEL=null;LDOTS=[];drawBoard();drawMoveList();
  setStat('Verifying '+san+' from the original position…','info');
  setCoach('Fresh Stockfish verification is checking your correction and the opponent’s strongest reply.');

  // Same-parent search: score the move from the ORIGINAL position so the
  // candidate is comparable with the freshly verified best move.
  sfAnalyzePlayedMoveFresh(originalFen,uci,15,candidateRes=>{
    if(!MISTAKE_REPLAY||MISTAKE_REPLAY!==r)return;
    if(!candidateRes){
      const msg='Could not verify '+san+'. Replay will not mark it correct without a fresh engine result.';
      setStat(msg,'bad');setCoach(msg);resetReplayPosition(r,900);return;
    }
    const candidateEval=infoWhiteEval(originalFen,candidateRes.info);
    evaluationPerspectiveSanity(originalFen,candidateRes.info,candidateEval);
    const loss=replayEvalLoss(r.bestEval,candidateEval,mover);
    const exactBest=uci===r.bestUci;
    const nearBest=loss!=null&&loss<=0.35; // <= ~0.35 pawns from the fresh best.
    const accepted=exactBest||nearBest;

    // Analyze the resulting position too. This is the tactical sanity check:
    // Replay explicitly surfaces the opponent's strongest response.
    sfAnalyzePositionFresh(afterFen,14,replyRes=>{
      if(!MISTAKE_REPLAY||MISTAKE_REPLAY!==r)return;
      let reply='',afterEval=null;
      if(replyRes){
        reply=replayReplyDescription(afterFen,replyRes.best);
        afterEval=infoWhiteEval(afterFen,replyRes.info);
        evaluationPerspectiveSanity(afterFen,replyRes.info,afterEval);
      }
      const evalPart=afterEval?' Resulting eval: '+evalText(afterEval)+'.':'';
      const replyPart=reply?' Opponent’s strongest reply: '+reply+'.':'';
      const tries=r.attempts>1?' after '+r.attempts+' tries':'';

      if(accepted){
        const quality=exactBest?'fresh engine best move':'an engine-equivalent correction';
        const msg='✓ Verified — '+san+' is '+quality+tries+'.'+evalPart+replyPart;
        setStat(msg,'ok');setCoach(msg);
        if(r.drill){
          MISTAKE_DRILL.solved++;updateMistakeDrillCard();
          const next=document.getElementById('mdnext');if(next)next.classList.remove('hidden');
          setCoach(msg+' Nice correction. Tap Next Position when you are ready.');
        }
        // Keep the corrected position on the board so the user can SEE the
        // tactical consequence. Do not silently reset or auto-play the reply.
        r.checking=true;PRACTICE_LOCK=true;
        return;
      }

      const bestText=r.bestSan?' Fresh best: '+r.bestSan+'.':'';
      const lossText=loss!=null&&loss<90?' Your move is about '+loss.toFixed(2)+' pawns worse than the fresh best.':'';
      const msg='Not quite — '+san+' did not pass fresh verification.'+bestText+lossText+evalPart+replyPart+' Try the position again.';
      setStat(msg,'bad');setCoach(msg);resetReplayPosition(r,1700);
    });
  });
}

function renderMistakeTrends(){
  const host=document.getElementById('mistaketrends');if(!host)return;
  const games=MISTAKE_GAMES,all=normalizedTrendErrors();
  if(!games.length){host.innerHTML='<div class="trendempty">Complete a Game Review and your recurring mistakes will appear here.</div>';return;}
  if(!all.length){host.innerHTML='<div class="trendstats"><span><b>'+games.length+'</b> games</span><span><b>0</b> meaningful errors</span><span><b>0</b> serious</span></div><div class="trendempty">No meaningful mistakes have cleared the long-term trend threshold yet.</div>';return;}

  const newest=Math.max(...games.map(g=>g.ts||0),Date.now());
  const byCat={},byTheme={};
  all.forEach(x=>{
    const ageDays=Math.max(0,(newest-(x.ts||x.gameTs||newest))/86400000);
    const recency=Math.max(.65,1-Math.min(30,ageDays)*.012);

    const c=byCat[x.category]||(byCat[x.category]={n:0,w:0,focus:0,serious:0,games:new Set()});
    c.n++;c.w+=x.weight;c.focus+=x.weight*recency;c.games.add(x.gameId);
    c.serious+=['Mistake','Miss','Blunder'].includes(x.grade)?1:0;

    const theme=x.theme||mistakeTheme(x.category);
    const t=byTheme[theme]||(byTheme[theme]={n:0,w:0,rawFocus:0,focus:0,serious:0,games:new Set()});
    t.n++;t.w+=x.weight;t.rawFocus+=x.weight*recency;t.games.add(x.gameId);
    t.serious+=['Mistake','Miss','Blunder'].includes(x.grade)?1:0;
  });

  // Confidence multiplier rewards repeated evidence across moves and games.
  // A single giant error can still matter, but it cannot automatically outrank
  // a pattern that keeps appearing in several games.
  Object.values(byTheme).forEach(t=>{
    const occurrences=Math.min(6,t.n),gameCount=Math.min(4,t.games.size);
    const confidence=.55+.07*occurrences+.13*gameCount;
    t.confidence=Math.min(1.35,confidence);
    t.focus=t.rawFocus*t.confidence;
  });

  const ranked=Object.entries(byCat).sort((a,b)=>b[1].focus-a[1].focus);
  const themes=Object.entries(byTheme).sort((a,b)=>b[1].focus-a[1].focus);
  const totalW=ranked.reduce((s,x)=>s+x[1].w,0)||1;
  const totalThemeFocus=themes.reduce((s,x)=>s+x[1].focus,0)||1;

  const phase={};
  all.forEach(x=>{const o=phase[x.phase]||(phase[x.phase]={n:0,w:0});o.n++;o.w+=x.weight;});
  const serious=all.filter(x=>['Mistake','Miss','Blunder'].includes(x.grade)).length;

  const themeHtml=themes.slice(0,4).map(([k,v])=>
    '<div class="trendrow"><span><b>'+k+'</b><small>'+v.n+' occurrence'+(v.n===1?'':'s')+' across '+v.games.size+' game'+(v.games.size===1?'':'s')+' · '+Math.round(v.focus/totalThemeFocus*100)+'% focus</small></span><b>'+v.focus.toFixed(1)+'</b></div>'
  ).join('');

  const top=ranked.slice(0,5).map(([k,v])=>
    '<button class="trendrow trendbutton" onclick="trendView('+JSON.stringify(k).replace(/"/g,'&quot;')+')">'+
    '<span>'+k+' <small>'+Math.round(v.w/totalW*100)+'% impact · '+v.n+' occurrence'+(v.n===1?'':'s')+' · '+v.games.size+' game'+(v.games.size===1?'':'s')+'</small></span>'+
    '<b>'+v.focus.toFixed(1)+'</b></button>').join('');

  const totalPhaseWeight=all.reduce((s,z)=>s+z.weight,0)||1;
  const phaseHtml=['Opening','Early middlegame','Middlegame','Endgame'].map(k=>{
    const x=phase[k]||{n:0,w:0};
    return '<div class="phasepill"><b>'+x.n+'</b><span>'+k+'</span><small>'+Math.round(x.w/totalPhaseWeight*100)+'% impact</small></div>';
  }).join('');

  const filtered=(TREND_FILTER?all.filter(x=>x.category===TREND_FILTER):all)
    .slice().sort((x,y)=>(y.ts||y.gameTs)-(x.ts||x.gameTs)).slice(0,TREND_FILTER?12:5);

  const recentHtml=filtered.length?filtered.map(x=>{
    const g=games.find(z=>z.id===x.gameId)||games.find(z=>(z.errors||[]).some(q=>q.ts===x.ts&&q.ply===x.ply));
    const impactText=x.impact>=12?'decisive / mate':(x.impact>=.1?'~'+x.impact.toFixed(1)+' pawns':'small');
    return '<div class="recenterr"><div><b>'+x.move+' · '+x.grade+'</b><span>'+x.san+' · '+x.category+' · '+x.phase+(x.best?' · best '+x.best:'')+' · '+impactText+'</span></div>'+
      (x.fen&&g?'<button class="mini" onclick="trendViewPosition('+JSON.stringify(g.id).replace(/"/g,'&quot;')+','+x.ply+')">Replay</button>':'')+'</div>';
  }).join(''):'<div class="trendempty">No matching mistakes.</div>';

  const focus=themes[0];
  const focusText=focus
    ? 'Current focus: <b>'+focus[0]+'</b>. This theme has appeared '+focus[1].n+' time'+(focus[1].n===1?'':'s')+' across '+focus[1].games.size+' of '+games.length+' reviewed game'+(games.length===1?'':'s')+'. '+themeAdvice(focus[0])
    : '';

  const progressHtml=progressComparisonHtml(games);
  const recentWeakness=recentWeaknessHtml(games,all);
  host.innerHTML=
    progressHtml+
    '<div class="trendstats"><span><b>'+games.length+'</b> games</span><span><b>'+all.length+'</b> meaningful errors</span><span><b>'+serious+'</b> serious</span></div>'+recentWeakness+
    '<div class="trendsub">Game phase</div><div class="phasegrid">'+phaseHtml+'</div>'+
    '<div class="trendsub">Training themes · confidence adjusted</div>'+themeHtml+
    '<div class="trendsub">Specific habits · weighted by impact</div>'+top+
    '<div class="trendsub">'+(TREND_FILTER?'Mistakes · '+TREND_FILTER+' <button class="tinyclear" onclick="trendView(\'\')">show all</button>':'Recent meaningful mistakes')+'</div>'+
    recentHtml+'<div class="trendhint">'+focusText+'</div>';
}

function clearMistakeHistory(){if(!confirm('Clear all saved ChessTool mistake history?'))return;MISTAKE_GAMES=[];TREND_FILTER='';try{localStorage.removeItem(MISTAKE_LOG_KEY);}catch(e){}renderMistakeTrends();}

// ─── GAME STATE ──────────────────────────────────────────────────────────────
// CRITICAL: flipped is ONLY changed by explicit user action (flip button, toggle side, bot color, random line)
// It is NEVER changed automatically inside rendering or auto-play functions
let MODE='drill';
let STUDY_PHASE='opening'; // opening | middlegame
let STUDY_PLAN=null;
let STUDY_PLAN_START_PLY=0;
let STUDY_PLAN_TARGET_PLY=0;
let MID_RATING=1600;
let MID_PRE_ANALYSIS=null;
let MID_ANALYZING=false;
let MID_FEEDBACK='';
let FEN=INIT;
let HIST=[INIT];
let SANS=[];
let SEL=null;      // {r,f} selected square
let LDOTS=[];      // [{r,f,san,nextFen}] legal dot squares
let FLIPPED=false; // board orientation — only user changes this
let DRILL_COLOR='white'; // which side user drills as
let SEL_LINES=new Set(DLINES.map(l=>l.id));
let SESSION_COLOR='white';
let SESSION_STARTED=false;
let PRACTICE_LOCK=false;
let LF=null,LT=null; // last move from/to squares

// bot state
let BOT_ACTIVE=false,BOT_THINKING=false,BOT_SKILL=10,BOT_LABEL='1600',BOT_COLOR='white',BOT_GAME_COLOR='white';
let BOT_LOG=[];
// quiz state
let Q_SCORE={c:0,t:0};
let QUIZ_OPTIONS=[]; // [{uci,san,correct}]
let QUIZ_CORRECT=null;
let QUIZ_DONE=false;
let QUIZ_RESULT=null;
// stockfish
let SF=null,SF_CB=null,SF_READY=false,SF_FAILED=false,SF_TIMER=null,SF_READY_CB=null;
let SF_ANALYSIS_QUEUE=Promise.resolve();
let SF_LAST_INFO=null;
let SF_MULTI_INFO={};
let REVIEW_FENS=[],REVIEW_INDEX=0,REVIEW_RESULTS=[];
let REVIEW_MODE='fast'; // fast | deep
const ANALYSIS_CACHE_KEY='chesstool_analysis_cache_v13';
const ANALYSIS_CACHE_MAX=650;
let ANALYSIS_CACHE=loadAnalysisCache();
function loadAnalysisCache(){
  try{const raw=JSON.parse(localStorage.getItem(ANALYSIS_CACHE_KEY)||'{}');return raw&&typeof raw==='object'?raw:{};}catch(e){return{};}
}
function saveAnalysisCache(){
  try{const entries=Object.entries(ANALYSIS_CACHE);if(entries.length>ANALYSIS_CACHE_MAX){entries.sort((a,b)=>(a[1]?.ts||0)-(b[1]?.ts||0));ANALYSIS_CACHE=Object.fromEntries(entries.slice(entries.length-ANALYSIS_CACHE_MAX));}localStorage.setItem(ANALYSIS_CACHE_KEY,JSON.stringify(ANALYSIS_CACHE));}catch(e){}
}
function analysisCacheKey(kind,fen,depth,uci=''){return ['sf-v13',kind,depth,uci,fen].join('|');}
function analysisCacheGet(kind,fen,depth,uci=''){const x=ANALYSIS_CACHE[analysisCacheKey(kind,fen,depth,uci)];if(!x)return null;x.ts=Date.now();return x.result||null;}
function analysisCachePut(kind,fen,depth,uci,result){if(!result)return;ANALYSIS_CACHE[analysisCacheKey(kind,fen,depth,uci)]={ts:Date.now(),result};saveAnalysisCache();}
function setReviewMode(mode){
  REVIEW_MODE=mode==='deep'?'deep':'fast';
  document.getElementById('reviewfast')?.classList.toggle('on',REVIEW_MODE==='fast');
  document.getElementById('reviewdeep')?.classList.toggle('on',REVIEW_MODE==='deep');
  if(BOT_LOG.length&&document.getElementById('revcard')&&!document.getElementById('revcard').classList.contains('hidden')){REVIEW_RESULTS=[];renderReviewList();renderReviewDetail();analyzeReview();}
}
let LAST_COACH='';

// ─── BOARD RENDERING ─────────────────────────────────────────────────────────
// CRITICAL: drawBoard ONLY reads FLIPPED, never writes it
function drawBoard(){
  const{bd}=parseFen(FEN);
  const el=document.getElementById('board');
  el.innerHTML='';
  for(let vr=0;vr<8;vr++){
    for(let vf=0;vf<8;vf++){
      const rank=FLIPPED?vr:7-vr;
      const file=FLIPPED?7-vf:vf;
      const sq=document.createElement('div');
      sq.className='sq '+((rank+file)%2===0?'dk':'lt');
      if(LF&&LF.r===rank&&LF.f===file)sq.classList.add('lf');
      if(LT&&LT.r===rank&&LT.f===file)sq.classList.add('lt2');
      const p=GP(bd,rank,file);

      // In Quiz mode, show the candidate source pieces and four destination
      // squares directly on the board. The user answers by making a move.
      if(MODE==='quiz'&&QUIZ_OPTIONS.length){
        const srcOpts=QUIZ_OPTIONS.filter(o=>+o.uci[1]-1===rank&&o.uci.charCodeAt(0)-97===file);
        const dstOpts=QUIZ_OPTIONS.filter(o=>+o.uci[3]-1===rank&&o.uci.charCodeAt(2)-97===file);
        if(srcOpts.length)sq.classList.add('qsrc');
        if(dstOpts.length){
          sq.classList.add('qdest');
          const badge=document.createElement('span');
          badge.className='qbadge';
          badge.textContent=dstOpts[0].n;
          sq.appendChild(badge);
        }
        if(QUIZ_RESULT){
          const ur=S2A(rank,file);
          if(ur===QUIZ_RESULT.correctUci.slice(2,4))sq.classList.add('qrightsq');
          if(QUIZ_RESULT.chosenUci!==QUIZ_RESULT.correctUci&&ur===QUIZ_RESULT.chosenUci.slice(2,4))sq.classList.add('qwrongsq');
        }
      }

      if(p)sq.insertAdjacentHTML('afterbegin',PSV[p]||'');
      if(SEL&&SEL.r===rank&&SEL.f===file)sq.classList.add('sel');
      const dot=LDOTS.find(d=>d.r===rank&&d.f===file);
      if(dot){sq.classList.add(p?'cap':'dot');}
      sq.addEventListener('click',()=>onSqClick(rank,file));
      el.appendChild(sq);
    }
  }
  drawCoords();
}

function drawCoords(){
  const RANKS=['8','7','6','5','4','3','2','1'];
  const FILES=['a','b','c','d','e','f','g','h'];
  const mob=window.innerWidth<=800;
  const rl=document.getElementById('rlabels');rl.innerHTML='';
  const fl=document.getElementById('flabels');fl.innerHTML='';
  (FLIPPED?[...RANKS].reverse():RANKS).forEach(r=>{
    const d=document.createElement('div');d.className='coord';d.textContent=r;
    d.style.height=(mob?45:60)+'px';d.style.display='flex';d.style.alignItems='center';
    rl.appendChild(d);
  });
  (FLIPPED?[...FILES].reverse():FILES).forEach(f=>{
    const d=document.createElement('div');d.className='coord';d.textContent=f;fl.appendChild(d);
  });
}

// ─── TRAIN / STUDY ENGINE ───────────────────────────────────────────────────
// Train and Study use the same repertoire-session engine:
//   Train = answers hidden until you move.
//   Study = the repertoire choices and strategic explanation are visible.
// In both modes the opponent automatically chooses among SELECTED compatible
// lines, so merged DB nodes can never jump into an unselected branch.

function stripHtml(x){
  const d=document.createElement('div');d.innerHTML=x||'';return(d.textContent||'').replace(/\s+/g,' ').trim();
}

function currentPracticeLines(){
  if(!SESSION_STARTED)return[];
  return DLINES.filter(l=>SEL_LINES.has(l.id)&&l.color===SESSION_COLOR&&
    SANS.length<l.sans.length&&SANS.every((san,i)=>l.sans[i]===san));
}
function completedPracticeLines(){
  if(!SESSION_STARTED)return[];
  return DLINES.filter(l=>SEL_LINES.has(l.id)&&l.color===SESSION_COLOR&&
    SANS.length===l.sans.length&&SANS.every((san,i)=>l.sans[i]===san));
}
function expectedPracticeMoves(){
  return [...new Set(currentPracticeLines().map(l=>l.sans[SANS.length]).filter(Boolean))];
}

function explainExpectedMove(expected, node){
  const why=stripHtml(node?.note||'');
  const choice=expected.length===1?expected[0]:expected.join(' or ');
  return 'Preferred repertoire move'+(expected.length>1?'s':'')+': '+choice+'.'+(why?' Why: '+why:'');
}

function renderStudy(){
  const el=document.getElementById('tree');if(!el)return;
  el.innerHTML='';
  if(MODE!=='drill')return;
  if(!SESSION_STARTED){
    el.innerHTML='<span class="tlbl">Choose your English/Caro lines and press Start Session. Opening answers stay hidden; Hint reveals them.</span>';
    return;
  }
  if(STUDY_PHASE==='middlegame'){
    el.innerHTML='<div class="midtitle">Middlegame Training · '+(STUDY_PLAN?.title||'Strategic position')+'</div>'+
      '<div class="midprompt">Opponent: ~'+MID_RATING+'. Your move is checked against full-strength Stockfish. Good moves continue; significant errors are explained and reset so you can find a stronger move.</div>'+
      (MID_FEEDBACK?'<div class="studywhy">'+MID_FEEDBACK+'</div>':'');
    renderIntegratedPlan();return;
  }
  const{turn}=parseFen(FEN),userTurn=SESSION_COLOR==='white'?'w':'b';
  if(turn!==userTurn){
    el.innerHTML='<span class="tlbl">Opponent is choosing a randomized repertoire continuation…</span>';return;
  }
  const moves=expectedPracticeMoves();
  if(!moves.length){
    el.innerHTML='<span class="tlbl">Opening line complete — transitioning to middlegame training…</span>';return;
  }
  el.innerHTML='<span class="tlbl">Opening recall: find your repertoire move. Any legal move is allowed; Hint reveals the answer.</span>';
}

function renderIntegratedPlan(){
  const host=document.getElementById('studyplan');if(!host)return;
  host.innerHTML='';
  if(MODE!=='drill')return;
  const plan=STUDY_PHASE==='middlegame'?STUDY_PLAN:null;
  if(!plan){host.innerHTML='';return;}
  host.innerHTML=`<div class="planmeta"><div class="planbox"><b>Main goal</b><span>${plan.goal}</span></div><div class="planbox"><b>Pawn breaks</b><span>${plan.breaks}</span></div><div class="planbox"><b>Piece map</b><span>${plan.pieces}</span></div><div class="planbox"><b>Opponent wants</b><span>${plan.opp}</span></div><div class="planbox"><b>Trigger</b><span>${plan.trigger}</span></div><div class="planbox"><b>Avoid</b><span>${plan.mistake}</span></div></div>`;
}

function onSqClick(rank,file){
  if(MISTAKE_REPLAY){mistakeReplayClick(rank,file);return;}
  if(PUZZLE&&MODE==='puzzles'){puzzleClick(rank,file);return;}
  if(MODE==='bot'){botClick(rank,file);return;}
  if(MODE!=='drill')return;
  if(!SESSION_STARTED||PRACTICE_LOCK)return;
  const{bd,turn}=parseFen(FEN);
  const userTurn=SESSION_COLOR==='white'?'w':'b';
  if(turn!==userTurn)return;
  const p=GP(bd,rank,file);

  if(SEL){
    const hit=LDOTS.find(d=>d.r===rank&&d.f===file);
    if(hit){if(STUDY_PHASE==='middlegame')handleStudyMiddlegameMove(hit.uci);else handlePracticeMove(hit.uci);return;}
    if(p&&friendly(p,turn)){SEL={r:rank,f:file};LDOTS=getLegalDots(rank,file);drawBoard();return;}
    SEL=null;LDOTS=[];drawBoard();return;
  }
  if(p&&friendly(p,turn)){SEL={r:rank,f:file};LDOTS=getLegalDots(rank,file);drawBoard();}
}

function getLegalDots(fromR,fromF){
  return legalMoves(FEN)
    .filter(uci=>uci.charCodeAt(0)-97===fromF&&+uci[1]-1===fromR)
    .map(uci=>({r:+uci[3]-1,f:uci.charCodeAt(2)-97,uci,san:uci2san(FEN,uci)}));
}

function setLastUci(uci){
  LF={r:+uci[1]-1,f:uci.charCodeAt(0)-97};
  LT={r:+uci[3]-1,f:uci.charCodeAt(2)-97};
}

function handlePracticeMove(uci){
  const beforeFen=FEN;
  const beforeHist=[...HIST],beforeSans=[...SANS];
  const expected=expectedPracticeMoves();
  if(!expected.length&&completedPracticeLines().length){finishPracticeLine();return;}
  const san=uci2san(FEN,uci);
  const node=DB[FEN];
  const correct=expected.includes(san);
  const nf=applyUci(FEN,uci);
  setLastUci(uci);
  FEN=nf;HIST.push(nf);SANS.push(san);SEL=null;LDOTS=[];
  drawBoard();drawMoveList();

  if(correct){
    refreshPanel();
    const msg='✓ Correct: '+san+(stripHtml(node?.note)?' — '+stripHtml(node.note):'');
    setStat(msg,'ok');setCoach(msg);
    renderStudy();
    setTimeout(practiceAutoReply,450);
    return;
  }

  // A wrong repertoire move is still allowed on the board first. Then explain
  // it and restore the exact pre-mistake position so the learner can retry.
  PRACTICE_LOCK=true;
  const explanation=explainExpectedMove(expected,node);
  const miss='✗ '+san+' is legal, but it leaves your selected repertoire. '+explanation;
  setStat(miss,'bad');setCoach(miss);
  document.getElementById('note').innerHTML='<strong>Why this is a miss:</strong> '+explanation;
  setTimeout(()=>{
    FEN=beforeFen;HIST=beforeHist;SANS=beforeSans;SEL=null;LDOTS=[];LF=null;LT=null;PRACTICE_LOCK=false;
    refreshPanel();drawBoard();drawMoveList();renderStudy();
    setStat('Try the position again.','info');setCoach(miss);
  },2400);
}

// ─── LINE SELECTION / SESSION START ──────────────────────────────────────────
function buildLineSelector(){
  const el=document.getElementById('linesel');el.innerHTML='';
  const grps={};
  DLINES.forEach(l=>{(grps[l.group]=grps[l.group]||[]).push(l);});
  for(const[g,ls]of Object.entries(grps)){
    const lbl=document.createElement('div');lbl.className='glbl';lbl.textContent=g;el.appendChild(lbl);
    ls.forEach(l=>{
      const chip=document.createElement('label');chip.className='lchip'+(SEL_LINES.has(l.id)?' on':'');
      const cb=document.createElement('input');cb.type='checkbox';cb.checked=SEL_LINES.has(l.id);
      cb.onchange=()=>{if(cb.checked){SEL_LINES.add(l.id);chip.classList.add('on');}else{SEL_LINES.delete(l.id);chip.classList.remove('on');}};
      chip.appendChild(cb);const sp=document.createElement('span');sp.textContent=l.label;chip.appendChild(sp);el.appendChild(chip);
    });
  }
}

function selectLineFamily(which){
  SEL_LINES.clear();
  DLINES.forEach(l=>{
    if(which==='all'||l.color===which)SEL_LINES.add(l.id);
  });
  buildLineSelector();
  const label=which==='white'?'1.e4 / Italian only':which==='black'?'Caro-Kann + Slav only':'all 1.e4 + Caro-Kann + Slav';
  setStat('Selected '+label+'. Press Start Session.','info');
  setCoach('Selected '+label+'.');
}

function setMidSkill(rating){
  MID_RATING=rating;
  [1400,1600,1800,2000].forEach((r,i)=>document.getElementById('ms'+i)?.classList.toggle('on',r===rating));
  if(STUDY_PHASE==='middlegame')setCoach('Middlegame opponent set to approximately '+rating+'. Your moves are still checked by full-strength Stockfish.');
}
function midSkillLevel(){
  return MID_RATING<=1400?4:MID_RATING<=1600?8:MID_RATING<=1800?12:16;
}

function startRandom(){
  initSF();
  const avail=DLINES.filter(l=>SEL_LINES.has(l.id));
  if(!avail.length){setStat('Select at least one line.','bad');return;}
  // Pick which repertoire side to train, then keep ALL selected lines for that
  // side alive. Opponent branches are sampled randomly as the game develops.
  const seed=avail[Math.floor(Math.random()*avail.length)];
  SESSION_COLOR=seed.color;DRILL_COLOR=seed.color;SESSION_STARTED=true;PRACTICE_LOCK=false;STUDY_PHASE='opening';STUDY_PLAN=null;
  FLIPPED=SESSION_COLOR==='black';
  fullReset();SESSION_STARTED=true; // fullReset clears board state only; restore session flag
  const family=SESSION_COLOR==='white'?'1.e4 / Italian as White':'Caro-Kann as Black';
  const startMsg='TRAIN: '+family+' — opening opponent variations are randomized from your selected lines, then the session continues into middlegame training.';
  setStat(startMsg,'info');setCoach(startMsg);
  renderStudy();
  setTimeout(practiceAutoReply,350);
}


const PLAN_LINE_MAP={
  'it-main':'e4-italian','it-2n':'e4-italian','it-hung':'e4-italian',
  'e4-phil':'e4-open','e4-sic-nf6':'e4-alapin','e4-sic-d5':'e4-alapin',
  'e4-fr':'e4-french','e4-ck':'e4-caro-white','e4-scandi':'e4-open',
  'e4-pirc':'e4-pirc','e4-modern':'e4-pirc','e4-alekh':'e4-open',
  'ck-cls':'ck-class','ck-cls2':'ck-class',
  'ck-adv':'ck-adv','ck-tal':'ck-adv','ck-adv-nc3':'ck-adv','ck-panov':'ck-panov','ck-ex':'ck-exchange','ck-ex-nf3':'ck-exchange',
  'ck-2k':'ck-two','ck-fan':'ck-fantasy','ck-hill':'ck-hill','ck-d3':'ck-d3',
  'slav-main':'slav-bf5','slav-alt':'slav-bf5','slav-e3':'slav-bf5','slav-nc3':'slav-bf5','slav-ex':'ck-exchange'
};
function historyFromSans(sans){
  const hist=[INIT];let fen=INIT;
  for(const san of sans){const u=san2uci(fen,san);if(!u)break;fen=applyUci(fen,u);hist.push(fen);}
  return hist;
}
function renderMiddlegamePanel(reveal=true){
  const card=document.getElementById('planinfocard'),host=document.getElementById('planinfo');
  if(!card||!host||!STUDY_PLAN)return;
  card.classList.remove('hidden');
  const hdr=document.getElementById('planinfoheader');if(hdr)hdr.textContent='Middlegame Blueprint';
  renderPlanInfo(STUDY_PLAN);
}

function findStudyPlan(){
  const done=completedPracticeLines();
  for(const line of done){
    const p=PLAN_DB.find(x=>x.id===PLAN_LINE_MAP[line.id]);
    if(p)return p;
  }
  return null;
}

function beginMiddlegameStudy(){
  // Continue from the exact final opening position the learner just reached.
  // The plan database supplies the strategic blueprint, not a replacement board.
  STUDY_PLAN=findStudyPlan();STUDY_PHASE='middlegame';
  if(!STUDY_PLAN){finishPracticeLine(true);return;}
  SEL=null;LDOTS=[];LF=null;LT=null;
  STUDY_PLAN_START_PLY=SANS.length;STUDY_PLAN_TARGET_PLY=STUDY_PLAN_START_PLY+20;
  FLIPPED=SESSION_COLOR==='black';PRACTICE_LOCK=false;SESSION_STARTED=true;
  MID_FEEDBACK='';MID_PRE_ANALYSIS=null;MID_ANALYZING=false;
  refreshPanel();drawBoard();drawMoveList();renderStudy();renderMiddlegamePanel(true);
  const msg='MIDDLEGAME TRAINING: '+STUDY_PLAN.title+'. Opening complete — now play about 10 more moves. Opponent ~'+MID_RATING+'; your moves are judged by full-strength Stockfish.';
  setStat(msg,'info');setCoach(msg+' Goal: '+STUDY_PLAN.goal+' Key breaks: '+STUDY_PLAN.breaks);
  if(parseFen(FEN).turn!==(SESSION_COLOR==='white'?'w':'b'))setTimeout(studyPlanBotReply,350);
  else prepareMiddlegameTurn();
}
function prepareMiddlegameTurn(){
  if(MODE!=='drill'||STUDY_PHASE!=='middlegame'||!SESSION_STARTED)return;
  if(!SF&&!SF_FAILED){initSF();setStat('Loading Stockfish for middlegame coaching…','info');setTimeout(prepareMiddlegameTurn,500);return;}
  const userTurn=SESSION_COLOR==='white'?'w':'b';
  if(parseFen(FEN).turn!==userTurn)return;
  MID_ANALYZING=true;PRACTICE_LOCK=true;MID_PRE_ANALYSIS=null;
  setStat('Stockfish is preparing your move feedback…','info');
  sfAnalyzePositionDepth(FEN,13,res=>{
    MID_ANALYZING=false;PRACTICE_LOCK=false;
    if(!SESSION_STARTED||STUDY_PHASE!=='middlegame')return;
    if(res){
      const ev=infoWhiteEval(FEN,res.info);evaluationPerspectiveSanity(FEN,res.info,ev);
      MID_PRE_ANALYSIS={best:res.best,eval:ev,info:res.info};
    }else MID_PRE_ANALYSIS=null;
    const bestSan=MID_PRE_ANALYSIS?.best?uci2san(FEN,MID_PRE_ANALYSIS.best):'';
    setStat('Your move — find the strongest continuation.','info');
    setCoach('Middlegame: apply the blueprint and calculate. '+(bestSan?'Your move will be compared with full-strength Stockfish.':'Engine feedback will be given when available.'));
    drawBoard();renderStudy();
  });
}
function studyPlanBotReply(){
  if(MODE!=='drill'||STUDY_PHASE!=='middlegame'||!SESSION_STARTED)return;
  const userTurn=SESSION_COLOR==='white'?'w':'b';
  if(parseFen(FEN).turn===userTurn){prepareMiddlegameTurn();return;}
  PRACTICE_LOCK=true;
  chooseRatedMoveWithTactics(FEN,MID_RATING,(uci,meta)=>{
    PRACTICE_LOCK=false;
    if(!SESSION_STARTED||STUDY_PHASE!=='middlegame')return;
    if(!uci){finishPracticeLine(true);return;}
    const san=uci2san(FEN,uci);setLastUci(uci);
    FEN=applyUci(FEN,uci);HIST.push(FEN);SANS.push(san);SEL=null;LDOTS=[];
    refreshPanel();drawBoard();drawMoveList();
    if(SANS.length>=STUDY_PLAN_TARGET_PLY||!legalMoves(FEN).length){finishPracticeLine(true);return;}
    setCoach('~'+MID_RATING+' opponent played '+san+'. Your previous feedback stays below; now find the best response.');
    renderStudy();prepareMiddlegameTurn();
  });
}
function handleStudyMiddlegameMove(uci){
  if(MID_ANALYZING)return;
  const beforeFen=FEN,beforeHist=[...HIST],beforeSans=[...SANS];
  const san=uci2san(FEN,uci);setLastUci(uci);
  const afterFen=applyUci(FEN,uci);
  FEN=afterFen;HIST.push(FEN);SANS.push(san);SEL=null;LDOTS=[];
  refreshPanel();drawBoard();drawMoveList();
  PRACTICE_LOCK=true;MID_ANALYZING=true;
  setStat('Analyzing '+san+'…','info');
  sfAnalyzePositionDepth(afterFen,13,res=>{
    MID_ANALYZING=false;
    if(!SESSION_STARTED||STUDY_PHASE!=='middlegame')return;
    const afterEval=res?infoWhiteEval(afterFen,res.info):null;
    if(res&&afterEval)evaluationPerspectiveSanity(afterFen,res.info,afterEval);
    const beforeEval=MID_PRE_ANALYSIS?.eval||null;
    const mover=parseFen(beforeFen).turn;
    const pb=whiteWinProb(beforeEval),pa=whiteWinProb(afterEval);
    const loss=(pb==null||pa==null)?null:Math.max(0,mover==='w'?pb-pa:pa-pb);
    const bestUci=MID_PRE_ANALYSIS?.best||null;
    const bestSan=bestUci?uci2san(beforeFen,bestUci):'';
    const grade=classifyMove({entry:{uci,san},beforeFen,afterFen,bestUci,beforeEval,afterEval,probLoss:loss,inBook:false,beforeInfo:MID_PRE_ANALYSIS?.info});
    const explanation=liveMoveExplanation(beforeFen,san,grade,bestSan,loss,STUDY_PLAN);
    MID_FEEDBACK=grade.icon+' <strong>'+grade.label+'</strong> — '+explanation;
    setStat(grade.icon+' '+grade.label+': '+san,'info');setCoach(stripHtml(MID_FEEDBACK));
    renderStudy();
    const retry=['Inaccuracy','Mistake','Miss','Blunder'].includes(grade.label);
    if(retry){
      setTimeout(()=>{
        FEN=beforeFen;HIST=beforeHist;SANS=beforeSans;SEL=null;LDOTS=[];LF=null;LT=null;
        PRACTICE_LOCK=false;MID_PRE_ANALYSIS=null;
        refreshPanel();drawBoard();drawMoveList();renderStudy();
        setStat('Try the middlegame position again. '+(bestSan?'Best move: '+bestSan+'.':''),'info');
        prepareMiddlegameTurn();
      },2800);
      return;
    }
    PRACTICE_LOCK=false;MID_PRE_ANALYSIS=null;
    if(SANS.length>=STUDY_PLAN_TARGET_PLY||!legalMoves(FEN).length){finishPracticeLine(true);return;}
    setTimeout(studyPlanBotReply,700);
  });
}
function liveMoveExplanation(beforeFen,san,grade,bestSan,loss,plan){
  const bits=[];
  if(grade.label==='Best')bits.push(san+' is Stockfish’s top move.');
  else if(bestSan&&bestSan!==san){
    const bu=san2uci(beforeFen,bestSan);
    bits.push('Stockfish prefers '+bestSan+(bu?' because it '+movePurpose(beforeFen,bu):'')+'.');
  }
  if(loss!=null&&loss>.02)bits.push('Your move gave up about '+Math.round(loss*100)+' percentage points of estimated winning chances.');
  if(plan){
    bits.push('Strategic goal: '+plan.goal);
    bits.push('Key pawn break: '+plan.breaks);
    bits.push('Ideal piece setup: '+plan.pieces);
    if(['Inaccuracy','Mistake','Miss','Blunder'].includes(grade.label))bits.push('Before retrying, ask whether your move helped that plan or answered the opponent’s threat: '+plan.opp);
  }
  if(['Inaccuracy','Mistake','Miss','Blunder'].includes(grade.label))bits.push('The position will reset so you can find a stronger continuation.');
  else bits.push('Good enough to continue; the opponent will now respond.');
  return bits.join(' ');
}

function finishPracticeLine(fromMiddlegame=false){
  if(MODE==='drill'&&!fromMiddlegame&&STUDY_PHASE==='opening'){beginMiddlegameStudy();return;}
  SESSION_STARTED=false;PRACTICE_LOCK=true;SEL=null;LDOTS=[];
  const msg=fromMiddlegame?'🏁 Middlegame lab complete. Start Session for another opening → plan sequence.':'🏁 Repertoire line complete. Start Session again for another randomized branch.';
  setStat(msg,'ok');setCoach(msg);renderStudy();drawBoard();
}

function practiceAutoReply(){
  if(!SESSION_STARTED||PRACTICE_LOCK||MODE!=='drill'||STUDY_PHASE==='middlegame')return;
  FLIPPED=SESSION_COLOR==='black';
  if(completedPracticeLines().length){finishPracticeLine();return;}
  const{turn}=parseFen(FEN),userTurn=SESSION_COLOR==='white'?'w':'b';
  if(turn===userTurn){
    const moves=expectedPracticeMoves();
    if(!moves.length){finishPracticeLine();return;}
    else setStat('Your turn — find your repertoire move.','info');
    renderStudy();drawBoard();return;
  }
  const lines=currentPracticeLines();
  if(!lines.length){
    if(completedPracticeLines().length){finishPracticeLine();return;}
    setStat('No selected line matches this position. Start a new session.','bad');return;
  }
  const candidates=lines.map(l=>l.sans[SANS.length]).filter(Boolean);
  if(!candidates.length){finishPracticeLine();return;}
  // Pick a compatible line, not DB's first global move. This is what makes
  // multiple selected variations genuinely random and prevents branch jumping.
  const san=candidates[Math.floor(Math.random()*candidates.length)];
  const uci=san2uci(FEN,san);
  if(!uci){setStat('Repertoire data error at '+san+'.','bad');return;}
  setLastUci(uci);
  const nf=applyUci(FEN,uci);FEN=nf;HIST.push(nf);SANS.push(san);SEL=null;LDOTS=[];
  refreshPanel();drawBoard();drawMoveList();renderStudy();
  if(completedPracticeLines().length){setTimeout(()=>finishPracticeLine(),300);return;}
  setStat('Opponent played '+san+'. Your turn.','info');
  if(LAST_COACH)setCoach(LAST_COACH+'  •  Opponent: '+san+'.');
}

function doHint(){
  if(MODE==='bot'){setStat('No hints in bot mode.','bad');return;}
  if(MODE==='puzzles'){
    if(!PUZZLE){setStat('No puzzle loaded.','info');return;}
    if(PUZZLE.validating){setStat('Wait for fresh Stockfish verification first.','info');return;}
    if(PUZZLE.bestSan){setStat('💡 Best move: '+PUZZLE.bestSan,'info');setCoach('Hint: '+PUZZLE.bestSan+'. Before moving, explain to yourself what threat it answers.');}
    return;
  }
  if(MODE==='mistakes'){
    const r=MISTAKE_REPLAY;if(!r){setStat('No saved mistake position loaded.','info');return;}
    if(r.validating){setStat('Wait for fresh Stockfish verification first.','info');return;}
    if(r.bestSan){setStat('💡 Best move: '+r.bestSan,'info');setCoach('Hint: '+r.bestSan+'. Try to explain what threat or coordination problem it solves before moving.');}
    return;
  }
  if(!SESSION_STARTED){setStat('Start a training session first.','info');return;}
  if(STUDY_PHASE==='middlegame'&&STUDY_PLAN){
    renderMiddlegamePanel(true);
    const best=MID_PRE_ANALYSIS?.best?uci2san(FEN,MID_PRE_ANALYSIS.best):'';
    setCoach('Middlegame hint: '+(best?'Stockfish best move is '+best+'. ':'')+'Goal: '+STUDY_PLAN.goal+' Pawn breaks: '+STUDY_PLAN.breaks);
    return;
  }
  const moves=expectedPracticeMoves();
  if(!moves.length){setStat('No more moves in this selected line.','info');return;}
  const node=DB[FEN];setStat('💡 '+explainExpectedMove(moves,node),'info');
}

// ─── BOT MODE ─────────────────────────────────────────────────────────────────
// GitHub Pages/iOS can reject a cross-origin Worker constructor. We first try
// loading Stockfish through a same-origin Blob worker. If that fails, the game
// continues with the built-in fallback engine instead of declaring "game over".
function initSF(){
  if(SF||SF_FAILED)return;
  fetch('https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js')
    .then(r=>{if(!r.ok)throw new Error('Stockfish HTTP '+r.status);return r.text();})
    .then(code=>{
      const blob=new Blob([code],{type:'text/javascript'});
      SF=new Worker(URL.createObjectURL(blob));
      SF.onmessage=e=>{
        const msg=String(e.data||'');
        if(msg==='readyok'||msg.includes('uciok')){
          SF_READY=true;
          if(msg==='readyok'&&SF_READY_CB){const rcb=SF_READY_CB;SF_READY_CB=null;rcb();}
        }
        if(msg.startsWith('info ')){
          const sm=msg.match(/score (cp|mate) (-?\d+)/);
          const pv=msg.match(/ pv (.+)$/);
          const mm=msg.match(/ multipv (\d+)/);
          if(sm){
            const inf={type:sm[1],value:+sm[2],pv:pv?pv[1].trim().split(/\s+/):[],multipv:mm?+mm[1]:1};
            SF_LAST_INFO=inf;
            SF_MULTI_INFO[inf.multipv]=inf;
          }
        }
        if(msg.startsWith('bestmove')&&SF_CB){
          clearTimeout(SF_TIMER);
          const bm=msg.split(' ')[1];
          const cb=SF_CB;SF_CB=null;
          const info=SF_LAST_INFO;SF_LAST_INFO=null;
          cb(bm&&bm!=='(none)'?bm:null,info);
        }
      };
      SF.onerror=()=>{SF_FAILED=true;SF_READY=false;try{SF.terminate();}catch(e){}SF=null;};
      SF.postMessage('uci');SF.postMessage('isready');
    })
    .catch(err=>{console.warn('Stockfish unavailable; using fallback bot.',err);SF_FAILED=true;});
}

function materialValue(p){return({P:100,N:320,B:330,R:500,Q:900,K:0})[p?.toUpperCase()]||0;}
function staticEval(fen,forSide){
  const{bd}=parseFen(fen);let score=0;
  for(let r=0;r<8;r++)for(let f=0;f<8;f++){
    const p=GP(bd,r,f);if(!p)continue;
    let v=materialValue(p);
    // small centralization bonus; enough to make the fallback play plausible openings
    if('NBRQ'.includes(p.toUpperCase()))v+=Math.max(0,4-Math.abs(3.5-f)-Math.abs(3.5-r))*3;
    score+=(isW(p)?1:-1)*v;
  }
  return forSide==='w'?score:-score;
}
function localBestMove(fen,skill){
  const{turn,bd}=parseFen(fen);const moves=legalMoves(fen);
  if(!moves.length)return null;
  const scored=moves.map(uci=>{
    const tf=uci.charCodeAt(2)-97,tr=+uci[3]-1;
    const captured=GP(bd,tr,tf);
    const nf=applyUci(fen,uci);
    let s=staticEval(nf,turn)+(captured?materialValue(captured)*.7:0)+(inCheck(nf,turn==='w'?'b':'w')?35:0);
    // Club/Strong look one opponent move ahead and discount their best reply.
    if(skill>=8){
      const replies=legalMoves(nf);
      if(replies.length){
        let worst=Infinity;
        for(const r of replies.slice(0,skill>=16?40:20)){
          const rf=applyUci(nf,r);
          worst=Math.min(worst,staticEval(rf,turn));
        }
        if(worst<Infinity)s=.55*s+.45*worst;
      }
    }
    return{uci,s};
  }).sort((a,b)=>b.s-a.s);
  if(skill<=2){
    const pool=scored.slice(0,Math.min(8,scored.length));
    return pool[Math.floor(Math.random()*pool.length)].uci;
  }
  if(skill<16){
    const pool=scored.slice(0,Math.min(3,scored.length));
    return pool[Math.floor(Math.random()*pool.length)].uci;
  }
  return scored[0].uci;
}

function sfBestMove(fen,skill,cb){
  const fallback=()=>setTimeout(()=>cb(localBestMove(fen,skill)),180);
  if(!SF||SF_FAILED){fallback();return;}
  SF_CB=(move,info)=>{
    const safe=isLegalEngineMove(fen,move)?move:localBestMove(fen,skill);
    cb(safe,info);
  };
  const mt=skill<=4?650:skill<=10?1100:skill<=16?1700:2600;
  try{
    SF.postMessage('setoption name UCI_LimitStrength value false');
    SF.postMessage('setoption name Skill Level value '+skill);
    SF.postMessage('position fen '+fen);
    SF.postMessage('go movetime '+mt);
    // Never let an engine-loading/browser issue terminate the chess game.
    clearTimeout(SF_TIMER);
    SF_TIMER=setTimeout(()=>{
      if(SF_CB){const done=SF_CB;SF_CB=null;done(localBestMove(fen,skill),null);}
    },mt+1800);
  }catch(e){
    SF_FAILED=true;SF=null;SF_CB=null;fallback();
  }
}

function ratingToSkill(rating){return rating<=1400?4:rating<=1600?8:rating<=1800?12:16;}
function humanChoiceWeights(rating){
  if(rating<=1400)return [0.48,0.28,0.15,0.09];
  if(rating<=1600)return [0.60,0.24,0.11,0.05];
  if(rating<=1800)return [0.73,0.18,0.07,0.02];
  return [0.84,0.12,0.035,0.005];
}
function weightedIndex(weights,n){
  const w=weights.slice(0,n),sum=w.reduce((x,y)=>x+y,0);
  let r=Math.random()*sum;
  for(let i=0;i<w.length;i++){r-=w[i];if(r<=0)return i;}
  return Math.max(0,w.length-1);
}
function sfBestMoveRated(fen,rating,cb){
  const fallback=()=>setTimeout(()=>cb(localBestMove(fen,ratingToSkill(rating))),180);
  if(!SF||SF_FAILED){fallback();return;}
  const multi=rating<=1400?4:rating<=1800?3:2;
  SF_MULTI_INFO={};SF_LAST_INFO=null;
  SF_CB=(move,info)=>{
    try{SF.postMessage('setoption name MultiPV value 1');}catch(e){}
    const candidates=[];
    for(let i=1;i<=multi;i++){
      const x=SF_MULTI_INFO[i];
      const u=x?.pv?.[0];
      if(u&&isLegalEngineMove(fen,u)&&!candidates.some(c=>c.uci===u))candidates.push({uci:u,info:x});
    }
    if(!candidates.length&&isLegalEngineMove(fen,move))candidates.push({uci:move,info});
    if(!candidates.length){cb(localBestMove(fen,ratingToSkill(rating)),info);return;}
    // Sample among strong engine candidates instead of asking UCI_LimitStrength
    // to behave like an exact human rating. This creates realistic variety
    // while avoiding random nonsense.
    const pick=candidates[weightedIndex(humanChoiceWeights(rating),candidates.length)];
    cb(pick.uci,pick.info);
  };
  const mt=rating<=1400?700:rating<=1600?900:rating<=1800?1150:1450;
  try{
    SF.postMessage('setoption name UCI_LimitStrength value false');
    SF.postMessage('setoption name Skill Level value 20');
    SF.postMessage('setoption name MultiPV value '+multi);
    SF.postMessage('position fen '+fen);
    SF.postMessage('go movetime '+mt);
    clearTimeout(SF_TIMER);
    SF_TIMER=setTimeout(()=>{
      if(SF_CB){const done=SF_CB;SF_CB=null;try{SF.postMessage('stop');SF.postMessage('setoption name MultiPV value 1');}catch(e){}done(localBestMove(fen,ratingToSkill(rating)),null);}
    },mt+2000);
  }catch(e){SF_FAILED=true;SF=null;SF_CB=null;fallback();}
}


function moveIsTactical(fen,uci){
  if(!isLegalEngineMove(fen,uci))return false;
  const {bd}=parseFen(fen);
  const tf=uci.charCodeAt(2)-97,tr=+uci[3]-1;
  const capture=!!GP(bd,tr,tf);
  const promotion=uci.length>4;
  const nf=applyUci(fen,uci);
  const givesCheck=inCheck(nf,parseFen(nf).turn);
  return capture||promotion||givesCheck;
}
function mateOverrideLimit(rating){
  if(rating<=1400)return 5;
  if(rating<=1600)return 7;
  if(rating<=1800)return 10;
  return 14;
}
function tacticOverrideCp(rating){
  if(rating<=1400)return 700;
  if(rating<=1600)return 550;
  if(rating<=1800)return 400;
  return 300;
}
function capturedMaterialValue(fen,uci){
  if(!isLegalEngineMove(fen,uci))return 0;
  const {bd}=parseFen(fen);
  const tf=uci.charCodeAt(2)-97,tr=+uci[3]-1;
  const cap=GP(bd,tr,tf);
  return cap?materialValue(cap):0;
}
function obviousTacticalWin(fen,uci,info,rating){
  if(!isLegalEngineMove(fen,uci)||!info)return false;
  const cap=capturedMaterialValue(fen,uci);
  const after=applyUci(fen,uci);
  const givesCheck=inCheck(after,parseFen(after).turn);
  // Taking a loose minor/rook/queen is exactly the kind of tactic a 1400+
  // opponent should punish reliably.
  if(cap>=280)return true;
  if(info.type!=='cp')return false;
  const edge=info.value; // full scan is side-to-move relative
  if(cap>=90&&edge>=(rating<=1400?260:rating<=1600?220:180))return true;
  if(givesCheck&&edge>=(rating<=1400?350:rating<=1600?300:250))return true;
  return false;
}
function chooseRatedMoveWithTactics(fen,rating,cb,fullStrength=false){
  if(fullStrength){
    sfAnalyzePositionDepth(fen,13,res=>{
      if(res&&isLegalEngineMove(fen,res.best))cb(res.best,{override:'full',info:res.info});
      else sfBestMove(fen,20,(m,info)=>cb(m,{override:'full-fallback',info}));
    });
    return;
  }
  // Quick full-strength scan first. Rating still controls normal play, but
  // short mates and obvious forcing wins are converted much more reliably.
  sfAnalyzePositionDepth(fen,10,res=>{
    if(res&&isLegalEngineMove(fen,res.best)){
      const info=res.info||{};
      if(info.type==='mate'&&info.value>0&&Math.abs(info.value)<=mateOverrideLimit(rating)){
        cb(res.best,{override:'mate',info});return;
      }
      if(obviousTacticalWin(fen,res.best,info,rating)){
        cb(res.best,{override:'material-tactic',info});return;
      }
      if(info.type==='cp'&&info.value>=tacticOverrideCp(rating)&&moveIsTactical(fen,res.best)){
        cb(res.best,{override:'tactic',info});return;
      }
    }
    sfBestMoveRated(fen,rating,(m,info)=>cb(m,{override:null,info}));
  });
}
function botRating(){
  if(BOT_LABEL==='1400')return 1400;
  if(BOT_LABEL==='1600')return 1600;
  if(BOT_LABEL==='1800')return 1800;
  return 2000;
}

function setBotSkill(s,lbl){
  BOT_SKILL=s;BOT_LABEL=lbl;
  const labels=['1400','1600','1800','2000','Full'];
  ['sk0','sk1','sk2','sk3','sk4'].forEach((id,i)=>document.getElementById(id)?.classList.toggle('on',i===labels.indexOf(lbl)));
}
function setBotColor(c){
  BOT_COLOR=c;
  document.getElementById('bc0').classList.toggle('on',c==='white');
  document.getElementById('bc1').classList.toggle('on',c==='black');
}

function startBotGame(){
  initSF();
  FLIPPED=BOT_COLOR==='black'; // user perspective
  fullReset();
  BOT_ACTIVE=true;BOT_GAME_COLOR=BOT_COLOR;
  BOT_LOG=[];
  BOT_THINKING=false;
  document.getElementById('revcard').classList.add('hidden');
  const bm='You are '+BOT_COLOR+'. Skill: '+BOT_LABEL;setStat(bm,'info');setCoach(bm);
  if(BOT_COLOR==='black')setTimeout(botThink,500);
}

function botClick(rank,file){
  if(!BOT_ACTIVE||BOT_THINKING)return;
  const{bd,turn}=parseFen(FEN);
  const playerTurn=BOT_COLOR==='white'?'w':'b';
  if(turn!==playerTurn)return;
  const p=GP(bd,rank,file);

  if(SEL){
    const hit=LDOTS.find(d=>d.r===rank&&d.f===file);
    if(hit){doBotPlayerMove(hit.uci);return;}
    if(p&&friendly(p,turn)){SEL={r:rank,f:file};LDOTS=getBotDots(rank,file);drawBoard();return;}
    SEL=null;LDOTS=[];drawBoard();return;
  }
  if(p&&friendly(p,turn)){SEL={r:rank,f:file};LDOTS=getBotDots(rank,file);drawBoard();}
}

function getBotDots(fromR,fromF){
  return legalMoves(FEN)
    .filter(uci=>uci.charCodeAt(0)-97===fromF&&+uci[1]-1===fromR)
    .map(uci=>({r:+uci[3]-1,f:uci.charCodeAt(2)-97,uci}));
}

function doBotPlayerMove(uci){
  const san=uci2san(FEN,uci);
  LF={r:+uci[1]-1,f:uci.charCodeAt(0)-97};
  LT={r:+uci[3]-1,f:uci.charCodeAt(2)-97};
  const nf=applyUci(FEN,uci);
  BOT_LOG.push({fen:FEN,uci,san,byBot:false});
  FEN=nf;HIST.push(nf);SANS.push(san);
  SEL=null;LDOTS=[];
  refreshPanel();drawBoard();drawMoveList();
  setCoach('You played '+san+'. '+BOT_LABEL+' is thinking…');
  if(!legalMoves(nf).length){endBot();return;}
  setTimeout(botThink,360);
}

function botThink(){
  if(!BOT_ACTIVE)return;
  BOT_THINKING=true;
  setStat(BOT_LABEL+' is thinking…','info');
  chooseRatedMoveWithTactics(FEN,botRating(),(uci,meta)=>{
    BOT_THINKING=false;
    if(!BOT_ACTIVE)return;
    if(!uci){const lm=legalMoves(FEN);if(!lm.length){endBot();return;}uci=localBestMove(FEN,BOT_SKILL);if(!uci){endBot();return;}}
    const san=uci2san(FEN,uci);
    LF={r:+uci[1]-1,f:uci.charCodeAt(0)-97};
    LT={r:+uci[3]-1,f:uci.charCodeAt(2)-97};
    const nf=applyUci(FEN,uci);
    BOT_LOG.push({fen:FEN,uci,san,byBot:true});
    FEN=nf;HIST.push(nf);SANS.push(san);
    refreshPanel();drawBoard();drawMoveList();
    if(!legalMoves(nf).length){endBot();return;}
    setStat('Your turn.','info');setCoach('Bot played '+san+'. Your turn.');
  },BOT_LABEL==='Full');
}

function endBot(){
  BOT_ACTIVE=false;BOT_THINKING=false;
  const turn=parseFen(FEN).turn,none=legalMoves(FEN).length===0,mate=none&&inCheck(FEN,turn);
  const title=mate?'Checkmate':'Game over';
  const result=mate?((turn==='w'?'Black':'White')+' wins by checkmate.'):(none?'Draw by stalemate.':'Game ended.');
  setStat(title+' — '+result,'info');setCoach(title+' — '+result);
  document.getElementById('revbtn').classList.remove('hidden');
  const ov=document.getElementById('gameoveroverlay');
  if(ov){document.getElementById('gameovertitle').textContent=title;document.getElementById('gameovertext').textContent=result;ov.classList.remove('hidden');}
}

function isLegalEngineMove(fen,uci){
  return !!uci&&legalMoves(fen).includes(uci);
}
function engineResultValid(fen,move,info){
  return isLegalEngineMove(fen,move)&&!!info;
}

function sfAnalyzePositionDepth(fen,depth,cb,retry=0){
  const cached=analysisCacheGet('pos',fen,depth);
  if(cached){setTimeout(()=>cb(cached),0);return;}
  if(!SF||SF_FAILED){cb(null);return;}
  let finished=false;
  const finish=res=>{
    if(finished)return;finished=true;
    clearTimeout(SF_TIMER);SF_READY_CB=null;SF_CB=null;
    if(!res&&retry<2){setTimeout(()=>sfAnalyzePositionDepth(fen,Math.max(11,depth-1),cb,retry+1),160);return;}
    if(res)analysisCachePut('pos',fen,depth,'',res);
    cb(res);
  };
  try{
    SF_CB=null;SF_LAST_INFO=null;
    SF.postMessage('stop');
    SF_READY_CB=()=>{
      if(finished)return;
      SF_LAST_INFO=null;SF_MULTI_INFO={};
      SF_CB=(move,info)=>{
        if(!engineResultValid(fen,move,info)){
          console.warn('Discarding illegal/stale engine move for FEN',move,fen);
          finish(null);return;
        }
        finish({best:move,info});
      };
      SF.postMessage('setoption name UCI_LimitStrength value false');
      SF.postMessage('setoption name Skill Level value 20');
      SF.postMessage('setoption name MultiPV value 1');
      SF.postMessage('position fen '+fen);
      SF.postMessage('go depth '+depth);
    };
    SF.postMessage('isready');
    SF_TIMER=setTimeout(()=>{try{SF.postMessage('stop');}catch(e){}finish(null);},depth>=14?16000:11000);
  }catch(e){SF_FAILED=true;try{SF?.terminate();}catch(x){}SF=null;finish(null);}
}
function sfAnalyzePlayedMove(fen,uci,depth,cb,retry=0){
  const cached=analysisCacheGet('played',fen,depth,uci);
  if(cached){setTimeout(()=>cb(cached),0);return;}
  if(!SF||SF_FAILED||!isLegalEngineMove(fen,uci)){cb(null);return;}
  let finished=false;
  const finish=res=>{
    if(finished)return;finished=true;
    clearTimeout(SF_TIMER);SF_READY_CB=null;SF_CB=null;
    if(!res&&retry<1){setTimeout(()=>sfAnalyzePlayedMove(fen,uci,Math.max(10,depth-1),cb,retry+1),120);return;}
    if(res)analysisCachePut('played',fen,depth,uci,res);
    cb(res);
  };
  try{
    SF_CB=null;SF_LAST_INFO=null;SF_MULTI_INFO={};SF.postMessage('stop');
    SF_READY_CB=()=>{
      if(finished)return;
      SF_LAST_INFO=null;SF_MULTI_INFO={};
      SF_CB=(move,info)=>finish(info?{best:uci,info}:null);
      SF.postMessage('setoption name UCI_LimitStrength value false');
      SF.postMessage('setoption name Skill Level value 20');
      SF.postMessage('setoption name MultiPV value 1');
      SF.postMessage('position fen '+fen);
      SF.postMessage('go depth '+depth+' searchmoves '+uci);
    };
    SF.postMessage('isready');
    SF_TIMER=setTimeout(()=>{try{SF.postMessage('stop');}catch(e){}finish(null);},12000);
  }catch(e){finish(null);}
}

// V2.25 Replay verification deliberately bypasses review caches.
function sfAnalyzePositionFresh(fen,depth,cb,retry=0){
  if(!SF||SF_FAILED){cb(null);return;}
  let finished=false;
  const finish=res=>{
    if(finished)return;finished=true;
    clearTimeout(SF_TIMER);SF_READY_CB=null;SF_CB=null;
    if(!res&&retry<1){setTimeout(()=>sfAnalyzePositionFresh(fen,Math.max(12,depth-1),cb,retry+1),140);return;}
    cb(res);
  };
  try{
    SF_CB=null;SF_LAST_INFO=null;SF_MULTI_INFO={};SF.postMessage('stop');
    SF_READY_CB=()=>{
      if(finished)return;
      SF_LAST_INFO=null;SF_MULTI_INFO={};
      SF_CB=(move,info)=>{
        if(!engineResultValid(fen,move,info)){finish(null);return;}
        finish({best:move,info});
      };
      SF.postMessage('setoption name UCI_LimitStrength value false');
      SF.postMessage('setoption name Skill Level value 20');
      SF.postMessage('setoption name MultiPV value 1');
      SF.postMessage('position fen '+fen);
      SF.postMessage('go depth '+depth);
    };
    SF.postMessage('isready');
    SF_TIMER=setTimeout(()=>{try{SF.postMessage('stop');}catch(e){}finish(null);},depth>=15?19000:15000);
  }catch(e){finish(null);}
}
function sfAnalyzePlayedMoveFresh(fen,uci,depth,cb,retry=0){
  if(!SF||SF_FAILED||!isLegalEngineMove(fen,uci)){cb(null);return;}
  let finished=false;
  const finish=res=>{
    if(finished)return;finished=true;
    clearTimeout(SF_TIMER);SF_READY_CB=null;SF_CB=null;
    if(!res&&retry<1){setTimeout(()=>sfAnalyzePlayedMoveFresh(fen,uci,Math.max(12,depth-1),cb,retry+1),140);return;}
    cb(res);
  };
  try{
    SF_CB=null;SF_LAST_INFO=null;SF_MULTI_INFO={};SF.postMessage('stop');
    SF_READY_CB=()=>{
      if(finished)return;
      SF_LAST_INFO=null;SF_MULTI_INFO={};
      SF_CB=(move,info)=>finish(info?{best:uci,info}:null);
      SF.postMessage('setoption name UCI_LimitStrength value false');
      SF.postMessage('setoption name Skill Level value 20');
      SF.postMessage('setoption name MultiPV value 1');
      SF.postMessage('position fen '+fen);
      SF.postMessage('go depth '+depth+' searchmoves '+uci);
    };
    SF.postMessage('isready');
    SF_TIMER=setTimeout(()=>{try{SF.postMessage('stop');}catch(e){}finish(null);},depth>=15?19000:15000);
  }catch(e){finish(null);}
}

function sfAnalyzePosition(fen,cb){sfAnalyzePositionDepth(fen,14,cb);}

function infoWhiteEval(fen,info){
  if(!info)return null;
  // stockfish.js reports score from the SIDE TO MOVE. Normalize every score
  // to White's perspective before storing/displaying it:
  //   positive = White better / White mating
  //   negative = Black better / Black mating
  const stm=parseFen(fen).turn;
  const signed=stm==='w'?info.value:-info.value;
  if(info.type==='mate')return{kind:'mate',value:signed};
  return{kind:'cp',value:signed/100};
}
function evaluationPerspectiveSanity(fen,info,normalized){
  if(!info||!normalized)return true;
  const stm=parseFen(fen).turn;
  const expected=stm==='w'?Math.sign(info.value):-Math.sign(info.value);
  const got=Math.sign(normalized.value);
  if(info.value!==0&&expected!==0&&got!==expected){
    console.error('Evaluation perspective sanity check failed', {fen,info,normalized});
    return false;
  }
  return true;
}
function evalText(ev){
  if(!ev)return'';
  if(ev.terminal)return ev.stalemate?'Draw':'Checkmate';
  if(ev.kind==='mate')return(ev.value>0?'M':'-M')+Math.abs(ev.value);
  if(ev.value>=10)return'+10.0+';
  if(ev.value<=-10)return'-10.0+';
  return(ev.value>=0?'+':'')+ev.value.toFixed(2);
}
function whiteWinProb(ev){
  if(!ev)return null;
  if(ev.kind==='mate')return ev.value>0?1:0;
  // Expected-points style curve. This is intentionally less hypersensitive
  // around equality than V2.5's curve, which over-penalized normal openings.
  return 1/(1+Math.exp(-0.46*ev.value));
}
const MOVE_CLASS_META={
  Brilliant:{icon:'‼',cls:'mc-brilliant'},
  Great:{icon:'!',cls:'mc-great'},
  Best:{icon:'★',cls:'mc-best'},
  Excellent:{icon:'✓',cls:'mc-excellent'},
  Good:{icon:'●',cls:'mc-good'},
  Inaccuracy:{icon:'?!',cls:'mc-inaccuracy'},
  Mistake:{icon:'?',cls:'mc-mistake'},
  Miss:{icon:'ⓧ',cls:'mc-miss'},
  Blunder:{icon:'??',cls:'mc-blunder'},
  Forced:{icon:'□',cls:'mc-forced'},
  Checkmate:{icon:'#',cls:'mc-mate'},
  Book:{icon:'📖',cls:'mc-book'},
  'Not analyzed':{icon:'…',cls:'rn'}
};
function moverWinProb(ev,side){
  const w=whiteWinProb(ev);if(w==null)return null;return side==='w'?w:1-w;
}
function materialBalanceForSide(fen,side){
  const {bd}=parseFen(fen);let w=0,b=0;
  for(let r=0;r<8;r++)for(let f=0;f<8;f++){
    const pc=GP(bd,r,f);if(!pc)continue;
    const v=materialValue(pc);
    if(isW(pc))w+=v;else b+=v;
  }
  return side==='w'?w-b:b-w;
}
function acceptedSacrificeMaterialLoss(entry,beforeFen,pv){
  if(!Array.isArray(pv)||pv.length<2||pv[0]!==entry.uci)return 0;
  const mover=parseFen(beforeFen).turn;
  const beforeBal=materialBalanceForSide(beforeFen,mover);
  let fen=beforeFen;

  // The first move must be the candidate and the opponent must actually take
  // the offered piece on move two.
  for(let i=0;i<Math.min(pv.length,4);i++){
    const u=pv[i];
    if(!isLegalEngineMove(fen,u))return 0;
    if(i===1&&u.slice(2,4)!==entry.uci.slice(2,4))return 0;
    fen=applyUci(fen,u);
  }

  // Look through the immediate recapture window. If the "sacrificed" material
  // is simply won back on the next move (e.g. Qxd5 Qxd5 Bxd5), it is an
  // exchange sequence, not a Brilliant sacrifice.
  const afterWindowBal=materialBalanceForSide(fen,mover);
  return beforeBal-afterWindowBal;
}

function isSacrificeCandidate(entry,beforeFen,afterFen){
  const {bd,turn}=parseFen(beforeFen);
  const ff=entry.uci.charCodeAt(0)-97,fr=+entry.uci[1]-1,tf=entry.uci.charCodeAt(2)-97,tr=+entry.uci[3]-1;
  const pc=GP(bd,fr,ff),cap=GP(bd,tr,tf);
  if(!pc||pc.toUpperCase()==='P'||pc.toUpperCase()==='K')return false;
  // A "brilliant" sacrifice should actually offer meaningful material, not
  // merely put a piece on an attacked square after an equal-value capture.
  const pv=materialValue(pc),cv=materialValue(cap);
  if(pv-cv<200)return false;
  const {bd:abd}=parseFen(afterFen);
  return attacked(abd,tr,tf,turn==='w'?'b':'w');
}
function pvAcceptsSacrifice(entry,beforeFen,pv){
  if(!Array.isArray(pv)||pv.length<2||pv[0]!==entry.uci)return false;
  const reply=pv[1];
  if(!isLegalEngineMove(applyUci(beforeFen,entry.uci),reply))return false;
  // The opponent's PV reply must actually capture the offered piece on its
  // destination square. Otherwise the material wasn't really sacrificed.
  return reply.slice(2,4)===entry.uci.slice(2,4);
}
function mateForSide(ev,side){
  if(!ev||ev.kind!=='mate')return 0;
  return side==='w'?ev.value:-ev.value; // positive = side mates, negative = side is mated
}

function classifyMove({entry,beforeFen,afterFen,bestUci,beforeEval,afterEval,probLoss,inBook,beforeInfo}){
  const mover=parseFen(beforeFen).turn;
  const legalCount=legalMoves(beforeFen).length;
  const mateAfter=afterEval?.terminal&&!afterEval?.stalemate;
  if(mateAfter)return{label:'Checkmate',...MOVE_CLASS_META.Checkmate};
  if(legalCount===1)return{label:'Forced',...MOVE_CLASS_META.Forced};
  if(probLoss==null)return{label:'Not analyzed',...MOVE_CLASS_META['Not analyzed']};

  const best=!!bestUci&&entry.uci===bestUci;
  const beforeP=moverWinProb(beforeEval,mover),afterP=moverWinProb(afterEval,mover);
  const bm=mateForSide(beforeEval,mover),am=mateForSide(afterEval,mover);

  // The mover is being forcibly mated. Once mate is unavoidable, grading is
  // about resistance quality rather than pretending every shorter mate is a
  // catastrophic new error.
  if(bm<0){
    if(am>=0)return{label:'Great',...MOVE_CLASS_META.Great}; // escaped mate
    if(best)return{label:'Forced',...MOVE_CLASS_META.Forced};
    const beforeDist=Math.abs(bm),afterDist=Math.abs(am);
    const shortened=beforeDist-afterDist;
    if(shortened>=6)return{label:'Mistake',...MOVE_CLASS_META.Mistake};
    if(shortened>=3)return{label:'Inaccuracy',...MOVE_CLASS_META.Inaccuracy};
    return{label:'Good',...MOVE_CLASS_META.Good};
  }

  const beforeMate=bm>0,afterMate=am>0;

  // The mover has a forced mate. Preserving the forced win is still a strong
  // move even if it is not the fastest engine mate. Only substantial loss of
  // conversion efficiency is downgraded.
  if(beforeMate){
    if(!afterMate)return{label:'Miss',...MOVE_CLASS_META.Miss};
    if(best)return{label:'Great',...MOVE_CLASS_META.Great};
    const lengthened=am-bm;
    if(lengthened<=0)return{label:'Excellent',...MOVE_CLASS_META.Excellent};
    if(lengthened<=2)return{label:'Good',...MOVE_CLASS_META.Good};
    if(lengthened<=4)return{label:'Inaccuracy',...MOVE_CLASS_META.Inaccuracy};
    if(lengthened<=7)return{label:'Mistake',...MOVE_CLASS_META.Mistake};
    return{label:'Blunder',...MOVE_CLASS_META.Blunder};
  }

  if(beforeP!=null&&afterP!=null&&beforeP>=.82&&afterP<.62&&probLoss>=.16)
    return{label:'Miss',...MOVE_CLASS_META.Miss};

  const pv=beforeInfo?.pv||[];
  const acceptedLoss=acceptedSacrificeMaterialLoss(entry,beforeFen,pv);
  // Brilliant is reserved for a sound, accepted sacrifice in a position where
  // the move still matters to the practical result. Do not award it for a
  // forced/best resource when the mover is already completely lost.
  const brilliantContext=beforeP!=null&&beforeP>=.08;
  if(best&&brilliantContext&&probLoss<=.008&&isSacrificeCandidate(entry,beforeFen,afterFen)&&
     pvAcceptsSacrifice(entry,beforeFen,pv)&&acceptedLoss>=250)
    return{label:'Brilliant',...MOVE_CLASS_META.Brilliant};

  if(best&&afterMate)return{label:'Great',...MOVE_CLASS_META.Great};
  if(best)return{label:'Best',...MOVE_CLASS_META.Best};
  if(probLoss<=.02)return{label:'Excellent',...MOVE_CLASS_META.Excellent};
  if(probLoss<=.05)return{label:'Good',...MOVE_CLASS_META.Good};
  if(probLoss<=.10)return{label:'Inaccuracy',...MOVE_CLASS_META.Inaccuracy};
  if(probLoss<=.20)return{label:'Mistake',...MOVE_CLASS_META.Mistake};
  return{label:'Blunder',...MOVE_CLASS_META.Blunder};
}
function pieceName(p){return({P:'pawn',N:'knight',B:'bishop',R:'rook',Q:'queen',K:'king'})[p?.toUpperCase()]||'piece';}
function movePurpose(fen,uci){
  if(!uci||!isLegalEngineMove(fen,uci))return'';
  const {bd,turn}=parseFen(fen);
  const ff=uci.charCodeAt(0)-97,fr=+uci[1]-1,tf=uci.charCodeAt(2)-97,tr=+uci[3]-1;
  const pc=GP(bd,fr,ff),cap=GP(bd,tr,tf),nf=applyUci(fen,uci);
  const san=uci2san(fen,uci);
  const ideas=[];
  if(san==='O-O'||san==='O-O-O')ideas.push('gets the king safe and connects the rooks');
  if(cap)ideas.push('removes the '+pieceName(cap)+' on '+uci.slice(2,4));
  if(inCheck(nf,parseFen(nf).turn))ideas.push('forces a reply with check');
  if(pc&&pc.toUpperCase()==='P'&&['d','e'].includes(uci[0]))ideas.push('challenges the center');
  if(pc&&pc.toUpperCase()==='P'&&['c','f'].includes(uci[0])&&Math.abs(tr-fr)>=1)ideas.push('creates a useful pawn break');
  if(pc&&['N','B'].includes(pc.toUpperCase())&&((turn==='w'&&fr===0)||(turn==='b'&&fr===7)))ideas.push('develops a minor piece');
  if(pc&&pc.toUpperCase()==='R'&&['c','d','e'].includes(uci[2]))ideas.push('activates a rook toward the center');
  if(pc&&pc.toUpperCase()==='Q'&&inCheck(nf,parseFen(nf).turn))ideas.push('uses the queen actively with tempo');
  return ideas.length?ideas.slice(0,2).join(' and '):'improves the position without creating an immediate tactical concession';
}
function strategicMoveNotes(entry,beforeFen,afterFen,plyIndex){
  const {bd,turn}=parseFen(beforeFen);
  const ff=entry.uci.charCodeAt(0)-97,fr=+entry.uci[1]-1,tf=entry.uci.charCodeAt(2)-97,tr=+entry.uci[3]-1;
  const pc=GP(bd,fr,ff),cap=GP(bd,tr,tf),notes=[];
  const moveNo=Math.floor(plyIndex/2)+1;
  if(moveNo>=6&&moveNo<=20){
    if(pc&&pc.toUpperCase()==='P'&&['d','e'].includes(entry.uci[0]))
      notes.push('Early-middlegame idea: this commits the central pawn structure, so check the resulting weak squares and pawn breaks before pushing.');
    if(pc&&pc.toUpperCase()==='P'&&['f','g','h'].includes(entry.uci[0])){
      const homeSide=turn==='w'?fr<=2:fr>=5;
      if(homeSide)notes.push('King-safety check: a flank-pawn move near your king can create squares and diagonals the opponent may attack.');
    }
    if(pc&&pc.toUpperCase()==='Q'&&!cap)
      notes.push('Development check: queen moves in this phase are strongest when they solve a concrete problem or gain tempo; otherwise improve the least-active piece first.');
    if(pc&&['N','B'].includes(pc.toUpperCase())&&!cap)
      notes.push('Piece-placement check: compare this square with the piece’s long-term job in the pawn structure, not just its immediate activity.');
    if(cap)notes.push('Before this exchange, compare what each recapture changes: material, pawn structure, open files and king safety.');
    if(inCheck(afterFen,parseFen(afterFen).turn))
      notes.push('Because this gives check, calculate the opponent’s forcing replies before judging the positional benefit.');
  }
  return notes;
}
function earlyMiddlegameLesson(entry,beforeFen,afterFen,bestSan,grade,plyIndex){
  const moveNo=Math.floor(plyIndex/2)+1;
  if(moveNo<8||moveNo>20||!['Inaccuracy','Mistake','Miss','Blunder'].includes(grade))return'';
  try{
    const from=entry.uci?.slice(0,2),to=entry.uci?.slice(2,4);
    let moved=null;
    if(from){
      const {bd}=parseFen(beforeFen);
      const ff=from.charCodeAt(0)-97,fr=+from[1]-1;
      moved=GP(bd,fr,ff);
    }
    const center=['c4','d4','e4','f4','c5','d5','e5','f5'],notes=[];
    if(moved&&moved.toLowerCase()==='p'&&center.includes(to))
      notes.push('This central pawn move changes the structure immediately, so check captures, pawn breaks, and newly opened lines before committing.');
    if(moved&&moved.toLowerCase()==='p'&&to&&['f','g','h'].includes(to[0]))
      notes.push('This flank pawn move changes squares around the king; make sure the space gain is worth the weakened squares.');
    if((entry.san||'').includes('x'))
      notes.push('Calculate the full capture/recapture sequence, not just the first exchange.');
    if(moved&&['n','b','r','q'].includes(moved.toLowerCase()))
      notes.push('In the early middlegame, compare piece coordination and ask whether this leaves a piece or pawn loose.');
    if(bestSan)
      notes.push('Compare with '+bestSan+': identify the threat, development gain, or structural improvement that move creates.');
    if(!notes.length)
      notes.push('Scan checks, captures, and direct threats for both sides, then improve your least-active piece.');
    return' Middlegame lesson: '+notes.slice(0,2).join(' ');
  }catch(err){
    console.warn('Middlegame lesson skipped',err);
    return'';
  }
}

function pvSanLine(fen,pv,maxPlies=4){
  if(!Array.isArray(pv)||!pv.length)return'';
  let cur=fen;const out=[];
  for(const u of pv.slice(0,maxPlies)){
    if(!isLegalEngineMove(cur,u))break;
    const san=uci2san(cur,u);
    if(!san)break;
    out.push(san);cur=applyUci(cur,u);
  }
  return out.join(' ');
}
function hangingPiecesAfterMove(afterFen,moverColor){
  try{
    const {bd}=parseFen(afterFen),enemy=moverColor==='w'?'b':'w',out=[];
    for(let r=0;r<8;r++)for(let f=0;f<8;f++){
      const pc=GP(bd,r,f);
      if(!pc||friendly(pc,enemy)||pc.toUpperCase()==='K')continue;
      if(attacked(bd,r,f,enemy)){
        const sq=String.fromCharCode(97+f)+(r+1);
        out.push({sq,pc,value:materialValue(pc)});
      }
    }
    return out.sort((x,y)=>y.value-x.value);
  }catch(e){return[];}
}
function missedMateLesson(beforeEval,afterEval,bestSan,grade){
  if(grade!=='Miss'||beforeEval?.kind!=='mate'||afterEval?.kind==='mate')return'';
  const n=Math.abs(beforeEval.value);
  return' Missed mate: you had a forced mate in '+n+(bestSan?' with '+bestSan+' as the engine’s preferred continuation':'')+
    '. The played move gave up the forced mate'+(afterEval?' but the resulting evaluation is '+evalText(afterEval):'')+'.';
}
function bigSwingLesson(entry,beforeFen,afterFen,opponentBestUci,opponentInfo,probLoss,grade){
  if(!['Mistake','Miss','Blunder'].includes(grade)||!opponentBestUci||!isLegalEngineMove(afterFen,opponentBestUci))return'';
  try{
    const replySan=uci2san(afterFen,opponentBestUci);
    const mover=parseFen(beforeFen).turn;
    const movedTo=entry.uci?.slice(2,4),replyTo=opponentBestUci.slice(2,4);
    const {bd:afterBd}=parseFen(afterFen);
    const tf=movedTo?.charCodeAt(0)-97,tr=movedTo?+movedTo[1]-1:-1;
    const movedPiece=(movedTo&&tf>=0&&tr>=0)?GP(afterBd,tr,tf):null;
    const notes=[];

    if(movedPiece&&replyTo===movedTo&&replySan.includes('x')){
      notes.push('Immediate punishment: '+replySan+' captures the piece you just moved to '+movedTo+'.');
    }else if(replySan.includes('x')){
      const captured=capturedMaterialValue(afterFen,opponentBestUci);
      notes.push('Immediate punishment: '+replySan+' is a forcing capture'+(captured>=280?' that wins a piece or more':'')+'.');
    }else{
      const next=applyUci(afterFen,opponentBestUci);
      if(inCheck(next,parseFen(next).turn))notes.push('Immediate punishment: '+replySan+' gives check and forces your response.');
    }

    const loose=hangingPiecesAfterMove(afterFen,mover).filter(x=>x.value>=280);
    if(loose.length&&!notes.some(n=>n.includes(loose[0].sq)))
      notes.push('After your move, your '+pieceName(loose[0].pc)+' on '+loose[0].sq+' is attacked; verify whether it has a safe tactical defense.');

    const line=pvSanLine(afterFen,opponentInfo?.pv||[],4);
    if(line)notes.push('Engine punishment line: '+line+'.');
    if(probLoss!=null&&probLoss>=.15)
      notes.push('This is a large swing, so the cause is likely concrete—checks, captures, or a loose piece—rather than a small positional preference.');

    return notes.length?' Tactical cause: '+notes.slice(0,3).join(' '):'';
  }catch(err){return'';}
}

function reviewExplanation(entry,beforeFen,afterFen,bestSan,probLoss,engineOK,classification='',plyIndex=0){
  const {bd,turn}=parseFen(beforeFen);
  const ff=entry.uci.charCodeAt(0)-97,fr=+entry.uci[1]-1,tf=entry.uci.charCodeAt(2)-97,tr=+entry.uci[3]-1;
  const pc=GP(bd,fr,ff),cap=GP(bd,tr,tf);
  const parts=[];
  const node=DB[beforeFen],repStatus=repertoireMoveStatus(beforeFen,entry.san);
  if(repStatus.inBook){
    const why=node&&node.moves&&node.moves[entry.san]?stripHtml(node.note||''):'';
    if(repStatus.transposition)parts.push('📖 Repertoire transposition: this move reaches a position already contained in your stored repertoire.');
    else parts.push(why?'📖 Repertoire: '+why:'📖 This move matches your stored repertoire.');
  }else{
    if(entry.san==='O-O'||entry.san==='O-O-O')parts.push('You castle, improving king safety and connecting the rooks.');
    else if(cap)parts.push('You exchange your '+pieceName(pc)+' for the '+pieceName(cap)+' on '+entry.uci.slice(2,4)+'.');
    else if(pc&&pc.toUpperCase()==='N'&&((turn==='w'&&fr===0)||(turn==='b'&&fr===7)))parts.push('You develop a knight and increase its influence on the center.');
    else if(pc&&pc.toUpperCase()==='B'&&((turn==='w'&&fr===0)||(turn==='b'&&fr===7)))parts.push('You develop a bishop and change its diagonal.');
    else if(pc&&pc.toUpperCase()==='P'&&['c','d','e','f'].includes(entry.uci[0]))parts.push('This pawn move changes the center and the available pawn breaks.');
    else parts.push('This move changes your piece coordination and the squares you control.');
  }
  if(inCheck(afterFen,parseFen(afterFen).turn))parts.push('It gives check, so the opponent must answer the threat immediately.');

  const meanings={
    Brilliant:'Exceptional engine-best move involving a verified sound material sacrifice.',
    Great:'A critical engine-best move in a forcing position.',
    Best:'Stockfish’s top choice.',
    Excellent:'Essentially as strong as the top choice.',
    Good:'A solid move with only a small loss in winning chances.',
    Inaccuracy:'A noticeable loss of accuracy, but the position remains manageable.',
    Mistake:'A significant deterioration in the position.',
    Miss:'A major winning opportunity or forced mate was available and was missed.',
    Blunder:'A major swing in the expected result of the game.',
    Forced:'This was the only legal move or the engine’s best resistance in an unavoidable forced-mate sequence.',
    Checkmate:'This move ends the game by checkmate.',
    Book:'This is a stored repertoire move, so ChessTool treats it as a book move rather than assigning a separate engine-quality label.'
  };
  if(meanings[classification])parts.push(meanings[classification]);

  if(classification==='Book'){
    // Repertoire explanation above is enough; do not undermine a book move with
    // a second Best/Excellent/Inaccuracy-style engine judgment.
  }else if(engineOK&&bestSan){
    if(bestSan===entry.san)parts.push('The move matches Stockfish’s first choice.');
    else{
      const bestUci=san2uci(beforeFen,bestSan);
      const purpose=bestUci?movePurpose(beforeFen,bestUci):'improves the position';
      if(probLoss!=null&&probLoss>.02)
        parts.push('Stockfish preferred '+bestSan+', which '+purpose+'. Your move gave up about '+Math.round(probLoss*100)+' percentage points of estimated winning chances.');
      else parts.push('Stockfish slightly preferred '+bestSan+', which '+purpose+', but the practical difference was small.');
    }
  }else if(!engineOK){
    parts.push('Stockfish analysis was unavailable for this position, so ChessTool is not inventing a numeric grade.');
  }

  strategicMoveNotes(entry,beforeFen,afterFen,plyIndex).forEach(x=>parts.push(x));
  return parts.join(' ');
}

function buildReviewFens(){
  if(!BOT_LOG.length)return[];
  const arr=[BOT_LOG[0].fen];
  BOT_LOG.forEach(e=>arr.push(applyUci(e.fen,e.uci)));
  return arr;
}

function reviewMoveLabel(i){
  const e=BOT_LOG[i],p=parseFen(e.fen);
  return p.fm+(p.turn==='w'?'. ':'… ')+e.san;
}

function renderReviewList(){
  const el=document.getElementById('revlist');if(!el)return;el.innerHTML='';
  BOT_LOG.forEach((e,i)=>{
    const r=REVIEW_RESULTS[i]||{};
    const div=document.createElement('button');div.type='button';div.className='ri reviewrow'+(REVIEW_INDEX===i+1?' active':'');
    const owner=e.byBot?'Bot':'You';
    const label=r.grade||'Analyzing…',icon=r.icon||'…',cls=r.cls||'rn';
    const evalTxt=r.evalAfter==null?'':(' · '+evalText(r.evalAfter));
    const book=(r.inBook&&label!=='Book')?' <span class="booktag">📖 '+(r.transposition?'Transposition':'Repertoire')+'</span>':'';
    const bookKind=(r.inBook&&label==='Book'&&r.transposition)?' <span class="booktag">Transposition</span>':'';
    div.innerHTML='<span class="rm">'+reviewMoveLabel(i)+'</span> <span class="reviewowner">'+owner+'</span> <span class="moveclass '+cls+'"><span class="moveicon">'+icon+'</span> '+label+'</span>'+bookKind+book+'<span class="rn">'+evalTxt+'</span>';
    div.onclick=()=>reviewGo(i+1);
    el.appendChild(div);
  });
  const foot=document.createElement('div');foot.className='reviewfoot';
  foot.textContent=(SF&&!SF_FAILED)?'Stockfish supplies evaluations and best moves; ChessTool assigns the move labels. Positive evaluation favors White, negative favors Black.':'Stockfish review is unavailable, so numeric engine claims are hidden.';
  el.appendChild(foot);
}

function renderReviewDetail(){
  const pos=document.getElementById('reviewpos'),detail=document.getElementById('reviewdetail');
  const dpos=document.getElementById('dockreviewpos'),ddetail=document.getElementById('dockreviewdetail');
  if(REVIEW_INDEX===0){
    if(pos)pos.textContent='Starting position';if(dpos)dpos.textContent='Starting position';
    const t='Use Next or tap a move to step through the game.';
    if(detail)detail.textContent=t;if(ddetail)ddetail.textContent=t;return;
  }
  const i=REVIEW_INDEX-1,e=BOT_LOG[i],r=REVIEW_RESULTS[i]||{};
  const title=reviewMoveLabel(i)+' · '+(e.byBot?'Bot':'You');
  const book=(r.inBook&&r.grade!=='Book')?' · 📖 '+(r.transposition?'Transposition':'Repertoire'):'';
  const best=(r.grade==='Book')?'':(r.bestSan&&r.bestSan!==e.san?' · Best: '+r.bestSan:'');
  const html='<strong class="'+(r.cls||'')+'">'+(r.icon||'…')+' '+(r.grade||'Analysis pending')+'</strong>'+book+best+(r.evalAfter!=null?' · Eval: '+evalText(r.evalAfter):'')+'<div class="reviewexplain">'+(r.explanation||'Analysis is still running…')+'</div>';
  if(pos)pos.textContent=title;if(dpos)dpos.textContent=title;
  if(detail)detail.innerHTML=html;if(ddetail)ddetail.innerHTML=html;
}

function reviewGo(idx){
  if(!REVIEW_FENS.length)return;
  REVIEW_INDEX=Math.max(0,Math.min(REVIEW_FENS.length-1,idx));
  FEN=REVIEW_FENS[REVIEW_INDEX];FLIPPED=BOT_GAME_COLOR==='black';SEL=null;LDOTS=[];
  if(REVIEW_INDEX>0){const u=BOT_LOG[REVIEW_INDEX-1].uci;setLastUci(u);}else{LF=null;LT=null;}
  refreshPanel();drawBoard();renderReviewList();renderReviewDetail();
  setCoach(REVIEW_INDEX===0?'Game review: starting position.':'Reviewing '+reviewMoveLabel(REVIEW_INDEX-1)+'. Use Previous / Next or tap another move.');
}
function reviewStep(delta){reviewGo(REVIEW_INDEX+delta);}

function evalDrift(a,b){
  if(!a||!b||a.kind!=='cp'||b.kind!=='cp')return 0;
  return Math.abs(a.value-b.value);
}
function reviewStabilityNote(playedEval,resultEval,plyIndex){
  if(plyIndex>=40)return'';
  const drift=evalDrift(playedEval,resultEval);
  if(drift>=1.0)return' Engine searches disagreed by about '+drift.toFixed(1)+' pawns here. ChessTool is showing and grading the more stable same-parent move search for this early position.';
  if(drift>=.55)return' The two engine searches differed moderately here; ChessTool uses the same-parent result for this early move.';
  return'';
}

function matePerspectiveTransitionNote(beforeEval,afterEval){
  if(!beforeEval||!afterEval||beforeEval.kind!=='mate'||afterEval.kind!=='mate')return'';
  if(Math.sign(beforeEval.value)!==Math.sign(afterEval.value)){
    return' Mate-side changed between consecutive positions. This can be legitimate only if the move actually escapes or reverses a forced mate; inspect this move closely.';
  }
  return'';
}

function analyzeReview(){
  const eng=document.getElementById('reviewengine');
  if(!SF||SF_FAILED){
    if(eng)eng.textContent='Stockfish unavailable';
    REVIEW_RESULTS=BOT_LOG.map((e,i)=>{const rs=repertoireMoveStatus(e.fen,e.san),inBook=rs.inBook,m=inBook?MOVE_CLASS_META.Book:MOVE_CLASS_META['Not analyzed'];return{grade:inBook?'Book':'Not analyzed',icon:m.icon,cls:m.cls,inBook,transposition:rs.transposition,evalAfter:null,bestSan:'',explanation:reviewExplanation(e,REVIEW_FENS[i],REVIEW_FENS[i+1],'',null,false,inBook?'Book':'Not analyzed',i)};});
    renderReviewList();renderReviewDetail();return;
  }
  const posResults=new Array(REVIEW_FENS.length),playedResults=new Array(BOT_LOG.length);
  let positionIndex=0,cachedHits=0,extraChecks=0;
  function updateProgress(label,done,total){if(eng)eng.textContent=label+' '+done+'/'+total+(cachedHits?' · '+cachedHits+' cached':'');}
  function provisionalLoss(i){const e=BOT_LOG[i],before=posResults[i],after=posResults[i+1];if(!before?.eval||!after?.eval)return null;const mover=parseFen(e.fen).turn,pb=whiteWinProb(before.eval),pa=whiteWinProb(after.eval);return Math.max(0,mover==='w'?pb-pa:pa-pb);}
  function needsPlayedVerification(i){
    const e=BOT_LOG[i],before=posResults[i],after=posResults[i+1];if(!before||!after)return false;

    // A terminal move (checkmate/stalemate) is already fully determined by
    // ChessTool's legal-move engine. Never send it through searchmoves; some
    // browser Stockfish builds do not return a usable info/bestmove pair for
    // that constrained terminal search.
    const afterFen=REVIEW_FENS[i+1];
    if(after?.eval?.terminal||!legalMoves(afterFen).length)return false;

    if(before.best===e.uci)return false;
    const loss=provisionalLoss(i);if(loss==null)return true;
    const inBook=isRepertoireMove(e.fen,e.san);

    // Forced-mate positions usually already have decisive information from
    // the position pass. Only Deep mode verifies a non-terminal mate move.
    if(before.eval?.kind==='mate'||after.eval?.kind==='mate')
      return REVIEW_MODE==='deep'&&i<40;

    if(REVIEW_MODE==='deep')return i<40;
    if(loss>=.045)return true;
    if(inBook&&i<20&&loss>=.025)return true;
    if(i<40&&evalDrift(before.eval,after.eval)>=1.75)return true;
    return false;
  }
  let reviewFinalized=false;
  const wholeReviewWatchdog=setTimeout(()=>{
    if(!reviewFinalized){
      console.warn('Whole review watchdog forced finalization');
      try{SF_CB=null;SF_READY_CB=null;SF?.postMessage('stop');}catch(e){}
      finalize();
    }
  }, REVIEW_MODE==='deep'?90000:60000);
  function finalize(){
    if(reviewFinalized)return;
    reviewFinalized=true;
    clearTimeout(wholeReviewWatchdog);
    if(eng)eng.textContent='Finalizing review…';

    try{
      REVIEW_RESULTS=BOT_LOG.map((e,i)=>{
        try{
          const before=posResults[i],after=posResults[i+1],played=playedResults[i],mover=parseFen(e.fen).turn;
          const eb=before?.eval||null,resultPositionEval=after?.eval||null,qualityAfter=played?.eval||resultPositionEval;
          const displayAfter=(i<40&&played?.eval)?played.eval:resultPositionEval,pb=whiteWinProb(eb),pa=whiteWinProb(qualityAfter);
          const probLoss=(pb==null||pa==null)?null:Math.max(0,mover==='w'?pb-pa:pa-pb),inBook=isRepertoireMove(e.fen,e.san),bestUci=before?.best||null;

          let c=classifyMove({entry:e,beforeFen:REVIEW_FENS[i],afterFen:REVIEW_FENS[i+1],bestUci,beforeEval:eb,afterEval:qualityAfter,probLoss,inBook,beforeInfo:before?.info});

          const finalFen=REVIEW_FENS[i+1],finalTurn=parseFen(finalFen).turn;
          if(!legalMoves(finalFen).length&&inCheck(finalFen,finalTurn))
            c={label:'Checkmate',...MOVE_CLASS_META.Checkmate};

          // Stored repertoire is a learning category, not a second engine grade.
          // A book move simply displays "📖 Book". Checkmate still wins precedence.
          if(inBook&&c.label!=='Checkmate')
            c={label:'Book',...MOVE_CLASS_META.Book};

          // Practical opening floor. In the first eight moves, a move that
          // changes the objective engine score by only a few tenths is not
          // pedagogically useful as an Inaccuracy. Repertoire/transposition
          // moves get a slightly wider floor.
          const pawnLoss=(eb?.kind==='cp'&&qualityAfter?.kind==='cp')
            ? Math.max(0,mover==='w'?eb.value-qualityAfter.value:qualityAfter.value-eb.value)
            : null;
          const quietOpening=(i<16&&pawnLoss!=null&&pawnLoss<=.35);
          const soundRepertoire=(inBook&&i<20&&qualityAfter?.kind!=='mate'&&
            ((probLoss!=null&&probLoss<=.075)||(pawnLoss!=null&&pawnLoss<=.55)));
          if(!inBook&&(quietOpening||soundRepertoire)&&['Inaccuracy','Mistake','Miss','Blunder'].includes(c.label))
            c={label:'Good',...MOVE_CLASS_META.Good};

          const bestSan=bestUci&&isLegalEngineMove(e.fen,bestUci)?uci2san(e.fen,bestUci):'';
          let explanation='';
          try{
            explanation=reviewExplanation(e,REVIEW_FENS[i],REVIEW_FENS[i+1],bestSan,probLoss,true,c.label,i);
          }catch(err){
            console.warn('Base explanation failed for move',i,e.san,err);
            explanation='Move analysis completed, but the detailed explanation could not be generated.';
          }
          explanation+=earlyMiddlegameLesson(e,REVIEW_FENS[i],REVIEW_FENS[i+1],bestSan,c.label,i);
          const opponentBestUci=after?.best||null;
          explanation+=bigSwingLesson(e,REVIEW_FENS[i],REVIEW_FENS[i+1],opponentBestUci,after?.info||null,probLoss,c.label);
          explanation+=missedMateLesson(eb,qualityAfter,bestSan,c.label);
          if(played)explanation+=' This move received a targeted same-parent verification.';
          explanation+=reviewStabilityNote(qualityAfter,resultPositionEval,i);
          explanation+=matePerspectiveTransitionNote(eb,displayAfter);

          const repStatus=repertoireMoveStatus(e.fen,e.san);
          return{grade:c.label,icon:c.icon,cls:c.cls,inBook:repStatus.inBook,transposition:repStatus.transposition,evalAfter:displayAfter,bestSan,probLoss,explanation,sameParent:!!played,beforeEval:eb,qualityAfter};
        }catch(err){
          console.error('Review move finalization failed',i,e?.san,err);
          const inBook=isRepertoireMove(e?.fen,e?.san);
          const after=posResults[i+1]?.eval||null;
          return{
            grade:'Not analyzed',icon:'…',cls:'rn',inBook,transposition:repertoireMoveStatus(e?.fen,e?.san).transposition,evalAfter:after,bestSan:'',
            probLoss:null,
            explanation:'This move could not be fully classified because a local review step failed. The rest of the game review is still available.',
            sameParent:false
          };
        }
      });

      if(eng)eng.textContent=(REVIEW_MODE==='fast'?'Fast':'Deep')+' review complete · '+cachedHits+' cached · '+extraChecks+' extra checks';
      saveMistakeTrends();
      renderReviewList();
      renderReviewDetail();
    }catch(err){
      console.error('Review finalization failed',err);
      if(eng)eng.textContent='Review completed with partial analysis';
      // Last-resort render so the UI can never remain stuck on "Finalizing".
      if(!REVIEW_RESULTS.length){
        REVIEW_RESULTS=BOT_LOG.map((e,i)=>({
          grade:'Not analyzed',icon:'…',cls:'rn',
          inBook:isRepertoireMove(e.fen,e.san),
          evalAfter:posResults[i+1]?.eval||null,
          bestSan:'',
          explanation:'Detailed classification was unavailable, but the game can still be replayed move by move.'
        }));
      }
      try{renderReviewList();renderReviewDetail();}catch(renderErr){console.error('Fallback review render failed',renderErr);}
    }
  }
  const verifyQueue=[];
  function buildVerifyQueue(){
    for(let i=0;i<BOT_LOG.length;i++)if(needsPlayedVerification(i))verifyQueue.push(i);
    if(eng&&verifyQueue.length===0)eng.textContent='No extra verification needed';
  }
  function verifyNext(qi){
    if(reviewFinalized)return;
    if(qi>=verifyQueue.length){finalize();return;}

    const i=verifyQueue[qi],e=BOT_LOG[i],depth=REVIEW_MODE==='deep'?(i<20?15:14):13;
    if(analysisCacheGet('played',e.fen,depth,e.uci))cachedHits++;
    updateProgress('Verifying key moves',qi+1,verifyQueue.length);

    let settled=false;
    const advance=res=>{
      if(settled||reviewFinalized)return;
      settled=true;
      clearTimeout(queueWatchdog);
      if(res){
        const ev=infoWhiteEval(e.fen,res.info);
        evaluationPerspectiveSanity(e.fen,res.info,ev);
        playedResults[i]={eval:ev,info:res.info};
      }
      extraChecks++;
      verifyNext(qi+1);
    };

    // This watchdog is deliberately outside sfAnalyzePlayedMove. It guarantees
    // the REVIEW QUEUE advances even if a Worker message, retry, or bestmove
    // callback is lost on mobile Safari.
    const queueWatchdog=setTimeout(()=>{
      console.warn('Review verification timed out; skipping move',i,e.san);
      try{
        clearTimeout(SF_TIMER);
        SF_CB=null;SF_READY_CB=null;SF_LAST_INFO=null;SF_MULTI_INFO={};
        SF?.postMessage('stop');
      }catch(err){}
      advance(null);
    },REVIEW_MODE==='deep'?18000:12000);

    try{
      sfAnalyzePlayedMove(e.fen,e.uci,depth,res=>advance(res));
    }catch(err){
      console.warn('Review verification failed; skipping move',i,e.san,err);
      advance(null);
    }
  }
  function nextPosition(){
    if(positionIndex>=REVIEW_FENS.length){buildVerifyQueue();verifyNext(0);return;}
    const fen=REVIEW_FENS[positionIndex],idx=positionIndex,tm=parseFen(fen).turn,lm=legalMoves(fen);
    if(!lm.length){if(inCheck(fen,tm))posResults[idx]={best:null,eval:{kind:'mate',value:tm==='w'?-1:1,terminal:true}};else posResults[idx]={best:null,eval:{kind:'cp',value:0,terminal:true,stalemate:true}};positionIndex++;updateProgress('Analyzing positions',positionIndex,REVIEW_FENS.length);nextPosition();return;}
    const depth=REVIEW_MODE==='deep'?(idx<10?18:(idx<20?17:(idx<40?15:14))):(idx<20?13:(idx<50?12:11));
    if(analysisCacheGet('pos',fen,depth))cachedHits++;
    updateProgress('Analyzing positions',positionIndex+1,REVIEW_FENS.length);
    sfAnalyzePositionDepth(fen,depth,res=>{if(res){const ev=infoWhiteEval(fen,res.info);evaluationPerspectiveSanity(fen,res.info,ev);posResults[idx]={best:res.best,eval:ev,info:res.info};}else posResults[idx]={best:null,eval:null,info:null};positionIndex++;nextPosition();});
  }
  nextPosition();
}
function showReview(){
  if(!BOT_LOG.length){setStat('No game to review.','bad');return;}
  BOT_ACTIVE=false;REVIEW_FENS=buildReviewFens();REVIEW_RESULTS=[];REVIEW_INDEX=0;
  document.getElementById('revcard').classList.remove('hidden');
  document.getElementById('reviewdock')?.classList.remove('hidden');
  document.getElementById('playhud')?.classList.add('hidden');
  document.getElementById('gameoveroverlay')?.classList.add('hidden');
  renderReviewList();reviewGo(0);analyzeReview();
}

// ─── PANEL / STATUS ──────────────────────────────────────────────────────────
function refreshPanel(){
  const node=DB[FEN];
  const name=node?.name||'Position';const eco=node?.eco||'';
  document.getElementById('opname').textContent=name;
  document.getElementById('opeco').textContent=eco;
  document.getElementById('note').innerHTML=node?.note||'<em>Position not in repertoire.</em>';
  document.getElementById('prog').style.width=Math.min(100,(SANS.length/12)*100)+'%';
  const ho=document.getElementById('hudopening'),he=document.getElementById('hudeco');
  if(ho)ho.textContent=name;if(he)he.textContent=eco;
}
function setCoach(msg){LAST_COACH=msg||'';const h=document.getElementById('hudmsg');if(h)h.textContent=LAST_COACH;}
function setStat(msg,cls){const e=document.getElementById('stat');e.textContent=msg;e.className=cls||'';}
function drawMoveList(){
  const el=document.getElementById('mvlist');el.innerHTML='';
  for(let i=0;i<SANS.length;i++){
    if(i%2===0){const n=document.createElement('span');n.className='mn';n.textContent=(Math.floor(i/2)+1)+'.';el.appendChild(n);}
    const m=document.createElement('span');m.className='mt'+(i===SANS.length-1?' cur':'');m.textContent=SANS[i];
    const idx=i;m.onclick=()=>{FEN=HIST[idx+1];HIST=HIST.slice(0,idx+2);SANS=SANS.slice(0,idx+1);SEL=null;LDOTS=[];LF=null;LT=null;refreshPanel();drawBoard();drawMoveList();};
    el.appendChild(m);
  }
  el.scrollTop=el.scrollHeight;
}

// ─── CONTROLS ────────────────────────────────────────────────────────────────
function goBack(){
  if(PUZZLE&&MODE==='puzzles'){
    resetPuzzlePosition(PUZZLE);
    return;
  }
  if(MISTAKE_REPLAY){
    const r=MISTAKE_REPLAY;
    FEN=r.fen;HIST=[r.fen];SANS=[];SEL=null;LDOTS=[];LF=null;LT=null;
    r.checking=false;PRACTICE_LOCK=false;
    refreshPanel();drawBoard();drawMoveList();
    setStat(r.bestUci?'Replay position reset — find the strongest move.':'Replay position reset — verification is still required.','info');
    return;
  }
  if(HIST.length<=1)return;
  HIST.pop();SANS.pop();FEN=HIST[HIST.length-1];
  SEL=null;LDOTS=[];LF=null;LT=null;
  refreshPanel();drawBoard();drawMoveList();
  if(MODE==='drill')renderStudy();
}

// fullReset resets position but NOT FLIPPED — FLIPPED is only changed by explicit user actions
function fullReset(){
  MISTAKE_REPLAY=null;
  FEN=INIT;HIST=[INIT];SANS=[];SEL=null;LDOTS=[];LF=null;LT=null;
  BOT_ACTIVE=false;BOT_LOG=[];
  document.getElementById('gameoveroverlay')?.classList.add('hidden');
  document.getElementById('reviewdock')?.classList.add('hidden');
  document.getElementById('playhud')?.classList.remove('hidden');
  document.getElementById('planinfocard')?.classList.add('hidden');
  refreshPanel();drawBoard();drawMoveList();
}

function doReset(){
  if(MODE==='mistakes'){startMistakeDrillPosition(MISTAKE_DRILL.index);return;}
  if(MODE==='puzzles'&&PUZZLE){resetPuzzlePosition(PUZZLE);return;}
  const wasSession=SESSION_STARTED;
  fullReset();SESSION_STARTED=wasSession;
  FLIPPED=SESSION_COLOR==='black';drawBoard();
  if(MODE==='drill'&&SESSION_STARTED)setTimeout(practiceAutoReply,250);
  renderStudy();setStat(SESSION_STARTED?'Session reset.':'Reset.','info');
}

function doFlip(){FLIPPED=!FLIPPED;drawBoard();}


// ─── MODE SWITCHING ───────────────────────────────────────────────────────────
function setMode(mode){
  MISTAKE_REPLAY=null;PUZZLE=null;
  MODE=mode;BOT_ACTIVE=false;SEL=null;LDOTS=[];SESSION_STARTED=false;PRACTICE_LOCK=false;STUDY_PHASE='opening';STUDY_PLAN=null;MID_FEEDBACK='';MID_PRE_ANALYSIS=null;
  document.querySelectorAll('.nb').forEach((b,i)=>b.classList.toggle('on',['drill','mistakes','bot','stats','puzzles'][i]===mode));
  show('linecard',mode==='drill');
  show('expcard',mode==='drill'||mode==='mistakes');
  show('midbotcard',mode==='drill');
  show('botcard',mode==='bot');
  show('trendcard',mode==='bot');
  show('mistakedrillcard',mode==='mistakes');
  show('statscard',mode==='stats');
  show('puzzlecard',mode==='puzzles');
  show('randbtn',mode==='drill');
  show('newgamebtn',mode==='bot');
  show('revbtn',false);
  show('hintbtn',mode==='drill'||mode==='mistakes'||mode==='puzzles');
  document.getElementById('revcard').classList.add('hidden');
  document.getElementById('reviewdock')?.classList.add('hidden');
  document.getElementById('gameoveroverlay')?.classList.add('hidden');
  document.getElementById('playhud')?.classList.remove('hidden');
  fullReset();
  if(mode==='drill'){
    buildLineSelector();renderStudy();initSF();
    const m='TRAIN: recall your opening, then continue directly into coached middlegame play. Wrong opening moves reset; middlegame errors are graded and retried.';
    setStat(m,'info');setCoach(m);
  }
  if(mode==='mistakes'){
    initSF();MISTAKE_DRILL.items=buildMistakeDrillItems();MISTAKE_DRILL.index=0;MISTAKE_DRILL.solved=0;MISTAKE_DRILL.attempts=0;
    startMistakeDrillPosition(0);
  }
  if(mode==='bot'){
    const m='Play a complete game, then review it move by move.';
    setStat(m,'info');setCoach(m);initSF();
  }
  if(mode==='stats'){
    const m='Your chess.com game stats and trends. Use Sync to pull your latest games.';
    setStat(m,'info');setCoach(m);renderStats();
  }
  if(mode==='puzzles'){
    const m='My Blunders: positions from your real chess.com games. Stockfish freshly verifies every answer.';
    setStat(m,'info');setCoach(m);initSF();startPuzzleSession();
  }
}

function show(id,visible){
  const el=document.getElementById(id);
  if(visible)el.classList.remove('hidden');else el.classList.add('hidden');
}

// ─── STATS TAB ────────────────────────────────────────────────────────────────
const STATS_CACHE_KEY='chesstool_stats_cache';
function bundledStats(){
  return (typeof MYGAMES_STATS!=='undefined'&&MYGAMES_STATS&&MYGAMES_STATS.games&&MYGAMES_STATS.games.length)?MYGAMES_STATS:null;
}
function statsData(){
  try{
    const raw=localStorage.getItem(STATS_CACHE_KEY);
    if(raw){const c=JSON.parse(raw);if(c&&c.stats&&c.stats.games&&c.stats.games.length)return c.stats;}
  }catch(e){}
  return bundledStats();
}
function statsScore(w,l,d){const t=w+l+d;return t?((w+0.5*d)/t*100):0;}
function aggStats(games){
  const months={},controls={},openings={};
  const byColor={white:{w:0,l:0,d:0},black:{w:0,l:0,d:0}};
  const endings={checkmateWin:0,checkmateLoss:0,resignWin:0,resignLoss:0,timeoutWin:0,timeoutLoss:0,draw:0};
  let moves=0;
  for(const g of games){
    const mk=(g.d||'').slice(0,7);
    const b=months[mk]||(months[mk]={label:mk,games:0,w:0,l:0,d:0});
    b.games++;b[g.s]++;
    const c=controls[g.c]||(controls[g.c]={games:0,w:0,l:0,d:0});
    c.games++;c[g.s]++;
    const o=openings[g.o]||(openings[g.o]={name:g.o,games:0,w:0,l:0,d:0});
    o.games++;o[g.s]++;
    byColor[g.col==='w'?'white':'black'][g.s]++;
    if(g.s==='d')endings.draw++;
    else endings[(g.t||'resign')+(g.s==='w'?'Win':'Loss')]++;
    moves+=g.m||0;
  }
  const W=games.filter(g=>g.s==='w').length,L=games.filter(g=>g.s==='l').length,D=games.length-W-L;
  return{months:Object.keys(months).sort().map(k=>months[k]),controls,
    openings:Object.values(openings).filter(o=>o.games>=3).sort((a,b)=>b.games-a.games),
    byColor,endings,total:{games:games.length,W,L,D},avgMoves:games.length?+(moves/games.length).toFixed(1):0};
}
function buildInsights(agg,games,deep,eng){
  const out=[],t=agg.total,rg=deep?deep.resign:null;
  out.push('Record: '+t.W+'W–'+t.L+'L–'+t.D+'D across '+t.games+' games ('+statsScore(t.W,t.L,t.D).toFixed(0)+'% score).');
  if(rg&&t.L){
    out.push('You resign only '+rg.myResignRate.toFixed(0)+'% of your losses while opponents resign '+rg.oppResignRate.toFixed(0)+
      '% of theirs — that is why '+rg.mateLossShare.toFixed(0)+'% of your losses end in checkmate vs '+rg.mateWinShare.toFixed(0)+
      '% of your wins. You play dead positions out; they don\u2019t.');
  }
  if(deep&&deep.tilt){
    const tl=deep.tilt;
    if(tl.afterLoss.winPct!=null&&tl.baseline!=null){
      const d=tl.baseline-tl.afterLoss.winPct;
      out.push('Tilt check: '+tl.afterLoss.winPct.toFixed(0)+'% wins in the game right after a loss vs '+tl.baseline.toFixed(0)+
        '% baseline ('+tl.afterLoss.n+' games) — '+(Math.abs(d)<5?'no real tilt.':'real tilt: take a break after losses.'));
    }
    const s1=tl.sessPos['1'],s3=tl.sessPos['3+'];
    if(s1.winPct!=null&&s3.winPct!=null)
      out.push('Session fatigue: game 1 of a session '+s1.winPct.toFixed(0)+'% wins vs game 3+ '+s3.winPct.toFixed(0)+'% ('+s3.n+' games).');
  }
  if(eng&&eng.mateLosses&&eng.mateLosses.avgDeadLostMoves!=null)
    out.push('Engine check of '+eng.mateLosses.n+' recent losses: you played '+eng.mateLosses.avgDeadLostMoves+
      ' moves on average after the position was dead lost (\u22125.0). Opponents in your wins resigned after '+
      eng.resignWins.avgDeadLostMoves+' dead-lost moves.');
  if(eng&&eng.thrownWins)
    out.push('You were +3.0 or better and still lost '+eng.thrownWins+' of the '+eng.mateLosses.n+' sampled losses — conversion is a leak.');
  if(eng&&eng.comebacks)
    out.push('Comebacks: you were \u22123.0 or worse and still won '+eng.comebacks+' of the '+eng.resignWins.n+' sampled wins.');
  const bw=agg.byColor.white,bb=agg.byColor.black;
  out.push('As White you score '+statsScore(bw.w,bw.l,bw.d).toFixed(0)+'%; as Black '+statsScore(bb.w,bb.l,bb.d).toFixed(0)+'%.');
  const pool=agg.openings.filter(o=>o.games>=5);
  if(pool.length){
    const sc=o=>statsScore(o.w,o.l,o.d);
    const best=pool.slice().sort((a,b)=>sc(b)-sc(a))[0];
    const worst=pool.slice().sort((a,b)=>sc(a)-sc(b))[0];
    out.push('Best opening (5+ games): '+best.name+' at '+sc(best).toFixed(0)+'% over '+best.games+' games.');
    if(worst!==best)out.push('Worst opening (5+ games): '+worst.name+' at '+sc(worst).toFixed(0)+'% over '+worst.games+' games — consider tightening this.');
  }
  if(deep&&deep.ratingDiff.length){
    const ub=deep.ratingDiff[deep.ratingDiff.length-1],lb=deep.ratingDiff[0];
    if(ub.games>=5)out.push('As the underdog ('+ub.bucket+'): '+ub.actual.toFixed(0)+'% actual vs '+ub.expected.toFixed(1)+'% expected over '+ub.games+' games.');
    if(lb.games>=5)out.push('As the favourite ('+lb.bucket+'): '+lb.actual.toFixed(0)+'% actual vs '+lb.expected.toFixed(1)+'% expected over '+lb.games+' games.');
  }
  const rap=games.filter(g=>g.c==='rapid'&&g.r!=null);
  if(rap.length>1)out.push('Rapid rating: '+rap[0].r+' → '+rap[rap.length-1].r+' ('+(rap[rap.length-1].r-rap[0].r>=0?'+':'')+(rap[rap.length-1].r-rap[0].r)+') from '+rap[0].d+' to '+rap[rap.length-1].d+'.');
  if(deep&&deep.pace&&deep.pace.rapid!=null)out.push('In rapid you average '+deep.pace.rapid.toFixed(1)+'s per move — that is blitz pace with 10 minutes on the clock. Slow down.');
  if(deep){
    const r=deep.rep.vsD4;
    if(r.total>=5)out.push('Vs 1.d4 as Black you actually play 1...d5 '+(r.d5/r.total*100).toFixed(0)+'% of the time ('+r.total+' games) — the Slav fits your real repertoire.');
    const w=deep.rep.asWhite;
    if(w.total>=5)out.push('As White you open 1.e4 '+(w.e4/w.total*100).toFixed(0)+'% and 1.c4 '+(w.c4/w.total*100).toFixed(0)+'% ('+w.total+' games).');
  }
  out.push('Average game length: '+agg.avgMoves+' moves.');
  out.push('Only '+agg.endings.timeoutLoss+' losses on time — time trouble is not your problem; moving too fast is.');
  return out;
}
function focusOfWeek(agg,deep,eng){
  const t=agg.total,cands=[];
  // (1) Playing dead positions out — the honest version of the old "mated" stat.
  if(eng&&eng.mateLosses&&eng.mateLosses.avgDeadLostMoves!=null&&eng.resignWins&&eng.resignWins.avgDeadLostMoves!=null){
    const mine=eng.mateLosses.avgDeadLostMoves,theirs=eng.resignWins.avgDeadLostMoves;
    if(mine>=Math.max(4,(theirs||0)*1.5))cands.push({sev:Math.min(1,mine/14),
      title:'Playing dead positions out',
      body:'Engine check of '+eng.mateLosses.n+' recent losses: you played '+mine+' moves on average after the position was dead lost (−5.0). Your opponents resigned after '+theirs+' dead-lost moves. This is where the "always mated" number really comes from.',
      drill:'New rule: down a rook with no compensation, or clearly −5, resign and start fresh. Practise it in your next 3 bot games — notice how much sharper game 2 feels.'});
  }else if(deep&&deep.resign.mateLossShare>=50&&deep.resign.myResignRate<25){
    cands.push({sev:0.65,
      title:'You never resign (they do)',
      body:Math.round(deep.resign.mateLossShare)+'% of your losses end in checkmate because you play on — you resign '+
        deep.resign.myResignRate.toFixed(0)+'% of losses vs opponents resigning '+deep.resign.oppResignRate.toFixed(0)+'% of theirs.',
      drill:'Set a resign rule for dead positions and follow it for a week; compare your game-2 sharpness.'});
  }
  // (2) Tilt after losses
  if(deep&&deep.tilt){
    const tl=deep.tilt;
    if(tl.afterLoss.winPct!=null&&tl.baseline!=null&&tl.baseline-tl.afterLoss.winPct>=8)
      cands.push({sev:Math.min(1,(tl.baseline-tl.afterLoss.winPct)/35),
        title:'Tilt after losses',
        body:'You win '+tl.baseline.toFixed(0)+'% normally but only '+tl.afterLoss.winPct.toFixed(0)+'% in the game right after a loss ('+tl.afterLoss.n+' games).',
        drill:'No instant rematches. After any loss, stand up for 2 minutes before queuing again.'});
    // (3) Session fatigue
    const s1=tl.sessPos['1'].winPct,s3=tl.sessPos['3+'].winPct;
    if(s1!=null&&s3!=null&&s1-s3>=8)
      cands.push({sev:Math.min(1,(s1-s3)/35),
        title:'Session fatigue',
        body:'Game 1 of a session: '+s1.toFixed(0)+'% wins. Game 3+: '+s3.toFixed(0)+'% over '+tl.sessPos['3+'].n+' games. Long sessions cost you real points.',
        drill:'Cap serious sessions at 2 games, or take a 10-minute break after game 2.'});
  }
  // (4) Throwing won games
  if(eng&&eng.thrownWins>=3)
    cands.push({sev:Math.min(1,eng.thrownWins/8),
      title:'Throwing won games',
      body:'In '+eng.mateLosses.n+' sampled losses you reached +3.0 or better '+eng.thrownWins+' times and still lost. Conversion, not defence, is the leak.',
      drill:'When ahead: trade pieces, not pawns. Do 10 “My Blunders” puzzles a day with a 2-second blunder-check before each move.'});
  const pool=agg.openings.filter(o=>o.games>=5);
  if(pool.length){
    const sc=o=>statsScore(o.w,o.l,o.d);
    const worst=pool.slice().sort((a,b)=>sc(a)-sc(b))[0];
    const s=sc(worst);
    if(s<45)cands.push({sev:(45-s)/45,
      title:'Leaky opening: '+worst.name,
      body:'You score only '+s.toFixed(0)+'% over '+worst.games+' games in the '+worst.name+'.',
      drill:'Open Train, select just this line family, and drill it until the plans feel automatic — then add its middlegame blueprint.'});
  }
  const bw=agg.byColor.white,bb=agg.byColor.black;
  const gap=Math.abs(statsScore(bw.w,bw.l,bw.d)-statsScore(bb.w,bb.l,bb.d));
  if(gap>=8){
    const weak=statsScore(bw.w,bw.l,bw.d)<statsScore(bb.w,bb.l,bb.d)?'White':'Black';
    cands.push({sev:gap/100,
      title:'Color gap: '+weak+' underperforms',
      body:'You score '+statsScore(bw.w,bw.l,bw.d).toFixed(0)+'% as White vs '+statsScore(bb.w,bb.l,bb.d).toFixed(0)+'% as Black.',
      drill:'Play your next 5 bot games as '+weak+' and review each one — look for where the '+weak+' plans break down.'});
  }
  if(!cands.length)return null;
  cands.sort((a,b)=>b.sev-a.sev);
  return cands[0];
}
// ─── DEEP STATS: honest aggregations from enriched per-game records ──────────
function aggDeep(games){
  const gs=games.slice().sort((a,b)=>((a.et||0)-(b.et||0))||(a.d<b.d?-1:1));
  // session clustering if records lack it (e.g. freshly synced games)
  if(gs.some(g=>g.spos==null)){
    let sid=0,spos=0,last=null;
    for(const g of gs){
      const et=g.et||null;
      if(et==null||last==null||et-last>45*60){sid++;spos=1;}else spos++;
      g.sess=sid;g.spos=spos;
      if(et!=null)last=et;
    }
  }
  const t={W:0,L:0,D:0};
  const e={checkmateWin:0,checkmateLoss:0,resignWin:0,resignLoss:0,timeoutWin:0,timeoutLoss:0,draw:0};
  for(const g of gs){t[g.s==='w'?'W':g.s==='l'?'L':'D']++;if(g.s==='d')e.draw++;else e[(g.t||'resign')+(g.s==='w'?'Win':'Loss')]++;}
  const resign={myResignRate:t.L?e.resignLoss/t.L*100:0,oppResignRate:t.W?e.resignWin/t.W*100:0,
    mateLossShare:t.L?e.checkmateLoss/t.L*100:0,mateWinShare:t.W?e.checkmateWin/t.W*100:0};
  // tilt + streaks + session position
  const seq=gs.map(g=>g.s);
  const afterLoss=[],after2=[];let streak=0;
  for(let i=0;i<seq.length-1;i++){if(seq[i]==='l'){afterLoss.push(seq[i+1]);streak++;if(streak>=2)after2.push(seq[i+1]);}else streak=0;}
  let maxw=0,maxl=0,cw=0,cl=0;
  for(const s of seq){if(s==='w'){cw++;cl=0;maxw=Math.max(maxw,cw);}else if(s==='l'){cl++;cw=0;maxl=Math.max(maxl,cl);}else{cw=0;cl=0;}}
  const sp={1:[],2:[],3:[]};
  for(const g of gs){const k=(g.spos||1)<=2?(g.spos||1):3;sp[k].push(g.s);}
  const wp=rs=>{const n=rs.length;return n?rs.filter(s=>s==='w').length/n*100:null;};
  const tilt={baseline:wp(seq),afterLoss:{n:afterLoss.length,winPct:wp(afterLoss)},
    after2Losses:{n:after2.length,winPct:wp(after2)},
    maxWinStreak:maxw,maxLossStreak:maxl,
    sessPos:{'1':{n:sp[1].length,winPct:wp(sp[1])},'2':{n:sp[2].length,winPct:wp(sp[2])},'3+':{n:sp[3].length,winPct:wp(sp[3])}}};
  // score vs rating difference
  const bfn=rd=>rd<-150?'<-150':rd<-50?'-150..-50':rd<=50?'-50..+50':rd<=150?'+50..+150':'>+150';
  const bm={};
  for(const g of gs){if(g.rd==null)continue;const b=bfn(g.rd);const o=bm[b]||(bm[b]={games:0,w:0,l:0,d:0,rd:0});o.games++;o[g.s]++;o.rd+=g.rd;}
  const ratingDiff=['<-150','-150..-50','-50..+50','+50..+150','>+150'].filter(k=>bm[k]).map(k=>{
    const o=bm[k],avg=o.rd/o.games;
    return{bucket:k,games:o.games,actual:statsScore(o.w,o.l,o.d),expected:100/(1+Math.pow(10,-avg/400))};});
  // time of day (hours already in America/Los_Angeles)
  const todDef=[['Night 0–5',0,5],['Morning 6–11',6,11],['Afternoon 12–17',12,17],['Evening 18–23',18,23]];
  const tod=todDef.map(td=>{const rs=gs.filter(g=>g.hod!=null&&g.hod>=td[1]&&g.hod<=td[2]).map(g=>g.s);
    return{label:td[0],games:rs.length,winPct:wp(rs)};});
  const wkd=gs.filter(g=>g.wd!=null&&g.wd<5).map(g=>g.s),wke=gs.filter(g=>g.wd!=null&&g.wd>=5).map(g=>g.s);
  const dayType={weekday:{games:wkd.length,winPct:wp(wkd)},weekend:{games:wke.length,winPct:wp(wke)}};
  // repertoire adherence from real first moves
  const rep={vsD4:{total:0,d5:0,Nf6:0,other:0},vsE4:{total:0,c6:0,other:0},asWhite:{total:0,e4:0,c4:0,other:0}};
  for(const g of gs){const fm=g.fm||[];if(fm.length<2)continue;
    if(g.col==='w'){rep.asWhite.total++;rep.asWhite[fm[0]==='e4'?'e4':fm[0]==='c4'?'c4':'other']++;}
    else if(fm[0]==='d4'){rep.vsD4.total++;rep.vsD4[fm[1]==='d5'?'d5':fm[1]==='Nf6'?'Nf6':'other']++;}
    else if(fm[0]==='e4'){rep.vsE4.total++;rep.vsE4[fm[1]==='c6'?'c6':'other']++;}}
  // pace per control (bullet/blitz would otherwise drag the average down)
  const pace={};
  for(const ctl of ['rapid','blitz','bullet','daily']){
    const aa=gs.filter(g=>g.c===ctl).map(g=>g.amt).filter(v=>v!=null);
    pace[ctl]=aa.length?aa.reduce((a,b)=>a+b,0)/aa.length:null;
  }
  const aaAll=gs.map(g=>g.amt).filter(v=>v!=null);
  pace.all=aaAll.length?aaAll.reduce((a,b)=>a+b,0)/aaAll.length:null;
  const lb={};for(const g of gs){(lb[g.s]||(lb[g.s]=[])).push(g.m||0);}
  const avgLen={};for(const k of Object.keys(lb))avgLen[k]=+(lb[k].reduce((a,b)=>a+b,0)/lb[k].length).toFixed(1);
  return{total:t,endings:e,resign,tilt,ratingDiff,tod,dayType,rep,pace,avgLenByResult:avgLen};
}
function escHtml(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function ratingChartSvg(games){
  const ctrls=[['rapid','#D4A853'],['blitz','#7fa8c9'],['bullet','#9a8fb5']];
  const series={};
  let mn=Infinity,mx=-Infinity,first='',last='';
  for(const[c]of ctrls){
    const pts=[];
    for(const g of games){
      if(g.c!==c||g.r==null)continue;
      if(!first||g.d<first)first=g.d;
      if(!last||g.d>last)last=g.d;
      mn=Math.min(mn,g.r);mx=Math.max(mx,g.r);
      pts.push({d:g.d,v:g.r});
    }
    series[c]=pts;
  }
  if(!isFinite(mn))return '<div class="trendempty">No rating data.</div>';
  const pad=Math.max(15,(mx-mn)*0.12);mn-=pad;mx+=pad;
  const W=620,H=230,pl=44,pr=10,pt=12,pb=26;
  const t0=new Date(first+'T00:00:00').getTime(),t1=new Date(last+'T00:00:00').getTime(),span=Math.max(1,t1-t0);
  const X=d=>pl+(new Date(d+'T00:00:00').getTime()-t0)/span*(W-pl-pr);
  const Y=v=>pt+(1-(v-mn)/(mx-mn))*(H-pt-pb);
  let svg='<svg class="rchart" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Rating over time">';
  for(let i=0;i<=4;i++){
    const v=mn+(mx-mn)*i/4,y=Y(v);
    svg+='<line x1="'+pl+'" y1="'+y+'" x2="'+(W-pr)+'" y2="'+y+'" stroke="#3a2f28" stroke-width="1"/><text x="'+(pl-5)+'" y="'+(y+4)+'" fill="#9A8070" font-size="10" text-anchor="end">'+Math.round(v)+'</text>';
  }
  svg+='<text x="'+pl+'" y="'+(H-8)+'" fill="#9A8070" font-size="10">'+escHtml(first)+'</text><text x="'+(W-pr)+'" y="'+(H-8)+'" fill="#9A8070" font-size="10" text-anchor="end">'+escHtml(last)+'</text>';
  for(const[c,col]of ctrls){
    const pts=series[c];
    if(pts.length<2)continue;
    svg+='<polyline fill="none" stroke="'+col+'" stroke-width="2" points="'+pts.map(p=>X(p.d).toFixed(1)+','+Y(p.v).toFixed(1)).join(' ')+'"/>';
    const lp=pts[pts.length-1];
    svg+='<circle cx="'+X(lp.d)+'" cy="'+Y(lp.v)+'" r="3.5" fill="'+col+'"/><text x="'+(X(lp.d)-7)+'" y="'+(Y(lp.v)-8)+'" fill="'+col+'" font-size="11" text-anchor="end" font-weight="600">'+lp.v+'</text>';
  }
  svg+='</svg>';
  const legend=ctrls.filter(([c])=>series[c].length>1).map(([c,col])=>'<span><i style="background:'+col+'"></i>'+c+'</span>').join('');
  return svg+'<div class="rlegend">'+legend+'</div>';
}
function aiCoachModel(games,agg){
  const reviewed=MISTAKE_GAMES.slice().sort((a,b)=>(b.ts||0)-(a.ts||0));
  const errs=normalizedTrendErrors();
  const recentReviewed=new Set(reviewed.slice(-20).map(g=>g.id));
  const recentErrs=errs.filter(e=>recentReviewed.has(e.gameId));
  const source=recentErrs.length?recentErrs:errs;
  const by=(key)=>{const m={};source.forEach(e=>{const k=e[key]||'Unknown';if(!m[k])m[k]={name:k,n:0,w:0,impact:0};m[k].n++;m[k].w+=e.weight||1;m[k].impact+=e.impact||0;});return Object.values(m).sort((a,b)=>b.w-a.w);};
  const themes=by('theme'),phases=by('phase'),cats=by('category');
  const topTheme=themes[0],topPhase=phases[0],topCat=cats[0];
  const openings=agg.openings.filter(o=>o.games>=5).map(o=>({...o,score:statsScore(o.w,o.l,o.d)}));
  const weakOpen=openings.slice().sort((a,b)=>a.score-b.score||b.games-a.games)[0];
  const strongOpen=openings.slice().sort((a,b)=>b.score-a.score||b.games-a.games)[0];
  const phaseMap={'Opening':'Opening','Early middlegame':'Strategy','Middlegame':'Strategy','Endgame':'Endgame'};
  const skill={Opening:{e:0,n:0},Tactics:{e:0,n:0},Strategy:{e:0,n:0},Endgame:{e:0,n:0}};
  source.forEach(e=>{
    let k=phaseMap[e.phase]||'Strategy';
    if(e.theme==='Calculation & forcing moves'||e.category==='Hanging / undefended piece'||e.category==='Missed opponent threat'||e.theme==='King safety & forcing threats')k='Tactics';
    skill[k].e+=(e.weight||1);skill[k].n++;
  });
  const max=Math.max(1,...Object.values(skill).map(x=>x.e));
  Object.values(skill).forEach(x=>x.score=Math.max(35,Math.round(100-55*x.e/max)));
  if(!source.length){skill.Tactics.score=skill.Strategy.score=skill.Endgame.score=null;}
  // Opening score is results-based, not engine-derived.
  skill.Opening.score=openings.length?Math.round(Math.max(35,Math.min(90,50+(statsScore(agg.total.W,agg.total.L,agg.total.D)-50)*1.5))):null;
  let headline='Build the coaching baseline';
  let why='Review games in this tool so I can diagnose recurring tactical, strategic, and endgame mistakes from actual positions.';
  let drill='Review your next 10 serious rapid games; the coach will turn those positions into a personalized training plan.';
  if(topTheme){
    headline=topTheme.name+' is your clearest current leak';
    why=topTheme.n+' meaningful errors in the analyzed sample point here'+(topPhase?' — most often in the '+topPhase.name.toLowerCase()+'.':'.');
    drill=themeAdvice(topTheme.name);
  }
  if(weakOpen&&weakOpen.score<45)why+=' Your weakest established opening result is '+weakOpen.name+' at '+weakOpen.score.toFixed(0)+'% across '+weakOpen.games+' games.';
  const priorities=[];
  if(topTheme)priorities.push({title:topTheme.name,body:themeAdvice(topTheme.name),tag:'#1 priority'});
  if(topCat)priorities.push({title:topCat.name,body:'This specific mistake has appeared '+topCat.n+' times in the analyzed sample. Use Replay/Mistake Drill on these positions until the better decision becomes automatic.',tag:'Recurring pattern'});
  if(weakOpen)priorities.push({title:weakOpen.name,body:'You score '+weakOpen.score.toFixed(0)+'% here across '+weakOpen.games+' games. Study where your games first leave your repertoire and what plan the resulting structure requires.',tag:'Opening work'});
  return {reviewed:reviewed.length,errors:source.length,skills:skill,headline,why,drill,priorities,weakOpen,strongOpen,topTheme,topPhase};
}
function coachSkillCard(name,obj,desc){
  const score=obj.score;
  return '<div class="skillcard"><div class="skilltop"><b>'+name+'</b><span>'+(score==null?'Building data':score+'/100')+'</span></div><div class="skilltrack"><i style="width:'+(score==null?8:score)+'%"></i></div><small>'+desc+(obj.n?' · '+obj.n+' analyzed errors':'')+'</small></div>';
}
function renderStats(){
  const body=document.getElementById('statsbody'),focus=document.getElementById('focusweek');
  if(!body)return;
  const data=statsData();
  if(!data){
    body.innerHTML='<div class="trendempty">No game data bundled. Use Sync to pull your games from chess.com.</div>';
    if(focus)focus.innerHTML='';
    return;
  }
  const games=data.games.slice().sort((a,b)=>a.d<b.d?-1:1);
  const agg=aggStats(games),t=agg.total;
  let html='';
  // Dashboard summary — answer the useful questions before the detailed diagnostics.
  const rapid=games.filter(g=>g.c==='rapid'&&g.r!=null);
  const currentRapid=rapid.length?rapid[rapid.length-1].r:null;
  const recent=games.slice(-30), recentAgg=aggStats(recent), rs=recentAgg.total;
  const rapid30=rapid.slice(-30), rapidDelta=rapid30.length>1?rapid30[rapid30.length-1].r-rapid30[0].r:0;
  const bw0=agg.byColor.white,bb0=agg.byColor.black;
  const whiteScore=statsScore(bw0.w,bw0.l,bw0.d), blackScore=statsScore(bb0.w,bb0.l,bb0.d);
  const allScore=statsScore(t.W,t.L,t.D), recentScore=statsScore(rs.W,rs.L,rs.D);
  const lastGame=games.length?games[games.length-1].d:'';
  const insights=buildInsights(agg,games,aggDeep(games),data.engine);
  const coach=aiCoachModel(games,agg);
  const deltaTxt=(rapidDelta>0?'+':'')+rapidDelta;
  html+='<div class="statshero">'+
    '<div class="statshero-main"><div class="statskicker">CHESS.COM PERFORMANCE</div><div class="statsrating">'+(currentRapid==null?'—':currentRapid)+'</div><div class="statsratinglabel">Rapid rating <span class="'+(rapidDelta>=0?'up':'down')+'">'+deltaTxt+' last 30 rapid</span></div></div>'+
    '<div class="statshero-side"><div><b>'+recentScore.toFixed(0)+'%</b><span>Last 30 score</span></div><div><b>'+whiteScore.toFixed(0)+'%</b><span>As White</span></div><div><b>'+blackScore.toFixed(0)+'%</b><span>As Black</span></div></div></div>';
  html+='<div class="statcards">'+
    '<div class="statcard"><span>RECENT FORM</span><b>'+rs.W+'–'+rs.L+'–'+rs.D+'</b><small>'+recent.length+' most recent games</small></div>'+
    '<div class="statcard"><span>CAREER SCORE</span><b>'+allScore.toFixed(0)+'%</b><small>'+t.W+'W · '+t.L+'L · '+t.D+'D</small></div>'+
    '<div class="statcard"><span>AVG LENGTH</span><b>'+agg.avgMoves+'</b><small>moves per game</small></div>'+
    '<div class="statcard"><span>LAST GAME</span><b>'+escHtml(lastGame.slice(5)||'—')+'</b><small>'+escHtml(lastGame||'No games')+'</small></div></div>';
  html+='<div class="aicoach"><div class="aicoachhead"><div><span>YOUR AI COACH</span><h2>'+escHtml(coach.headline)+'</h2></div><div class="coachsample">'+coach.reviewed+' reviewed games · '+coach.errors+' meaningful errors</div></div>'+
    '<p class="coachwhy">'+escHtml(coach.why)+'</p><div class="skillgrid">'+
    coachSkillCard('Opening',coach.skills.Opening,'Results + repertoire performance')+
    coachSkillCard('Tactics',coach.skills.Tactics,'Calculation, threats, loose pieces, king safety')+
    coachSkillCard('Strategy',coach.skills.Strategy,'Plans, coordination, pawn structure, tempi')+
    coachSkillCard('Endgame',coach.skills.Endgame,'Technique in analyzed late-game positions')+
    '</div><div class="coachprescription"><span>DO THIS NEXT</span><b>'+escHtml(coach.drill)+'</b></div></div>';
  html+='<div class="coachpriorities"><div class="statsdetailtitle">Training priorities</div>'+(coach.priorities.length?coach.priorities.slice(0,3).map((x,i)=>'<div class="priorityrow"><em>0'+(i+1)+'</em><div><span>'+escHtml(x.tag)+'</span><b>'+escHtml(x.title)+'</b><p>'+escHtml(x.body)+'</p></div></div>').join(''):'<div class="trendempty">Review games to unlock position-based coaching priorities.</div>')+'</div>';
  html+='<div class="statsdetails"><div class="statsdetailtitle">Performance details</div>';
  // (a) rating chart
  html+='<div class="statsec">Rating over time</div>'+ratingChartSvg(games);
  // (b) monthly W/L/D bars
  html+='<div class="statsec">Results by month</div>';
  for(const m of agg.months){
    const tot=m.games||1;
    html+='<div class="mbar"><span class="mlbl">'+escHtml(m.label)+'</span><span class="mtrack"><span class="mw" style="width:'+(m.w/tot*100)+'%"></span><span class="md" style="width:'+(m.d/tot*100)+'%"></span><span class="ml" style="width:'+(m.l/tot*100)+'%"></span></span><span class="mval">'+m.w+'W '+m.l+'L '+m.d+'D</span></div>';
  }
  // per-control totals
  const ctlOrder=['rapid','blitz','bullet','daily'];
  for(const c of ctlOrder){
    const cc=agg.controls[c];if(!cc)continue;
    html+='<div class="mbar"><span class="mlbl">'+c+'</span><span class="mtrack"><span class="mw" style="width:'+(cc.w/cc.games*100)+'%"></span><span class="md" style="width:'+(cc.d/cc.games*100)+'%"></span><span class="ml" style="width:'+(cc.l/cc.games*100)+'%"></span></span><span class="mval">'+statsScore(cc.w,cc.l,cc.d).toFixed(0)+'% · '+cc.games+'g</span></div>';
  }
  // (c) openings table
  html+='<div class="statsec">Openings (3+ games)</div><table class="opentable"><tr><th>Opening</th><th class="num">Games</th><th class="num">Score</th><th class="num">W-L-D</th></tr>';
  for(const o of agg.openings.slice(0,12)){
    const s=statsScore(o.w,o.l,o.d);
    const cls=s>=55?'scoregood':s>=45?'scoreavg':'scorebad';
    html+='<tr><td>'+escHtml(o.name)+'</td><td class="num">'+o.games+'</td><td class="num '+cls+'">'+s.toFixed(0)+'%</td><td class="num">'+o.w+'-'+o.l+'-'+o.d+'</td></tr>';
  }
  html+='</table>';
  // (d) color split + how games end
  html+='<div class="statsec">By color</div>';
  const bw=agg.byColor.white,bb=agg.byColor.black;
  html+='<div class="mbar"><span class="mlbl">White</span><span class="mtrack"><span class="mw" style="width:'+(bw.w/(bw.w+bw.l+bw.d||1)*100)+'%"></span></span><span class="mval">'+statsScore(bw.w,bw.l,bw.d).toFixed(0)+'%</span></div>';
  html+='<div class="mbar"><span class="mlbl">Black</span><span class="mtrack"><span class="mw" style="width:'+(bb.w/(bb.w+bb.l+bb.d||1)*100)+'%"></span></span><span class="mval">'+statsScore(bb.w,bb.l,bb.d).toFixed(0)+'%</span></div>';
  html+='<div class="statsec">How games ended</div>';
  const e=agg.endings;
  const erows=[['Checkmated them',e.checkmateWin],['You got mated',e.checkmateLoss],['They resigned',e.resignWin],['You resigned',e.resignLoss],['Won on time',e.timeoutWin],['Lost on time',e.timeoutLoss],['Draws',e.draw]];
  const emax=Math.max(1,...erows.map(r=>r[1]));
  for(const[lbl,v]of erows){
    html+='<div class="ebar"><span class="elbl">'+lbl+'</span><span class="etrack"><span class="efill" style="display:block;width:'+(v/emax*100)+'%"></span></span><span class="eval">'+v+'</span></div>';
  }
  // (d2) the honest mate stat — resignation gap
  const deep=aggDeep(games),eng=data.engine;
  const rg=deep.resign;
  html+='<div class="statsec">The honest mate stat</div><div class="honestbox">';
  html+='<div class="honestbig">You resign <b>'+rg.myResignRate.toFixed(0)+'%</b> of your losses — your opponents resign <b>'+rg.oppResignRate.toFixed(0)+'%</b> of theirs.</div>';
  html+='<div class="honestsub">That one habit explains the scary number: '+rg.mateLossShare.toFixed(0)+'% of your losses end in checkmate, but only '+rg.mateWinShare.toFixed(0)+'% of your wins do — because opponents quit before mate. You play dead positions out; they don\u2019t.</div>';
  if(eng&&eng.mateLosses&&eng.mateLosses.avgDeadLostMoves!=null)
    html+='<div class="honestsub">Engine check ('+eng.mateLosses.n+' recent losses, depth '+eng.depth+'): you played <b>'+eng.mateLosses.avgDeadLostMoves+' moves</b> on average after the position was dead lost (−5.0). In '+eng.resignWins.n+' wins, opponents played <b>'+eng.resignWins.avgDeadLostMoves+' moves</b> after dead lost before resigning.</div>';
  html+='<div class="honesttake">🎯 Resigning a dead position isn\u2019t quitting — it\u2019s banking time and energy for the next game.</div></div>';
  // (d3) tilt & session fatigue
  const tl=deep.tilt;
  html+='<div class="statsec">Tilt &amp; session fatigue</div>';
  const pctRow=(lbl,v,n)=>{const w=v==null?0:Math.max(0,Math.min(100,v));
    return '<div class="ebar"><span class="elbl">'+lbl+'</span><span class="etrack"><span class="efill" style="display:block;width:'+w+'%"></span></span><span class="eval">'+(v==null?'—':v.toFixed(0)+'%')+'</span></div>'+
    (n!=null?'<div class="esub">'+n+' games</div>':'');};
  html+=pctRow('Win% baseline',tl.baseline,t.games);
  html+=pctRow('Win% right after a loss',tl.afterLoss.winPct,tl.afterLoss.n);
  html+=pctRow('Win% after 2+ straight losses',tl.after2Losses.winPct,tl.after2Losses.n);
  html+=pctRow('Session game 1',tl.sessPos['1'].winPct,tl.sessPos['1'].n);
  html+=pctRow('Session game 2',tl.sessPos['2'].winPct,tl.sessPos['2'].n);
  html+=pctRow('Session game 3+',tl.sessPos['3+'].winPct,tl.sessPos['3+'].n);
  html+='<div class="esub">Longest streaks: '+tl.maxWinStreak+' wins · '+tl.maxLossStreak+' losses.</div>';
  // (d4) score vs rating difference
  if(deep.ratingDiff.length){
    html+='<div class="statsec">Score vs rating difference</div>';
    for(const b of deep.ratingDiff){
      html+='<div class="pairrow"><span class="elbl">You '+b.bucket+'</span><span class="ptrack"><span class="pfill act" style="width:'+Math.min(100,b.actual)+'%"></span></span><span class="pval">'+b.actual.toFixed(0)+'%</span></div>';
      html+='<div class="pairrow exp"><span class="elbl">expected</span><span class="ptrack"><span class="pfill" style="width:'+Math.min(100,b.expected)+'%"></span></span><span class="pval">'+b.expected.toFixed(0)+'% · '+b.games+'g</span></div>';
    }
    html+='<div class="esub">Expected score from the Elo formula for your average rating gap in each bucket.</div>';
  }
  // (d5) when you play
  html+='<div class="statsec">When you play (Pacific)</div>';
  for(const h of deep.tod)html+=pctRow(h.label,h.winPct,h.games);
  html+=pctRow('Weekday',deep.dayType.weekday.winPct,deep.dayType.weekday.games);
  html+=pctRow('Weekend',deep.dayType.weekend.winPct,deep.dayType.weekend.games);
  // (d6) repertoire adherence
  const rp=deep.rep;
  html+='<div class="statsec">Do you play your repertoire?</div>';
  if(rp.vsD4.total)html+='<div class="ebar"><span class="elbl">Vs 1.d4: 1...d5</span><span class="etrack"><span class="efill" style="display:block;width:'+(rp.vsD4.d5/rp.vsD4.total*100)+'%"></span></span><span class="eval">'+(rp.vsD4.d5/rp.vsD4.total*100).toFixed(0)+'%</span></div><div class="esub">'+rp.vsD4.total+' games · 1...Nf6 '+(rp.vsD4.Nf6/rp.vsD4.total*100).toFixed(0)+'% · other '+(rp.vsD4.other/rp.vsD4.total*100).toFixed(0)+'%</div>';
  if(rp.vsE4.total)html+='<div class="ebar"><span class="elbl">Vs 1.e4: Caro (1...c6)</span><span class="etrack"><span class="efill" style="display:block;width:'+(rp.vsE4.c6/rp.vsE4.total*100)+'%"></span></span><span class="eval">'+(rp.vsE4.c6/rp.vsE4.total*100).toFixed(0)+'%</span></div><div class="esub">'+rp.vsE4.total+' games</div>';
  if(rp.asWhite.total)html+='<div class="ebar"><span class="elbl">As White: 1.e4 / 1.c4</span><span class="etrack"><span class="efill" style="display:block;width:'+(rp.asWhite.e4/rp.asWhite.total*100)+'%"></span></span><span class="eval">'+(rp.asWhite.e4/rp.asWhite.total*100).toFixed(0)+'% / '+(rp.asWhite.c4/rp.asWhite.total*100).toFixed(0)+'%</span></div><div class="esub">'+rp.asWhite.total+' games</div>';
  // (d7) thrown wins & comebacks
  if(eng){
    html+='<div class="statsec">Thrown &amp; stolen</div>';
    html+='<div class="ebar"><span class="elbl">Thrown wins (was +3, lost)</span><span class="etrack"><span class="efill bad" style="display:block;width:'+(eng.thrownWins/eng.mateLosses.n*100)+'%"></span></span><span class="eval">'+eng.thrownWins+'/'+eng.mateLosses.n+'</span></div>';
    html+='<div class="ebar"><span class="elbl">Comebacks (was −3, won)</span><span class="etrack"><span class="efill" style="display:block;width:'+(eng.comebacks/eng.resignWins.n*100)+'%"></span></span><span class="eval">'+eng.comebacks+'/'+eng.resignWins.n+'</span></div>';
    html+='<div class="esub">From '+eng.mateLosses.n+' sampled losses and '+eng.resignWins.n+' sampled wins (engine depth '+eng.depth+').</div>';
  }
  // (e) key insights
  html+='<div class="statsec">Key insights</div><ul class="insightlist">';
  for(const s of buildInsights(agg,games,deep,eng))html+='<li>'+escHtml(s)+'</li>';
  html+='</ul>';
  const sourceDate=data.synced||data.generated||'';
  const freshest=games.length?games[games.length-1].d:'';
  html+='</div><div class="statsfooter">'+t.games+' games · latest game '+escHtml(freshest||'—')+(sourceDate?' · last sync '+escHtml(sourceDate):'')+'</div>';
  body.innerHTML=html;
  // focus of the week
  const f=focusOfWeek(agg,deep,eng);
  if(focus)focus.innerHTML=f?('<div class="focusbox"><div class="flbl">Focus of the week</div><b>'+escHtml(f.title)+'</b><div style="font-size:.78rem;margin-top:4px">'+escHtml(f.body)+'</div><div class="fdrill">🎯 '+escHtml(f.drill)+'</div></div>'):'';
  const note=document.getElementById('statssyncnote');
  if(note)note.classList.add('hidden');
}
function ecoNameFromUrl(url){
  if(!url)return'Unknown';
  const base=String(url).split('/').pop()||'';
  const parts=base.split('-').filter(p=>p&&!/^[0-9]/.test(p)&&p.indexOf('.')<0);
  return parts.join(' ')||'Unknown';
}
function syncGameRecord(g){
  try{
    const pgn=g.pgn||'';
    const tag=n=>{const m=pgn.match(new RegExp('\\['+n+'\\s+"([^"]*)"\\]'));return m?m[1]:'';};
    const white=tag('White'),black=tag('Black');
    if(!white||!black)return null;
    const meW=white.toLowerCase()==='rvt8';
    const me=meW?g.white:g.black,opp=meW?g.black:g.white;
    const meRes=String(me.result||'').toLowerCase(),oppRes=String(opp.result||'').toLowerCase();
    const draws={'agreed':1,'repetition':1,'stalemate':1,'insufficient':1,'50move':1,'timevsinsufficient':1};
    let s,t;
    if(meRes==='win'){s='w';t=oppRes==='checkmated'?'checkmate':(oppRes==='timeout'||oppRes==='timeforfeit')?'timeout':'resign';}
    else if(draws[meRes]){s='d';t='draw';}
    else{s='l';t=meRes==='checkmated'?'checkmate':(meRes==='timeout'||meRes==='timeforfeit')?'timeout':'resign';}
    let c=String(g.time_class||'').toLowerCase();
    if(!['rapid','blitz','bullet','daily'].includes(c)){
      const base=String(g.time_control||'').split('+')[0];
      c={'600':'rapid','300':'blitz','180':'blitz','120':'bullet','60':'bullet'}[base]||'rapid';
    }
    const dt=(tag('UTCDate')||tag('Date')||'').replace(/\./g,'-').slice(0,10);
    const mm=pgn.match(/\b\d+\.\s/g);
    // enriched fields (mirror gen_stats.py): LA hour/weekday, rating diff, first moves, end time
    let hod=null,wd=null;
    try{
      const iso=(tag('UTCDate')||tag('Date')||'').replace(/\./g,'-')+'T'+(tag('UTCTime')||tag('StartTime')||'00:00:00')+'Z';
      const dd=new Date(iso);
      if(!isNaN(dd)){
        const fmt=new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',hour:'numeric',hour12:false});
        const parts=fmt.formatToParts(dd);const hh=parts.find(p=>p.type==='hour');
        hod=hh?parseInt(hh.value,10)%24:null;
        const wfmt=new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',weekday:'short'});
        wd={'Sun':0,'Mon':1,'Tue':2,'Wed':3,'Thu':4,'Fri':5,'Sat':6}[wfmt.format(dd)];
      }
    }catch(err){}
    const meR=typeof me.rating==='number'?me.rating:null,opR=typeof opp.rating==='number'?opp.rating:null;
    let fm=[];
    try{
      const mt=pgn.split(/\n\s*\n/).slice(1).join(' ').replace(/\{[^}]*\}/g,' ').replace(/\d+\.\.\./g,' ').replace(/\b\d+\./g,' ').trim().split(/\s+/).filter(t=>t&&!/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t));
      fm=mt.slice(0,4);
    }catch(err){}
    return{d:dt,c,r:meR,s,col:meW?'w':'b',
      o:ecoNameFromUrl(tag('ECOUrl')),t,m:mm?mm.length:0,u:g.url||'',opp:meW?black:white,
      hod,wd,rd:(meR!=null&&opR!=null)?meR-opR:null,
      et:(typeof g.end_time==='number'?g.end_time:null),fm,amt:null};
  }catch(err){return null;}
}
function syncStats(){
  const note=document.getElementById('statssyncnote'),btn=document.getElementById('syncbtn');
  if(!note)return;
  note.classList.remove('hidden');
  note.innerHTML='Syncing from chess.com…';
  if(btn)btn.disabled=true;
  const done=(msg,isErr)=>{
    note.innerHTML=msg;
    if(btn)btn.disabled=false;
    if(!isErr)setTimeout(()=>note.classList.add('hidden'),4000);
  };
  fetch('https://api.chess.com/pub/player/rvt8/games/archives')
    .then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json();})
    .then(async data=>{
      const urls=data.archives||[];
      if(!urls.length)throw new Error('no archives');
      const base=bundledStats();
      const genMonth=base&&base.generated?base.generated.slice(0,7):'0000-00';
      // Re-fetch the newest bundled month (games may have been added since)
      // plus anything newer.
      const targets=urls.filter(u=>{const m=u.slice(-7);return m>=genMonth;});
      const have={};
      if(base)for(const g of base.games)if(g.u)have[g.u]=1;
      let added=0;
      const merged=base?base.games.slice():[];
      for(const u of targets){
        const r=await fetch(u);
        if(!r.ok)continue;
        const j=await r.json();
        for(const g of (j.games||[])){
          const rec=syncGameRecord(g);
          if(!rec||!rec.u||have[rec.u])continue;
          have[rec.u]=1;merged.push(rec);added++;
        }
      }
      merged.sort((a,b)=>a.d<b.d?-1:1);
      const stats={generated:base?base.generated:'',synced:new Date().toISOString().slice(0,10),games:merged};
      try{localStorage.setItem(STATS_CACHE_KEY,JSON.stringify({savedAt:Date.now(),stats}));}catch(err){}
      renderStats();
      done(added?('Synced: '+added+' new game'+(added===1?'':'s')+' added.'):'Already up to date — no new games found.');
    })
    .catch(err=>{
      console.warn('stats sync failed',err);
      done('Couldn’t reach chess.com — showing bundled data. Check your connection and try again.',true);
    });
}

// ─── PUZZLES TAB (MY BLUNDERS) ────────────────────────────────────────────────
const PUZZLE_KEY='chesstool_puzzle_progress';
const PUZZLE_DAILY_TARGET=10;
let PUZZLE=null;          // active puzzle state
let PUZZLE_QUEUE=[];      // ordered puzzle ids
let PUZZLE_INDEX=0;
function puzzleList(){return (typeof MY_PUZZLES!=='undefined'&&Array.isArray(MY_PUZZLES))?MY_PUZZLES:[];}
function puzzleProgGet(){
  let p={};
  try{p=JSON.parse(localStorage.getItem(PUZZLE_KEY))||{};}catch(e){p={};}
  p.attempts=p.attempts||0;p.solved=p.solved||{};p.streak=p.streak||0;
  p.day=p.day||{date:'',count:0};
  return p;
}
function puzzleProgSave(p){try{localStorage.setItem(PUZZLE_KEY,JSON.stringify(p));}catch(e){}}
function puzzleTodayStr(){return new Date().toISOString().slice(0,10);}
function buildPuzzleQueue(){
  const list=puzzleList(),prog=puzzleProgGet();
  const items=list.map(p=>{
    const s=prog.solved[p.id]||{};
    return{id:p.id,solved:!!s.s,fails:s.f||0,last:s.last||0};
  });
  // Spaced repetition: unsolved first, most-failed first, least-recent first.
  items.sort((a,b)=>{
    if(a.solved!==b.solved)return a.solved?1:-1;
    if(b.fails!==a.fails)return b.fails-a.fails;
    return a.last-b.last;
  });
  PUZZLE_QUEUE=items.map(x=>x.id);
  if(PUZZLE_INDEX>=PUZZLE_QUEUE.length)PUZZLE_INDEX=0;
}
function updatePuzzleCard(){
  const list=puzzleList(),prog=puzzleProgGet();
  const solved=list.filter(p=>{const s=prog.solved[p.id];return s&&s.s;}).length;
  const today=prog.day.date===puzzleTodayStr()?prog.day.count:0;
  const c=document.getElementById('pzcount');
  if(c)c.textContent=list.length?((PUZZLE_INDEX+1)+' / '+list.length):'0 puzzles';
  const sc=document.getElementById('pzscore');
  if(sc)sc.textContent=solved+' solved · '+prog.attempts+' attempts';
  const mt=document.getElementById('pzmeta');
  if(mt)mt.textContent='streak '+prog.streak+' · today '+today+'/'+PUZZLE_DAILY_TARGET;
}
function startPuzzleSession(){
  buildPuzzleQueue();
  if(!PUZZLE_QUEUE.length){
    PUZZLE=null;
    setStat('No puzzles bundled yet.','info');
    setCoach('Puzzle data is missing.');
    updatePuzzleCard();
    return;
  }
  startPuzzle(PUZZLE_QUEUE[PUZZLE_INDEX]||PUZZLE_QUEUE[0]);
}
function puzzleSwingHtml(item){
  if(!item||!isFinite(item.evalBefore)||!isFinite(item.evalAfter))return'';
  const f=v=>Math.abs(v)>=99?'mate':(v>=0?'+':'')+v.toFixed(1);
  const b='<b>'+f(item.evalBefore)+'</b>',a='<b>'+f(item.evalAfter)+'</b>';
  if(item.swingType==='won-to-lost')return' — you went from '+b+' to '+a+' in one move. Find the move that kept your advantage';
  if(item.swingType==='won-to-even')return' — you went from '+b+' to '+a+', throwing most of your edge. Find the move that kept the win in hand';
  if(item.swingType==='even-to-lost')return' — you were level at '+b+' and fell to '+a+'. Find the move that held the balance';
  return' — you went from '+b+' to '+a;
}
function startPuzzle(id){
  const item=puzzleList().find(p=>p.id===id);
  if(!item){setStat('Puzzle not found.','bad');return;}
  PUZZLE={item,fen:item.fen,bestUci:null,bestSan:'',bestEval:null,playedSan:item.playedSan||'',validating:true,checking:false,attempts:0};
  FEN=item.fen;HIST=[item.fen];SANS=[];SEL=null;LDOTS=[];LF=null;LT=null;
  FLIPPED=item.side==='b'; // show from rvt8's perspective
  BOT_ACTIVE=false;PRACTICE_LOCK=true;
  refreshPanel();drawBoard();drawMoveList();
  const pr=document.getElementById('pzprompt');
  if(pr)pr.innerHTML='vs <b>'+escHtml(item.opp)+'</b> · '+escHtml(item.date)+' · '+escHtml(item.opening)+'<br>You played <b>'+escHtml(item.playedSan)+'</b>??'+puzzleSwingHtml(item)+' — find the improvement.';
  const prompt='Puzzle: you played '+item.playedSan+' — find the improvement. Freshly verifying with Stockfish…';
  setStat(prompt,'info');setCoach(prompt);
  const nx=document.getElementById('pznext');if(nx)nx.classList.add('hidden');
  updatePuzzleCard();
  document.getElementById('board')?.scrollIntoView({behavior:'smooth',block:'center'});
  sfAnalyzePositionFresh(item.fen,15,res=>{
    if(!PUZZLE||PUZZLE.item.id!==id||MODE!=='puzzles')return;
    PUZZLE.validating=false;PRACTICE_LOCK=false;
    if(!res){
      const msg='Fresh verification was unavailable. The puzzle is paused rather than trusting the cached answer.';
      setStat(msg,'bad');setCoach(msg);PUZZLE.checking=true;return;
    }
    const ev=infoWhiteEval(item.fen,res.info);
    evaluationPerspectiveSanity(item.fen,res.info,ev);
    PUZZLE.bestUci=res.best;PUZZLE.bestSan=uci2san(item.fen,res.best)||'';PUZZLE.bestEval=ev;
    const msg='Puzzle verified. Find the improvement over '+item.playedSan+'.';
    setStat(msg,'info');setCoach(msg);
  });
}
function nextPuzzle(){
  if(!PUZZLE_QUEUE.length)return startPuzzleSession();
  PUZZLE_INDEX=(PUZZLE_INDEX+1)%PUZZLE_QUEUE.length;
  startPuzzle(PUZZLE_QUEUE[PUZZLE_INDEX]);
}
function resetPuzzlePosition(r){
  if(!PUZZLE||PUZZLE!==r)return;
  FEN=r.fen;HIST=[r.fen];SANS=[];SEL=null;LDOTS=[];LF=null;LT=null;
  r.checking=false;PRACTICE_LOCK=false;
  refreshPanel();drawBoard();drawMoveList();
}
function puzzleClick(rank,file){
  const r=PUZZLE;if(!r||r.validating||r.checking)return;
  const {bd,turn}=parseFen(FEN),p=GP(bd,rank,file);
  if(SEL){
    const hit=LDOTS.find(d=>d.r===rank&&d.f===file);
    if(hit){handlePuzzleMove(hit.uci);return;}
    if(p&&friendly(p,turn)){SEL={r:rank,f:file};LDOTS=getLegalDots(rank,file);drawBoard();return;}
    SEL=null;LDOTS=[];drawBoard();return;
  }
  if(p&&friendly(p,turn)){SEL={r:rank,f:file};LDOTS=getLegalDots(rank,file);drawBoard();}
}
function handlePuzzleMove(uci){
  const r=PUZZLE;if(!r||r.validating||r.checking||MODE!=='puzzles')return;
  const originalFen=r.fen,mover=parseFen(originalFen).turn,san=uci2san(originalFen,uci);
  if(!san)return;
  const prog=puzzleProgGet();
  prog.attempts++;r.attempts++;
  r.checking=true;PRACTICE_LOCK=true;
  setLastUci(uci);
  const afterFen=applyUci(originalFen,uci);
  FEN=afterFen;HIST=[originalFen,afterFen];SANS=[san];SEL=null;LDOTS=[];drawBoard();drawMoveList();
  setStat('Verifying '+san+' from the original position…','info');
  updatePuzzleCard();
  // Never trust the cached answer: fresh Stockfish analysis of both the
  // puzzle position and the played move, then accept near-equivalents.
  sfAnalyzePlayedMoveFresh(originalFen,uci,15,candidateRes=>{
    if(!PUZZLE||PUZZLE!==r)return;
    if(!candidateRes){
      const msg='Could not verify '+san+'. The puzzle will not mark it correct without a fresh engine result.';
      setStat(msg,'bad');setCoach(msg);resetPuzzlePosition(r);return;
    }
    const candidateEval=infoWhiteEval(originalFen,candidateRes.info);
    evaluationPerspectiveSanity(originalFen,candidateRes.info,candidateEval);
    const loss=replayEvalLoss(r.bestEval,candidateEval,mover);
    const exactBest=uci===r.bestUci;
    const nearBest=loss!=null&&loss<=0.35; // <= ~0.35 pawns from the fresh best
    const accepted=exactBest||nearBest;
    sfAnalyzePositionFresh(afterFen,14,replyRes=>{
      if(!PUZZLE||PUZZLE!==r)return;
      let reply='',afterEval=null;
      if(replyRes){
        reply=replayReplyDescription(afterFen,replyRes.best);
        afterEval=infoWhiteEval(afterFen,replyRes.info);
      }
      const evalPart=afterEval?' Resulting eval: '+evalText(afterEval)+'.':'';
      const replyPart=reply?' Opponent’s strongest reply: '+reply+'.':'';
      const tries=r.attempts>1?' after '+r.attempts+' tries':'';
      const today=puzzleTodayStr();
      if(prog.day.date!==today){prog.day={date:today,count:0};}
      if(accepted){
        const quality=exactBest?'the fresh engine best move':'an engine-equivalent improvement';
        const msg='✓ Verified — '+san+' is '+quality+tries+'.'+evalPart+replyPart;
        setStat(msg,'ok');setCoach(msg+' Nice — this is exactly the kind of position you used to get wrong.');
        const prev=prog.solved[r.item.id]||{};
        prog.solved[r.item.id]={s:true,f:prev.f||0,last:Date.now()};
        prog.streak++;prog.day.count++;
        puzzleProgSave(prog);
        const nx=document.getElementById('pznext');if(nx)nx.classList.remove('hidden');
        updatePuzzleCard();
        r.checking=true;PRACTICE_LOCK=true; // keep the solved position visible
        return;
      }
      const prev=prog.solved[r.item.id]||{};
      prog.solved[r.item.id]={s:false,f:(prev.f||0)+1,last:Date.now()};
      prog.streak=0;
      puzzleProgSave(prog);
      const bestText=r.bestSan?' The improvement was '+r.bestSan+'.':'';
      const lossText=loss!=null&&loss<90?' Your move is about '+loss.toFixed(2)+' pawns worse than the fresh best.':'';
      const msg='Not quite — '+san+' did not pass fresh verification.'+bestText+lossText+evalPart+replyPart+' This puzzle will come back sooner. Try again.';
      setStat(msg,'bad');setCoach(msg);
      updatePuzzleCard();
      setTimeout(()=>resetPuzzlePosition(r),1700);
    });
  });
}

console.info('ChessTool V2.30 loaded: inflection-point blunder puzzles');

// ─── INIT ─────────────────────────────────────────────────────────────────────
if(!DB[INIT])DB[INIT]={name:'Starting Position',eco:'',note:'Welcome! Drill your opening repertoire.',moves:{}};
buildLineSelector();
renderMistakeTrends();
drawBoard();
refreshPanel();
drawMoveList();
setStat('TRAIN: choose lines and press Start Session.','info');setCoach('Choose English only, Caro-Kann + Slav, or All, then Start Session.');
