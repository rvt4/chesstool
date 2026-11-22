// ════ V2.33 — REPERTOIRE AUDIT ═══════════════════════════════════════════════
// 1) Full annotations for the V2.32 lines, which were drillable but had no
//    explanations at all (they were only in DLINES, never registered).
// 2) Extra notes on existing lines where key moves had none.
// 3) Gap-fillers for main-line replies the repertoire did not cover.
// Notes are stored per color, so White-side and Black-side explanations of the
// same position no longer overwrite each other.

// ─── WHITE: annotations for existing lines ───────────────────────────────────
regLine('white','French: Advance','C02',[
 'e4','e6','d4','d5','e5','c5','c3','Nc6','Nf3','Qb6','Bd3',
 ['cxd4','Black releases the tension. Recapture with the pawn.'],
 ['cxd4','Keep the classical centre. TRAP: 7…Nxd4?? 8.Nxd4 Qxd4 9.Bb5+ and the d4 queen falls to a discovered attack from your Qd1.'],
 ['Bd7','The safe way to prepare …Nxd4: now Bb5+ can be met by …Bxb5.'],
 ['O-O','The Milner-Barry Gambit: you offer d4 for a big lead in development.'],
 ['Nxd4','Black takes up the offer.'],['Nxd4','Recapture — the queen will take back.'],['Qxd4','Black is a pawn up but behind in development.'],
 ['Nc3','Develop with threats: Nb5 and Nxd5 ideas, Re1, and Black’s king is still in the centre. If 10…Qxe5 11.Re1 with heavy pressure.']
]);
regLine('white','Italian: Hungarian Defence','C50',[
 'e4','e5','Nf3','Nc6','Bc4','Be7','d3','Nf6','O-O','O-O','Re1','d6','c3',
 ['Na5','Black chases your Italian bishop.'],
 ['Bb5','Keep the bishop: after …a6/…c6 it drops to a4 and then c2, Ruy Lopez style.'],
 ['c6','Black gains a tempo.'],
 ['Ba4','Next Bc2 if …b5. You get a slow Ruy-Lopez structure: Nbd2-f1-g3, h3, then d4.']
]);
regLine('white','Sicilian: Alapin','B22',[
 'e4','c5','c3','Nf6','e5','Nd5','d4','cxd4','Nf3','Nc6','cxd4','d6',
 ['Bc4','Hit the d5 knight and develop. (7…Nb6 is Black’s other main move: drop the bishop to b3 and keep e5 protected.)'],
 ['dxe5','Black releases.'],['dxe5','Recapture: your e5 pawn cramps f6 and d6.'],['e6','Black solidifies the knight.'],
 ['O-O','Plan: Qe2, Rd1, Nc3 and the d-file. The e5 pawn is your space advantage — keep it protected.']
]);
regLine('white','Sicilian: Alapin — …d5','B22',[
 'e4','c5','c3','d5','exd5','Qxd5','d4','Nf6',
 ['Nf3','Develop; Black often pins with …Bg4 here — meet it with Be2 and h3 when useful.'],['e6','Solid.'],
 ['Be2','Modest but sound: castle quickly, then Na3/c4 or Be3/dxc5 depending on Black’s setup.'],'Be7',
 ['O-O','You have the freer game: Black’s queen on d5 will be hit by Nc3/c4 later.'],'O-O'
]);
regLine('white','Scandinavian Defence','B01',[
 'e4','d5','exd5','Qxd5','Nc3',['Qd8','A rare, passive retreat: Black just loses time. (3…Qa5 and 3…Qd6 are the main moves — see those lines.)'],
 'd4','Nf6',['Nf3','Develop — you are simply ahead in development.'],'c6',
 ['Bc4','Active bishop; castle next.'],'Bf5',['O-O','King safe.'],'e6',
 ['Re1','Prepare d5 or Ne5. Your extra tempi let you open the centre on your terms.']
]);
regLine('white','Alekhine Defence','B03',[
 'e4','Nf6','e5','Nd5','d4','d6',
 ['Nf3','The Modern Variation: calm development, no overextension. (Against …g6 the same idea works: Bc4-b3, O-O, then a4-a5 or Qe2.)'],
 ['dxe5','Black trades on e5.'],['Nxe5','Recapture with the knight, centralised.'],['c6','Black supports the d5 knight.'],
 ['Be2','Calm development.'],['Bf5','Black develops outside the chain.'],
 ['O-O','King safe.'],['e6','Solid.'],
 ['c4','Kick the knight and grab space — the trade-off Black accepted with 1…Nf6.']
]);
regLine('white','Modern Defence','B06',[
 'e4','g6','d4','Bg7','Nc3','d6','f4','Nf6',
 ['Nf3','Develop; same Austrian structure as the Pirc.'],'O-O',
 ['Bd3','Protect e4 and aim at the kingside.'],['Na6','Black prepares …c5 with the knight covering c7/b4.'],
 ['O-O','Castle first.'],['c5','Black hits the centre.'],
 ['d5','Gain space and keep the position closed on the queenside. Plan: e5 or f5 attacks, Qe1-h4.']
]);
regLine('white','Philidor Defence','C41',[
 'e4','e5','Nf3','d6','d4','exd4','Nxd4','Nf6','Nc3','Be7',
 ['Be2','Calm development; castle and expand.'],'O-O',['O-O','King safe.'],['Re8','Black pressures e4.'],
 ['Re1','Defend e4 again.'],['Bf8','Black regroups.'],
 ['Bf1','Mirror it: both sides are solid, but you have more space. Plan: f3/Be3, Qd2, Rad1 — or h3 and g4 if Black stays passive.']
]);

