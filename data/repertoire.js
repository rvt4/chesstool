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
  A('Italian Game','C50','<strong>11.Ng3</strong> — Development is complete; now calculate d4, h3, or a4 based on Black’s setup.')],'white');
registerLine(
 ['e4','e5','Nf3','Nc6','Bc4','Nf6','d3','Bc5','O-O','d6','c3','O-O','Re1','a6','Bb3','Ba7','Nbd2','Re8','Nf1'],
 [N,N,N,N,N,A('Italian: Two Knights','C55','<strong>3…Nf6</strong> — Stay in Italian territory with 4.d3. No need to enter a memorization-heavy Ng5 fight.'),
  A('Italian: Two Knights','C55','<strong>4.d3</strong> — Solid center, fast castling, then c3/Re1 and a timed d4.'),N,N,N,
  A('Italian: Two Knights','C55','<strong>6.c3</strong> — Prepare d4 while keeping the center stable.'),N,
  A('Italian: Two Knights','C55','<strong>7.Re1</strong> — Finish the setup before looking for tactics.')],'white');
registerLine(
 ['e4','e5','Nf3','Nc6','Bc4','Be7','d3','Nf6','O-O','O-O','Re1','d6','c3','Na5','Bb5','c6','Ba4'],
 [N,N,N,N,N,A('Italian: Hungarian Defence','C50','<strong>3…Be7</strong> — Black is passive. Don’t force anything: develop, castle, and claim space.'),
  A('Italian: Hungarian Defence','C50','<strong>4.d3</strong> — Keep the center healthy and prepare c3/d4.'),N,N,N,
  A('Italian: Hungarian Defence','C50','<strong>6.Re1</strong> — Support e4 and prepare expansion.'),N,
  A('Italian: Hungarian Defence','C50','<strong>7.c3</strong> — d4 is the strategic goal once your pieces are ready.')],'white');
registerLine(
 ['e4','e5','Nf3','d6','d4','exd4','Nxd4','Nf6','Nc3','Be7','Be2','O-O','O-O','Re8','Re1','Bf8','Bf1'],
 [N,N,N,A('Philidor Defence','C41','<strong>2…d6</strong> — Black gives you room. Play d4 and use your lead in space.'),
  A('Philidor Defence','C41','<strong>3.d4</strong> — Challenge the center immediately.'),N,
  A('Philidor Defence','C41','<strong>4.Nxd4</strong> — Recapture with development and keep active pieces.'),N,
  A('Philidor Defence','C41','<strong>5.Nc3</strong> — Simple development; castle and use the extra space.')],'white');
registerLine(
 ['e4','c5','c3','Nf6','e5','Nd5','d4','cxd4','Nf3','Nc6','cxd4','d6','Bc4','dxe5','dxe5','e6','O-O'],
 [N,A('Sicilian Defence','B20','<strong>1…c5</strong> — Use the Alapin. You get an immediate center and positions that reward calculation more than Sicilian theory memorization.'),
  A('Sicilian: Alapin','B22','<strong>2.c3</strong> — Prepare d4 and build a broad center.'),N,
  A('Sicilian: Alapin','B22','<strong>3.e5</strong> — Gain space and kick the f6 knight.'),N,
  A('Sicilian: Alapin','B22','<strong>4.d4</strong> — Establish the center before finishing development.'),N,
  A('Sicilian: Alapin','B22','<strong>5.Nf3</strong> — Develop while supporting d4/e5.')],'white');
registerLine(
 ['e4','c5','c3','d5','exd5','Qxd5','d4','Nf6','Nf3','e6','Be2','Be7','O-O','O-O'],
 [N,N,N,A('Sicilian: Alapin — ...d5','B22','<strong>2…d5</strong> — Black challenges immediately. Exchange once, then build with d4/Nf3.'),
  A('Sicilian: Alapin','B22','<strong>3.exd5</strong> — Clarify the center and gain tempi against the queen.'),N,
  A('Sicilian: Alapin','B22','<strong>4.d4</strong> — Occupy the center and develop naturally.')],'white');
