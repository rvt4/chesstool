# ChessTool V2.18

Focused repertoire-label and tactical-training update.

## Book moves are just Book moves
If a move is recognized in your repertoire (including a recognized transposition),
Game Review now displays:

`📖 Book`

It does **not** also call the move Best / Excellent / Good / Inaccuracy.

The evaluation can still be shown for context, but ChessTool no longer teaches tiny
engine preferences as a second judgment on a move you deliberately chose for your
repertoire.

A transposed book move is still identified as a transposition in the review UI and
explanation.

## Stronger 1400+ tactical punishment
The rated bot still uses humanized candidate selection for ordinary play.

The full-strength tactical scan now overrides that selection more reliably when the
best move:
- directly captures a loose minor piece, rook, or queen;
- wins a pawn with a clearly large tactical edge;
- gives a forcing check with a substantial evaluation advantage;
- is a short forced mate (existing behavior).

This is designed to stop a 1400+ bot from repeatedly ignoring obvious piece-winning
tactics while preserving realistic positional inaccuracies.

## More concrete Mistake / Miss / Blunder explanations
For large errors, Game Review now examines the opponent's best reply and principal
variation.

It can show:
- the exact immediate punishment;
- when the piece you just moved can simply be captured;
- when a forcing capture wins a piece or more;
- when the punishment begins with check;
- a short engine punishment line (up to four plies);
- a warning about an attacked loose piece.

All V2.17 Fast Review reliability, caching, transposition-aware repertoire,
middlegame coaching, evaluation cap, Brilliant verification, and mate grading remain.
