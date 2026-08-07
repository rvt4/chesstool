// ─── SVG PIECES ──────────────────────────────────────────────────────────────
// White pieces = ivory + dark stroke; Black pieces = dark + gold stroke
const PSV={
  K:`<svg class="psv" viewBox="0 0 45 45"><g fill="#FFFFF0" stroke="#333" stroke-width="1.5" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V17s-5.5-7.5-16-4c-3 6 6 10.5 6 10.5v7"/><path d="M11.5 30c5.5-3 15.5-3 21 0M11.5 33.5c5.5-3 15.5-3 21 0M11.5 37c5.5-3 15.5-3 21 0"/></g></svg>`,
  Q:`<svg class="psv" viewBox="0 0 45 45"><g fill="#FFFFF0" stroke="#333" stroke-width="1.5" stroke-linejoin="round"><circle cx="6" cy="12" r="2.75"/><circle cx="14" cy="9" r="2.75"/><circle cx="22.5" cy="8" r="2.75"/><circle cx="31" cy="9" r="2.75"/><circle cx="39" cy="12" r="2.75"/><path d="M9 26c8.5-8.5 15.5-8.5 27 0l2.5-12.5L31 25l-.3-14.1-8.2 13.4-8.4-13.1L14 25 6.5 13.5z"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c4-1.5 17-1.5 21 0"/></g></svg>`,
  R:`<svg class="psv" viewBox="0 0 45 45"><g fill="#FFFFF0" stroke="#333" stroke-width="1.5" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5h-20zM12 36v-4h21v4H12z"/><path d="M14 29.5v-13h17v13H14z"/><path d="M9 12l3.5 3h20l3.5-3V9H9v3zM9 9h27"/><path d="M11 12v2.5M14 12v2.5M31 12v2.5M34 12v2.5"/></g></svg>`,
  B:`<svg class="psv" viewBox="0 0 45 45"><g fill="#FFFFF0" stroke="#333" stroke-width="1.5" stroke-linejoin="round"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M17.5 26h10M15 30h15"/></g></svg>`,
  N:`<svg class="psv" viewBox="0 0 45 45"><g fill="#FFFFF0" stroke="#333" stroke-width="1.5" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/><path d="M24 18c.38 5.1-5.45 4.9-5 0"/><path d="M9.5 25.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z"/><path d="M9 25.5c0 8.5 13.5 16 22 13.5"/><path d="M8 10s1 5.5 1.5 5.5c0 0 2-4 1-5.5"/><path d="M14.5 13.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" fill="#333" stroke="none"/></g></svg>`,
  P:`<svg class="psv" viewBox="0 0 45 45"><g fill="#FFFFF0" stroke="#333" stroke-width="1.5" stroke-linejoin="round"><path d="M22.5 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M22.5 9c-4 0-7 3-7 7 0 2.96 1.62 5.5 4 6.88V26h6v-3.12c2.38-1.38 4-3.92 4-6.88 0-4-3-7-7-7z"/><path d="M14 29.5v3.5h17v-3.5l-1.5-2.5h-14z"/><path d="M14.5 37h16v-4h-16v4z"/></g></svg>`,
  k:`<svg class="psv" viewBox="0 0 45 45"><g fill="#1a1008" stroke="#D4A853" stroke-width="1.5" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V17s-5.5-7.5-16-4c-3 6 6 10.5 6 10.5v7"/><path d="M11.5 30c5.5-3 15.5-3 21 0M11.5 33.5c5.5-3 15.5-3 21 0M11.5 37c5.5-3 15.5-3 21 0"/></g></svg>`,
  q:`<svg class="psv" viewBox="0 0 45 45"><g fill="#1a1008" stroke="#D4A853" stroke-width="1.5" stroke-linejoin="round"><circle cx="6" cy="12" r="2.75"/><circle cx="14" cy="9" r="2.75"/><circle cx="22.5" cy="8" r="2.75"/><circle cx="31" cy="9" r="2.75"/><circle cx="39" cy="12" r="2.75"/><path d="M9 26c8.5-8.5 15.5-8.5 27 0l2.5-12.5L31 25l-.3-14.1-8.2 13.4-8.4-13.1L14 25 6.5 13.5z"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c4-1.5 17-1.5 21 0"/></g></svg>`,
  r:`<svg class="psv" viewBox="0 0 45 45"><g fill="#1a1008" stroke="#D4A853" stroke-width="1.5" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5h-20zM12 36v-4h21v4H12z"/><path d="M14 29.5v-13h17v13H14z"/><path d="M9 12l3.5 3h20l3.5-3V9H9v3zM9 9h27"/><path d="M11 12v2.5M14 12v2.5M31 12v2.5M34 12v2.5"/></g></svg>`,
  b:`<svg class="psv" viewBox="0 0 45 45"><g fill="#1a1008" stroke="#D4A853" stroke-width="1.5" stroke-linejoin="round"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M17.5 26h10M15 30h15"/></g></svg>`,
  n:`<svg class="psv" viewBox="0 0 45 45"><g fill="#1a1008" stroke="#D4A853" stroke-width="1.5" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/><path d="M24 18c.38 5.1-5.45 4.9-5 0"/><path d="M9.5 25.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z"/><path d="M9 25.5c0 8.5 13.5 16 22 13.5"/><path d="M8 10s1 5.5 1.5 5.5c0 0 2-4 1-5.5"/><path d="M14.5 13.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" fill="#D4A853" stroke="none"/></g></svg>`,
  p:`<svg class="psv" viewBox="0 0 45 45"><g fill="#1a1008" stroke="#D4A853" stroke-width="1.5" stroke-linejoin="round"><path d="M22.5 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M22.5 9c-4 0-7 3-7 7 0 2.96 1.62 5.5 4 6.88V26h6v-3.12c2.38-1.38 4-3.92 4-6.88 0-4-3-7-7-7z"/><path d="M14 29.5v3.5h17v-3.5l-1.5-2.5h-14z"/><path d="M14.5 37h16v-4h-16v4z"/></g></svg>`,
};