// ─── WHITE: V2.32 lines, now annotated ───────────────────────────────────────
regLine('white',"Owen's Defence",'B00',[
 'e4',["b6","Owen's Defence. Black will hit e4 with …Bb7. Take the full centre and keep e4 well protected."],
 ['d4','Both centre pawns. Your job from here: keep e4 protected and blunt the b7 bishop.'],['Bb7','Now e4 is attacked.'],
 ['Nc3','Defend e4 with a piece. (3.Bd3 is the other good move — see the 3.Bd3 line.)'],'e6',
 ['Nf3','Develop toward castling.'],['Bb4','Black pins c3, so the knight stops guarding e4. Count attackers on e4 every move.'],
 ['Bd3','Add a defender and prepare to castle.'],['Nf6','e4 is now hit by Nf6 and Bb7.'],
 ['Qe2','The key move: the queen defends e4 a second time. If 6…d5, play 7.e5 and gain space.'],'O-O',
 ['Bd2','Break the pin. Plan: castle, a3 to question the bishop, then e5 or d5 to gain space.'],
 ['d6','Black is solid but passive. You have the centre — use it.']
]);
regLine('white',"Owen's Defence",'B00',[
 'e4','b6','d4','Bb7',
 ['Bd3','Defend e4 with the bishop and keep c3 for the c-pawn. TRAP: 3…f5?! 4.exf5! Bxg2? 5.Qh5+ g6 6.fxg6 Bg7 7.gxh7+ (discovered check) Kf8 8.hxg8=Q+ wins.'],
 'e6',['Nf3','Develop.'],['Bb4+','A spite check.'],
 ['c3','Block with a pawn that supports d4 anyway.'],['Be7','Black has lost a tempo.'],
 ['O-O','King safe.'],'Nf6',
 ['Qe2','Keep e4 covered twice. Plan: c4 and Nc3 for a big centre, or e5 to kick the knight.'],'O-O'
]);
regLine('white','Petrov Defence','C42',[
 'e4','e5','Nf3',['Nf6','The Petrov: Black counter-attacks e4.'],
 ['Nxe5','Take the pawn. TRAP: 3…Nxe4? 4.Qe2! and if 4…Nf6?? 5.Nc6+ — a discovered check that wins the queen.'],
 ['d6','Correct: kick the knight first.'],
 ['Nf3','Retreat — the knight was attacked. Don’t try 4.Nxf7?! (the Cochrane) unless you want chaos.'],['Nxe4','Now Black regains the pawn.'],
 ['d4','Take the centre; Black’s e4 knight needs support.'],['d5','Black supports it.'],
 ['Bd3','Develop with pressure on e4.'],'Nc6',
 ['O-O','King safe. Next c4 hitting d5, or Re1 piling on e4.'],['Be7','The main line. Plan: c4, Nc3, and pressure on e4/d5.']
]);
regLine('white','Petrov: Stafford Gambit','C42',[
 'e4','e5','Nf3','Nf6','Nxe5',['Nc6','The Stafford Gambit: unsound, but full of traps. Trade the knight off first.'],
 ['Nxc6','Take — Black’s pieces will be active, but you are a pawn up.'],['dxc6','Black opens lines for fast development.'],
 ['d3','Solid: protect e4. Avoid 5.e5?! Ne4 6.d3?? Bc5! which is a known trap (Bxf2+ and …Bg4+ ideas).'],
 ['Bc5','Now …Ng4 (with Bxf2+ / Nxf2) is the threat.'],
 ['Be2','Covers g4, so …Ng4 just hangs to Bxg4. Expect 6…h5 to support it: then calculate every …Ng4/…Qh4 idea, use c3 + d4 to blunt the c5 bishop, and castle only when f2 is safe. You are a clean pawn up — no need to hurry.']
]);
regLine('white','Philidor: Lion / Hanham','C41',[
 'e4','e5','Nf3','d6','d4',['Nf6','Black keeps the tension instead of 3…exd4. (If 3…Nd7 4.Bc4! and 4…Be7? 5.dxe5 dxe5? 6.Qd5! threatens mate on f7.)'],
 ['Nc3','Defend e4. If 4…exd4 5.Nxd4 you are back in the main Philidor line.'],['Nbd7','The Lion/Hanham setup: Black holds e5 with pieces.'],
 ['Bc4','Aim at f7, the Hanham’s sore spot.'],['Be7','Black develops; f7 needs watching.'],
 ['O-O','King safe.'],'O-O',
 ['Re1','Overprotect e4, so Black’s …exd4/…Nxe4 tricks lose their punch.'],['c6','Black prepares …b5.'],
 ['a4','Stop …b5. Plan: h3, Ba2, Be3 and a slow squeeze — Black is cramped and has few breaks.']
]);
regLine('white','Italian: Semi-Italian','C50',[
 'e4','e5','Nf3','Nc6','Bc4',['d6','Passive: Black blocks the f8 bishop. Punish it with the centre.'],
 ['d4','Strike now. If 4…Bg4, 5.d5 kicks the knight and the pin is harmless.'],['exd4','Black gives up the centre.'],
 ['Nxd4','Recapture centrally — a Philidor-like space edge with your bishop already on c4.'],'Nf6',
 ['Nc3','Develop.'],'Be7',
 ['O-O','King safe. Many players also tuck the bishop on b3 to sidestep …Nxe4/…d5 fork tricks.'],'O-O',
 ['Be3','Natural development. Plans: f4 + Qf3 for a kingside push, or Qd2 + Rad1 and a central squeeze.']
]);

