// ════ ENGLISH OPENING LINES ══════════════════════════════════════════════════

// Line 1: Botvinnik vs 1...e5, Two Knights
registerLine(
  ['c4','e5','Nc3','Nf6','g3','d5','cxd5','Nxd5','Bg2','Nb6','Nf3','Nc6','O-O','Be7','d3','O-O','Nd5','Nxd5'],
  [A('English Opening','A10','<strong>1.c4</strong> — The English. Control d5 without occupying it. A hypermodern system that leads to rich strategic play.'),
   A('English: King\'s English','A20','<strong>1…e5</strong> — The reversed Sicilian. White has an extra tempo compared to Black in a normal Sicilian.'),
   A('English: King\'s English','A25','<strong>2.Nc3</strong> — Developing toward d5. White plans g3-Bg2 and long-term pressure.'),
   A('English: Two Knights','A22','<strong>2…Nf6</strong> — Symmetrical development. White starts the Botvinnik fianchetto plan.'),
   A('English: Botvinnik','A22','<strong>3.g3</strong> — Beginning the fianchetto. The Bg2 will dominate the long diagonal for the whole game.'),
   A('English: Classical','A22','<strong>3…d5</strong> — Black strikes the center. White trades to create an imbalance.'),
   A('English: Classical Exchange','A22','<strong>4.cxd5</strong> — Opening the c-file and reducing central tension.'),
   A('English: Botvinnik','A22','<strong>4…Nxd5</strong> — Black recaptures. Now <strong>5.Bg2</strong> — the cornerstone move, activating the long diagonal.'),
   A('English: Botvinnik — Bg2','A22','<strong>5.Bg2</strong> — The fianchetto is complete! This bishop eyes d5 and will dominate the game. Black must find active counterplay.'),
   A('English: Botvinnik','A22','<strong>5…Nb6</strong> — The knight retreats safely. White develops with Nf3 and plans O-O, d3, Nd5.'),
   A('English: Botvinnik','A22','<strong>6.Nf3</strong> — Development. White will castle and then manoeuvre Nd5.'),
   N,
   A('English: Botvinnik','A22','<strong>7.O-O</strong> — King to safety. Plan: d3, Nd5 — the dream outpost.'),
   N,
   A('English: Botvinnik','A22','<strong>8.d3</strong> — Solid centre. White prepares Nd5.'),
   N,
   A('English: Botvinnik — Nd5!','A22','<strong>9.Nd5!</strong> — The ideal outpost. Black must exchange, but White recaptures with the e-pawn, creating a strong passed pawn.'),
  ]
);

// Line 2: Botvinnik vs 1...Nc6 (Closed)
registerLine(
  ['c4','e5','Nc3','Nc6','g3','g6','Bg2','Bg7','d3','d6','e4','Nge7','Nge2','O-O','O-O','Be6','Nd5','f5'],
  [N,N,N,
   A('English: Closed','A26','<strong>2…Nc6</strong> — Black heads for a King\'s Indian structure. White mirrors with the Botvinnik setup.'),
   N,
   A('English: Closed','A26','<strong>3…g6</strong> — Double fianchetto battle. Both Bg2 and Bg7 fight for the long diagonal.'),
   N,
   A('English: Closed','A26','<strong>4…Bg7</strong> — Mirror position. White plays d3 for flexibility, then e4 for space.'),
   N,N,
   A('English: Closed — e4','A26','<strong>6.e4!</strong> — Space! White has a strong pawn centre. Plan: Nge2, O-O, Nd5.'),
  ]
);

