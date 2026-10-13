# ChessTool V2.32

## New in V2.32 — repertoire gap-fillers + Positional Masters puzzles

**Repertoire (from October games — 147 rapid games analyzed):**
- White: two new Owen's Defense lines (`owens-main`: 3.Nc3 e6 4.Nf3 Bb4 5.Bd3
  Nf6 6.Qe2; `owens-bd3`: 3.Bd3 challenging immediately) — 5 Owen's games faced,
  0 prep before.
- White: `petrov-white` (classical 3.Nxe5 d6) and `petrov-stafford`
  (3...Nc6?! Stafford Gambit — both October Petrov games were Staffords, both lost).
- White: `philidor-sidelines` (3.Bc4 — the most common Philidor deviation,
  genuinely different from the d4-based main line) and `it-semi`
  (Semi-Italian 3...d6 with the 4.d4 break).
- Black: two London System lines (`london-c5`: the principled ...c5 strike vs
  2.Bf4; `london-solid`: ...e6/...c5 vs 2.Nf3) — 10 London games faced in October,
  0 prep before. The Zukertort/Chigorin move orders seen are London move orders
  and are covered by these lines.
- Black: `english-caro` (1.c4 c6 2...d5 with ...Bf5 Caro-style development).
- New repertoire groups: "1.e4 / Owen's Defense (White)", "London System (Black)",
  "English (Black)". All 33 drill lines verified: every SAN resolves via core.js.

**Bug fix:** `core.js` `uci2san` no longer labels a rook move e8→g8 as `O-O`
(the castling label now applies only when the moving piece is the king). This
previously broke SAN resolution for PGN imports containing ...Rg8.

**Positional Masters puzzles:** a new "Positional Masters" sub-tab next to
"My Blunders" in the Puzzles tab. 24+ deep strategic positions from famous
master games (prophylaxis, exchange sacrifices, pawn breaks, outposts,
blockades, zugzwang, king hunts...), each with a single engine-verified best
move (Stockfish 19, depth 18+) and a written explanation of the idea shown
after solving. Separate progress tracking (`chesstool_pos_progress`) and
spaced repetition; answers are freshly engine-verified like My Blunders.

## New in V2.30 — inflection-point puzzles

