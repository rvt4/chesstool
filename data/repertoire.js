// ════ 1.e4 WHITE REPERTOIRE ═══════════════════════════════════════════════════
// Primary system: Italian Game. The supporting repertoire keeps the same
// philosophy against Black's other first moves: occupy the center, develop,
// castle, then play forcing/active chess rather than drifting.

registerLine(
 ['e4','e5','Nf3','Nc6','Bc4','Bc5','d3','Nf6','O-O','d6','c3','O-O','Re1','a6','Bb3','Ba7','Nbd2','Re8','Nf1','h6','Ng3'],
 [A('King Pawn Opening','C20','<strong>1.e4</strong> — Take central space immediately. Your default White repertoire now aims for open lines, quick development, and concrete decisions.'),
  A('Open Game','C20','<strong>1…e5</strong> — Develop with tempo: Nf3 attacks e5 and prepares the Italian.'),
  A('Open Game','C40','<strong>2.Nf3</strong> — Develop and attack e5. Avoid early queen moves; make Black solve real development problems.'),
  N,A('Italian Game','C50','<strong>3.Bc4</strong> — The Italian. Pressure f7, castle quickly, then choose the right central break.'),
  A('Italian Game: Giuoco Piano','C50','<strong>3…Bc5</strong> — Main line. Use d3/c3/O-O/Re1 and prepare d4 when it is tactically sound.'),
  A('Italian Game','C50','<strong>4.d3</strong> — Keep e4 solid and develop before opening the center.'),N,
  A('Italian Game','C50','<strong>5.O-O</strong> — King safe first. Your next setup is c3, Re1, Nbd2-f1-g3.'),N,
  A('Italian Game','C50','<strong>6.c3</strong> — Supports d4 and gives the bishop c2 if Black attacks it.'),N,
  A('Italian Game','C50','<strong>7.Re1</strong> — Reinforce e4 and make d4 more realistic.'),N,
  A('Italian Game','C50','<strong>8.Bb3</strong> — Preserve the bishop and keep pressure on f7.'),N,
  A('Italian Game','C50','<strong>9.Nbd2</strong> — Begin the classic Nf1-g3 maneuver. Improve the worst piece before attacking.'),N,
  A('Italian Game','C50','<strong>10.Nf1</strong> — Route to g3, where the knight supports f5/h5 and central play.'),N,
  A('Italian Game','C50','<strong>11.Ng3</strong> — Development is complete; now calculate d4, h3, or a4 based on Black’s setup.')]
);
registerLine(
 ['e4','e5','Nf3','Nc6','Bc4','Nf6','d3','Bc5','O-O','d6','c3','O-O','Re1','a6','Bb3','Ba7','Nbd2','Re8','Nf1'],
 [N,N,N,N,N,A('Italian: Two Knights','C55','<strong>3…Nf6</strong> — Stay in Italian territory with 4.d3. No need to enter a memorization-heavy Ng5 fight.'),
  A('Italian: Two Knights','C55','<strong>4.d3</strong> — Solid center, fast castling, then c3/Re1 and a timed d4.'),N,N,N,
  A('Italian: Two Knights','C55','<strong>6.c3</strong> — Prepare d4 while keeping the center stable.'),N,
  A('Italian: Two Knights','C55','<strong>7.Re1</strong> — Finish the setup before looking for tactics.')]
);
registerLine(
 ['e4','e5','Nf3','Nc6','Bc4','Be7','d3','Nf6','O-O','O-O','Re1','d6','c3','Na5','Bb5','c6','Ba4'],
 [N,N,N,N,N,A('Italian: Hungarian Defence','C50','<strong>3…Be7</strong> — Black is passive. Don’t force anything: develop, castle, and claim space.'),
  A('Italian: Hungarian Defence','C50','<strong>4.d3</strong> — Keep the center healthy and prepare c3/d4.'),N,N,N,
  A('Italian: Hungarian Defence','C50','<strong>6.Re1</strong> — Support e4 and prepare expansion.'),N,
  A('Italian: Hungarian Defence','C50','<strong>7.c3</strong> — d4 is the strategic goal once your pieces are ready.')]
);
registerLine(
 ['e4','e5','Nf3','d6','d4','exd4','Nxd4','Nf6','Nc3','Be7','Be2','O-O','O-O','Re8','Re1','Bf8','Bf1'],
 [N,N,N,A('Philidor Defence','C41','<strong>2…d6</strong> — Black gives you room. Play d4 and use your lead in space.'),
  A('Philidor Defence','C41','<strong>3.d4</strong> — Challenge the center immediately.'),N,
  A('Philidor Defence','C41','<strong>4.Nxd4</strong> — Recapture with development and keep active pieces.'),N,
  A('Philidor Defence','C41','<strong>5.Nc3</strong> — Simple development; castle and use the extra space.')]
);
registerLine(
 ['e4','c5','c3','Nf6','e5','Nd5','d4','cxd4','Nf3','Nc6','cxd4','d6','Bc4','dxe5','dxe5','e6','O-O'],
 [N,A('Sicilian Defence','B20','<strong>1…c5</strong> — Use the Alapin. You get an immediate center and positions that reward calculation more than Sicilian theory memorization.'),
  A('Sicilian: Alapin','B22','<strong>2.c3</strong> — Prepare d4 and build a broad center.'),N,
  A('Sicilian: Alapin','B22','<strong>3.e5</strong> — Gain space and kick the f6 knight.'),N,
  A('Sicilian: Alapin','B22','<strong>4.d4</strong> — Establish the center before finishing development.'),N,
  A('Sicilian: Alapin','B22','<strong>5.Nf3</strong> — Develop while supporting d4/e5.')]
);
registerLine(
 ['e4','c5','c3','d5','exd5','Qxd5','d4','Nf6','Nf3','e6','Be2','Be7','O-O','O-O'],
 [N,N,N,A('Sicilian: Alapin — ...d5','B22','<strong>2…d5</strong> — Black challenges immediately. Exchange once, then build with d4/Nf3.'),
  A('Sicilian: Alapin','B22','<strong>3.exd5</strong> — Clarify the center and gain tempi against the queen.'),N,
  A('Sicilian: Alapin','B22','<strong>4.d4</strong> — Occupy the center and develop naturally.')]
);
registerLine(
 ['e4','e6','d4','d5','e5','c5','c3','Nc6','Nf3','Qb6','Bd3','cxd4','cxd4','Bd7','O-O','Nxd4','Nxd4','Qxd4','Nc3'],
 [N,A('French Defence','C00','<strong>1…e6</strong> — Choose the Advance: grab space and learn to defend the d4/e5 pawn chain.'),
  A('French Defence','C00','<strong>2.d4</strong> — Build the classical center.'),N,
  A('French: Advance','C02','<strong>3.e5</strong> — Space. Your strategic job is to support d4 and attack the kingside when Black’s counterplay is contained.'),N,
  A('French: Advance','C02','<strong>4.c3</strong> — Reinforce d4 before developing.'),N,
  A('French: Advance','C02','<strong>5.Nf3</strong> — Develop and prepare Bd3/O-O.'),N,
  A('French: Advance','C02','<strong>6.Bd3</strong> — Active development. If Black grabs d4 later, use development tempi rather than panicking about a pawn.')]
);
registerLine(
 ['e4','c6','d4','d5','e5','Bf5','Nf3','e6','Be2','c5','O-O','Nc6','Be3','cxd4','Nxd4','Nxd4','Bxd4'],
 [N,A('Caro-Kann Defence','B10','<strong>1…c6</strong> — As White, use the Advance. You already understand the Caro structures from the Black side.'),
  A('Caro-Kann','B12','<strong>2.d4</strong> — Take the center.'),N,
  A('Caro-Kann: Advance','B12','<strong>3.e5</strong> — Gain space and make Black prove the c8 bishop can justify the tempo.'),N,
  A('Caro-Kann: Advance','B12','<strong>4.Nf3</strong> — Simple development; Be2/O-O follows.'),N,
  A('Caro-Kann: Advance','B12','<strong>5.Be2</strong> — Keep the position sound and prepare to castle.')]
);
registerLine(
 ['e4','d5','exd5','Qxd5','Nc3','Qd8','d4','Nf6','Nf3','c6','Bc4','Bf5','O-O','e6','Re1'],
 [N,A('Scandinavian Defence','B01','<strong>1…d5</strong> — Take the pawn and develop with tempo against the queen.'),
  A('Scandinavian Defence','B01','<strong>2.exd5</strong> — The cleanest response.'),N,
  A('Scandinavian Defence','B01','<strong>3.Nc3</strong> — Develop while attacking the queen.'),N,
  A('Scandinavian Defence','B01','<strong>4.d4</strong> — Claim the center while Black has spent queen tempi.')]
);
registerLine(
 ['e4','d6','d4','Nf6','Nc3','g6','f4','Bg7','Nf3','O-O','Bd3','Nc6','O-O','e5','dxe5','dxe5','fxe5'],
 [N,A('Pirc Defence','B07','<strong>1…d6</strong> — Build the Austrian center: d4, Nc3, f4. Make Black’s hypermodern setup prove itself.'),
  A('Pirc Defence','B07','<strong>2.d4</strong> — Take central space.'),N,
  A('Pirc Defence','B07','<strong>3.Nc3</strong> — Support e4 and prepare f4.'),N,
  A('Pirc: Austrian Attack','B09','<strong>4.f4</strong> — The thematic aggressive setup. Develop before launching e5/f5.')]
);
registerLine(
 ['e4','g6','d4','Bg7','Nc3','d6','f4','Nf6','Nf3','O-O','Bd3','Na6','O-O','c5','d5'],
 [N,A('Modern Defence','B06','<strong>1…g6</strong> — Treat it like a Pirc: occupy the center and use the Austrian setup.'),
  A('Modern Defence','B06','<strong>2.d4</strong> — Build the center.'),N,
  A('Modern Defence','B06','<strong>3.Nc3</strong> — Support e4 and prepare f4.'),N,
  A('Modern Defence','B06','<strong>4.f4</strong> — Space first; then Nf3/Bd3/O-O and a well-timed e5.')]
);
registerLine(
 ['e4','Nf6','e5','Nd5','d4','d6','Nf3','dxe5','Nxe5','c6','Be2','Bf5','O-O','e6','c4'],
 [N,A('Alekhine Defence','B02','<strong>1…Nf6</strong> — Gain space with e5, but don’t chase the knight forever.'),
  A('Alekhine Defence','B02','<strong>2.e5</strong> — Take space and make the knight move.'),N,
  A('Alekhine Defence','B03','<strong>3.d4</strong> — Build a real center, then develop it instead of adding more pawn moves.')]
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
 {id:'it-main',label:'Italian: Giuoco Piano main line',group:'1.e4 / Italian (White)',color:'white',sans:['e4','e5','Nf3','Nc6','Bc4','Bc5','d3','Nf6','O-O','d6','c3','O-O','Re1','a6','Bb3','Ba7','Nbd2','Re8','Nf1','h6','Ng3']},
 {id:'it-2n',label:'Italian: Two Knights · quiet d3',group:'1.e4 / Italian (White)',color:'white',sans:['e4','e5','Nf3','Nc6','Bc4','Nf6','d3','Bc5','O-O','d6','c3','O-O','Re1','a6','Bb3','Ba7','Nbd2','Re8','Nf1']},
 {id:'it-hung',label:'Italian: vs ...Be7 Hungarian',group:'1.e4 / Italian (White)',color:'white',sans:['e4','e5','Nf3','Nc6','Bc4','Be7','d3','Nf6','O-O','O-O','Re1','d6','c3','Na5','Bb5','c6','Ba4']},
 {id:'e4-phil',label:'1.e4: Philidor',group:'1.e4 Other Defences (White)',color:'white',sans:['e4','e5','Nf3','d6','d4','exd4','Nxd4','Nf6','Nc3','Be7','Be2','O-O','O-O','Re8','Re1','Bf8','Bf1']},
 {id:'e4-sic-nf6',label:'Sicilian: Alapin vs ...Nf6',group:'1.e4 Other Defences (White)',color:'white',sans:['e4','c5','c3','Nf6','e5','Nd5','d4','cxd4','Nf3','Nc6','cxd4','d6','Bc4','dxe5','dxe5','e6','O-O']},
 {id:'e4-sic-d5',label:'Sicilian: Alapin vs ...d5',group:'1.e4 Other Defences (White)',color:'white',sans:['e4','c5','c3','d5','exd5','Qxd5','d4','Nf6','Nf3','e6','Be2','Be7','O-O','O-O']},
 {id:'e4-fr',label:'French: Advance',group:'1.e4 Other Defences (White)',color:'white',sans:['e4','e6','d4','d5','e5','c5','c3','Nc6','Nf3','Qb6','Bd3','cxd4','cxd4','Bd7','O-O','Nxd4','Nxd4','Qxd4','Nc3']},
 {id:'e4-ck',label:'Caro-Kann: Advance as White',group:'1.e4 Other Defences (White)',color:'white',sans:['e4','c6','d4','d5','e5','Bf5','Nf3','e6','Be2','c5','O-O','Nc6','Be3','cxd4','Nxd4','Nxd4','Bxd4']},
 {id:'e4-scandi',label:'Scandinavian: main setup',group:'1.e4 Other Defences (White)',color:'white',sans:['e4','d5','exd5','Qxd5','Nc3','Qd8','d4','Nf6','Nf3','c6','Bc4','Bf5','O-O','e6','Re1']},
 {id:'e4-pirc',label:'Pirc: Austrian setup',group:'1.e4 Other Defences (White)',color:'white',sans:['e4','d6','d4','Nf6','Nc3','g6','f4','Bg7','Nf3','O-O','Bd3','Nc6','O-O','e5','dxe5','dxe5','fxe5']},
 {id:'e4-modern',label:'Modern: Austrian setup',group:'1.e4 Other Defences (White)',color:'white',sans:['e4','g6','d4','Bg7','Nc3','d6','f4','Nf6','Nf3','O-O','Bd3','Na6','O-O','c5','d5']},
 {id:'e4-alekh',label:'Alekhine: Classical center',group:'1.e4 Other Defences (White)',color:'white',sans:['e4','Nf6','e5','Nd5','d4','d6','Nf3','dxe5','Nxe5','c6','Be2','Bf5','O-O','e6','c4']},
  {id:'ck-cls', label:'Caro-Kann: Classical Karpov',          group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d4','d5','Nc3','dxe4','Nxe4','Bf5','Ng3','Bg6','h4','h6','Nf3','Nd7','h5','Bh7','Bd3','Bxd3','Qxd3','e6','Bd2','Ngf6','O-O-O','Be7','Ne4','Nxe4','Qxe4','Nf6','Qh4','O-O','Ne5','Nd7','Nxd7','Qxd7','Qe4']},
  {id:'ck-cls2',label:'Caro-Kann: Classical early Nf3',       group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d4','d5','Nc3','dxe4','Nxe4','Bf5','Nf3','Nd7','Ng3','Bg6','h4','h6','Bd3','Bxd3','Qxd3','e6','Bd2','Ngf6','O-O-O','Be7','Kb1']},
  {id:'ck-adv', label:'Caro-Kann: Advance (Short)',           group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d4','d5','e5','Bf5','Nf3','e6','Be2','Nd7','O-O','Ne7','Nbd2','h6','Nb3','g5','Nfd2','Bg6','c3','c5','dxc5']},
  {id:'ck-tal', label:'Caro-Kann: Advance (Tal h4)',          group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d4','d5','e5','Bf5','h4','h5','Bd3','Bxd3','Qxd3','e6','Bg5','Qb6','Nd2','Qa6','Qf3','c5','Ne2','Nc6','c3']},
  {id:'ck-panov',label:'Caro-Kann: Panov Attack',             group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d4','d5','exd5','cxd5','c4','Nf6','Nc3','e6','Nf3','Bb4','Bd3','dxc4','Bxc4','O-O','O-O','Nc6','a3','Ba5','Bg5']},
  {id:'ck-ex',  label:'Caro-Kann: Exchange',                  group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d4','d5','exd5','cxd5','Bd3','Nc6','c3','Qc7','Ne2','Bg4','f3','Bd7','O-O','e6','Nd2','Nf6']},
  {id:'ck-2k',  label:'Caro-Kann: Two Knights Bg4',           group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','Nc3','d5','Nf3','Bg4','h3','Bxf3','Qxf3','e6','d4','Nf6','Bd3','Bb4','O-O','O-O','a3','Bxc3','bxc3','Nbd7','Re1','c5']},
  {id:'ck-fan', label:'Caro-Kann: Fantasy',                   group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d4','d5','f3','dxe4','fxe4','e5','Nf3','exd4','Bc4','Nf6','O-O','Be7','e5','Nd5']},
  {id:'ck-hill',label:'Caro-Kann: Hillbilly',                 group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','Bc4','d5','exd5','cxd5','Bb5+','Nc6','d4','Nf6','Nf3','Bf5','O-O','e6']},
  {id:'ck-d3',  label:'Caro-Kann: Quiet 2.d3',                group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d3','d5','Nd2','e5','Ngf3','Bd6','g3','Nf6','Bg2','O-O','O-O','Re8']},
  {id:'ck-ex-nf3',label:'Caro-Kann: Exchange — Nf3/Bd3 setup', group:'Caro-Kann (Black)', color:'black',
   sans:['e4','c6','d4','d5','exd5','cxd5','Nf3','Nc6','Bd3','Bg4','c3','e6','Bf4','Bd6','Bxd6','Qxd6','Nbd2','Nge7','O-O','O-O']},
  {id:'ck-adv-nc3',label:'Caro-Kann: Advance — 4.Nc3 / g4', group:'Caro-Kann (Black)', color:'black',
   sans:['e4','c6','d4','d5','e5','Bf5','Nc3','e6','g4','Bg6','Nge2','c5','h4','h5','Nf4','Bh7','g5','cxd4','Qxd4','Ne7']},
];