// ─── FEN ENGINE ──────────────────────────────────────────────────────────────
function parseFen(fen){
  const p=fen.split(' ');
  const rows=p[0].split('/');
  const bd=[];
  for(let r=0;r<8;r++){const row=[];for(const c of rows[r]){if(isNaN(c))row.push(c);else for(let i=0;i<+c;i++)row.push(null);}bd.push(row);}
  return{bd,turn:p[1],cas:p[2],ep:p[3]||'-',hm:+p[4]||0,fm:+p[5]||1};
}
// bd[7-rank][file] = piece
function GP(bd,r,f){return(r>=0&&r<8&&f>=0&&f<8)?bd[7-r][f]:null;}
function S2A(r,f){return String.fromCharCode(97+f)+(r+1);}
function isW(p){return p&&p===p.toUpperCase();}
function isB(p){return p&&p!==p.toUpperCase();}
function friendly(p,t){return t==='w'?isW(p):isB(p);}
function hostile(p,t){return t==='w'?isB(p):isW(p);}

function applyUci(fen,uci){
  const{bd:b0,turn,cas,ep,hm,fm}=parseFen(fen);
  const b=b0.map(r=>[...r]);
  const ff=uci.charCodeAt(0)-97,fr=+uci[1]-1;
  const tf=uci.charCodeAt(2)-97,tr=+uci[3]-1;
  const promo=uci[4]?(turn==='w'?uci[4].toUpperCase():uci[4].toLowerCase()):null;
  const pc=b[7-fr][ff];
  const cap=b[7-tr][tf];
  b[7-fr][ff]=null;
  b[7-tr][tf]=promo||pc;
  // castling rook
  if(pc==='K'){if(tf===6&&ff===4){b[7][5]=b[7][7];b[7][7]=null;}if(tf===2&&ff===4){b[7][3]=b[7][0];b[7][0]=null;}}
  if(pc==='k'){if(tf===6&&ff===4){b[0][5]=b[0][7];b[0][7]=null;}if(tf===2&&ff===4){b[0][3]=b[0][0];b[0][0]=null;}}
  // en passant
  if(pc&&pc.toUpperCase()==='P'&&ep!=='-'){
    const ef=ep.charCodeAt(0)-97,er=+ep[1]-1;
    if(tf===ef&&tr===er)b[7-(turn==='w'?er-1:er+1)][ef]=null;
  }
  let nc=cas;
  if(pc==='K')nc=nc.replace(/[KQ]/g,'');if(pc==='k')nc=nc.replace(/[kq]/g,'');
  if(fr===0&&ff===0)nc=nc.replace('Q','');if(fr===0&&ff===7)nc=nc.replace('K','');
  if(fr===7&&ff===0)nc=nc.replace('q','');if(fr===7&&ff===7)nc=nc.replace('k','');
  if(!nc)nc='-';
  let nep='-';
  if(pc&&pc.toUpperCase()==='P'&&Math.abs(tr-fr)===2)nep=S2A(Math.floor((fr+tr)/2),ff);
  const nt=turn==='w'?'b':'w';
  const nh=(pc&&pc.toUpperCase()==='P')||cap?0:hm+1;
  const nf=fm+(turn==='b'?1:0);
  let fs='';
  // parseFen stores rows in normal FEN order: index 0 = rank 8, index 7 = rank 1.
  // Serialize in that SAME order. The old code iterated 7 -> 0, which physically
  // inverted the position after every move and broke all repertoire FEN lookups.
  for(let row=0;row<8;row++){
    let e=0;
    for(let f=0;f<8;f++){
      if(b[row][f]){
        if(e){fs+=e;e=0;}
        fs+=b[row][f];
      }else{
        e++;
      }
    }
    if(e)fs+=e;
    if(row<7)fs+='/';
  }
  return`${fs} ${nt} ${nc} ${nep} ${nh} ${nf}`;
}