// ─── WHITE: gap-fillers ──────────────────────────────────────────────────────
const S_SCANDI_QA5=regLine('white','Scandinavian: 3…Qa5','B01',[
 'e4','d5','exd5','Qxd5','Nc3',['Qa5','The main Scandinavian: the queen is safe on a5 and pins ideas against c3.'],
 ['d4','Centre first.'],['Nf6','Black develops.'],
 ['Nf3','Develop.'],['c6','Gives the queen d8 as a retreat and supports …Bf5.'],
 ['Bc4','Active bishop.'],['Bf5','Black develops outside the chain.'],
 ['Bd2','Unpin in advance: now Nd5 or Nb5 can hit the a5 queen.'],['e6','Black solidifies.'],
 ['Qe2','Plan O-O-O, then d5 or Nd5 ideas. Black’s queen on a5 is a target, not an asset.'],['Bb4','Black pins c3.'],
 ['O-O-O','Long castle: the rook joins the d-file and d5 breaks become real threats.']
]);
const S_SCANDI_NF6=regLine('white','Scandinavian: 2…Nf6','B01',[
 'e4','d5','exd5',['Nf6','The Modern Scandinavian: Black regains d5 with the knight. (If 3…Bg4, play 4.f3! and keep the extra pawn with c4.)'],
 ['d4','Take the centre.'],['Nxd5','Black recaptures.'],
 ['Nf3','Develop.'],['Bg4','Pin the f3 knight.'],
 ['Be2','Unpin calmly.'],'e6',['O-O','King safe.'],'Nc6',
 ['c4','Kick the knight and build a big centre.'],['Nb6','The knight retreats.'],
 ['Nc3','Develop.'],'Be7',['Be3','Natural.'],'O-O',
 ['b3','Prophylaxis: after …Bxf3 Bxf3 your c4 pawn would hang without this. Plan: Rc1, Qd2, d5 at the right moment.']
]);
const S_ALEKH_BG4=regLine('white','Alekhine: Modern 4…Bg4','B05',[
 'e4','Nf6','e5','Nd5','d4','d6','Nf3',['Bg4','The most popular reply: pin the f3 knight that defends e5.'],
 ['Be2','Unpin and prepare to castle.'],'e6',['O-O','King safe.'],'Be7',
 ['h3','Ask the bishop now.'],['Bh5','Black keeps the pin.'],
 ['c4','Kick the knight and grab space.'],['Nb6','Retreat.'],
 ['Nc3','Develop, defend e4 square.'],'O-O',['Be3','Protect d4.'],['d5','Black stakes a claim in the centre.'],
 ['c5','Push the knight back and gain queenside space. Plan: b4-b5 and a queenside majority; watch …Bxf3/…Nc4 ideas.']
]);
const S_SIC_E6=regLine('white','Sicilian: Alapin 2…e6','B22',[
 'e4','c5','c3',['e6','Black heads for a French. After 3.d4 d5 4.e5 you are in your French Advance — same plans, same traps.'],
 ['d4','Centre.'],'d5',['e5','Transpose to the French Advance.','French: Advance','C02'],'Nc6',
 ['Nf3','Develop.','French: Advance','C02'],'Qb6',['Bd3','Same setup as your French Advance line.','French: Advance','C02'],
 'cxd4',['cxd4','TRAP reminder: 7…Nxd4?? 8.Nxd4 Qxd4 9.Bb5+ wins the queen.','French: Advance','C02'],'Bd7',
 ['O-O','Milner-Barry Gambit, as in your French line.','French: Advance','C02']
]);
const S_SIC_D6=regLine('white','Sicilian: Alapin 2…d6','B22',[
 'e4','c5','c3',['d6','Black prepares …Nf6 hitting e4.'],
 ['d4','Centre.'],['Nf6','e4 is attacked.'],
 ['Bd3','Defend e4 with development (c3 has taken the knight’s square).'],['g6','Black goes for a fianchetto.'],
 ['Nf3','Develop.'],'Bg7',['O-O','King safe.'],'O-O',
 ['h3','Stop …Bg4. Plan: Re1, Nbd2-f1, and keep the big centre; d5 or dxc5 only when it wins space or a tempo.']
]);
const S_FR_BD7=regLine('white','French: Advance 5…Bd7','C02',[
 'e4','e6','d4','d5','e5','c5','c3','Nc6','Nf3',
 ['Bd7','Black delays …Qb6. No Milner-Barry here — switch to the Be2/Na3 plan.'],
 ['Be2','Solid: the bishop isn’t exposed on d3.'],['Nge7','The knight heads for f5 to hit d4.'],
 ['Na3','Route the knight to c2 to overprotect d4.'],['cxd4','Black releases.'],
 'cxd4',['Nf5','Pressure on d4.'],
 ['Nc2','d4 is rock solid. Plan: O-O, then g4!? to kick the f5 knight, or Bd3 and a kingside expansion.']
]);

