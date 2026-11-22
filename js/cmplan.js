// ════ ROAD TO CM ══════════════════════════════════════════════════════════════
// A phased training plan from ~1500 online rapid to FIDE 2200 (Candidate
// Master). Shown in the My Coach tab. The phase is picked from your latest
// rapid rating (bundled or synced stats) and can be overridden. A weekly
// checklist is stored per ISO week on this device.

const CM_KEY='chesstool_cm_v1';

const CM_PHASES=[
 {id:'p1',name:'Phase 1 · Foundation',lo:0,hi:1700,target:'1700 chess.com rapid',time:'≈ 6–9 months',
  why:'At your level most games are decided by one-move tactics and rushed moves. Remove blunders and slow down before anything else.',
  exit:['1700+ rapid, held for 4 weeks','Average ≥ 15 s per move in 10–15 min games','Mate with K+Q and K+R vs K quickly, and set up Lucena and Philidor from memory','80%+ first-try accuracy on due puzzles in the Puzzles tab'],
  focus:[
   ['Tactics','Forks, pins, skewers, discovered attacks, back-rank and smothered mates. Accuracy over speed: calculate to the end before you move. Before EVERY move in your games: checks, captures and threats — for both sides.'],
   ['Endgames','K+Q vs K and K+R vs K mates · opposition and key squares · rule of the square · Lucena and Philidor positions · outside passed pawn.'],
   ['Strategy','Development, open files, outposts, worst-piece improvement. Learn the PLANS of your openings: Italian d4 break, Caro-Kann …c5 vs the Advance, Slav …e5 / …c5.'],
   ['Openings','Drill your repertoire to move 8–10 in the Train tab, 10 minutes a day. Understand why each move is played (the notes now explain every one of your moves).'],
   ['Playing','15|10 or 30|0 rapid only. Max 3 rated games a day. Stop after 2 losses in a row. Join a local club and play some over-the-board games.']],
  books:['Logical Chess: Move by Move (Chernev)','Silman’s Complete Endgame Course — sections up to your rating class','A tactics workbook built on motifs, e.g. a Steps Method or Chess Tactics for Champions level book']},
 {id:'p2',name:'Phase 2 · Club player',lo:1700,hi:1900,target:'1900 chess.com rapid + a first FIDE rating',time:'≈ 9–12 months',
  why:'Tactics stop being enough. You now win by calculating accurately, knowing your pawn structures, and converting won endgames.',
  exit:['1900+ rapid, held for 4 weeks','A published FIDE rating (needs FIDE-rated over-the-board games)','Repertoire known to move 12 in your main lines','20 of your own games annotated by you before using an engine'],
  focus:[
   ['Calculation','Woodpecker-style cycles: one set of puzzles solved repeatedly, faster each cycle. Solve some from the diagram only, without moving pieces. Count every exchange sequence to the end.'],
   ['Endgames','Rook endgames: active rook, rook behind passed pawns, cutting off the king · good vs bad bishop · knight vs bishop · queen vs pawn on the 7th · triangulation.'],
   ['Strategy','Your structures: IQP (Panov), Carlsbad and minority attack (Caro Exchange), French chain (Advance), Slav …Bf5 structures. Study 3 master games per structure.'],
   ['Openings','Extend main lines to move 12–15. For each line keep 2–3 model games and know the typical middlegame plan.'],
   ['Playing','First over-the-board events (US Chess rated), then FIDE-rated classical events. Aim for about 2 tournaments a quarter. Online: keep 15|10+.']],
  books:['The Woodpecker Method (Smith & Tikkanen)','Chess Structures: A Grandmaster Guide (Rios) — or Pawn Structure Chess (Soltis)','100 Endgames You Must Know (de la Villa)']},
 {id:'p3',name:'Phase 3 · Strong club / Expert',lo:1900,hi:2100,target:'≈ FIDE 2000 (≈ 2100 online rapid)',time:'≈ 12–18 months',
  why:'At this level games are lost to wrong plans, missed prophylaxis and poor conversion — the "thrown wins" your stats already show.',
  exit:['FIDE classical rating around 2000','30+ FIDE classical games in the last 12 months','Convert +3 positions vs the 2000 bot reliably (practise in vs Bot)'],
  focus:[
   ['Calculation','Candidate moves first, then compare. Practise defending bad positions. Positional Masters puzzles in this app — explain the idea before you move.'],
   ['Endgames','Finish 100 Endgames You Must Know. Practical rook endings (4 vs 3 on one side), opposite-coloured bishops, the principle of two weaknesses.'],
   ['Strategy','Prophylaxis ("what does my opponent want?"), converting advantages, exchanging the right pieces. Replay games of a classical positional player.'],
   ['Openings','Close the gaps your tournament games reveal. Prepare against specific opponents when pairings are known.'],
   ['Playing','30+ FIDE classical games a year. Analyse every one deeply, own analysis first. Consider a titled coach (even monthly) from here on.']],
  books:['Simple Chess (Stean) and The Amateur’s Mind (Silman)','My System (Nimzowitsch)','Endgame Strategy (Shereshevsky)']},
 {id:'p4',name:'Phase 4 · Master track',lo:2100,hi:9999,target:'FIDE 2200 → Candidate Master',time:'≈ 12–24 months',
  why:'The last 200 points are about consistency in long games: deep preparation, stamina, and very few unforced errors.',
  exit:['FIDE classical rating 2200 (published or interim) — then apply for the CM title through your federation'],
  focus:[
   ['Calculation','GM-preparation style training: long, hard positions with written solutions, checked afterwards.'],
   ['Endgames','Selected chapters of Dvoretsky’s Endgame Manual with a coach.'],
   ['Strategy','Deep study of your own games with a coach. Model games of strong players in your structures.'],
   ['Openings','A deep, tested repertoire with prepared files. Know your lines’ critical tries in detail.'],
   ['Playing','40+ classical games a year, including open sections with stronger opposition. Sleep, food and clock management are part of the training.']],
  books:['Grandmaster Preparation series (Aagaard): Calculation, Positional Play','Dvoretsky’s Endgame Manual']}
];