registerLine(
 ['e4','e6','d4','d5','e5','c5','c3','Nc6','Nf3','Qb6','Bd3','cxd4','cxd4','Bd7','O-O','Nxd4','Nxd4','Qxd4','Nc3'],
 [N,A('French Defence','C00','<strong>1…e6</strong> — Choose the Advance: grab space and learn to defend the d4/e5 pawn chain.'),
  A('French Defence','C00','<strong>2.d4</strong> — Build the classical center.'),N,
  A('French: Advance','C02','<strong>3.e5</strong> — Space. Your strategic job is to support d4 and attack the kingside when Black’s counterplay is contained.'),N,
  A('French: Advance','C02','<strong>4.c3</strong> — Reinforce d4 before developing.'),N,
  A('French: Advance','C02','<strong>5.Nf3</strong> — Develop and prepare Bd3/O-O.'),N,
  A('French: Advance','C02','<strong>6.Bd3</strong> — Active development. If Black grabs d4 later, use development tempi rather than panicking about a pawn.')],'white');
registerLine(
 ['e4','c6','d4','d5','e5','Bf5','Nf3','e6','Be2','c5','O-O','Nc6','Be3','cxd4','Nxd4','Nxd4','Bxd4'],
 [N,A('Caro-Kann Defence','B10','<strong>1…c6</strong> — As White, use the Advance. You already understand the Caro structures from the Black side.'),
  A('Caro-Kann','B12','<strong>2.d4</strong> — Take the center.'),N,
  A('Caro-Kann: Advance','B12','<strong>3.e5</strong> — Gain space and make Black prove the c8 bishop can justify the tempo.'),N,
  A('Caro-Kann: Advance','B12','<strong>4.Nf3</strong> — Simple development; Be2/O-O follows.'),N,
  A('Caro-Kann: Advance','B12','<strong>5.Be2</strong> — Keep the position sound and prepare to castle.')],'white');
registerLine(
 ['e4','d5','exd5','Qxd5','Nc3','Qd8','d4','Nf6','Nf3','c6','Bc4','Bf5','O-O','e6','Re1'],
 [N,A('Scandinavian Defence','B01','<strong>1…d5</strong> — Take the pawn and develop with tempo against the queen.'),
  A('Scandinavian Defence','B01','<strong>2.exd5</strong> — The cleanest response.'),N,
  A('Scandinavian Defence','B01','<strong>3.Nc3</strong> — Develop while attacking the queen.'),N,
  A('Scandinavian Defence','B01','<strong>4.d4</strong> — Claim the center while Black has spent queen tempi.')],'white');
regLine('white','Pirc: Austrian Attack','B09',[
 'e4',['d6','The Pirc. Build the Austrian center: d4, Nc3, f4. Make Black’s hypermodern setup prove itself.','Pirc Defence','B07'],
 ['d4','Take central space.','Pirc Defence','B07'],'Nf6',
 ['Nc3','Support e4 and prepare f4.','Pirc Defence','B07'],'g6',
 ['f4','The thematic aggressive setup. Develop before launching e5 or f5.'],'Bg7',
 ['Nf3','Develop and add control of e5.'],'O-O',
 ['Bd3','Guard e4 and aim at the black king.'],'Nc6',
 ['O-O','Castle first. Black is about to hit the center with …e5.'],
 ['e5','The principled break, using the c6 knight.'],
 ['fxe5','Take with the f-pawn: it opens the f-file for your rook (8.dxe5?! just releases the tension).'],'dxe5',
 ['d5','Gain space with tempo on the c6 knight.'],'Nd4',
 ['Nxd4','Remove the strong knight.'],'exd4',
 ['Ne2','Attack the d4 pawn again. Plan: Ng3, Bg5/Kh1, and a kingside attack down the f-file. The d5 pawn cramps Black.']
]);
registerLine(
 ['e4','g6','d4','Bg7','Nc3','d6','f4','Nf6','Nf3','O-O','Bd3','Na6','O-O','c5','d5'],
 [N,A('Modern Defence','B06','<strong>1…g6</strong> — Treat it like a Pirc: occupy the center and use the Austrian setup.'),
  A('Modern Defence','B06','<strong>2.d4</strong> — Build the center.'),N,
  A('Modern Defence','B06','<strong>3.Nc3</strong> — Support e4 and prepare f4.'),N,
  A('Modern Defence','B06','<strong>4.f4</strong> — Space first; then Nf3/Bd3/O-O and a well-timed e5.')],'white');