// ─── BLACK: V2.32 lines, now annotated ───────────────────────────────────────
regLine('black','Caro-Kann: Exchange','B13',[
 'e4','c6','d4','d5','exd5','cxd5',
 ['Nf3','Exchange with an early knight.'],['Nc6','Pressure d4.'],
 'Bd3',['Bg4','Pin the knight that guards d4 and e5.'],
 'c3',['e6','Solid chain; your bishop is already outside it.'],
 ['Bf4','White develops the good bishop.'],['Bd6','Offer the trade: in this structure the dark-squared bishop is White’s best minor piece.'],
 'Bxd6',['Qxd6','Your queen is active on d6.'],
 'Nbd2',['Nge7','Knight to e7 keeps …f6/…e5 ideas and can go to g6 or f5.'],
 'O-O',['O-O','Plan: …Rab8 and a minority attack (…b5-b4) against c3 — the classic winning plan for Black in this structure.']
]);
regLine('black','Caro-Kann: Advance','B12',[
 'e4','c6','d4','d5','e5','Bf5',
 ['Nc3','Sharp: White prepares g4 to hunt the bishop.'],['e6','Normal development; get ready to retreat to g6.'],
 ['g4','The bishop is chased.'],['Bg6','Safe on g6 for now.'],
 ['Nge2','White prepares h4 and Nf4.'],['c5','Counter in the centre — the right reaction to a wing attack.'],
 ['h4','Threatening h5 to trap the bishop.'],['h5','Stop it.'],
 ['Nf4','Attacks the bishop and h5.'],['Bh7','The bishop tucks in.'],
 ['g5','White gains space.'],['cxd4','Open the c-file and the centre.'],
 'Qxd4',['Nc6','Develop with tempo on the queen. Plan: …Nge7-f5, …Qb6, pressure on d4 and e5.']
]);
regLine('black','London System','D02',[
 'd4',['d5','Your Slav move order starts the same way.','Queen Pawn Game','D00'],
 ['Bf4','The Accelerated London.','London System','D00'],['Nf6','Develop.','London System','D00'],
 'e3',['c5','Strike d4 before White’s setup is complete.'],
 'c3',['Nc6','Pile on d4.'],
 'Nd2',['Qb6','Hit b2 — the Bf4 has left the queenside.'],
 ['Qb3','White offers the queen trade.'],['c4','Kick the queen and gain queenside space.'],
 'Qxb6',['axb6','Doubled b-pawns, but your rook gets the half-open a-file — a good trade for you.'],
 'Ngf3',['Bf5','Bishop outside the chain. Plan: …e6, …b5-b4 and pressure on the queenside.']
]);
regLine('black','London System','D02',[
 'd4','d5',['Nf3','Normal London move order.','Queen Pawn Game','D02'],['Nf6','Develop.','Queen Pawn Game','D02'],
 'Bf4',['e6','Solid centre; your bishop stays home in this version.'],
 'e3',['c5','The standard anti-London strike.'],
 'c3',['Nc6','Pressure d4.'],
 'Nbd2',['Be7','Safe development. (…Bd6 to challenge the f4 bishop is the main alternative.)'],
 'Bd3',['O-O','King safe. Plan: …b6/…Bb7, or …Qb6 at b2, and …Nh5 to chase the Bf4 when possible.'],
 'O-O'
]);
regLine('black','English Opening','A11',[
 'c4',['c6','Meet the English with Caro/Slav ideas. After 2.d4 d5 it’s your Slav; after 2.e4 d5 it’s a Caro-Kann/Panov.'],
 'Nf3',['d5','Claim the centre.'],
 'g3',['Nf6','Develop.'],
 'Bg2',['Bf5','The Slav idea: bishop out before …e6.'],
 'O-O',['e6','Solid chain, bishop already outside.'],
 'd3',['Be7','Castle next. Plan: …h6 (a retreat square for the bishop), …Nbd7, …a5 against b4 expansion.']
]);

