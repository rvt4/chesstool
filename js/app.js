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

// ─── GAME STATE ──────────────────────────────────────────────────────────────
// CRITICAL: flipped is ONLY changed by explicit user action (flip button, toggle side, bot color, random line)
// It is NEVER changed automatically inside rendering or auto-play functions
let MODE='drill';
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
let BOT_ACTIVE=false,BOT_THINKING=false,BOT_SKILL=1,BOT_LABEL='Beginner',BOT_COLOR='white',BOT_GAME_COLOR='white';
let BOT_LOG=[];
// quiz state
let Q_SCORE={c:0,t:0};
let QUIZ_OPTIONS=[]; // [{uci,san,correct}]
let QUIZ_CORRECT=null;
let QUIZ_DONE=false;
let QUIZ_RESULT=null;
// stockfish
let SF=null,SF_CB=null,SF_READY=false,SF_FAILED=false,SF_TIMER=null;
let SF_LAST_INFO=null;
let REVIEW_FENS=[],REVIEW_INDEX=0,REVIEW_RESULTS=[];
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
  if(MODE!=='explorer')return;
  if(!SESSION_STARTED){el.innerHTML='<span class="tlbl">Choose lines and press Start Session.</span>';return;}
  const{turn}=parseFen(FEN),userTurn=SESSION_COLOR==='white'?'w':'b';
  if(turn!==userTurn){el.innerHTML='<span class="tlbl">Opponent is choosing a repertoire continuation…</span>';return;}
  const moves=expectedPracticeMoves();
  if(!moves.length){el.innerHTML='<span class="tlbl">End of selected repertoire line.</span>';renderIntegratedPlan();return;}
  const lbl=document.createElement('div');lbl.className='tlbl';lbl.textContent='Recommended move'+(moves.length>1?'s':'')+':';el.appendChild(lbl);
  moves.forEach(san=>{const m=document.createElement('span');m.className='tm ml';m.textContent=san;el.appendChild(m);});
  const node=DB[FEN];
  const why=stripHtml(node?.note||'');
  if(why){const d=document.createElement('div');d.className='studywhy';d.textContent=why;el.appendChild(d);}
  renderIntegratedPlan();
}

function renderIntegratedPlan(){
  const host=document.getElementById('studyplan');if(!host)return;
  host.innerHTML='';
  if(MODE!=='explorer')return;
  const plan=PLAN_DB.find(p=>fenFromSans(p.sans)===FEN);
  if(!plan){host.innerHTML='<span class="tlbl">A middlegame blueprint will appear here when this line reaches a stored strategic structure.</span>';return;}
  host.innerHTML=`<div class="planmeta"><div class="planbox"><b>Main goal</b><span>${plan.goal}</span></div><div class="planbox"><b>Pawn breaks</b><span>${plan.breaks}</span></div><div class="planbox"><b>Piece map</b><span>${plan.pieces}</span></div><div class="planbox"><b>Opponent wants</b><span>${plan.opp}</span></div><div class="planbox"><b>Trigger</b><span>${plan.trigger}</span></div><div class="planbox"><b>Avoid</b><span>${plan.mistake}</span></div></div>`;
}

