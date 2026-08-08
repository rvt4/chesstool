# ChessTool V2.15

Focused Game Review reliability patch.

## Fixed: review stuck at "Verifying key moves X/X"

V2.14 could send a final checkmating move into a constrained `searchmoves`
verification. Some browser Stockfish sessions do not return the normal
`info -> bestmove` sequence for that terminal search, so the final callback never
reached Game Review's `finalize()` function.

V2.15 fixes this at several levels:

- Checkmate/stalemate moves never enter the secondary verification queue.
- Fast mode does not redundantly re-verify ordinary forced-mate positions.
- Every verification has an independent queue-level timeout.
- A failed/timed-out verification is skipped rather than blocking the whole review.
- `finalize()` is idempotent and guaranteed to run after the queue advances.
- The final mating move is classified directly from ChessTool's legal-move/check
  detection, so it does not depend on another Stockfish search.

All V2.14 review caching, Fast/Deep modes, capped evaluations, practical repertoire
grading, richer moves 8–20 coaching, bot behavior, and middlegame training remain.