// Line 3: Symmetrical — Four Knights d4 into Maroczy
registerLine(
  ['c4','c5','Nf3','Nf6','Nc3','Nc6','d4','cxd4','Nxd4','g6','e4','Bg7','Be2','O-O','O-O','d6','Be3','Bd7','Qd2','Nxd4','Bxd4','Bc6','f3','a5','b3'],
  [N,
   A('English: Symmetrical','A30','<strong>1…c5</strong> — Symmetrical. Black mirrors White. The key: White breaks symmetry with d4 at the right moment.'),
   A('English: Symmetrical','A30','<strong>2.Nf3</strong> — Flexible. White prepares d4.'),
   N,
   A('English: Four Knights','A33','<strong>3.Nc3</strong> — Four knights. Now <strong>4.d4!</strong> breaks the symmetry.'),
   N,
   A('English: Four Knights — d4','A33','<strong>4.d4!</strong> — The critical central break! White seizes the initiative.'),
   A('English: Symmetrical Exchange','A33','<strong>4…cxd4 5.Nxd4</strong> — Black trades. White recaptures and plays e4 for the Maroczy Bind.'),
   N,
   A('English: Maroczy Bind','A36','<strong>5…g6</strong> — Black fianchettoes. White plays <strong>6.e4!</strong> to establish the Maroczy Bind.'),
   A('English: Maroczy Bind','A36','<strong>6.e4!</strong> — Pawns on c4 and e4 clamp down on d5. Black has no space. Plan: Be2, O-O, Be3.'),
  ]
);

// Line 4: Symmetrical — Hedgehog
registerLine(
  ['c4','c5','Nf3','e6','Nc3','a6','g3','b5','cxb5','axb5','Bg2','Bb7','O-O','Nf6','b3','d6','Bb2','Nbd7','d4','cxd4','Nxd4','Qb6'],
  [N,N,N,
   A('English: Hedgehog','A30','<strong>2…e6</strong> — Black prepares the Hedgehog: a6, b5, d6, Bb7. A coiled spring waiting to strike.'),
   N,
   A('English: Hedgehog','A30','<strong>3…a6</strong> — Preparing b5 to break the c4 grip. The Hedgehog is resilient and explosive.'),
  ]
);

// Line 5: Anglo-Grünfeld
registerLine(
  ['c4','Nf6','Nc3','d5','cxd5','Nxd5','g3','g6','Bg2','Bg7','Nf3','O-O','O-O','Nc6','Nxd5','Qxd5','d3','Qd6','Be3','Rd8','Qa4','a6','Rfd1'],
  [N,
   A('English vs 1…Nf6','A15','<strong>1…Nf6</strong> — Flexible. White heads for the Anglo-Grünfeld with cxd5 Nxd5 g3.'),
   A('English: Anglo-Indian','A16','<strong>2.Nc3</strong> — Developing toward d5. After d5 cxd5 Nxd5 g3 we reach the Anglo-Grünfeld.'),
   A('English: Anglo-Grünfeld','A16','<strong>2…d5</strong> — Central challenge. White trades and builds the fianchetto with an extra tempo.'),
   A('English: Anglo-Grünfeld','A16','<strong>3.cxd5 Nxd5</strong> — White trades, then g3 begins the fianchetto.'),
   N,
   A('English: Anglo-Grünfeld','A16','<strong>4.g3</strong> — Fianchetto. White will castle and then challenge with e4.'),
   N,
   A('English: Anglo-Grünfeld','A16','<strong>5.Bg2</strong> — The bishop eyes the long diagonal. Both sides castle and a balanced fight begins.'),
  ]
);

// Line 6: Anglo-Indian / King's Indian English
registerLine(
  ['c4','Nf6','Nc3','g6','g3','Bg7','Bg2','O-O','Nf3','d6','O-O','Nc6','d4','Nxd4','Nxd4'],
  [N,N,N,
   A('English: King\'s Indian setup','A15','<strong>2…g6</strong> — Black heads for a King\'s Indian structure. White uses d4 to get an IQP position.'),
  ]
);

// ════ CARO-KANN LINES ════════════════════════════════════════════════════════