function attacked(bd,r,f,by){
  const foe=by==='w'?isW:isB;
  for(const[dr,df]of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]){const p=GP(bd,r+dr,f+df);if(p&&foe(p)&&p.toUpperCase()==='N')return true;}
  for(const[dr,df]of[[-1,0],[1,0],[0,-1],[0,1]]){let nr=r+dr,nf=f+df;while(nr>=0&&nr<8&&nf>=0&&nf<8){const p=GP(bd,nr,nf);if(p){if(foe(p)&&(p.toUpperCase()==='R'||p.toUpperCase()==='Q'))return true;break;}nr+=dr;nf+=df;}}
  for(const[dr,df]of[[-1,-1],[-1,1],[1,-1],[1,1]]){let nr=r+dr,nf=f+df;while(nr>=0&&nr<8&&nf>=0&&nf<8){const p=GP(bd,nr,nf);if(p){if(foe(p)&&(p.toUpperCase()==='B'||p.toUpperCase()==='Q'))return true;break;}nr+=dr;nf+=df;}}
  for(const[dr,df]of[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]){const p=GP(bd,r+dr,f+df);if(p&&foe(p)&&p.toUpperCase()==='K')return true;}
  const pd=by==='w'?-1:1;
  for(const df of[-1,1]){const p=GP(bd,r+pd,f+df);if(p&&foe(p)&&p.toUpperCase()==='P')return true;}
  return false;
}

function inCheck(fen,side){
  const{bd}=parseFen(fen);const kp=side==='w'?'K':'k';
  for(let r=0;r<8;r++)for(let f=0;f<8;f++)if(GP(bd,r,f)===kp)return attacked(bd,r,f,side==='w'?'b':'w');
  return false;
}

