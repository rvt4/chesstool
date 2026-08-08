# ChessTool V2.17

Focused opening/review teaching update.

## Position-based repertoire recognition
ChessTool now normalizes FEN positions using board, side-to-move, castling rights,
and en-passant state while ignoring halfmove/fullmove counters.

A move is tagged:
- `📖 Repertoire` when it is directly stored from that position.
- `📖 Transposition` when a different move order reaches a position already in the repertoire.

This makes the opening knowledge position-aware rather than relying only on one exact
move sequence.

## Practical opening grading
During roughly the first eight moves, tiny engine differences are no longer taught as
Inaccuracies. If the objective loss is only a few tenths, the move is at least Good.
Known repertoire/transposition moves get a slightly wider practical floor.

A genuine tactical or strategic loss can still receive a negative grade.

## Better explanations for large swings
For Mistake / Miss / Blunder moves, ChessTool now inspects the opponent's best reply
from the resulting position.

It can explicitly identify situations such as:
- the piece you just moved can immediately be captured;
- the opponent has a forcing capture;
- the opponent has a forcing check;
- the evaluation swing is large enough that you should search for a concrete tactic.

This is especially useful for moves such as a queen move that simply allows `...Nxd5`
instead of only displaying `Miss`.

All V2.16 Fast Review reliability, caching, bot behavior, middlegame coaching,
evaluation cap, Brilliant verification, and mate grading remain intact.
