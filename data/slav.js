// ════ SLAV DEFENCE (BLACK) ═══════════════════════════════════════════════════
// Your new weapon against 1.d4. The big idea, repeated in every line below:
// develop the c8 bishop to f5 BEFORE playing ...e6. In the Queen's Gambit
// Declined that bishop is stuck behind the pawn chain; the Slav's 1...d5 +
// 2...c6 move order keeps its escape route open. Support d5 with the c-pawn,
// grab ...dxc4 when the timing is right, and then choose between a central
// ...e5 break or rolling the queenside pawn majority.

registerLine(
 ['d4','d5','c4','c6','Nf3','Nf6','Nc3','dxc4','a4','Bf5','e3','e6','Bxc4','Bb4','O-O','O-O'],
 [N,
  A('Slav Defence','D10','<strong>1…d5</strong> — The Slav begins. Next comes 2…c6: support d5 without locking in the c8 bishop.'),
  N,
  A('Slav Defence','D10','<strong>2…c6</strong> — The Slav move. Unlike …e6 (QGD), the bishop on c8 keeps its escape square. If White plays cxd5 now, you recapture …cxd5 into a healthy Carlsbad structure.'),
  N,
  A('Slav Defence','D11','<strong>3…Nf6</strong> — Develop and keep both …dxc4 and …e6 options open. Don\'t grab the pawn before you can hold it.'),
  N,
  A('Slav: 4…dxc4','D15','<strong>4…dxc4</strong> — Take the pawn. Your plan: …Bf5, …e6, …Nbd7, castle, then either …e5 in the center or …b5-b4 on the queenside.'),
  A('Slav: main line','D17','<strong>5.a4</strong> — White\'s main try, stopping …b5. You don\'t need that pawn back — develop and play the position.'),
  A('Slav: main line','D17','<strong>5…Bf5!</strong> — THE point of the Slav. In the QGD this bishop is a tall pawn behind e6; here it develops actively and eyes c2. This one move is why you play this opening.'),
  N,
  A('Slav: main line','D17','<strong>6…e6</strong> — Now lock the chain, since the bishop is already out. Next: …Bb4, …Nbd7, castle.'),
  N,
  A('Slav: main line','D17','<strong>7…Bb4</strong> — Pin and develop with tempo. Watch for Qb3 ideas from White and keep …Nbd7 coming.'),
  N,
  A('Slav: main line','D17','<strong>8…O-O</strong> — King safe, development nearly done. Middlegame plan: …Nbd7, …Re8, then …e5 against a loose center or …b5 queenside play.')]
);

registerLine(
 ['d4','d5','c4','c6','Nf3','Nf6','Nc3','dxc4','e3','Bf5','Bxc4','e6','O-O','Nbd7'],
 [N,
  A('Slav Defence','D10','<strong>1…d5</strong> — Your Slav setup begins.'),
  N,
  A('Slav Defence','D10','<strong>2…c6</strong> — Solid, and the c8 bishop stays mobile.'),
  N,N,N,
  A('Slav: 4…dxc4','D15','<strong>4…dxc4</strong> — Same pawn grab as the main line, but White skipped 5.a4 — so …b5 is suddenly back on the menu!'),
  N,
  A('Slav: 4…dxc4','D15','<strong>5…Bf5</strong> — Develop before …e6, as always. White\'s e3 blocks his own f1 bishop, so holding the pawn is more comfortable here.'),
  N,
  A('Slav: 4…dxc4','D15','<strong>6…e6</strong> — You don\'t have to give the pawn back: 7…b5!? is playable since a4 never came. Even if you return it, …Nbd7 and castling give you a smooth game.'),
  N,
  A('Slav: 4…dxc4','D15','<strong>7…Nbd7</strong> — Head for c5 or e5. Plan: castle, …Rc8/Re8, and push …b5-b4 if White lets you keep the extra pawn.')]
);