// ─── BLACK: gap-fillers ──────────────────────────────────────────────────────
const S_CK_HILL_BB3=regLine('black','Caro-Kann: Hillbilly','B10',[
 'e4','c6','Bc4','d5',
 ['Bb3','The real Hillbilly: White gambits e4.'],['dxe4','Take it — that was the point of 2…d5.'],
 ['Qh5','Threat: Qxf7+.'],['e6','Blocks the b3 bishop’s diagonal and defends f7 for good.'],
 ['Nc3','White develops and attacks e4 again.'],['Nf6','Develop with tempo on the h5 queen and hold e4 — you stay a pawn up. Then …Be7/…Bb4, …O-O and …Nbd7. A French-like game where your c8 bishop is not stuck.']
]);
const S_SLAV_NE5=regLine('black','Slav: 6.Ne5','D17',[
 'd4','d5','c4','c6','Nf3','Nf6','Nc3','dxc4','a4','Bf5',
 ['Ne5','The sharpest try: White wants to regain c4 with the knight.'],['Nbd7','Challenge the e5 knight. (6…e6 7.f3 Bb4 leads to very sharp theory.)'],
 ['Nxc4','White regains the pawn.'],['Qc7','Prepare …e5.'],
 ['g3','White fianchettoes.'],['e5','Your central break — the point of …Qc7.'],
 'dxe5',['Nxe5','Recapture; the bishop on f5 and queen on c7 work together.'],
 ['Bf4','Pin the e5 knight against your queen.'],['Nfd7','Support e5.'],
 ['Bg2','Plan: …f6 or …g5 to cement e5, then …Be6 and …Rd8. Active and well studied for Black.']
]);
const S_SLAV_E3_QB3=regLine('black','Slav: 4.e3 Bf5 5.cxd5','D12',[
 'd4','d5','c4','c6','Nf3','Nf6','e3','Bf5',
 ['cxd5','White’s critical try against the early …Bf5.'],['cxd5','Recapture.'],
 ['Qb3','Hits b7: your bishop left the queenside, so this is the test.'],['Qc8','Defend b7 and keep queens on. (6…Qb6 7.Qxb6 axb6 is a solid, simpler alternative.)'],
 ['Nc3','Develop.'],['e6','Solid chain.'],
 ['Bd2','White prepares Rc1.'],['Nc6','Develop. Plan: …Be7, …O-O, …a6 and contest the c-file with your queen and rooks.']
]);