// Weekly checklist. `from` = first phase where the task appears.
const CM_TASKS=[
 {id:'tactics',label:'Tactics 20–30 min — calculate fully before moving',target:6,go:'puzzles'},
 {id:'slow',label:'Slow rated game (15|10 or longer) + 10-min self-review before the engine',target:5},
 {id:'openings',label:'Opening drill 10 min (Train tab)',target:4,go:'drill'},
 {id:'endgame',label:'Endgame study 30 min (this phase’s list)',target:2},
 {id:'master',label:'Master game, 45 min — guess the move, in your openings',target:1},
 {id:'mistakes',label:'Review losses / Mistake Drill',target:2,go:'mistakes'},
 {id:'bot',label:'Long game vs the 1800+ bot — resign when lost, then Review',target:1,go:'bot'},
 {id:'calc',label:'3 hard positions solved without moving the pieces',target:3,from:2,go:'positional'},
 {id:'otb',label:'Over-the-board classical game (club or FIDE-rated)',target:1,from:2}
];

const CM_RULES=[
 'Max 3 rated games a day. Stop after 2 losses in a row.',
 'Rapid means rapid: aim for ≥ 15 seconds per move on average.',
 'Before every move: checks, captures, threats — yours AND your opponent’s.',
 'Resign dead-lost positions (about −5, no counterplay) and spend that time reviewing.',
 'Every loss is reviewed within 24 hours: your own analysis first, then the engine.',
 'One repertoire: 1.e4 (Italian / Alapin / French Advance…), Caro-Kann, Slav. No switching for 6 months.'
];

function cmLoad(){try{return JSON.parse(localStorage.getItem(CM_KEY)||'{}')||{};}catch(e){return{};}}
function cmSave(o){try{localStorage.setItem(CM_KEY,JSON.stringify(o));}catch(e){}}
function cmWeekKey(d=new Date()){
  const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));
  const day=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-day);
  const y0=new Date(Date.UTC(t.getUTCFullYear(),0,1));
  return t.getUTCFullYear()+'-W'+String(Math.ceil(((t-y0)/864e5+1)/7)).padStart(2,'0');
}
function cmSnapshot(){
  let data=null;try{data=(typeof statsData==='function')?statsData():null;}catch(e){}
  const games=(data&&data.games)||[];
  const rapid=games.filter(g=>g.c==='rapid'&&g.r);
  const rating=rapid.length?rapid[rapid.length-1].r:null;
  const recent=rapid.slice(-50).filter(g=>typeof g.amt==='number');
  const pace=recent.length?recent.reduce((a,g)=>a+g.amt,0)/recent.length:null;
  let last30=0;
  if(games.length){const lastD=new Date(games[games.length-1].d);const cut=new Date(lastD-30*864e5).toISOString().slice(0,10);last30=games.filter(g=>g.d>=cut).length;}
  return{rating,pace,last30,asOf:games.length?games[games.length-1].d:null};
}
function cmPhaseIndex(st,snap){
  if(st.phase){const i=CM_PHASES.findIndex(p=>p.id===st.phase);if(i>=0)return i;}
  const r=snap.rating||1500;return Math.max(0,CM_PHASES.findIndex(p=>r>=p.lo&&r<p.hi));
}
function cmSetPhase(id){const st=cmLoad();st.phase=id||null;cmSave(st);renderCMPlan();}
function cmBump(id,delta){
  const st=cmLoad(),wk=cmWeekKey();st.weeks=st.weeks||{};st.weeks[wk]=st.weeks[wk]||{};
  st.weeks[wk][id]=Math.max(0,(st.weeks[wk][id]||0)+delta);
  // keep the last 12 weeks only
  const keys=Object.keys(st.weeks).sort();while(keys.length>12)delete st.weeks[keys.shift()];
  cmSave(st);renderCMPlan();
}
function cmGo(where){
  if(where==='positional'){setMode('puzzles');if(typeof setPuzMode==='function')setPuzMode('positional');return;}
  setMode(where);
}
function cmEsc(s){return String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}

