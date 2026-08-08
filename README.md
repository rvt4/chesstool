# ChessTool V2.5

Personal English Opening + Caro-Kann trainer focused on opening recall and the early middlegame.

## V2.5

- Fixed Stockfish review synchronization. Each position now waits for `readyok` before the next depth-14 search begins, preventing an old `bestmove` or score from contaminating the next position.
- Review controls and the detailed move explanation now appear in a dedicated panel directly below the board, with Previous / Next controls kept visible on mobile.
- Checkmate and stalemate are explicitly detected after every bot move. Checkmate now produces a board overlay with the result and a Review Game button.
- The final mating move is labeled Checkmate in review instead of Not analyzed.
- Train and Study now both transition automatically from the end of the opening into a Middlegame Lab for roughly 10 additional moves.
- Study shows the full strategic blueprint. Train hides it initially so you must recall the plan; Hint reveals it.
- Every one of the 20 current repertoire branches maps to one of 18 validated middlegame structures.
- End-of-line detection happens before wrong-move handling, removing the blank “next move is .” behavior.
- Mate evaluations are shown as M# / -M#, and positive numerical evaluation always favors White.

## Modes

### Train
Recall opening moves without answers shown. Wrong legal moves are explained and reset. At the end of theory, continue into Middlegame Recall.

### Study
Recommended opening moves and explanations are shown. At the end of theory, continue from the exact final opening position with the full middlegame blueprint visible.

### vs Bot
Play a complete game and review it move by move with Stockfish-backed analysis when the browser engine is available.

GitHub Pages: deploy `main` from `/ (root)`.