function legalMoves(fen){
  const{bd,turn,cas,ep}=parseFen(fen);
  const moves=[];
  function tryM(uci){const nf=applyUci(fen,uci);if(!inCheck(nf,turn))moves.push(uci);}
  for(let r=0;r<8;r++)for(let f=0;f<8;f++){
    const p=GP(bd,r,f);if(!p||!friendly(p,turn))continue;
    const pt=p.toUpperCase();
    if(pt==='P'){
      const d=turn==='w'?1:-1,pr=(turn==='w'&&r+d===7)||(turn==='b'&&r+d===0);
      if(!GP(bd,r+d,f)){if(pr)for(const q of['q','r','b','n'])tryM(S2A(r,f)+S2A(r+d,f)+q);else tryM(S2A(r,f)+S2A(r+d,f));
        if(((turn==='w'&&r===1)||(turn==='b'&&r===6))&&!GP(bd,r+d,f)&&!GP(bd,r+2*d,f))tryM(S2A(r,f)+S2A(r+2*d,f));}
      for(const df of[-1,1]){if(f+df<0||f+df>7)continue;const ie=ep!=='-'&&f+df===ep.charCodeAt(0)-97&&r+d===+ep[1]-1;
        if(hostile(GP(bd,r+d,f+df),turn)||ie){if(pr)for(const q of['q','r','b','n'])tryM(S2A(r,f)+S2A(r+d,f+df)+q);else tryM(S2A(r,f)+S2A(r+d,f+df));}}}
    if(pt==='N'){for(const[dr,df]of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]){const nr=r+dr,nf2=f+df;if(nr>=0&&nr<8&&nf2>=0&&nf2<8&&!friendly(GP(bd,nr,nf2),turn))tryM(S2A(r,f)+S2A(nr,nf2));}}
    const slid={B:[[-1,-1],[-1,1],[1,-1],[1,1]],R:[[-1,0],[1,0],[0,-1],[0,1]],Q:[[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]};
    if(slid[pt]){for(const[dr,df]of slid[pt]){let nr=r+dr,nf2=f+df;while(nr>=0&&nr<8&&nf2>=0&&nf2<8){if(friendly(GP(bd,nr,nf2),turn))break;tryM(S2A(r,f)+S2A(nr,nf2));if(hostile(GP(bd,nr,nf2),turn))break;nr+=dr;nf2+=df;}}}
    if(pt==='K'){
      for(const[dr,df]of[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]){const nr=r+dr,nf2=f+df;if(nr>=0&&nr<8&&nf2>=0&&nf2<8&&!friendly(GP(bd,nr,nf2),turn))tryM(S2A(r,f)+S2A(nr,nf2));}
      if(turn==='w'&&r===0&&f===4){if(cas.includes('K')&&!GP(bd,0,5)&&!GP(bd,0,6)&&!attacked(bd,0,4,'b')&&!attacked(bd,0,5,'b')&&!attacked(bd,0,6,'b'))tryM('e1g1');if(cas.includes('Q')&&!GP(bd,0,3)&&!GP(bd,0,2)&&!GP(bd,0,1)&&!attacked(bd,0,4,'b')&&!attacked(bd,0,3,'b')&&!attacked(bd,0,2,'b'))tryM('e1c1');}
      if(turn==='b'&&r===7&&f===4){if(cas.includes('k')&&!GP(bd,7,5)&&!GP(bd,7,6)&&!attacked(bd,7,4,'w')&&!attacked(bd,7,5,'w')&&!attacked(bd,7,6,'w'))tryM('e8g8');if(cas.includes('q')&&!GP(bd,7,3)&&!GP(bd,7,2)&&!GP(bd,7,1)&&!attacked(bd,7,4,'w')&&!attacked(bd,7,3,'w')&&!attacked(bd,7,2,'w'))tryM('e8c8');}
    }
  }
  return moves;
}

