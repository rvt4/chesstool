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
  const label=which==='white'?'English only':which==='black'?'Caro-Kann only':'all English + Caro-Kann';
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
  const family=SESSION_COLOR==='white'?'English as White':'Caro-Kann as Black';
  const startMsg='TRAIN: '+family+' — opening opponent variations are randomized from your selected lines, then the session continues into middlegame training.';
  setStat(startMsg,'info');setCoach(startMsg);
  renderStudy();
  setTimeout(practiceAutoReply,350);
}


const PLAN_LINE_MAP={
  'e-e5-4n':'eng-rev-sic','e-e5-cl':'eng-bot','e-sym':'eng-sym','e-hedge':'eng-hedge',
  'e-grun':'eng-grun','e-kid':'eng-kid','e-e6':'eng-e6','e-c6':'eng-c6',
  'e-dutch':'eng-dutch','e-b6':'eng-b6','ck-cls':'ck-class','ck-cls2':'ck-class',
  'ck-adv':'ck-adv','ck-tal':'ck-adv','ck-panov':'ck-panov','ck-ex':'ck-exchange',
  'ck-2k':'ck-two','ck-fan':'ck-fantasy','ck-hill':'ck-hill','ck-d3':'ck-d3'
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
    MID_PRE_ANALYSIS=res?{best:res.best,eval:infoWhiteEval(FEN,res.info)}:null;
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
  sfBestMoveRated(FEN,MID_RATING,uci=>{
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
    const beforeEval=MID_PRE_ANALYSIS?.eval||null;
    const mover=parseFen(beforeFen).turn;
    const pb=whiteWinProb(beforeEval),pa=whiteWinProb(afterEval);
    const loss=(pb==null||pa==null)?null:Math.max(0,mover==='w'?pb-pa:pa-pb);
    const bestUci=MID_PRE_ANALYSIS?.best||null;
    const bestSan=bestUci?uci2san(beforeFen,bestUci):'';
    const grade=classifyMove({entry:{uci,san},beforeFen,afterFen,bestUci,beforeEval,afterEval,probLoss:loss,inBook:false});
    const explanation=liveMoveExplanation(san,grade,bestSan,loss,STUDY_PLAN);
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
function liveMoveExplanation(san,grade,bestSan,loss,plan){
  const bits=[];
  if(grade.label==='Best')bits.push(san+' is Stockfish’s top move.');
  else if(bestSan&&bestSan!==san)bits.push('Stockfish prefers '+bestSan+'.');
  if(loss!=null&&loss>.02)bits.push('Your move gave up about '+Math.round(loss*100)+' percentage points of estimated winning chances.');
  if(plan){
    bits.push('Plan reminder: '+plan.goal);
    bits.push('Key break: '+plan.breaks);
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

function sfBestMoveRated(fen,rating,cb){
  const fallback=()=>setTimeout(()=>cb(localBestMove(fen,midSkillLevel())),180);
  if(!SF||SF_FAILED){fallback();return;}
  SF_CB=(move,info)=>cb(move||localBestMove(fen,midSkillLevel()),info);
  const mt=rating<=1400?650:rating<=1600?900:rating<=1800?1200:1550;
  try{
    SF.postMessage('setoption name UCI_LimitStrength value true');
    SF.postMessage('setoption name UCI_Elo value '+rating);
    SF.postMessage('position fen '+fen);
    SF.postMessage('go movetime '+mt);
    clearTimeout(SF_TIMER);
    SF_TIMER=setTimeout(()=>{
      if(SF_CB){const done=SF_CB;SF_CB=null;done(localBestMove(fen,midSkillLevel()),null);}
    },mt+1900);
  }catch(e){SF_FAILED=true;SF=null;SF_CB=null;fallback();}
}

function setBotSkill(s,lbl){
  BOT_SKILL=s;BOT_LABEL=lbl;
  const labels=['1400','1600','1800','Full'];
  ['sk0','sk1','sk2','sk3'].forEach((id,i)=>document.getElementById(id)?.classList.toggle('on',i===labels.indexOf(lbl)));
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
  BOT_ACTIVE=false;BOT_THINKING=false;
  const turn=parseFen(FEN).turn,none=legalMoves(FEN).length===0,mate=none&&inCheck(FEN,turn);
  const title=mate?'Checkmate':'Game over';
  const result=mate?((turn==='w'?'Black':'White')+' wins by checkmate.'):(none?'Draw by stalemate.':'Game ended.');
  setStat(title+' — '+result,'info');setCoach(title+' — '+result);
  document.getElementById('revbtn').classList.remove('hidden');
  const ov=document.getElementById('gameoveroverlay');
  if(ov){document.getElementById('gameovertitle').textContent=title;document.getElementById('gameovertext').textContent=result;ov.classList.remove('hidden');}
}

function sfAnalyzePositionDepth(fen,depth,cb,retry=0){
  if(!SF||SF_FAILED){cb(null);return;}
  let finished=false;
  const finish=res=>{
    if(finished)return;finished=true;
    clearTimeout(SF_TIMER);SF_READY_CB=null;SF_CB=null;
    if(!res&&retry<1){setTimeout(()=>sfAnalyzePositionDepth(fen,Math.max(11,depth-1),cb,retry+1),120);return;}
    cb(res);
  };
  try{
    SF_CB=null;SF_LAST_INFO=null;
    SF.postMessage('stop');
    SF_READY_CB=()=>{
      if(finished)return;
      SF_LAST_INFO=null;
      SF_CB=(move,info)=>finish(move&&info?{best:move,info}:null);
      SF.postMessage('setoption name UCI_LimitStrength value false');
      SF.postMessage('setoption name Skill Level value 20');
      SF.postMessage('position fen '+fen);
      SF.postMessage('go depth '+depth);
    };
    SF.postMessage('isready');
    SF_TIMER=setTimeout(()=>{try{SF.postMessage('stop');}catch(e){}finish(null);},depth>=14?16000:11000);
  }catch(e){SF_FAILED=true;try{SF?.terminate();}catch(x){}SF=null;finish(null);}
}
function sfAnalyzePosition(fen,cb){sfAnalyzePositionDepth(fen,14,cb);}

function infoWhiteEval(fen,info){
  if(!info)return null;
  const stm=parseFen(fen).turn;
  if(info.type==='mate'){
    const whiteMate=stm==='w'?info.value:-info.value;
    return{kind:'mate',value:whiteMate};
  }
  const cp=stm==='w'?info.value:-info.value;
  return{kind:'cp',value:cp/100};
}
function evalText(ev){
  if(!ev)return'';
  if(ev.terminal)return ev.stalemate?'Draw':'Checkmate';
  if(ev.kind==='mate')return(ev.value>0?'M':'-M')+Math.abs(ev.value);
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
  'Not analyzed':{icon:'…',cls:'rn'}
};
function moverWinProb(ev,side){
  const w=whiteWinProb(ev);if(w==null)return null;return side==='w'?w:1-w;
}
function isSacrificeCandidate(entry,beforeFen,afterFen){
  const {bd,turn}=parseFen(beforeFen);
  const ff=entry.uci.charCodeAt(0)-97,fr=+entry.uci[1]-1,tf=entry.uci.charCodeAt(2)-97,tr=+entry.uci[3]-1;
  const pc=GP(bd,fr,ff),cap=GP(bd,tr,tf);
  if(!pc||pc.toUpperCase()==='P'||pc.toUpperCase()==='K')return false;
  const pv=materialValue(pc),cv=materialValue(cap);
  if(pv-cv<180)return false;
  const {bd:abd}=parseFen(afterFen);
  return attacked(abd,tr,tf,turn==='w'?'b':'w');
}
function classifyMove({entry,beforeFen,afterFen,bestUci,beforeEval,afterEval,probLoss,inBook}){
  const mover=parseFen(beforeFen).turn;
  const legalCount=legalMoves(beforeFen).length;
  const mateAfter=afterEval?.terminal&&!afterEval?.stalemate;
  if(mateAfter)return{label:'Checkmate',...MOVE_CLASS_META.Checkmate};
  if(legalCount===1)return{label:'Forced',...MOVE_CLASS_META.Forced};
  if(probLoss==null)return{label:'Not analyzed',...MOVE_CLASS_META['Not analyzed']};

  const best=!!bestUci&&entry.uci===bestUci;
  const beforeP=moverWinProb(beforeEval,mover),afterP=moverWinProb(afterEval,mover);
  const beforeMate=beforeEval?.kind==='mate'&&((mover==='w'&&beforeEval.value>0)||(mover==='b'&&beforeEval.value<0));
  const afterMate=afterEval?.kind==='mate'&&((mover==='w'&&afterEval.value>0)||(mover==='b'&&afterEval.value<0));

  // Miss: a major tactical win or forced mate was available and the move lets it go.
  if((beforeMate&&!afterMate)||(beforeP!=null&&afterP!=null&&beforeP>=.82&&afterP<.62&&probLoss>=.16))
    return{label:'Miss',...MOVE_CLASS_META.Miss};

  // Brilliant is deliberately conservative: engine-best, tactically sound, and
  // offers a materially more valuable non-pawn piece to capture.
  if(best&&isSacrificeCandidate(entry,beforeFen,afterFen)&&probLoss<=.01)
    return{label:'Brilliant',...MOVE_CLASS_META.Brilliant};

  // Great: engine-best in a genuinely critical/mating position.
  const critical=beforeEval?.kind==='mate';
  if(best&&critical)return{label:'Great',...MOVE_CLASS_META.Great};
  if(best)return{label:'Best',...MOVE_CLASS_META.Best};
  if(probLoss<=.02)return{label:'Excellent',...MOVE_CLASS_META.Excellent};
  if(probLoss<=.05)return{label:'Good',...MOVE_CLASS_META.Good};
  if(probLoss<=.10)return{label:'Inaccuracy',...MOVE_CLASS_META.Inaccuracy};
  if(probLoss<=.20)return{label:'Mistake',...MOVE_CLASS_META.Mistake};
  return{label:'Blunder',...MOVE_CLASS_META.Blunder};
}
function pieceName(p){return({P:'pawn',N:'knight',B:'bishop',R:'rook',Q:'queen',K:'king'})[p?.toUpperCase()]||'piece';}
function reviewExplanation(entry,beforeFen,afterFen,bestSan,probLoss,engineOK,classification=''){
  const {bd,turn}=parseFen(beforeFen);
  const ff=entry.uci.charCodeAt(0)-97,fr=+entry.uci[1]-1,tf=entry.uci.charCodeAt(2)-97,tr=+entry.uci[3]-1;
  const pc=GP(bd,fr,ff),cap=GP(bd,tr,tf);
  const parts=[];
  const node=DB[beforeFen];
  if(node&&node.moves&&node.moves[entry.san]){
    const why=stripHtml(node.note||'');
    parts.push(why?'📖 Repertoire: '+why:'📖 This move matches your stored repertoire.');
  }else{
    if(entry.san==='O-O'||entry.san==='O-O-O')parts.push('Castling improves king safety and connects the rooks.');
    else if(cap)parts.push('This '+pieceName(pc)+' captures a '+pieceName(cap)+' on '+entry.uci.slice(2,4)+', changing the material balance.');
    else if(pc&&pc.toUpperCase()==='N'&&((turn==='w'&&fr===0)||(turn==='b'&&fr===7)))parts.push('This develops a knight from its starting square and increases central influence.');
    else if(pc&&pc.toUpperCase()==='B'&&((turn==='w'&&fr===0)||(turn==='b'&&fr===7)))parts.push('This develops a bishop and improves coordination.');
    else if(pc&&pc.toUpperCase()==='P'&&['c','d','e','f'].includes(entry.uci[0]))parts.push('This pawn move changes the center and the available pawn breaks.');
    else parts.push('This move changes the placement and coordination of your pieces.');
  }
  if(inCheck(afterFen,parseFen(afterFen).turn))parts.push('It gives check, so the opponent must answer the threat immediately.');

  const meanings={
    Brilliant:'Exceptional engine-best move involving a sound material sacrifice.',
    Great:'A critical engine-best move in a tactically important position.',
    Best:'Stockfish’s top choice.',
    Excellent:'Essentially as strong as the top choice.',
    Good:'A solid move with only a small loss in winning chances.',
    Inaccuracy:'A noticeable loss of accuracy, but the position remains manageable.',
    Mistake:'A significant deterioration in the position.',
    Miss:'A major winning opportunity or forced mate was available and was missed.',
    Blunder:'A major swing in the expected result of the game.',
    Forced:'There was essentially no alternative legal move.',
    Checkmate:'This move ends the game by checkmate.'
  };
  if(meanings[classification])parts.push(meanings[classification]);

  if(engineOK&&bestSan){
    if(bestSan===entry.san)parts.push('The move matches Stockfish’s first choice.');
    else if(probLoss!=null&&probLoss>.02)parts.push('Stockfish preferred '+bestSan+'; the played move reduced estimated winning chances by about '+Math.round(probLoss*100)+' percentage points.');
    else parts.push('Stockfish slightly preferred '+bestSan+', but the practical difference was small.');
  }else if(!engineOK){
    parts.push('Stockfish analysis was unavailable for this position, so ChessTool is not inventing a numeric grade.');
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
    const label=r.grade||'Analyzing…',icon=r.icon||'…',cls=r.cls||'rn';
    const evalTxt=r.evalAfter==null?'':(' · '+evalText(r.evalAfter));
    const book=r.inBook?' <span class="booktag">📖 Repertoire</span>':'';
    div.innerHTML='<span class="rm">'+reviewMoveLabel(i)+'</span> <span class="reviewowner">'+owner+'</span> <span class="moveclass '+cls+'"><span class="moveicon">'+icon+'</span> '+label+'</span>'+book+'<span class="rn">'+evalTxt+'</span>';
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
  const book=r.inBook?' · 📖 Repertoire':'';
  const html='<strong class="'+(r.cls||'')+'">'+(r.icon||'…')+' '+(r.grade||'Analysis pending')+'</strong>'+book+(r.bestSan&&r.bestSan!==e.san?' · Best: '+r.bestSan:'')+(r.evalAfter!=null?' · Eval: '+evalText(r.evalAfter):'')+'<div class="reviewexplain">'+(r.explanation||'Analysis is still running…')+'</div>';
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

function analyzeReview(){
  const eng=document.getElementById('reviewengine');
  if(!SF||SF_FAILED){
    if(eng)eng.textContent='Stockfish unavailable';
    REVIEW_RESULTS=BOT_LOG.map((e,i)=>{
      const inBook=!!DB[e.fen]?.moves?.[e.san];
      return{grade:'Not analyzed',icon:'…',cls:'rn',inBook,evalAfter:null,bestSan:'',explanation:reviewExplanation(e,REVIEW_FENS[i],REVIEW_FENS[i+1],'',null,false,'Not analyzed')};
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
        const eb=before?.eval||null,ea=after?.eval||null;
        const pb=whiteWinProb(eb),pa=whiteWinProb(ea);
        let probLoss=(pb==null||pa==null)?null:Math.max(0,mover==='w'?pb-pa:pa-pb);
        const inBook=!!DB[e.fen]?.moves?.[e.san];
        const bestUci=before?.best||null;
        let c=classifyMove({entry:e,beforeFen:REVIEW_FENS[i],afterFen:REVIEW_FENS[i+1],bestUci,beforeEval:eb,afterEval:ea,probLoss,inBook});

        // Browser depth can be noisy in the first few opening moves. A stored,
        // legal repertoire move is never called a Blunder/Mistake solely from
        // a shallow opening fluctuation unless the move actually loses >30%
        // winning chances or walks into forced mate.
        if(inBook&&i<12&&['Mistake','Miss','Blunder'].includes(c.label)&&!(probLoss!=null&&probLoss>.30)&&ea?.kind!=='mate'){
          c={label:'Good',...MOVE_CLASS_META.Good};
        }
        const bestSan=bestUci?uci2san(e.fen,bestUci):'';
        const explanation=reviewExplanation(e,REVIEW_FENS[i],REVIEW_FENS[i+1],bestSan,probLoss,true,c.label);
        return{grade:c.label,icon:c.icon,cls:c.cls,inBook,evalAfter:ea,bestSan,probLoss,explanation};
      });
      if(eng)eng.textContent='Stockfish complete';renderReviewList();renderReviewDetail();return;
    }
    const fen=REVIEW_FENS[k],idx=k;
    const tm=parseFen(fen).turn,lm=legalMoves(fen);
    if(!lm.length){
      if(inCheck(fen,tm))posResults[idx]={best:null,eval:{kind:'mate',value:tm==='w'?-1:1,terminal:true}};
      else posResults[idx]={best:null,eval:{kind:'cp',value:0,terminal:true,stalemate:true}};
      k++;if(eng)eng.textContent='Stockfish '+Math.round(100*k/REVIEW_FENS.length)+'%';next();return;
    }
    sfAnalyzePositionDepth(fen,14,res=>{
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
  if(HIST.length<=1)return;
  HIST.pop();SANS.pop();FEN=HIST[HIST.length-1];
  SEL=null;LDOTS=[];LF=null;LT=null;
  refreshPanel();drawBoard();drawMoveList();
  if(MODE==='drill')renderStudy();
}

// fullReset resets position but NOT FLIPPED — FLIPPED is only changed by explicit user actions
function fullReset(){
  FEN=INIT;HIST=[INIT];SANS=[];SEL=null;LDOTS=[];LF=null;LT=null;
  BOT_ACTIVE=false;BOT_LOG=[];
  document.getElementById('gameoveroverlay')?.classList.add('hidden');
  document.getElementById('reviewdock')?.classList.add('hidden');
  document.getElementById('playhud')?.classList.remove('hidden');
  document.getElementById('planinfocard')?.classList.add('hidden');
  refreshPanel();drawBoard();drawMoveList();
}

function doReset(){
  const wasSession=SESSION_STARTED;
  fullReset();SESSION_STARTED=wasSession;
  FLIPPED=SESSION_COLOR==='black';drawBoard();
  if(MODE==='drill'&&SESSION_STARTED)setTimeout(practiceAutoReply,250);
  renderStudy();setStat(SESSION_STARTED?'Session reset.':'Reset.','info');
}

function doFlip(){FLIPPED=!FLIPPED;drawBoard();}


// ─── MODE SWITCHING ───────────────────────────────────────────────────────────
function setMode(mode){
  MODE=mode;BOT_ACTIVE=false;SEL=null;LDOTS=[];SESSION_STARTED=false;PRACTICE_LOCK=false;STUDY_PHASE='opening';STUDY_PLAN=null;MID_FEEDBACK='';MID_PRE_ANALYSIS=null;
  document.querySelectorAll('.nb').forEach((b,i)=>b.classList.toggle('on',['drill','bot'][i]===mode));
  show('linecard',mode==='drill');
  show('expcard',mode==='drill');
  show('midbotcard',mode==='drill');
  show('botcard',mode==='bot');
  show('randbtn',mode==='drill');
  show('newgamebtn',mode==='bot');
  show('revbtn',false);
  show('hintbtn',mode==='drill');
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
  if(mode==='bot'){
    const m='Play a complete game, then review it move by move.';
    setStat(m,'info');setCoach(m);initSF();
  }
}

function show(id,visible){
  const el=document.getElementById(id);
  if(visible)el.classList.remove('hidden');else el.classList.add('hidden');
}

console.info('ChessTool V2.6 loaded: unified training + rated middlegame opponent + live move coaching + richer review classifications');

// ─── INIT ─────────────────────────────────────────────────────────────────────
if(!DB[INIT])DB[INIT]={name:'Starting Position',eco:'',note:'Welcome! Drill your opening repertoire.',moves:{}};
buildLineSelector();
drawBoard();
refreshPanel();
drawMoveList();
setStat('TRAIN: choose lines and press Start Session.','info');setCoach('Choose English only, Caro-Kann only, or All, then Start Session.');