registerLine(
 ['e4','Nf6','e5','Nd5','d4','d6','Nf3','dxe5','Nxe5','c6','Be2','Bf5','O-O','e6','c4'],
 [N,A('Alekhine Defence','B02','<strong>1…Nf6</strong> — Gain space with e5, but don’t chase the knight forever.'),
  A('Alekhine Defence','B02','<strong>2.e5</strong> — Take space and make the knight move.'),N,
  A('Alekhine Defence','B03','<strong>3.d4</strong> — Build a real center, then develop it instead of adding more pawn moves.')],'white');

// ════ CARO-KANN LINES ════════════════════════════════════════════════════════

// Line 7: Classical — Karpov Variation (B19)
regLine('black','Caro-Kann: Classical','B18',[
 'e4',['c6','The Caro-Kann! Prepare …d5 with pawn support. Unlike the French, the c8 bishop stays free.','Caro-Kann Defence','B10'],
 ['d4','White builds the centre. Challenge it immediately with 2…d5.','Caro-Kann: Main Line','B12'],['d5','Hit e4. White must defend, exchange, or advance.','Caro-Kann: Main Line','B12'],
 ['Nc3','Classical Variation. Trade with 3…dxe4 to free your game.'],['dxe4','Release the tension; the knight on e4 becomes a target for …Bf5.'],
 ['Nxe4','White recaptures. Now the key move.'],['Bf5','The point of the Caro-Kann: the bishop gets out BEFORE …e6 locks it in.'],
 ['Ng3','White chases the bishop with tempo.'],['Bg6','Retreat to g6 — still on the good diagonal.'],
 ['h4','White threatens h5, kicking the bishop and grabbing kingside space.'],['h6','Stop h5-h6 ideas and keep h7 as the bishop’s home if h5 comes.'],
 ['Nf3','Natural development.','Caro-Kann: Classical','B19'],['Nd7','Prepare …Ngf6 (so Ne4xf6+ can be met by …Nxf6) and stop Ne5.','Caro-Kann: Karpov','B19'],
 ['h5','White gains kingside space.','Caro-Kann: Classical','B19'],['Bh7','The bishop tucks in. White will trade it with Bd3.','Caro-Kann: Classical','B19'],
 ['Bd3','Offer the trade.','Caro-Kann: Classical','B19'],['Bxd3','Take — White recaptures with the queen.','Caro-Kann: Classical','B19'],
 'Qxd3',['e6','Now lock in the c6-d5-e6 chain; your bishop is already traded off.','Caro-Kann: Classical','B19'],
 'Bd2',['Ngf6','Develop. Next …Be7 and castle short.','Caro-Kann: Classical','B19'],
 ['O-O-O','White castles long and will throw the kingside pawns.','Caro-Kann: Classical','B19'],['Be7','Calm development; your king goes short.','Caro-Kann: Classical','B19'],
 ['Ne4','White offers a knight trade to clear the e-file.','Caro-Kann: Classical','B19'],['Nxe4','Trade one pair of minor pieces — every trade reduces White’s attacking force.','Caro-Kann: Classical','B19'],
 'Qxe4',['Nf6','Bring the other knight to f6 with tempo on the queen.','Caro-Kann: Classical','B19'],
 ['Qe2','The queen steps back, keeping an eye on e5 and the kingside.','Caro-Kann: Classical','B19'],
 ['Qd5','Centralise and offer …Qe4: a queen trade kills White’s attack, and the endgame is comfortable for you. (Careful with …O-O and …Nd7 lines: if White’s queen sits on h4, …Nd7 uncovers Be7 against it — always check that tactic, for both sides.)','Caro-Kann: Classical','B19']
]);