function renderCMPlan(){
  const root=document.getElementById('cmbody');if(!root)return;
  const st=cmLoad(),snap=cmSnapshot(),pi=cmPhaseIndex(st,snap),ph=CM_PHASES[pi];
  const wk=cmWeekKey(),done=(st.weeks&&st.weeks[wk])||{};
  const tasks=CM_TASKS.filter(t=>!t.from||pi+1>=t.from);
  const totalT=tasks.reduce((a,t)=>a+t.target,0),totalD=tasks.reduce((a,t)=>a+Math.min(t.target,done[t.id]||0),0);
  const pct=totalT?Math.round(totalD/totalT*100):0;
  const r=snap.rating;
  const base=pi===0?1200:ph.lo,span=Math.min(ph.hi,2300)-base||1;
  const inPhase=r?Math.max(0,Math.min(100,Math.round((r-base)/span*100))):0;
  const paceWarn=snap.pace!=null&&snap.pace<15;

  let h='';
  h+='<div class="coachfocus"><div class="coacheyebrow">THE GOAL</div><h2>Candidate Master = FIDE classical rating 2200</h2>'+
     '<p>No norms needed — reach 2200 once (with enough rated games) and the title can be awarded. But <b>only over-the-board FIDE-rated classical games count</b>; chess.com ratings are just a progress gauge. In the US, FIDE-rated events run through US Chess — look for "FIDE-rated" in the event listing.</p>'+
     '<p>Honest timeline from where you are: several years of steady work at about 8–10 hours a week. Many adults get there; the ones who do train deliberately and play lots of long games. A coach speeds things up a lot from roughly 1800.</p></div>';

  h+='<div class="coachmetrics">'+
     '<div><b>'+(r||'—')+'</b><span>Rapid rating'+(snap.asOf?' ('+snap.asOf+')':'')+'</span></div>'+
     '<div><b'+(paceWarn?' class="cmwarn"':'')+'>'+(snap.pace!=null?snap.pace.toFixed(1)+'s':'—')+'</b><span>Avg per move, last 50 rapid'+(paceWarn?' — too fast':'')+'</span></div>'+
     '<div><b>'+snap.last30+'</b><span>Games in last 30 days'+(snap.last30>90?' — fewer, slower games':'')+'</span></div></div>';

  h+='<div class="coachfocus"><div class="coacheyebrow">YOU ARE IN</div><h3>'+ph.name+' <span class="cmtime">'+ph.time+'</span></h3>'+
     '<p>'+ph.why+'</p><div class="cmbar"><div style="width:'+inPhase+'%"></div></div>'+
     '<p class="cmsmall">Phase target: <b>'+ph.target+'</b>'+(r?' · now '+r:'')+'</p>'+
     '<div class="cmphases">'+CM_PHASES.map((p,i)=>'<button class="mini'+(i===pi?' on':'')+'" onclick="cmSetPhase(\''+p.id+'\')">'+(i+1)+'</button>').join('')+
     '<button class="mini" onclick="cmSetPhase(null)">Auto</button></div></div>';

  h+='<div class="coachfocus"><div class="coacheyebrow">THIS WEEK · '+wk+'</div><h3>'+pct+'% of the weekly plan done</h3><div class="cmbar"><div style="width:'+pct+'%"></div></div>'+
     tasks.map(t=>{const n=done[t.id]||0,ok=n>=t.target;
       return '<div class="cmtask'+(ok?' ok':'')+'"><span class="cmcount">'+n+'/'+t.target+'</span><span class="cmlabel">'+cmEsc(t.label)+'</span>'+
         '<span class="cmbtns">'+(t.go?'<button class="mini" onclick="cmGo(\''+t.go+'\')">Go</button>':'')+
         '<button class="mini" onclick="cmBump(\''+t.id+'\',-1)">−</button><button class="mini" onclick="cmBump(\''+t.id+'\',1)">+</button></span></div>';}).join('')+
     '<p class="cmsmall">Tap + when you finish a session. Resets every Monday.</p></div>';

  h+='<div class="coachfocus"><div class="coacheyebrow">WHAT TO STUDY NOW</div>'+
     ph.focus.map(f=>'<p><b>'+f[0]+'.</b> '+f[1]+'</p>').join('')+
     '<p><b>Reading.</b> '+ph.books.join(' · ')+'</p>'+
     '<p><b>Move on when:</b></p><ul class="cmlist">'+ph.exit.map(x=>'<li>'+x+'</li>').join('')+'</ul></div>';

  h+='<div class="coachfocus"><div class="coacheyebrow">HOUSE RULES</div><ul class="cmlist">'+CM_RULES.map(x=>'<li>'+x+'</li>').join('')+'</ul></div>';

  h+='<details class="cmall"><summary>See all four phases</summary>'+CM_PHASES.map((p,i)=>
     '<div class="cmphase"><b>'+p.name+'</b> — '+p.target+' ('+p.time+')<br><span class="cmsmall">'+p.why+'</span></div>').join('')+'</details>';

  root.innerHTML=h;
}