registerLine(
 ['d4','d5','c4','c6','Nf3','Nf6','Nc3','e6','e3','Nbd7','Bd3','dxc4','Bxc4','b5','Bd3','Bb7','O-O'],
 [N,
  A('Semi-Slav','D31','<strong>1…d5</strong> — The Semi-Slav: Slav solidity (…c6) plus QGD solidity (…e6). Rock solid — but mind your development, it\'s easy to fall behind.'),
  N,
  A('Semi-Slav','D31','<strong>2…c6</strong> — Same Slav start.'),
  N,N,N,
  A('Semi-Slav','D31','<strong>4…e6</strong> — Now it\'s a Semi-Slav. The c8 bishop is locked in for a while — that\'s the price. In return the center is iron.'),
  N,
  A('Semi-Slav','D31','<strong>5…Nbd7</strong> — The knight belongs on d7 here (…Nc6 would block the c-pawn and invite tactics on d5). Next: …Bd6 or …dxc4.'),
  N,
  A('Semi-Slav','D31','<strong>6…dxc4</strong> — Release the tension and grab the pawn. White\'s Bd3 bites on granite now — and …b5 keeps the pawn.'),
  N,
  A('Semi-Slav','D31','<strong>7…b5</strong> — Hold the pawn and start the queenside majority rolling. Plan: …Bb7, castle, then …a5/…b4 or …c5 at the right moment.'),
  N,
  A('Semi-Slav','D31','<strong>8…Bb7</strong> — The bishop finally breathes on the long diagonal, eyeing e4. Patience pays: your structure is excellent.')]
);

registerLine(
 ['d4','d5','c4','c6','Nf3','Nf6','e3','Bf5','Nc3','e6','Nh4','Bg6','Nxg6','hxg6'],
 [N,
  A('Slav Defence','D10','<strong>1…d5</strong> — Slav setup.'),
  N,
  A('Slav Defence','D10','<strong>2…c6</strong> — The bishop keeps its escape route.'),
  N,N,
  A('Slav: 4.e3 Bf5','D11','<strong>4.e3</strong> — White plays solidly instead of Nc3. Your answer doesn\'t change: get …Bf5 in while you still can.'),
  A('Slav: 4.e3 Bf5','D11','<strong>4…Bf5!</strong> — Even better here: White\'s e3 rules out Nc3-e4 tempo tricks against the bishop. Develop, then …e6/Nbd7.'),
  N,
  A('Slav: 4.e3 Bf5','D11','<strong>5…e6</strong> — Solidify. If White chases the bishop with Nh4, let him — the exchange favors you.'),
  A('Slav: 4.e3 Bf5','D11','<strong>6.Nh4</strong> — White spends a tempo attacking your bishop. Don\'t panic: retreat …Bg6 and the knight on h4 will look misplaced after …Nbd7.'),
  A('Slav: 4.e3 Bf5','D11','<strong>6…Bg6</strong> — Keep the tension. If Nxg6 you get the half-open h-file and keep a rock-solid center — a fine trade.'),
  N,
  A('Slav: 4.e3 Bf5','D11','<strong>7…hxg6</strong> — The rook belongs on h8 with real pressure. Plan: …Nbd7, …Bd6, castle, and use the h-file — White\'s kingside is your long-term target.')]
);

