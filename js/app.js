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
let LF=null,LT=null; // last move from/to squares

// bot state
let BOT_ACTIVE=false,BOT_THINKING=false,BOT_SKILL=1,BOT_LABEL='Beginner',BOT_COLOR='white';
let BOT_LOG=[];
// quiz state
let Q_SCORE={c:0,t:0};
// stockfish
let SF=null,SF_CB=null;

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
      sq.className='sq '+((rank+file)%2===0?'lt':'dk');
      if(LF&&LF.r===rank&&LF.f===file)sq.classList.add('lf');
      if(LT&&LT.r===rank&&LT.f===file)sq.classList.add('lt2');
      const p=GP(bd,rank,file);
      if(p)sq.innerHTML=PSV[p]||'';
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

// ─── CLICK HANDLING ──────────────────────────────────────────────────────────
function onSqClick(rank,file){
  if(MODE==='quiz'||MODE==='plans')return;
  if(MODE==='bot'){botClick(rank,file);return;}
  const{bd,turn}=parseFen(FEN);

  // In Drill, the user's color is fixed. If it is the repertoire/opponent's
  // turn, ignore board taps and let drillAutoReply make that move.
  if(MODE==='drill'){
    const userTurn=DRILL_COLOR==='white'?'w':'b';
    FLIPPED=(DRILL_COLOR==='black');
    if(turn!==userTurn){
      SEL=null;LDOTS=[];drawBoard();
      return;
    }
  }

  const p=GP(bd,rank,file);

  if(SEL){
    const hit=LDOTS.find(d=>d.r===rank&&d.f===file);
    if(hit){execMove(hit.san,hit.nextFen);return;}
    if(p&&friendly(p,turn)){SEL={r:rank,f:file};LDOTS=getRepDots(rank,file);drawBoard();return;}
    SEL=null;LDOTS=[];drawBoard();return;
  }
  if(p&&friendly(p,turn)){SEL={r:rank,f:file};LDOTS=getRepDots(rank,file);drawBoard();}
}

// Get repertoire move dots from a square
// Uses san2uci which validates against actual legal moves — fixes Bg2 etc.
function getRepDots(fromR,fromF){
  const node=DB[FEN];if(!node)return[];
  const dots=[];
  for(const[san,nextFen]of Object.entries(node.moves)){
    const uci=san2uci(FEN,san);
    if(!uci)continue;
    if(uci.charCodeAt(0)-97===fromF&&+uci[1]-1===fromR){
      dots.push({r:+uci[3]-1,f:uci.charCodeAt(2)-97,san,nextFen});
    }
  }
  return dots;
}

function setLastMove(san){
  const uci=san2uci(FEN,san);
  if(!uci){LF=null;LT=null;return;}
  LF={r:+uci[1]-1,f:uci.charCodeAt(0)-97};
  LT={r:+uci[3]-1,f:uci.charCodeAt(2)-97};
}

// Core move executor — NO board flipping here
function execMove(san,nextFen){
  setLastMove(san);
  FEN=nextFen;HIST.push(nextFen);SANS.push(san);
  SEL=null;LDOTS=[];
  // Drill orientation is fixed to the side being trained.
  // A move must never change the player's viewing side.
  if(MODE==='drill') FLIPPED=(DRILL_COLOR==='black');
  refreshPanel();drawBoard();drawMoveList();

  if(MODE==='drill'){
    setStat('✓ Correct!','ok');
    setTimeout(drillAutoReply,450);
  } else if(MODE==='explorer'){
    setStat('','');
    setTimeout(explorerAutoReply,480);
  }
}

// ─── DRILL ───────────────────────────────────────────────────────────────────
function drillAutoReply(){
  // Lock orientation before and after every automatic repertoire reply.
  FLIPPED=(DRILL_COLOR==='black');
  const{turn}=parseFen(FEN);
  const dt=DRILL_COLOR==='white'?'w':'b';
  if(turn===dt){setStat('Your turn — find the next move.','info');return;}
  const node=DB[FEN];
  if(!node||!Object.keys(node.moves).length){setStat('🏁 End of line! Reset or try Random Line.','info');return;}
  const[san,nextFen]=Object.entries(node.moves)[0];
  setLastMove(san);
  FEN=nextFen;HIST.push(nextFen);SANS.push(san);
  FLIPPED=(DRILL_COLOR==='black');
  refreshPanel();drawBoard();drawMoveList();
  const nn=DB[FEN];
  if(!nn||!Object.keys(nn.moves).length)setStat('🏁 End of line! Reset or try Random Line.','info');
  else setStat('Your turn — find the next move.','info');
}