// Line 7: Classical — Karpov Variation (B19) full line
registerLine(
  ['e4','c6','d4','d5','Nc3','dxe4','Nxe4','Bf5','Ng3','Bg6','h4','h6','Nf3','Nd7','h5','Bh7','Bd3','Bxd3','Qxd3','e6','Bd2','Ngf6','O-O-O','Be7','Ne4','Nxe4','Qxe4','Nf6','Qh4','O-O','Ne5','Nd7','Nxd7','Qxd7','Qe4'],
  [N,
   A('Caro-Kann Defence','B10','<strong>1…c6</strong> — The Caro-Kann! Prepares d5 with pawn support. The c8 bishop stays free — unlike the French.'),
   A('Caro-Kann: Main Line','B12','<strong>2.d4</strong> — White builds the centre. We challenge immediately with 2…d5.'),
   N,
   A('Caro-Kann: Classical','B18','<strong>3.Nc3</strong> — Classical Variation. We trade with 3…dxe4 to free the position.'),
   N,
   A('Caro-Kann: Classical Bf5!','B18','<strong>4…Bf5!</strong> — The key move! Bishop escapes BEFORE e6. This is the whole point of the Caro-Kann.'),
   N,
   A('Caro-Kann: Classical','B18','<strong>5.Ng3 Bg6</strong> — White chases the bishop; we retreat to g6, still active.'),
   N,
   A('Caro-Kann: Spassky Var','B18','<strong>6.h4</strong> — Threatening h5. We play <strong>6…h6</strong> to stop it.'),
   A('Caro-Kann: Classical','B18','<strong>6…h6</strong> — Stopping h5. Our bishop on g6 is safe. Continue with Nd7, Ngf6.'),
   A('Caro-Kann: Classical','B19','<strong>7.Nf3 Nd7</strong> — Karpov Variation! Preparing Ngf6 without allowing Nxf6+.'),
   A('Caro-Kann: Karpov','B19','<strong>7…Nd7</strong> — Rock solid. Plan: Ngf6, e6, Be7, castle kingside.'),
   A('Caro-Kann: Karpov','B19','<strong>8.h5 Bh7</strong> — White pushes; we retreat the bishop safely.'),
   A('Caro-Kann: Karpov','B19','<strong>8…Bh7</strong> — Bishop retreats. White plays Bd3 to exchange it.'),
   A('Caro-Kann: Karpov','B19','<strong>9.Bd3 Bxd3</strong> — We exchange, removing White\'s good bishop.'),
   N,
   A('Caro-Kann: Karpov','B19','<strong>10.e6</strong> — Solid. The d5-e6-c6 pawn chain is extremely sturdy. White castles queenside.'),
  ]
);

// Line 8: Classical — early Nf3 by White
registerLine(
  ['e4','c6','d4','d5','Nc3','dxe4','Nxe4','Bf5','Nf3','Nd7','Ng3','Bg6','h4','h6','Bd3','Bxd3','Qxd3','e6','Bd2','Ngf6','O-O-O','Be7','Kb1'],
  [N,N,N,N,N,N,
   A('Caro-Kann: Classical alt','B18','<strong>5.Nf3</strong> — White develops differently. We continue with Nd7, Ng3, and reach a similar structure to B19.'),
  ]
);

// Line 9: Advance — Short system
registerLine(
  ['e4','c6','d4','d5','e5','Bf5','Nf3','e6','Be2','Nd7','O-O','Ne7','Nbd2','h6','Nb3','g5','Nfd2','Bg6','c3','c5','dxc5'],
  [N,N,N,N,
   A('Caro-Kann: Advance','B12','<strong>3.e5</strong> — Advance Variation. White grabs space. Our plan: <strong>3…Bf5!</strong> then e6 and c5.'),
   A('Caro-Kann: Advance Bf5','B12','<strong>3…Bf5!</strong> — Critical! The bishop escapes before e6. This is the whole point — we avoid the bad bishop problem.'),
   A('Caro-Kann: Advance Short','B12','<strong>4.Nf3</strong> — Short System. We play 4…e6 to support d5 and prepare c5.'),
   A('Caro-Kann: Advance','B12','<strong>4…e6</strong> — Solid pawn chain c6-d5-e6. We attack with c5 soon.'),
   N,
   A('Caro-Kann: Advance','B12','<strong>5…Nd7</strong> — The knight heads for e7-f5 to attack the e5 pawn.'),
   N,
   A('Caro-Kann: Advance','B12','<strong>6…Ne7!</strong> — From e7, the knight goes to f5 attacking e5, or to g6. Very flexible.'),
  ]
);