registerLine(
 ['d4','d5','c4','c6','cxd5','cxd5','Nf3','Nf6','Nc3','e6','Bf4','Bd6','Bxd6','Qxd6'],
 [N,
  A('Slav Defence','D10','<strong>1…d5</strong> — Slav setup.'),
  N,
  A('Slav Defence','D10','<strong>2…c6</strong> — Support d5, keep the bishop mobile.'),
  A('Slav: Exchange','D10','<strong>3.cxd5</strong> — The Exchange. White accepts a symmetrical Carlsbad structure. Your job: develop actively and don\'t drift.'),
  A('Slav: Exchange','D10','<strong>3…cxd5</strong> — Recapture toward the center. You know this pawn structure from the Caro-Kann Exchange — same ideas apply.'),
  N,
  A('Slav: Exchange','D10','<strong>4…Nf6</strong> — Develop. Plan: …e6, …Bd6, …O-O, …Nc6. Symmetrical doesn\'t mean dead — keep every piece active.'),
  N,
  A('Slav: Exchange','D10','<strong>5…e6</strong> — Solid. White\'s main idea here is kingside play and central pressure (no c-pawn means no classic minority attack). Meet activity with activity.'),
  N,
  A('Slav: Exchange','D10','<strong>6…Bd6</strong> — Challenge the f4 bishop immediately. Trading it removes White\'s best minor piece and your most common headache in these structures.'),
  N,
  A('Slav: Exchange','D10','<strong>7…Qxd6</strong> — The queen is well placed on d6, eyeing the center. Finish with …O-O, …Nc6, …Bf5/…Bg4. Equal and active.')]
);

registerLine(
 ['d4','d5','c4','c6','Nc3','Nf6','Nf3','dxc4','a4','Bf5'],
 [N,
  A('Slav Defence','D10','<strong>1…d5</strong> — Slav setup.'),
  N,
  A('Slav Defence','D10','<strong>2…c6</strong> — The bishop keeps its escape route.'),
  A('Slav: 3.Nc3','D11','<strong>3.Nc3</strong> — White develops the knight first, keeping options: 4.Nf3 transposes to the main line, while 4.e3 is a quieter sideline. You stay flexible either way.'),
  N,N,
  A('Slav: 3.Nc3','D15','<strong>4…dxc4</strong> — Against 4.Nf3 this is your main-line …dxc4. Against the sideline 4.e3, you have 4…e6 or the sharper 4…Bf5!?, keeping the bishop out before locking the chain.'),
  N,
  A('Slav: 3.Nc3','D17','<strong>5…Bf5</strong> — Same main-line development. From here the plans are identical: …e6, …Nbd7, castle, then …e5 or queenside play. One system, many move orders — that\'s the beauty of the Slav.')]
);


// ─── DRILL LINE DEFINITIONS ──────────────────────────────────────────────────
DLINES.push(
 {id:'slav-main',label:'Slav: main line 4…dxc4',group:'Slav Defence (Black)',color:'black',sans:['d4','d5','c4','c6','Nf3','Nf6','Nc3','dxc4','a4','Bf5','e3','e6','Bxc4','Bb4','O-O','O-O']},
 {id:'slav-alt',label:'Slav: 4…dxc4 without 5.a4',group:'Slav Defence (Black)',color:'black',sans:['d4','d5','c4','c6','Nf3','Nf6','Nc3','dxc4','e3','Bf5','Bxc4','e6','O-O','Nbd7']},
 {id:'slav-semi',label:'Slav: Semi-Slav 4…e6',group:'Slav Defence (Black)',color:'black',sans:['d4','d5','c4','c6','Nf3','Nf6','Nc3','e6','e3','Nbd7','Bd3','dxc4','Bxc4','b5','Bd3','Bb7','O-O']},
 {id:'slav-e3',label:'Slav: 4.e3 Bf5 system',group:'Slav Defence (Black)',color:'black',sans:['d4','d5','c4','c6','Nf3','Nf6','e3','Bf5','Nc3','e6','Nh4','Bg6','Nxg6','hxg6']},
 {id:'slav-ex',label:'Slav: Exchange 3.cxd5',group:'Slav Defence (Black)',color:'black',sans:['d4','d5','c4','c6','cxd5','cxd5','Nf3','Nf6','Nc3','e6','Bf4','Bd6','Bxd6','Qxd6']},
 {id:'slav-nc3',label:'Slav: 3.Nc3 sidelines',group:'Slav Defence (Black)',color:'black',sans:['d4','d5','c4','c6','Nc3','Nf6','Nf3','dxc4','a4','Bf5']}
);