// ─── EXPLORER ────────────────────────────────────────────────────────────────
function explorerAutoReply(){
  const node=DB[FEN];
  if(!node||!Object.keys(node.moves).length){
    setStat('End of repertoire line.','info');renderTree();return;
  }
  const[san,nextFen]=Object.entries(node.moves)[0];
  setLastMove(san);
  FEN=nextFen;HIST.push(nextFen);SANS.push(san);
  refreshPanel();drawBoard();drawMoveList();
  setStat('Computer played '+san+'. Click your next move below.','info');
  renderTree();
}

function renderTree(){
  const el=document.getElementById('tree');el.innerHTML='';
  const node=DB[FEN];
  if(!node||!Object.keys(node.moves).length){
    el.innerHTML='<span class="tlbl">End of repertoire</span>';return;
  }
  const{turn}=parseFen(FEN);
  const lbl=document.createElement('span');lbl.className='tlbl';
  lbl.textContent=(turn==='w'?'White':'Black')+' to move:';
  el.appendChild(lbl);
  Object.entries(node.moves).forEach(([san,nextFen],i)=>{
    const m=document.createElement('span');
    m.className='tm'+(i===0?' ml':'');m.textContent=san;
    m.onclick=()=>execMove(san,nextFen);
    el.appendChild(m);
  });
}

// ─── RANDOM LINE DRILL ───────────────────────────────────────────────────────
function buildLineSelector(){
  const el=document.getElementById('linesel');el.innerHTML='';
  const grps={};
  DLINES.forEach(l=>{(grps[l.group]=grps[l.group]||[]).push(l);});
  for(const[g,ls]of Object.entries(grps)){
    const lbl=document.createElement('div');lbl.className='glbl';lbl.textContent=g;el.appendChild(lbl);
    ls.forEach(l=>{
      const chip=document.createElement('label');
      chip.className='lchip'+(SEL_LINES.has(l.id)?' on':'');
      const cb=document.createElement('input');cb.type='checkbox';cb.checked=SEL_LINES.has(l.id);
      cb.onchange=()=>{if(cb.checked){SEL_LINES.add(l.id);chip.classList.add('on');}else{SEL_LINES.delete(l.id);chip.classList.remove('on');}};
      chip.appendChild(cb);
      const s=document.createElement('span');s.textContent=l.label;chip.appendChild(s);
      el.appendChild(chip);
    });
  }
}

function startRandom(){
  const avail=DLINES.filter(l=>SEL_LINES.has(l.id));
  if(!avail.length){setStat('Select at least one line!','bad');return;}
  const line=avail[Math.floor(Math.random()*avail.length)];
  DRILL_COLOR=line.color;
  // Set board orientation based on which side we're drilling
  FLIPPED=line.color==='black';
  document.getElementById('colorbtn').textContent=line.color==='white'?'White':'Black';
  fullReset();
  setStat('Drilling: '+line.label,'info');
  playUntilUserTurn(line.sans,0,line.color==='white'?'w':'b');
}

function playUntilUserTurn(sanArr,idx,userTurn){
  const{turn}=parseFen(FEN);
  if(turn===userTurn){setStat('Your turn — find the next move.','info');return;}
  if(idx>=sanArr.length){setStat('Your turn — find the next move.','info');return;}
  const san=sanArr[idx];
  const uci=san2uci(FEN,san);
  if(!uci){setStat('Your turn — find the next move.','info');return;}
  const nextFen=applyUci(FEN,uci);
  setTimeout(()=>{
    setLastMove(san);
    FEN=nextFen;HIST.push(nextFen);SANS.push(san);
    refreshPanel();drawBoard();drawMoveList();
    playUntilUserTurn(sanArr,idx+1,userTurn);
  },idx===0?220:430);
}