// Line 8: Classical — early Nf3 by White
regLine('black','Caro-Kann: Classical','B18',[
 'e4','c6','d4','d5','Nc3','dxe4','Nxe4','Bf5',
 ['Nf3','White develops before chasing the bishop.'],['Nd7','Same plan as the main line: stop Ne5 and prepare …Ngf6.'],
 ['Ng3','Now the chase begins.'],['Bg6','Same retreat.'],
 ['h4','h5 is threatened again.'],['h6','Make room on h7.'],
 ['Bd3','White trades before pushing h5.'],['Bxd3','Accept the trade.'],
 'Qxd3',['e6','Chain locked, bishop already out of the box.'],
 'Bd2',['Ngf6','Develop and prepare to castle.'],
 'O-O-O',['Be7','Same setup as the main line: …O-O, then …c5 or …Qc7 and …Rd8.'],
 ['Kb1','A useful king move. Your plan: …O-O, …c5 to challenge d4, and …Qa5/…Qb6 against the white king.']
]);

// Line 9: Advance — Short system
regLine('black','Caro-Kann: Advance','B12',[
 'e4','c6','d4','d5',
 ['e5','Advance Variation. White grabs space. Your plan: 3…Bf5, then …e6 and …c5.'],['Bf5','Critical: the bishop escapes before …e6, so you never get the "bad bishop".'],
 ['Nf3','Short System: quiet development.'],['e6','Solid chain c6-d5-e6. …c5 is coming.'],
 'Be2',['Nd7','The d7 knight already hits e5 and supports …c5; it can also go b6 later.'],
 'O-O',['Ne7','The other knight heads for f5 (hitting d4) or g6 (hitting e5). Flexible.'],
 'Nbd2',['h6','Give the bishop h7 and prepare …g5 to gain kingside space.'],
 'Nb3',['g5','Space grab: it stops Bf4 and supports …Ng6/…Bg7 ideas. Only good because White’s pieces are not aimed at your king.'],
 'Nfd2',['Bg6','Keep the bishop on the b1-h7 diagonal.'],
 'c3',['c5','The thematic break — hit the base of White’s chain.'],
 ['dxc5','White releases. Recapture with the knight (…Nxc5) and your pieces are active.']
]);

// Line 10: Advance — Tal variation (h4)
regLine('black','Caro-Kann: Advance Tal','B12',[
 'e4','c6','d4','d5','e5','Bf5',
 ['h4','Tal’s aggressive approach: h5 would trap your bishop.'],['h5','Stop h5 for good. The g5 square is weak, but your bishop is safe.'],
 ['Bd3','White offers the bishop trade.'],['Bxd3','Take it: you were going to be chased anyway.'],
 'Qxd3',['e6','Normal chain. Your light squares are fine without the bishop because the pawns sit on light squares.'],
 ['Bg5','White uses the hole on g5.'],['Qb6','Hit b2 and d4 at once.'],
 ['Nd2','White ignores b2 to develop.'],['Qa6','Offer the queen trade on a6: if White avoids it, your queen guards f1 and makes kingside castling awkward.'],
 ['Qf3','White keeps queens on.'],['c5','Hit the chain — your standard Advance break.'],
 'Ne2',['Nc6','Pile up on d4. Plan: …cxd4, …Nge7-f5, and the queen on a6 keeps White’s king in the centre.'],
 'c3'
]);

// Line 11: Panov-Botvinnik Attack
regLine('black','Caro-Kann: Panov','B14',[
 'e4','c6','d4','d5',
 ['exd5','Exchange. Recapture with the c-pawn.','Caro-Kann: Exchange','B13'],['cxd5','Symmetrical centre for now. Now 4.c4 is the Panov; 4.Bd3 is the quiet Exchange.','Caro-Kann: Exchange','B13'],
 ['c4','Panov-Botvinnik: White is heading for an isolated d-pawn (IQP).','Caro-Kann: Panov Attack','B13'],['Nf6','Develop and pressure d5/c4.'],
 'Nc3',['e6','Solid: support d5 and free the f8 bishop.'],
 'Nf3',['Bb4','Nimzo-Indian style: pin c3 and increase pressure on d5 and e4.'],
 'Bd3',['dxc4','Release when White’s bishop has moved twice: White gets the IQP, you get the blockade square d5.'],
 'Bxc4',['O-O','King safe first.'],
 'O-O',['Nc6','Pressure the isolated d4 pawn.'],
 ['a3','White asks the bishop.'],['Be7','Drop back — keep the bishop pair option and stay solid. (…Bxc3 bxc3 is fine too but gives White a strong centre.)'],
 ['Re1','IQP plan: rooks to e1/d1, Bd3 and Qd3/Ne5 for a kingside attack. Your plan: …b6, …Bb7, …Rc8, trade minor pieces and blockade d5 — every trade makes the d4 pawn weaker.']
]);