// ─── Notes for remaining unannotated moves ──────────────────────────────────
regLine('white','Italian: Hungarian Defence','C50',['e4','e5','Nf3','Nc6','Bc4','Be7','d3','Nf6',['O-O','King safe first; then Re1, c3 and d4.']]);
regLine('white','Sicilian: Alapin','B22',['e4','c5','c3','Nf6','e5','Nd5','d4','cxd4','Nf3','Nc6',['cxd4','Recapture toward the centre: you now have the ideal d4 + e5 duo.']]);
regLine('white','Caro-Kann: Advance','B12',['e4','c6','d4','d5','e5','Bf5','Nf3','e6','Be2',['c5','Black hits d4 at once.'],
 ['O-O','Castle; don’t rush to defend d4 with pawns.'],['Nc6','More pressure on d4.'],
 ['Be3','The Short plan: support d4 with pieces, ready to recapture on d4 with a piece.'],['cxd4','Black exchanges.'],
 ['Nxd4','Recapture with the knight; your e5 pawn gives you lasting space.'],'Nxd4',
 ['Bxd4','A strong centralised bishop. Plan: c4 or Nd2-b3, f4 and a kingside space grab.']]);
regLine('black','Caro-Kann: Two Knights','B11',['e4','c6','Nc3','d5','Nf3','Bg4','h3','Bxf3','Qxf3','e6','d4','Nf6','Bd3','Bb4','O-O',['O-O','Castle; e4 is pressured by Nf6 and d5.']]);
regLine('black','Caro-Kann: Fantasy','B15',['e4','c6','d4','d5','f3','dxe4','fxe4','e5','Nf3',
 ['exd4','Take: White’s centre is gone and the e4 pawn is isolated.'],'Bc4',
 ['Nf6','Develop with pressure on e4. (Not …Nxe4 later while O-O and Ng5+ ideas exist — the f-file gets dangerous.)'],'O-O',
 ['Be7','Calm development, ready to castle.'],'e5',
 ['Nd5','Centralise the knight in front of the isolated pawn. Plan: …O-O, …Be6, and keep the extra d4 pawn if White can’t win it back cleanly.']]);