// ─── QUIZ ─────────────────────────────────────────────────────────────────────
// Quiz picks a random annotated position and shows it on the board
// The board does NOT flip — it stays in the current orientation
function startQuiz(){
  // Pick positions that have a name (annotated) and are not the start position
  const positions=Object.entries(DB).filter(([fen,n])=>n.name&&fen!==INIT&&Object.keys(n.moves).length>0);
  if(!positions.length){setStat('No quiz positions loaded.','bad');return;}
  const[fen,node]=positions[Math.floor(Math.random()*positions.length)];

  // Update board to show the quiz position — NEVER change FLIPPED here
  FEN=fen;HIST=[fen];SANS=[];SEL=null;LDOTS=[];LF=null;LT=null;

  const{turn}=parseFen(fen);
  // Keep the user's chosen board orientation

  drawBoard();
  drawMoveList();

  // Update opening info
  document.getElementById('opname').textContent=node.name||'';
  document.getElementById('opeco').textContent=node.eco||'';
  document.getElementById('prog').style.width='0%';
  document.getElementById('note').innerHTML='<em>What is the best move for '+(turn==='w'?'White':'Black')+'?</em>';

  const correct=Object.keys(node.moves)[0];

  // Generate distractors
  const allSans=new Set();
  Object.values(DB).forEach(n=>Object.keys(n.moves).forEach(s=>allSans.add(s)));
  const distractors=[...allSans].filter(s=>s!==correct).sort(()=>Math.random()-.5).slice(0,3);
  const opts=[correct,...distractors].sort(()=>Math.random()-.5);

  document.getElementById('qq').innerHTML=
    '<strong>'+node.name+'</strong>'+(node.eco?' ('+node.eco+')':'')+
    '<br><span style="color:var(--muted)">'+(turn==='w'?'White':'Black')+' to move — choose the best move:</span>';

  const optEl=document.getElementById('qopts');optEl.innerHTML='';
  opts.forEach(opt=>{
    const btn=document.createElement('button');
    btn.className='qopt';btn.textContent=opt;
    btn.onclick=()=>{
      if(btn.dataset.done)return;
      Q_SCORE.t++;
      optEl.querySelectorAll('.qopt').forEach(b=>{b.dataset.done='1';b.style.cursor='default';b.onclick=null;});
      if(opt===correct){btn.classList.add('right');Q_SCORE.c++;setStat('✓ Correct! '+(node.note||''),'ok');}
      else{btn.classList.add('wrong');optEl.querySelectorAll('.qopt').forEach(b=>{if(b.textContent===correct)b.classList.add('right');});setStat('✗ Correct move was '+correct+'.','bad');}
      document.getElementById('qsc').textContent=Q_SCORE.c+' / '+Q_SCORE.t;
      setTimeout(startQuiz,2000);
    };
    optEl.appendChild(btn);
  });
}

// ─── BOT MODE ─────────────────────────────────────────────────────────────────
function initSF(){
  if(SF)return;
  try{
    SF=new Worker('https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js');
    SF.onmessage=e=>{
      if(e.data.startsWith('bestmove')&&SF_CB){
        const bm=e.data.split(' ')[1];
        const cb=SF_CB;SF_CB=null;
        cb(bm&&bm!=='(none)'?bm:null);
      }
    };
    SF.postMessage('uci');SF.postMessage('isready');
  }catch(err){console.warn('SF failed:',err);}
}

function sfBestMove(fen,skill,cb){
  if(!SF){cb(null);return;}
  SF_CB=cb;
  const mt=skill<=2?450:skill<=8?950:1500;
  SF.postMessage('setoption name Skill Level value '+skill);
  SF.postMessage('position fen '+fen);
  SF.postMessage('go movetime '+mt);
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
  BOT_ACTIVE=true;
  BOT_LOG=[];
  BOT_THINKING=false;
  document.getElementById('revcard').classList.add('hidden');
  setStat('You are '+BOT_COLOR+'. Skill: '+BOT_LABEL,'info');
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
  if(!legalMoves(nf).length){endBot();return;}
  setTimeout(botThink,360);
}

function botThink(){
  if(!BOT_ACTIVE)return;
  BOT_THINKING=true;
  setStat(BOT_LABEL+' is thinking…','info');
  sfBestMove(FEN,BOT_SKILL,uci=>{
    BOT_THINKING=false;
    if(!uci||!BOT_ACTIVE){endBot();return;}
    const san=uci2san(FEN,uci);
    LF={r:+uci[1]-1,f:uci.charCodeAt(0)-97};
    LT={r:+uci[3]-1,f:uci.charCodeAt(2)-97};
    const nf=applyUci(FEN,uci);
    BOT_LOG.push({fen:FEN,uci,san,byBot:true});
    FEN=nf;HIST.push(nf);SANS.push(san);
    refreshPanel();drawBoard();drawMoveList();
    if(!legalMoves(nf).length){endBot();return;}
    setStat('Your turn.','info');
  });
}

function endBot(){
  BOT_ACTIVE=false;
  setStat(inCheck(FEN,parseFen(FEN).turn)?'Checkmate!':'Game over! Click Review.','info');
  document.getElementById('revbtn').classList.remove('hidden');
}

function showReview(){
  if(!BOT_LOG.length){setStat('No game to review.','bad');return;}
  document.getElementById('revcard').classList.remove('hidden');
  const el=document.getElementById('revlist');el.innerHTML='';
  BOT_LOG.forEach((e,i)=>{
    const mn=Math.floor(i/2)+1;
    const div=document.createElement('div');div.className='ri';
    const rn=DB[e.fen];
    let c='',cls='rn';
    if(!e.byBot){
      if(rn&&rn.moves[e.san]){c='In repertoire ✓';cls='rg';}
      else if(rn){c='Deviation from repertoire';cls='rb';}
      else{c='Out of book';cls='rn';}
    }else{c='Bot played';}
    div.innerHTML='<span class="rm">'+mn+(e.byBot?'… ':'. ')+e.san+'</span> <span class="'+cls+'">'+c+'</span>';
    el.appendChild(div);
  });
}