// Line 12: Exchange — Bd3/c3 (no Panov)
regLine('black','Caro-Kann: Exchange','B13',[
 'e4','c6','d4','d5','exd5','cxd5',
 ['Bd3','Quiet Exchange: White aims for a comfortable, slightly better structure.'],['Nc6','Develop and hit d4.'],
 'c3',['Qc7','Stop Bf4 — White’s best way to develop that bishop.'],
 'Ne2',['Bg4','Pin/annoy: White has to spend a move on f3.'],
 ['f3','Weakens e3 and the a7-g1 diagonal.'],['Bd7','The bishop has done its job (f3 is played); it retreats to a safe square.'],
 'O-O',['e6','Solid chain.'],
 'Nd2',['Nf6','Normal development. Plan: …Bd6, …O-O, then a minority attack with …b5-b4 against c3.']
]);

// Line 13: Two Knights — 6.d4
regLine('black','Caro-Kann: Two Knights','B11',[
 'e4','c6',
 ['Nc3','Two Knights. Play …d5 and then …Bg4 against Nf3.','Caro-Kann: Two Knights','B10'],['d5','Central challenge, as always.'],
 ['Nf3','The Two Knights proper.'],['Bg4','Pin the knight. If h3, take on f3: you give the bishop pair but get a rock-solid light-square setup and fast development.'],
 'h3',['Bxf3','Take — 4…Bh5 allows g4/Ne5 tricks.'],
 'Qxf3',['e6','Pawns on light squares to compensate for the missing bishop.'],
 ['d4','White takes the centre.'],['Nf6','Develop and keep the tension.'],
 'Bd3',['Bb4','Pin the c3 knight; e4 is under real pressure.'],
 'O-O','O-O',
 ['a3','White kicks the bishop.'],['Bxc3','Give the bishop for the knight: White gets doubled c-pawns.'],
 'bxc3',['Nbd7','Develop; next …c5 or …dxe4 to target the c-pawns.'],
 'Re1',['c5','Strike d4. Your long-term target is White’s weak queenside pawns.']
]);

// Line 13b: Two Knights — 6.d3 (more common at club level)
regLine('black','Caro-Kann: Two Knights','B11',[
 'e4','c6','Nc3','d5','Nf3','Bg4','h3','Bxf3','Qxf3','e6',
 ['d3','The quiet main line: White keeps the bishop pair and plays slowly.'],['Nf6','Develop.'],
 ['a3','Prevents …Bb4.'],['Bc5','The bishop takes the active a7-g1 diagonal instead.'],
 ['g3','White fianchettoes.'],['O-O','King safe.'],
 'Bg2',['Nbd7','Plan: …d4 to gain space and cramp the c3 knight, or …Re8/…e5. Keep pawns on light squares.'],
 'O-O'
]);


// ════ V2 ENGLISH SIDELINES ═══════════════════════════════════════════════════
// The repertoire intentionally funnels unusual replies into familiar structures.
registerLine(
  ['c4','e6','Nc3','d5','d4','Nf6','Nf3','Be7','Bg5','O-O','e3','Nbd7','Rc1','c6','Bd3','dxc4','Bxc4'],
  [N,
   A('English vs ...e6','A13','<strong>1…e6</strong> — Black is inviting a Queen’s Gambit structure. We keep English move-order flexibility, then occupy the center with d4 when useful.'),
   A('English vs ...e6','A13','<strong>2.Nc3</strong> — Develop first. If Black follows with ...d5, d4 gives us a familiar QGD-style position with the c-pawn already active.'),
   N,
   A('English → QGD structure','D30','<strong>3.d4</strong> — Transposition is a feature, not a problem. Develop naturally, pressure c- and d-files, and watch the central pawn tension.')],'white');