// Line 10: Advance — Tal variation (h4 system)
registerLine(
  ['e4','c6','d4','d5','e5','Bf5','h4','h5','Bd3','Bxd3','Qxd3','e6','Bg5','Qb6','Nd2','Qa6','Qf3','c5','Ne2','Nc6','c3'],
  [N,N,N,N,N,N,
   A('Caro-Kann: Advance Tal','B12','<strong>4.h4!</strong> — Tal\'s aggressive approach. We play 4…h5 to stabilise.'),
   A('Caro-Kann: Advance Tal','B12','<strong>4…h5!</strong> — Stopping h5. If White plays Bd3 we exchange favourably.'),
  ]
);

// Line 11: Panov-Botvinnik Attack
registerLine(
  ['e4','c6','d4','d5','exd5','cxd5','c4','Nf6','Nc3','e6','Nf3','Bb4','Bd3','dxc4','Bxc4','O-O','O-O','Nc6','a3','Ba5','Bg5'],
  [N,N,N,N,
   A('Caro-Kann: Exchange','B13','<strong>3.exd5 cxd5</strong> — Exchange. We recapture with the c-pawn, then White plays c4 for the Panov.'),
   N,
   A('Caro-Kann: Panov Attack','B13','<strong>4.c4!</strong> — Panov-Botvinnik! IQP positions. We play Nf6 and aim for active piece play.'),
   A('Caro-Kann: Panov','B14','<strong>4…Nf6</strong> — Developing and pressuring c4.'),
   N,
   A('Caro-Kann: Panov','B14','<strong>5…e6</strong> — Solid. We prepare Be7 and castle. The IQP gives White activity; we have structure.'),
   A('Caro-Kann: Panov Nimzo','B14','<strong>6…Bb4!</strong> — Nimzo-style! Pinning c3, getting active piece play.'),
  ]
);

// Line 12: Exchange — no Panov
registerLine(
  ['e4','c6','d4','d5','exd5','cxd5','Bd3','Nc6','c3','Qc7','Ne2','Bg4','f3','Bd7','O-O','e6','Nd2','Nf6'],
  [N,N,N,N,
   A('Caro-Kann: Exchange','B13','<strong>3.exd5 cxd5</strong> — Exchange Variation. White plays Bd3 instead of c4, heading for a symmetrical position.'),
  ]
);

// Line 13: Two Knights Bg4
registerLine(
  ['e4','c6','Nc3','d5','Nf3','Bg4','h3','Bxf3','Qxf3','e6','d4','Nf6','Bd3','Bb4','O-O','O-O','a3','Bxc3','bxc3','Nbd7','Re1','c5'],
  [N,N,
   A('Caro-Kann: Two Knights','B10','<strong>2.Nc3</strong> — Two Knights. We play d5 then Bg4, pinning the f3 knight.'),
   A('Caro-Kann: Two Knights','B11','<strong>2…d5</strong> — Central challenge. Then 3…Bg4 — active piece play.'),
   N,
   A('Caro-Kann: Two Knights Bg4','B11','<strong>3…Bg4!</strong> — The pin! White must deal with this. If h3 we exchange and damage White\'s structure.'),
  ]
);


// ════ V2 ENGLISH SIDELINES ═══════════════════════════════════════════════════
// The repertoire intentionally funnels unusual replies into familiar structures.
registerLine(
  ['c4','e6','Nc3','d5','d4','Nf6','Nf3','Be7','Bg5','O-O','e3','Nbd7','Rc1','c6','Bd3','dxc4','Bxc4'],
  [N,
   A('English vs ...e6','A13','<strong>1…e6</strong> — Black is inviting a Queen’s Gambit structure. We keep English move-order flexibility, then occupy the center with d4 when useful.'),
   A('English vs ...e6','A13','<strong>2.Nc3</strong> — Develop first. If Black follows with ...d5, d4 gives us a familiar QGD-style position with the c-pawn already active.'),
   N,
   A('English → QGD structure','D30','<strong>3.d4</strong> — Transposition is a feature, not a problem. Develop naturally, pressure c- and d-files, and watch the central pawn tension.')]
);

