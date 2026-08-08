# ChessTool V2.6

Personal English Opening + Caro-Kann trainer built around one continuous workflow:

**opening repertoire → early middlegame plan → coached practice → full-game review**

## Main training mode

There is now one Train mode instead of separate Train and Study modes.

### Opening phase
- Opponent autoplays random continuations from the selected English or Caro-Kann lines.
- You may make any legal move.
- Correct repertoire moves continue.
- Wrong moves are explained and the position resets so you can retry.
- Hint reveals the expected repertoire move.

### Middlegame phase
- When the stored opening line ends, training automatically continues from that exact position.
- The relevant strategic blueprint stays visible: goal, pawn breaks, piece placement, opponent plan, trigger, and common mistake.
- Choose an approximate opponent level: 1400 / 1600 / 1800 / 2000.
- The opponent uses limited-strength Stockfish.
- Your moves are independently checked by full-strength Stockfish at depth 13.
- Every move receives Best / Excellent / Good / Inaccuracy / Mistake / Miss / Blunder-style feedback plus the engine's preferred move.
- Inaccuracy or worse resets the position so you can find a stronger move.
- Hint reveals Stockfish's current best move.

## Game Review
- Stockfish depth-14 analysis with retry and synchronized searches.
- Classification icons:
  - ‼ Brilliant
  - ! Great
  - ★ Best
  - ✓ Excellent
  - ● Good
  - ?! Inaccuracy
  - ? Mistake
  - ⓧ Miss
  - ?? Blunder
  - □ Forced
  - # Checkmate
- 📖 Repertoire is displayed as a separate opening tag.
- Move definitions are built into an expandable legend.
- Review board, Previous/Next controls, best move, evaluation and explanation remain directly under the board on mobile.
- Mate scores display as M# / -M# and the mating move is labeled Checkmate.

## Data validation
All 20 repertoire branches and all 18 mapped middlegame structures validate through ChessTool's legal-move engine.

GitHub Pages: deploy `main` from `/ (root)`.