// ─── PANEL / STATUS ──────────────────────────────────────────────────────────
function refreshPanel(){
  const node=DB[FEN];
  document.getElementById('opname').textContent=node?.name||'Unknown Position';
  document.getElementById('opeco').textContent=node?.eco||'';
  document.getElementById('note').innerHTML=node?.note||'<em>Position not in repertoire.</em>';
  document.getElementById('prog').style.width=Math.min(100,(SANS.length/12)*100)+'%';
}
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
  if(MODE==='explorer')renderTree();
}

// fullReset resets position but NOT FLIPPED — FLIPPED is only changed by explicit user actions
function fullReset(){
  FEN=INIT;HIST=[INIT];SANS=[];SEL=null;LDOTS=[];LF=null;LT=null;
  BOT_ACTIVE=false;BOT_LOG=[];
  refreshPanel();drawBoard();drawMoveList();
}

function doReset(){
  fullReset();
  if(MODE==='drill') FLIPPED=(DRILL_COLOR==='black');
  drawBoard();
  if(MODE==='drill'&&DRILL_COLOR==='black'){setTimeout(()=>drillAutoReply(),300);}
  if(MODE==='explorer'){renderTree();}
  setStat('Reset.','info');
}

function doHint(){
  if(MODE==='bot'){setStat('No hints in bot mode.','bad');return;}
  const node=DB[FEN];
  if(!node||!Object.keys(node.moves).length){setStat('No moves in repertoire here.','info');return;}
  setStat('💡 Hint: try '+Object.keys(node.moves)[0],'info');
}

function doFlip(){FLIPPED=!FLIPPED;drawBoard();}

function toggleSide(){
  DRILL_COLOR=DRILL_COLOR==='white'?'black':'white';
  FLIPPED=DRILL_COLOR==='black';
  document.getElementById('colorbtn').textContent=DRILL_COLOR==='white'?'White':'Black';
  fullReset();
  if(DRILL_COLOR==='black')setTimeout(()=>drillAutoReply(),350);
  setStat('Playing as '+DRILL_COLOR+'. Make your moves.','info');
}

// ─── MODE SWITCHING ───────────────────────────────────────────────────────────
function setMode(mode){
  MODE=mode;BOT_ACTIVE=false;SEL=null;LDOTS=[];
  // Only reset flip when switching away from bot mode or when going to explorer/quiz
  if(mode==='drill'){FLIPPED=DRILL_COLOR==='black';}
  // explorer and quiz now keep the current orientation
  // bot mode flip is set when starting a game

  document.querySelectorAll('.nb').forEach((b,i)=>b.classList.toggle('on',['drill','explorer','quiz','plans','bot'][i]===mode));

  // card visibility
  show('linecard',mode==='drill');
  show('expcard',mode==='explorer');
  show('quizcard',mode==='quiz');
  show('plancard',mode==='plans');
  show('planinfocard',mode==='plans');
  show('botcard',mode==='bot');
  show('colorbtn',mode==='drill');
  show('randbtn',mode==='drill');
  show('newgamebtn',mode==='bot');
  show('revbtn',false);
  show('hintbtn',mode!=='bot');
  document.getElementById('revcard').classList.add('hidden');

  fullReset();

  if(mode==='drill'){buildLineSelector();setStat('Pick lines → Random Line, or move pieces freely.','info');}
  if(mode==='explorer'){setStat('Click a move below — computer replies automatically.','info');renderTree();}
  if(mode==='quiz'){setStat('','');startQuiz();}
  if(mode==='plans'){setStat('Choose the plan that fits the position — then study the blueprint.','info');startPlanQuiz();}
  if(mode==='bot'){setStat('Set skill & color → New Game.','info');initSF();}
}

function show(id,visible){
  const el=document.getElementById(id);
  if(visible)el.classList.remove('hidden');else el.classList.add('hidden');
}

console.info('ChessTool V2 loaded: modular repertoire + plans architecture');

// ─── INIT ─────────────────────────────────────────────────────────────────────
if(!DB[INIT])DB[INIT]={name:'Starting Position',eco:'',note:'Welcome! Drill your opening repertoire.',moves:{}};
buildLineSelector();
loadProgress();
drawBoard();
refreshPanel();
drawMoveList();
setStat('Pick lines and click Random Line — or move pieces freely.','info');