registerLine(
  ['c4','c6','Nf3','d5','g3','Nf6','Bg2','g6','O-O','Bg7','d4','O-O','Nc3','dxc4','a4','Na6','e4'],
  [N,
   A('English vs ...c6','A11','<strong>1…c6</strong> — Black prepares ...d5. We fianchetto and meet the center with d4, keeping the position strategically familiar.'),
   A('English vs ...c6','A11','<strong>2.Nf3</strong> — Flexible development. The g2 bishop will pressure the center after ...d5.'),
   N,
   A('English vs ...c6','A11','<strong>3.g3</strong> — Fianchetto first; then Bg2, O-O and d4. Avoid wasting tempi trying to punish a perfectly sound setup.'),
   N,
   A('English vs ...c6','A11','<strong>4.Bg2</strong> — The long diagonal gives us natural pressure on d5 and b7.')],'white');

registerLine(
  ['c4','f5','Nc3','Nf6','g3','g6','Bg2','Bg7','d3','O-O','e4','d6','Nge2','e5','O-O','Nc6'],
  [N,
   A('English vs Dutch setup','A10','<strong>1…f5</strong> — Treat this as a reversed Dutch. Build with Nc3, g3, Bg2 and challenge the dark squares with e4.'),
   A('English vs Dutch setup','A10','<strong>2.Nc3</strong> — Pressure e4/d5 and prepare the fianchetto.'),
   N,
   A('English vs Dutch setup','A10','<strong>3.g3</strong> — The bishop belongs on g2, where Black’s weakened dark squares can matter later.'),
   N,
   A('English vs Dutch setup','A10','<strong>4.Bg2</strong> — Finish development before opening the center. The thematic break is e4.')],'white');

registerLine(
  ['c4','b6','Nc3','Bb7','e4','e6','Nf3','Bb4','d3','f5','exf5','exf5','Be2','Nf6','O-O','O-O'],
  [N,
   A('English vs ...b6','A10','<strong>1…b6</strong> — Black aims at e4 with ...Bb7. We can take central space with e4 and develop normally.'),
   A('English vs ...b6','A10','<strong>2.Nc3</strong> — Support e4 and d5 while Black spends a tempo on the queenside fianchetto.'),
   N,
   A('English vs ...b6','A10','<strong>3.e4</strong> — Claim the center. The key is to develop quickly so the broad center stays an asset.')],'white');

// ════ V2 CARO-KANN SIDELINES ═════════════════════════════════════════════════
registerLine(
  ['e4','c6','d4','d5','f3','dxe4','fxe4','e5','Nf3','exd4','Bc4','Nf6','O-O','Be7','e5','Nd5'],
  [N,N,N,N,
   A('Caro-Kann: Fantasy','B15','<strong>3.f3</strong> — The Fantasy Variation builds an aggressive center. We strike immediately with ...dxe4 rather than letting White roll forward.'),
   A('Caro-Kann: Fantasy','B15','<strong>3…dxe4!</strong> — Challenge the center. After fxe4, ...e5 attacks it again and accelerates development.'),
   N,
   A('Caro-Kann: Fantasy','B15','<strong>4…e5!</strong> — A second central hit. The goal is activity, not passive Caro-Kann shell play.')],'black');

registerLine(
  ['e4','c6','Bc4','d5','exd5','cxd5','Bb5+','Nc6','d4','Nf6','Nf3','Bf5','O-O','e6'],
  [N,N,
   A('Caro-Kann: Hillbilly','B10','<strong>2.Bc4</strong> — An early bishop sortie. Don’t overreact: play ...d5 and gain central space with tempo.'),
   A('Caro-Kann: Hillbilly','B10','<strong>2…d5!</strong> — The principled answer. Challenge e4 immediately and develop behind the center.'),
   N,N,
   A('Caro-Kann: Hillbilly','B10','<strong>4.Bb5+</strong> — Meet the check calmly with ...Nc6. Black gets normal development and a healthy center.')],'black');

