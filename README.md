# ChessTool V2.7

Focused accuracy patch on top of V2.6.

## V2.7 changes

### Legal engine-move gate
Every engine `bestmove` is checked against ChessTool's own `legalMoves(fen)` result before it is used or displayed.

If an old/stale Stockfish result ever suggests an illegal move such as impossible castling, ChessTool rejects it. Review analysis retries the exact position instead of showing the illegal recommendation. Rated bot play falls back to a legal local move rather than executing an invalid engine result.

### Much stricter Brilliant moves
A move is no longer Brilliant simply because a valuable piece lands on an attacked square.

To receive **‼ Brilliant**, the move must:
1. be Stockfish's top move;
2. give up meaningful non-pawn material;
3. remain essentially lossless;
4. and Stockfish's principal variation must show the opponent actually accepting the offered material.

If those conditions are not met, the move is classified normally as Best / Great / etc.

### Better forced-mate grading
Positions with a forced mate are now handled separately:
- `# Checkmate` for the mating move.
- `! Great` for a best move that preserves/executes a forced mate.
- `□ Forced` for the only legal move or best resistance when mate is unavoidable.
- `?? Blunder` when a move materially shortens the forced mate.
- `ⓧ Miss` when a player throws away a forced mate.

This prevents long forced-mate sequences from being filled with generic Excellent labels.

All existing V2.6 training, rated middlegame opponent, live move feedback, review icons, and repertoire/middlegame data remain intact.