Puzzle feedback: old puzzles often showed already-lost positions. The puzzle set
is now rebuilt with an inflection-point filter — every puzzle is the move that
*lost the game*: eval before the move is >= -1.5 (not already lost) and the drop
is >= 2.5 pawns. Each puzzle shows the swing (e.g. "you went from +3.2 to mate
in one move") and is tagged even-to-lost / won-to-even / won-to-lost.
80 puzzles from the 50 most recent rapid losses, max 3 per game.

## New in V2.29 — honest insights

The old "69% of losses by checkmate" insight was misleading: Ryan never resigns,
opponents usually do. The Stats tab now tells the honest story:

- **The honest mate stat**: his resign rate vs opponents' resign rate, plus an
  engine check (30 recent losses, depth 15) counting moves played *after* the
  position was dead lost (−5.0) — him vs his opponents. Takeaway: resigning a
  dead position is banking time and energy, not quitting.
- **Tilt & session fatigue**: win% right after a loss (and after 2+ straight
  losses) vs baseline; win% by session-game number (45-min session gaps);
  longest streaks.
- **Score vs rating difference**: actual vs Elo-expected score in rating-gap
  buckets (<−150 … >+150).
- **When you play**: win% by time of day (America/Los_Angeles) and weekday vs
  weekend.
- **Repertoire adherence**: do his real first moves match the repertoire?
  (Vs 1.d4 → % 1...d5; vs 1.e4 → % Caro; as White → 1.e4/1.c4 split.)
- **Thrown & stolen**: sampled games where he was +3 and lost, or −3 and won.
- Move pace from clock annotations (avg seconds/move).
- Focus of the week retuned to the new metrics (dead positions, tilt,
  session fatigue, thrown wins).

## New in V2.28

### Slav Defence repertoire (Black)
Six new drill lines under "Slav Defence (Black)", wired into Train mode and the
"Caro-Kann + Slav only" line family:
- **Slav: main line 4…dxc4** — 5.a4 Bf5!, the …Bf5-before-…e6 idea, …Bb4, castling, then …e5 or queenside play
- **Slav: 4…dxc4 without 5.a4** — …b5 is back on the menu when White skips a4
- **Slav: Semi-Slav 4…e6** (D31) — …Nbd7, …dxc4, …b5 hold, …Bb7 activation
- **Slav: 4.e3 Bf5 system** — …Bg6, …hxg6 and the half-open h-file
- **Slav: Exchange 3.cxd5** — Carlsbad structure ideas you already know from the Caro-Kann Exchange
- **Slav: 3.Nc3 sidelines** — one system, many move orders

A new middlegame blueprint ("Slav — …Bf5 Structures") covers the …Bf5 lines;
the Exchange Slav maps to the existing Carlsbad blueprint. All annotations keep
the usual voice: short, concrete, second-person, with the plan for each move.

### Stats tab
A new **Stats** tab renders your real chess.com games (bundled snapshot of
926 games, Jul–Sep 2026):
- rating line chart over time (rapid / blitz / bullet, inline SVG, no libraries)
- monthly W/L/D bars plus per-control totals
- openings table (3+ games) with color-coded scores
- White vs Black split and a breakdown of how games ended
- Key insights with the real numbers, and a **Focus of the week** card that
  picks your single worst trend with one concrete drill suggestion
- **↻ Sync from chess.com** pulls your newest games from the public API,
  merges them into local storage, and re-renders. Works offline from `file://`
  using the bundled snapshot.

### Puzzles tab — My Blunders
A new **Puzzles** tab built from 80 of your worst real-game moments
(Stockfish-verified blunders from your recent rapid losses, biggest eval drops
first). Each puzzle shows the position from your side and tells you what you
played ("you played X?? — find the improvement"). Like Mistake Drill and
Replay, it **never trusts the cached answer**: Stockfish freshly verifies the
position and your attempt, accepting the engine best or anything within ~0.35
pawns. Progress (solved/attempts, streak, daily count toward a target of 10)
is saved locally, and the queue uses spaced repetition — failed and
least-recent puzzles resurface first. Unlike Mistake Drill (which uses your
in-app bot games), these are positions from your actual chess.com games.

## Generating the data files
- `gen_stats.py` reads `~/workspace/chess/rvt8/months/*.json` and writes
  `Chesstool/data/mygames.js` (`const MYGAMES_STATS = {...}`).
- `gen_puzzles.py` verifies `~/workspace/chess/rvt8/blunders.json` against
  `rapid_games.pgn`, runs the Stockfish binary at `~/workspace/chess/stockfish`,
  and writes `Chesstool/data/puzzles.js` (`const MY_PUZZLES = [...]`).

Both scripts live in `~/workspace/chesstool/work/` (not in the shipped zip).

## Focused Replay verification update.

(This section describes V2.25; kept for history.)

## Replay no longer trusts the cached review best move
When you tap Replay, ChessTool now:
1. restores the exact position before your mistake;
2. runs a fresh full-strength Stockfish search with cache bypassed;
3. updates the replay target if the fresh best move differs from the old review result;
4. waits for that verification before allowing a correction attempt.

## Every attempted correction is freshly scored
Your move is analyzed with `searchmoves` from the ORIGINAL position so its evaluation
is directly comparable with the freshly verified best move.

Replay accepts:
- the fresh engine best move; or
- a near-equivalent move within roughly 0.35 pawns of the fresh best.

It no longer says `Correct` solely because your move matches an old stored SAN.

## Opponent strongest-reply sanity check
After your attempted correction, ChessTool freshly analyzes the resulting position and
shows:
- the resulting evaluation;
- the opponent's strongest reply;
- a short description of what that reply does when available.

This is designed for cases like a suggested `O-O-O` where the user notices a possible
`Nf7` rook fork. Even if castling is still objectively best, Replay will surface Nf7 as
the opponent's strongest response instead of hiding the tactical consequence.

If the attempted move is not good enough, Replay returns you to the original position
after showing the fresh best move and opponent response.

## Reliability
Fresh Replay searches deliberately bypass the normal Game Review cache. If Stockfish
cannot fresh-verify a position, Replay refuses to mark a move correct rather than
falling back to stale cached analysis.

All V2.24 Mistake Coach themes, confidence weighting, garbage-time filtering,
Game Review, bot play, opening repertoire, and middlegame training remain unchanged.