registerLine(
  ['e4','c6','d3','d5','Nd2','e5','Ngf3','Bd6','g3','Nf6','Bg2','O-O','O-O','Re8'],
  [N,N,
   A('Caro-Kann: Quiet 2.d3','B10','<strong>2.d3</strong> — White avoids the main center. Take space with ...d5 and ...e5 rather than playing passively.'),
   A('Caro-Kann: Quiet 2.d3','B10','<strong>2…d5</strong> — Establish the center. Against quiet systems, development and space are more important than memorization.'),
   N,
   A('Caro-Kann: Quiet 2.d3','B10','<strong>3…e5</strong> — Claim more space because White has not challenged the center.')],'black');


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
 {id:'e4-pirc',label:'Pirc: Austrian setup',group:'1.e4 Other Defences (White)',color:'white',sans:['e4','d6','d4','Nf6','Nc3','g6','f4','Bg7','Nf3','O-O','Bd3','Nc6','O-O','e5','fxe5','dxe5','d5','Nd4','Nxd4','exd4','Ne2']},
 {id:'e4-modern',label:'Modern: Austrian setup',group:'1.e4 Other Defences (White)',color:'white',sans:['e4','g6','d4','Bg7','Nc3','d6','f4','Nf6','Nf3','O-O','Bd3','Na6','O-O','c5','d5']},
 {id:'e4-alekh',label:'Alekhine: Classical center',group:'1.e4 Other Defences (White)',color:'white',sans:['e4','Nf6','e5','Nd5','d4','d6','Nf3','dxe5','Nxe5','c6','Be2','Bf5','O-O','e6','c4']},
  {id:'ck-cls', label:'Caro-Kann: Classical Karpov',          group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d4','d5','Nc3','dxe4','Nxe4','Bf5','Ng3','Bg6','h4','h6','Nf3','Nd7','h5','Bh7','Bd3','Bxd3','Qxd3','e6','Bd2','Ngf6','O-O-O','Be7','Ne4','Nxe4','Qxe4','Nf6','Qe2','Qd5']},
  {id:'ck-cls2',label:'Caro-Kann: Classical early Nf3',       group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d4','d5','Nc3','dxe4','Nxe4','Bf5','Nf3','Nd7','Ng3','Bg6','h4','h6','Bd3','Bxd3','Qxd3','e6','Bd2','Ngf6','O-O-O','Be7','Kb1']},
  {id:'ck-adv', label:'Caro-Kann: Advance (Short)',           group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d4','d5','e5','Bf5','Nf3','e6','Be2','Nd7','O-O','Ne7','Nbd2','h6','Nb3','g5','Nfd2','Bg6','c3','c5','dxc5']},
  {id:'ck-tal', label:'Caro-Kann: Advance (Tal h4)',          group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d4','d5','e5','Bf5','h4','h5','Bd3','Bxd3','Qxd3','e6','Bg5','Qb6','Nd2','Qa6','Qf3','c5','Ne2','Nc6','c3']},
  {id:'ck-panov',label:'Caro-Kann: Panov Attack',             group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d4','d5','exd5','cxd5','c4','Nf6','Nc3','e6','Nf3','Bb4','Bd3','dxc4','Bxc4','O-O','O-O','Nc6','a3','Be7','Re1']},
  {id:'ck-ex',  label:'Caro-Kann: Exchange',                  group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d4','d5','exd5','cxd5','Bd3','Nc6','c3','Qc7','Ne2','Bg4','f3','Bd7','O-O','e6','Nd2','Nf6']},
  {id:'ck-2k',  label:'Caro-Kann: Two Knights Bg4',           group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','Nc3','d5','Nf3','Bg4','h3','Bxf3','Qxf3','e6','d4','Nf6','Bd3','Bb4','O-O','O-O','a3','Bxc3','bxc3','Nbd7','Re1','c5']},
  {id:'ck-fan', label:'Caro-Kann: Fantasy',                   group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d4','d5','f3','dxe4','fxe4','e5','Nf3','exd4','Bc4','Nf6','O-O','Be7','e5','Nd5']},
  {id:'ck-hill',label:'Caro-Kann: Hillbilly',                 group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','Bc4','d5','exd5','cxd5','Bb5+','Nc6','d4','Nf6','Nf3','Bf5','O-O','e6']},
  {id:'ck-d3',  label:'Caro-Kann: Quiet 2.d3',                group:'Caro-Kann (Black)', color:'black', sans:['e4','c6','d3','d5','Nd2','e5','Ngf3','Bd6','g3','Nf6','Bg2','O-O','O-O','Re8']},
  {id:'ck-ex-nf3',label:'Caro-Kann: Exchange — Nf3/Bd3 setup', group:'Caro-Kann (Black)', color:'black',
   sans:['e4','c6','d4','d5','exd5','cxd5','Nf3','Nc6','Bd3','Bg4','c3','e6','Bf4','Bd6','Bxd6','Qxd6','Nbd2','Nge7','O-O','O-O']},
  {id:'ck-adv-nc3',label:'Caro-Kann: Advance — 4.Nc3 / g4', group:'Caro-Kann (Black)', color:'black',
   sans:['e4','c6','d4','d5','e5','Bf5','Nc3','e6','g4','Bg6','Nge2','c5','h4','h5','Nf4','Bh7','g5','cxd4','Qxd4','Nc6']},
  // ── V2.32: gap-fillers from October games ──────────────────────────────
  {id:'owens-main',label:"Owen's: 3.Nc3 e6, solid center",group:'1.e4 / Owen\'s Defense (White)',color:'white',
   sans:['e4','b6','d4','Bb7','Nc3','e6','Nf3','Bb4','Bd3','Nf6','Qe2','O-O','Bd2','d6']},
  {id:'owens-bd3',label:"Owen's: 3.Bd3, challenging immediately",group:'1.e4 / Owen\'s Defense (White)',color:'white',
   sans:['e4','b6','d4','Bb7','Bd3','e6','Nf3','Bb4+','c3','Be7','O-O','Nf6','Qe2','O-O']},
  {id:'petrov-white',label:'Petrov: classical 3.Nxe5 d6',group:'1.e4 Other Defences (White)',color:'white',
   sans:['e4','e5','Nf3','Nf6','Nxe5','d6','Nf3','Nxe4','d4','d5','Bd3','Nc6','O-O','Be7']},
  {id:'petrov-stafford',label:'Petrov: Stafford Gambit 3…Nc6?! (safe Be2 setup)',group:'1.e4 Other Defences (White)',color:'white',
   sans:['e4','e5','Nf3','Nf6','Nxe5','Nc6','Nxc6','dxc6','d3','Bc5','Be2']},
  {id:'philidor-lion',label:'Philidor: Lion/Hanham 3…Nf6 4.Nc3 Nbd7',group:'1.e4 Other Defences (White)',color:'white',
   sans:['e4','e5','Nf3','d6','d4','Nf6','Nc3','Nbd7','Bc4','Be7','O-O','O-O','Re1','c6','a4']},
  {id:'it-semi',label:'Italian: Semi-Italian 3…d6, 4.d4 break',group:'1.e4 / Italian (White)',color:'white',
   sans:['e4','e5','Nf3','Nc6','Bc4','d6','d4','exd4','Nxd4','Nf6','Nc3','Be7','O-O','O-O','Be3']},
  {id:'london-c5',label:'London: early …c5 strike vs 2.Bf4',group:'London System (Black)',color:'black',
   sans:['d4','d5','Bf4','Nf6','e3','c5','c3','Nc6','Nd2','Qb6','Qb3','c4','Qxb6','axb6','Ngf3','Bf5']},
  {id:'london-solid',label:'London: solid …e6/…c5 vs 2.Nf3',group:'London System (Black)',color:'black',
   sans:['d4','d5','Nf3','Nf6','Bf4','e6','e3','c5','c3','Nc6','Nbd2','Be7','Bd3','O-O','O-O']},
  {id:'english-caro',label:'English: Caro setup 1…c6/2…d5',group:'English (Black)',color:'black',
   sans:['c4','c6','Nf3','d5','g3','Nf6','Bg2','Bf5','O-O','e6','d3','Be7']},
];