regLine('black','Caro-Kann: Hillbilly','B10',['e4','c6','Bc4','d5','exd5',
 ['cxd5','Recapture: the bishop on c4 is now hit.'],'Bb5+',
 ['Nc6','Block with development (…Bd7 is also fine).'],'d4',
 ['Nf6','Develop.'],'Nf3',
 ['Bf5','Your bishop comes out before …e6, Caro style.'],'O-O',
 ['e6','Solid. Plan: …Bd6, …O-O, and …Qb6 or …Rc8 on the c-file.']]);
regLine('black','Caro-Kann: Quiet 2.d3','B10',['e4','c6','d3','d5','Nd2','e5','Ngf3',
 ['Bd6','Protect e5 and develop.'],'g3',
 ['Nf6','Develop.'],'Bg2',
 ['O-O','King safe.'],'O-O',
 ['Re8','Support e5. Plan: …Nbd7-f8-g6 or …a5-a4 for queenside space; you have a free and easy game.']]);
regLine('black','Slav: 3.Nc3','D11',['d4','d5','c4','c6','Nc3',['Nf6','Develop and wait: after 4.Nf3 you’re in the main line.']]);
regLine('white','French: Advance 5…Bd7','C02',['e4','e6','d4','d5','e5','c5','c3','Nc6','Nf3','Bd7','Be2','Nge7','Na3','cxd4',['cxd4','Keep the pawn chain intact.']]);

DLINES.push(
 {id:'e4-scandi-qa5',label:'Scandinavian: 3…Qa5 main line',group:'1.e4 Other Defences (White)',color:'white',sans:S_SCANDI_QA5},
 {id:'e4-scandi-nf6',label:'Scandinavian: 2…Nf6 Modern',group:'1.e4 Other Defences (White)',color:'white',sans:S_SCANDI_NF6},
 {id:'e4-alekh-bg4',label:'Alekhine: Modern 4…Bg4',group:'1.e4 Other Defences (White)',color:'white',sans:S_ALEKH_BG4},
 {id:'e4-sic-e6',label:'Sicilian: Alapin vs 2…e6 (→ French)',group:'1.e4 Other Defences (White)',color:'white',sans:S_SIC_E6},
 {id:'e4-sic-d6',label:'Sicilian: Alapin vs 2…d6',group:'1.e4 Other Defences (White)',color:'white',sans:S_SIC_D6},
 {id:'e4-fr-bd7',label:'French: Advance 5…Bd7 (Be2/Na3)',group:'1.e4 Other Defences (White)',color:'white',sans:S_FR_BD7},
 {id:'ck-hill-bb3',label:'Caro-Kann: Hillbilly 3.Bb3 gambit',group:'Caro-Kann (Black)',color:'black',sans:S_CK_HILL_BB3},
 {id:'ck-2k-d3',label:'Caro-Kann: Two Knights 6.d3',group:'Caro-Kann (Black)',color:'black',
  sans:['e4','c6','Nc3','d5','Nf3','Bg4','h3','Bxf3','Qxf3','e6','d3','Nf6','a3','Bc5','g3','O-O','Bg2','Nbd7','O-O']},
 {id:'slav-ne5',label:'Slav: 6.Ne5 …Nbd7/…Qc7/…e5',group:'Slav Defence (Black)',color:'black',sans:S_SLAV_NE5},
 {id:'slav-e3-qb3',label:'Slav: 4.e3 Bf5 5.cxd5 6.Qb3',group:'Slav Defence (Black)',color:'black',sans:S_SLAV_E3_QB3}
);