registerLine(
  ['c4','c6','Nf3','d5','g3','Nf6','Bg2','g6','O-O','Bg7','d4','O-O','Nc3','dxc4','a4','Na6','e4'],
  [N,
   A('English vs ...c6','A11','<strong>1…c6</strong> — Black prepares ...d5. We fianchetto and meet the center with d4, keeping the position strategically familiar.'),
   A('English vs ...c6','A11','<strong>2.Nf3</strong> — Flexible development. The g2 bishop will pressure the center after ...d5.'),
   N,
   A('English vs ...c6','A11','<strong>3.g3</strong> — Fianchetto first; then Bg2, O-O and d4. Avoid wasting tempi trying to punish a perfectly sound setup.'),
   N,
   A('English vs ...c6','A11','<strong>4.Bg2</strong> — The long diagonal gives us natural pressure on d5 and b7.')]
);

registerLine(
  ['c4','f5','Nc3','Nf6','g3','g6','Bg2','Bg7','d3','O-O','e4','d6','Nge2','e5','O-O','Nc6'],
  [N,
   A('English vs Dutch setup','A10','<strong>1…f5</strong> — Treat this as a reversed Dutch. Build with Nc3, g3, Bg2 and challenge the dark squares with e4.'),
   A('English vs Dutch setup','A10','<strong>2.Nc3</strong> — Pressure e4/d5 and prepare the fianchetto.'),
   N,
   A('English vs Dutch setup','A10','<strong>3.g3</strong> — The bishop belongs on g2, where Black’s weakened dark squares can matter later.'),
   N,
   A('English vs Dutch setup','A10','<strong>4.Bg2</strong> — Finish development before opening the center. The thematic break is e4.')]
);

registerLine(
  ['c4','b6','Nc3','Bb7','e4','e6','Nf3','Bb4','d3','f5','exf5','exf5','Be2','Nf6','O-O','O-O'],
  [N,
   A('English vs ...b6','A10','<strong>1…b6</strong> — Black aims at e4 with ...Bb7. We can take central space with e4 and develop normally.'),
   A('English vs ...b6','A10','<strong>2.Nc3</strong> — Support e4 and d5 while Black spends a tempo on the queenside fianchetto.'),
   N,
   A('English vs ...b6','A10','<strong>3.e4</strong> — Claim the center. The key is to develop quickly so the broad center stays an asset.')]
);

// ════ V2 CARO-KANN SIDELINES ═════════════════════════════════════════════════
registerLine(
  ['e4','c6','d4','d5','f3','dxe4','fxe4','e5','Nf3','exd4','Bc4','Nf6','O-O','Be7','e5','Nd5'],
  [N,N,N,N,
   A('Caro-Kann: Fantasy','B15','<strong>3.f3</strong> — The Fantasy Variation builds an aggressive center. We strike immediately with ...dxe4 rather than letting White roll forward.'),
   A('Caro-Kann: Fantasy','B15','<strong>3…dxe4!</strong> — Challenge the center. After fxe4, ...e5 attacks it again and accelerates development.'),
   N,
   A('Caro-Kann: Fantasy','B15','<strong>4…e5!</strong> — A second central hit. The goal is activity, not passive Caro-Kann shell play.')]
);

registerLine(
  ['e4','c6','Bc4','d5','exd5','cxd5','Bb5+','Nc6','d4','Nf6','Nf3','Bf5','O-O','e6'],
  [N,N,
   A('Caro-Kann: Hillbilly','B10','<strong>2.Bc4</strong> — An early bishop sortie. Don’t overreact: play ...d5 and gain central space with tempo.'),
   A('Caro-Kann: Hillbilly','B10','<strong>2…d5!</strong> — The principled answer. Challenge e4 immediately and develop behind the center.'),
   N,N,
   A('Caro-Kann: Hillbilly','B10','<strong>4.Bb5+</strong> — Meet the check calmly with ...Nc6. Black gets normal development and a healthy center.')]
);