function uci2san(fen,uci){
  const{bd,turn,ep}=parseFen(fen);
  const ff=uci.charCodeAt(0)-97,fr=+uci[1]-1,tf=uci.charCodeAt(2)-97,tr=+uci[3]-1;
  const p=GP(bd,fr,ff);if(!p)return uci;
  if(uci==='e1g1'||uci==='e8g8')return'O-O';
  if(uci==='e1c1'||uci==='e8c8')return'O-O-O';
  const pt=p.toUpperCase();
  const isEp=pt==='P'&&ep!=='-'&&S2A(tr,tf)===ep&&ff!==tf&&!GP(bd,tr,tf);
  const cap=(GP(bd,tr,tf)||isEp)?'x':'';
  const dst=S2A(tr,tf),prom=uci[4]?'='+uci[4].toUpperCase():'';
  if(pt==='P')return cap?String.fromCharCode(97+ff)+'x'+dst+prom:dst+prom;

  // SAN must identify the origin when two identical pieces can legally reach
  // the same destination (Nbd7, Nge7, Rfd1, etc.). V1 omitted this, which made
  // valid repertoire lines fail to register.
  const rivals=[];
  for(const other of legalMoves(fen)){
    if(other===uci||other.slice(2,4)!==uci.slice(2,4))continue;
    const of=other.charCodeAt(0)-97,or=+other[1]-1;
    const op=GP(bd,or,of);
    if(op&&op.toUpperCase()===pt)rivals.push({f:of,r:or});
  }
  let dis='';
  if(rivals.length){
    const sameFile=rivals.some(x=>x.f===ff);
    const sameRank=rivals.some(x=>x.r===fr);
    if(!sameFile)dis=String.fromCharCode(97+ff);
    else if(!sameRank)dis=String(fr+1);
    else dis=String.fromCharCode(97+ff)+String(fr+1);
  }
  return pt+dis+cap+dst+prom;
}

// Find the UCI for a given SAN in a position using actual legal moves
function san2uci(fen,san){
  const moves=legalMoves(fen);
  for(const uci of moves){
    const s=uci2san(fen,uci);
    if(s===san||s===san.replace(/[+#]/g,''))return uci;
  }
  return null;
}

// ─── OPENING DATABASE ─────────────────────────────────────────────────────────
// Build the DB by resolving SANs to actual FENs using the chess engine
// This way Bg2, Nf3, etc. ALL work correctly because we verify via legal moves
const INIT='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const DB={};  // FEN -> {name, eco, note, moves:{SAN->nextFEN}}

function addPos(fen,name,eco,note){DB[fen]={name,eco,note,moves:{}};}
function addLine(moves,anns){
  // moves: [{fen,san}] pairs OR just build from start
  // actually takes array of SANs and walks from INIT
  // But some lines need to start mid-position, so we accept {start,sans,anns}
}

// The cleanest approach: define each line as an array of SANs,
// walk from INIT resolving each SAN via the engine, register every position
function registerLine(sanArr, annArr){
  let fen=INIT;
  for(let i=0;i<sanArr.length;i++){
    const san=sanArr[i];
    const uci=san2uci(fen,san);
    if(!uci){console.warn('Cannot resolve',san,'at',fen);break;}
    const nextFen=applyUci(fen,uci);
    if(!DB[fen])DB[fen]={name:'',eco:'',note:'',moves:{}};
    DB[fen].moves[san]=nextFen;
    if(annArr&&annArr[i]){
      const a=annArr[i];
      if(a.name&&!DB[fen].name)DB[fen].name=a.name;
      if(a.eco&&!DB[fen].eco)DB[fen].eco=a.eco;
      if(a.note&&!DB[fen].note)DB[fen].note=a.note;
    }
    fen=nextFen;
  }
}

// Helper: annotation shorthand
const A=(name,eco,note)=>({name,eco,note});
const N=null; // no annotation