function onSqClick(rank,file){
  if(MODE==='bot'){botClick(rank,file);return;}
  if(MODE!=='drill'&&MODE!=='explorer')return;
  if(!SESSION_STARTED||PRACTICE_LOCK)return;
  const{bd,turn}=parseFen(FEN);
  const userTurn=SESSION_COLOR==='white'?'w':'b';
  if(turn!==userTurn)return;
  const p=GP(bd,rank,file);

  if(SEL){
    const hit=LDOTS.find(d=>d.r===rank&&d.f===file);
    if(hit){handlePracticeMove(hit.uci);return;}
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
  const san=uci2san(FEN,uci);
  const node=DB[FEN];
  const correct=expected.includes(san);
  const nf=applyUci(FEN,uci);
  setLastUci(uci);
  FEN=nf;HIST.push(nf);SANS.push(san);SEL=null;LDOTS=[];
  drawBoard();drawMoveList();

  if(correct){
    refreshPanel();
    const msg=MODE==='explorer'?'✓ '+san+' — '+(stripHtml(node?.note)||'matches your repertoire.'):'✓ Correct: '+san;
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
  const label=which==='white'?'English only':which==='black'?'Caro-Kann only':'all English + Caro-Kann';
  setStat('Selected '+label+'. Press Start Session.','info');
  setCoach('Selected '+label+'.');
}

function startRandom(){
  const avail=DLINES.filter(l=>SEL_LINES.has(l.id));
  if(!avail.length){setStat('Select at least one line.','bad');return;}
  // Pick which repertoire side to train, then keep ALL selected lines for that
  // side alive. Opponent branches are sampled randomly as the game develops.
  const seed=avail[Math.floor(Math.random()*avail.length)];
  SESSION_COLOR=seed.color;DRILL_COLOR=seed.color;SESSION_STARTED=true;PRACTICE_LOCK=false;
  FLIPPED=SESSION_COLOR==='black';
  fullReset();SESSION_STARTED=true; // fullReset clears board state only; restore session flag
  const family=SESSION_COLOR==='white'?'English as White':'Caro-Kann as Black';
  const startMsg=(MODE==='drill'?'TRAIN':'STUDY')+': '+family+' — opponent variations will be randomized from your selected lines.';
  setStat(startMsg,'info');setCoach(startMsg);
  renderStudy();
  setTimeout(practiceAutoReply,350);
}

function finishPracticeLine(){
  SESSION_STARTED=false;PRACTICE_LOCK=true;SEL=null;LDOTS=[];
  const msg='🏁 Repertoire line complete. Start Session again for another randomized branch.';
  setStat(msg,'ok');setCoach(msg);renderStudy();drawBoard();
}

function practiceAutoReply(){
  if(!SESSION_STARTED||PRACTICE_LOCK||(MODE!=='drill'&&MODE!=='explorer'))return;
  FLIPPED=SESSION_COLOR==='black';
  const{turn}=parseFen(FEN),userTurn=SESSION_COLOR==='white'?'w':'b';
  if(turn===userTurn){
    const moves=expectedPracticeMoves();
    if(!moves.length){finishPracticeLine();return;}
    else setStat(MODE==='drill'?'Your turn — find your repertoire move.':'Your turn — recommended moves are shown below.','info');
    renderStudy();drawBoard();return;
  }
  const lines=currentPracticeLines();
  if(!lines.length){setStat('No selected line matches this position. Start a new session.','bad');return;}
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
  setStat('Opponent played '+san+'. Your turn.','info');
  if(LAST_COACH)setCoach(LAST_COACH+'  •  Opponent: '+san+'.');
}

function doHint(){
  if(MODE==='bot'){setStat('No hints in bot mode.','bad');return;}
  if(!SESSION_STARTED){setStat('Start a training session first.','info');return;}
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
        if(msg==='readyok'||msg.includes('uciok'))SF_READY=true;
        if(msg.startsWith('info ')){
          const sm=msg.match(/score (cp|mate) (-?\d+)/);
          const pv=msg.match(/ pv (.+)$/);
          if(sm)SF_LAST_INFO={type:sm[1],value:+sm[2],pv:pv?pv[1].trim().split(/\s+/):[]};
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
  SF_CB=(move,info)=>cb(move||localBestMove(fen,skill),info);
  const mt=skill<=2?400:skill<=8?800:1300;
  try{
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

function setBotSkill(s,lbl){
  BOT_SKILL=s;BOT_LABEL=lbl;
  ['sk0','sk1','sk2'].forEach((id,i)=>document.getElementById(id).classList.toggle('on',i===['Beginner','Club','Strong'].indexOf(lbl)));
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
  sfBestMove(FEN,BOT_SKILL,uci=>{
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
  });
}

function endBot(){
  BOT_ACTIVE=false;
  setStat(inCheck(FEN,parseFen(FEN).turn)?'Checkmate!':'Game over! Click Review.','info');
  document.getElementById('revbtn').classList.remove('hidden');
}

function sfAnalyzePosition(fen,cb){
  // Review never substitutes the lightweight fallback evaluator for Stockfish.
  // If the real engine is unavailable, return null so the UI does not display
  // fake precision such as +0.03.
  if(!SF||SF_FAILED){cb(null);return;}
  SF_LAST_INFO=null;
  SF_CB=(move,info)=>cb({best:move,info});
  try{
    SF.postMessage('setoption name Skill Level value 20');
    SF.postMessage('position fen '+fen);
    SF.postMessage('go movetime 220');
    clearTimeout(SF_TIMER);
    SF_TIMER=setTimeout(()=>{
      if(SF_CB){SF_CB=null;SF_LAST_INFO=null;cb(null);}
    },2400);
  }catch(e){SF_FAILED=true;SF=null;SF_CB=null;cb(null);}
}

function infoWhiteEval(fen,info){
  if(!info)return null;
  let v;
  if(info.type==='mate')v=(info.value>0?99:-99);
  else v=info.value/100;
  return parseFen(fen).turn==='w'?v:-v;
}

function reviewGrade(loss){
  if(loss==null)return{label:'Not analyzed',cls:'rn'};
  if(loss<=.12)return{label:'Excellent',cls:'rg'};
  if(loss<=.35)return{label:'Good',cls:'rg'};
  if(loss<=.80)return{label:'Inaccuracy',cls:'rn'};
  if(loss<=1.80)return{label:'Mistake',cls:'rb'};
  return{label:'Blunder',cls:'rb'};
}

function pieceName(p){return({P:'pawn',N:'knight',B:'bishop',R:'rook',Q:'queen',K:'king'})[p?.toUpperCase()]||'piece';}
function reviewExplanation(entry,beforeFen,afterFen,bestSan,loss,engineOK){
  const {bd,turn}=parseFen(beforeFen);
  const ff=entry.uci.charCodeAt(0)-97,fr=+entry.uci[1]-1,tf=entry.uci.charCodeAt(2)-97,tr=+entry.uci[3]-1;
  const pc=GP(bd,fr,ff),cap=GP(bd,tr,tf);
  const parts=[];
  const node=DB[beforeFen];
  if(node&&node.moves&&node.moves[entry.san]){
    const why=stripHtml(node.note||'');
    parts.push(why?'This is in your repertoire. '+why:'This move matches your stored repertoire.');
  }else{
    if(entry.san==='O-O'||entry.san==='O-O-O')parts.push('Castling improves king safety and connects the rooks.');
    else if(cap)parts.push('This '+pieceName(pc)+' captures a '+pieceName(cap)+' on '+entry.uci.slice(2,4)+', changing the material balance.');
    else if(pc&&pc.toUpperCase()==='N'&&((turn==='w'&&fr===0)||(turn==='b'&&fr===7)))parts.push('This develops a knight from its starting square and brings another piece into the game.');
    else if(pc&&pc.toUpperCase()==='B'&&((turn==='w'&&fr===0)||(turn==='b'&&fr===7)))parts.push('This develops a bishop and improves coordination.');
    else if(pc&&pc.toUpperCase()==='P'&&['c','d','e','f'].includes(entry.uci[0]))parts.push('This pawn move changes the center, so its main value depends on the squares and pawn breaks it creates.');
    else parts.push('This move changes piece placement without an immediate material change.');
  }
  if(inCheck(afterFen,parseFen(afterFen).turn))parts.push('It also gives check, forcing an immediate response.');
  if(engineOK&&bestSan){
    if(bestSan===entry.san)parts.push('Stockfish also chose this as its first move.');
    else if(loss!=null&&loss>.12)parts.push('Stockfish preferred '+bestSan+'; the move cost about '+loss.toFixed(2)+' pawns of evaluation at the review search depth.');
    else parts.push('Stockfish slightly preferred '+bestSan+', but the evaluation difference was small.');
  }else if(!engineOK){
    parts.push('No numeric engine claim is shown because Stockfish review was unavailable in this browser session.');
  }
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
    let grade=r.grade|| (DB[e.fen]?.moves?.[e.san]?'Repertoire':'Analyzing…');
    let cls=r.cls||'rn';
    const evalTxt=r.evalAfter==null?'':(' · '+(r.evalAfter>=0?'+':'')+r.evalAfter.toFixed(2));
    div.innerHTML='<span class="rm">'+reviewMoveLabel(i)+'</span> <span class="reviewowner">'+owner+'</span> <span class="'+cls+'">'+grade+'</span><span class="rn">'+evalTxt+'</span>';
    div.onclick=()=>reviewGo(i+1);
    el.appendChild(div);
  });
  const foot=document.createElement('div');foot.className='reviewfoot';
  foot.textContent=(SF&& !SF_FAILED)?'Evaluations are from Stockfish in the browser. Positive favors White; negative favors Black.':'Stockfish review is unavailable, so ChessTool is intentionally hiding numeric evaluations instead of showing heuristic scores.';
  el.appendChild(foot);
}

function renderReviewDetail(){
  const pos=document.getElementById('reviewpos'),detail=document.getElementById('reviewdetail');if(!pos||!detail)return;
  if(REVIEW_INDEX===0){pos.textContent='Starting position';detail.textContent='Use Next or tap a move to step through the game.';return;}
  const i=REVIEW_INDEX-1,e=BOT_LOG[i],r=REVIEW_RESULTS[i]||{};
  pos.textContent=reviewMoveLabel(i)+' · '+(e.byBot?'Bot':'You');
  detail.innerHTML='<strong>'+(r.grade||'Analysis pending')+'</strong>'+(r.bestSan&&r.bestSan!==e.san?' · Best: '+r.bestSan:'')+(r.evalAfter!=null?' · Eval: '+(r.evalAfter>=0?'+':'')+r.evalAfter.toFixed(2):'')+'<div class="reviewexplain">'+(r.explanation||'Analysis is still running…')+'</div>';
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

function analyzeReview(){
  const eng=document.getElementById('reviewengine');
  if(!SF||SF_FAILED){
    if(eng)eng.textContent='Stockfish unavailable';
    REVIEW_RESULTS=BOT_LOG.map((e,i)=>{
      const before=REVIEW_FENS[i],after=REVIEW_FENS[i+1];
      return{grade:DB[e.fen]?.moves?.[e.san]?'Repertoire':'Played',cls:DB[e.fen]?.moves?.[e.san]?'rg':'rn',evalAfter:null,bestSan:'',explanation:reviewExplanation(e,before,after,'',null,false)};
    });
    renderReviewList();renderReviewDetail();return;
  }
  if(eng)eng.textContent='Stockfish 0%';
  const posResults=new Array(REVIEW_FENS.length);
  let k=0;
  function next(){
    if(k>=REVIEW_FENS.length){
      REVIEW_RESULTS=BOT_LOG.map((e,i)=>{
        const before=posResults[i],after=posResults[i+1];
        const mover=parseFen(e.fen).turn;
        const eb=before?.eval,ea=after?.eval;
        const loss=(eb==null||ea==null)?null:Math.max(0,mover==='w'?eb-ea:ea-eb);
        const g=reviewGrade(loss);
        const bestSan=before?.best?uci2san(e.fen,before.best):'';
        const inBook=!!DB[e.fen]?.moves?.[e.san];
        return{grade:inBook?'Repertoire':g.label,cls:inBook?'rg':g.cls,evalAfter:ea,bestSan,loss,explanation:reviewExplanation(e,REVIEW_FENS[i],REVIEW_FENS[i+1],bestSan,loss,true)};
      });
      if(eng)eng.textContent='Stockfish complete';renderReviewList();renderReviewDetail();return;
    }
    const fen=REVIEW_FENS[k],idx=k;
    sfAnalyzePosition(fen,res=>{
      posResults[idx]=res?{best:res.best,eval:infoWhiteEval(fen,res.info)}:{best:null,eval:null};
      k++;if(eng)eng.textContent='Stockfish '+Math.round(100*k/REVIEW_FENS.length)+'%';next();
    });
  }
  next();
}

function showReview(){
  if(!BOT_LOG.length){setStat('No game to review.','bad');return;}
  BOT_ACTIVE=false;REVIEW_FENS=buildReviewFens();REVIEW_RESULTS=[];REVIEW_INDEX=0;
  document.getElementById('revcard').classList.remove('hidden');
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
  if(HIST.length<=1)return;
  HIST.pop();SANS.pop();FEN=HIST[HIST.length-1];
  SEL=null;LDOTS=[];LF=null;LT=null;
  refreshPanel();drawBoard();drawMoveList();
  if(MODE==='explorer')renderStudy();
}

// fullReset resets position but NOT FLIPPED — FLIPPED is only changed by explicit user actions
function fullReset(){
  FEN=INIT;HIST=[INIT];SANS=[];SEL=null;LDOTS=[];LF=null;LT=null;
  BOT_ACTIVE=false;BOT_LOG=[];
  refreshPanel();drawBoard();drawMoveList();
}

function doReset(){
  const wasSession=SESSION_STARTED;
  fullReset();SESSION_STARTED=wasSession;
  FLIPPED=SESSION_COLOR==='black';drawBoard();
  if((MODE==='drill'||MODE==='explorer')&&SESSION_STARTED)setTimeout(practiceAutoReply,250);
  renderStudy();setStat(SESSION_STARTED?'Session reset.':'Reset.','info');
}

function doFlip(){FLIPPED=!FLIPPED;drawBoard();}


// ─── MODE SWITCHING ───────────────────────────────────────────────────────────
function setMode(mode){
  MODE=mode;BOT_ACTIVE=false;SEL=null;LDOTS=[];SESSION_STARTED=false;PRACTICE_LOCK=false;
  document.querySelectorAll('.nb').forEach((b,i)=>b.classList.toggle('on',['drill','explorer','bot'][i]===mode));
  show('linecard',mode==='drill'||mode==='explorer');
  show('expcard',mode==='explorer');
  show('botcard',mode==='bot');
  show('randbtn',mode==='drill'||mode==='explorer');
  show('newgamebtn',mode==='bot');
  show('revbtn',false);
  show('hintbtn',mode!=='bot');
  document.getElementById('revcard').classList.add('hidden');
  fullReset();
  if(mode==='drill'){buildLineSelector();const m='TRAIN: choose lines, Start Session, then recall your moves. Wrong legal moves are explained and reset.';setStat(m,'info');setCoach(m);}
  if(mode==='explorer'){buildLineSelector();const m='STUDY: choose lines, Start Session. Your moves are shown with explanations; the opponent autoplays random selected branches.';setStat(m,'info');setCoach(m);renderStudy();}
  if(mode==='bot'){const m='Set skill & color → New Game.';setStat(m,'info');setCoach(m);initSF();}
}

function show(id,visible){
  const el=document.getElementById(id);
  if(visible)el.classList.remove('hidden');else el.classList.add('hidden');
}

console.info('ChessTool V2.3 loaded: mobile coaching + family quick-select + line completion + engine-backed review');

// ─── INIT ─────────────────────────────────────────────────────────────────────
if(!DB[INIT])DB[INIT]={name:'Starting Position',eco:'',note:'Welcome! Drill your opening repertoire.',moves:{}};
buildLineSelector();
drawBoard();
refreshPanel();
drawMoveList();
setStat('TRAIN: choose lines and press Start Session.','info');setCoach('Choose English only, Caro-Kann only, or All, then Start Session.');