registerLine(
  ['e4','c6','d3','d5','Nd2','e5','Ngf3','Bd6','g3','Nf6','Bg2','O-O','O-O','Re8'],
  [N,N,
   A('Caro-Kann: Quiet 2.d3','B10','<strong>2.d3</strong> — White avoids the main center. Take space with ...d5 and ...e5 rather than playing passively.'),
   A('Caro-Kann: Quiet 2.d3','B10','<strong>2…d5</strong> — Establish the center. Against quiet systems, development and space are more important than memorization.'),
   N,
   A('Caro-Kann: Quiet 2.d3','B10','<strong>3…e5</strong> — Claim more space because White has not challenged the center.')]
);


// ─── DRILL LINE DEFINITIONS ──────────────────────────────────────────────────
const DLINES=[
  {id:'e-bot',  label:'English: Botvinnik vs 1…e5',     group:'English (White)', color:'white', sans:['c4','e5','Nc3','Nf6','g3','d5','cxd5','Nxd5','Bg2','Nb6','Nf3']},
  {id:'e-cls2', label:'English: Botvinnik vs 1…Nc6',    group:'English (White)', color:'white', sans:['c4','e5','Nc3','Nc6','g3','g6','Bg2','Bg7','d3','d6','e4']},
  {id:'e-sym',  label:'English: Symmetrical / Maroczy', group:'English (White)', color:'white', sans:['c4','c5','Nf3','Nf6','Nc3','Nc6','d4','cxd4','Nxd4','g6','e4']},
  {id:'e-hedge',label:'English: Hedgehog',               group:'English (White)', color:'white', sans:['c4','c5','Nf3','e6','Nc3','a6','g3','b5','cxb5','axb5','Bg2']},
  {id:'e-grun', label:'English: Anglo-Grünfeld',         group:'English (White)', color:'white', sans:['c4','Nf6','Nc3','d5','cxd5','Nxd5','g3','g6','Bg2','Bg7','Nf3']},
  {id:'ck-cls', label:'Caro-Kann: Classical Karpov',     group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d4','d5','Nc3','dxe4','Nxe4','Bf5','Ng3','Bg6','h4','h6','Nf3','Nd7']},
  {id:'ck-adv', label:'Caro-Kann: Advance (Short)',      group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d4','d5','e5','Bf5','Nf3','e6','Be2','Nd7','O-O','Ne7']},
  {id:'ck-tal', label:'Caro-Kann: Advance (Tal h4)',     group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d4','d5','e5','Bf5','h4','h5','Bd3','Bxd3','Qxd3']},
  {id:'ck-panov',label:'Caro-Kann: Panov Attack',        group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d4','d5','exd5','cxd5','c4','Nf6','Nc3','e6','Nf3','Bb4']},
  {id:'ck-2k',  label:'Caro-Kann: Two Knights Bg4',      group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','Nc3','d5','Nf3','Bg4','h3','Bxf3','Qxf3']},
  {id:'e-e6',   label:'English: vs ...e6 / QGD setup',    group:'English (White)', color:'white', sans:['c4','e6','Nc3','d5','d4','Nf6','Nf3','Be7','Bg5']},
  {id:'e-c6',   label:'English: vs ...c6',                group:'English (White)', color:'white', sans:['c4','c6','Nf3','d5','g3','Nf6','Bg2','g6','O-O']},
  {id:'e-dutch',label:'English: vs ...f5 Dutch setup',     group:'English (White)', color:'white', sans:['c4','f5','Nc3','Nf6','g3','g6','Bg2','Bg7','d3','O-O','e4']},
  {id:'e-b6',   label:'English: vs ...b6',                 group:'English (White)', color:'white', sans:['c4','b6','Nc3','Bb7','e4','e6','Nf3']},
  {id:'ck-ex',  label:'Caro-Kann: Exchange',               group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d4','d5','exd5','cxd5','Bd3','Nc6','c3','Qc7']},
  {id:'ck-fan', label:'Caro-Kann: Fantasy',                group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d4','d5','f3','dxe4','fxe4','e5']},
  {id:'ck-hill',label:'Caro-Kann: Hillbilly',              group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','Bc4','d5','exd5','cxd5','Bb5+','Nc6']},
  {id:'ck-d3',  label:'Caro-Kann: Quiet 2.d3',             group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d3','d5','Nd2','e5']},
];
