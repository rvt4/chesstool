# ChessTool V2.16

Game Review finalization reliability patch.

## Fixed: stuck on "Finalizing review"

The verification queue now finishes correctly, but V2.15 exposed a second failure:
an exception inside the final move-by-move classification/explanation pass could stop
the renderer while the status remained "Finalizing review".

V2.16 makes finalization fault-tolerant:

- Every move is finalized inside its own error boundary.
- If one explanation/classification fails, only that move falls back to
  "Not analyzed"; the rest of the review still renders.
- The moves 8–20 coaching helper is now self-contained and no longer depends on an
  optional square helper.
- Illegal/stale best moves are ignored before SAN conversion.
- A whole-review watchdog forces finalization if the browser worker becomes stuck.
- There is a last-resort partial-review renderer, so Game Review should never remain
  permanently on "Finalizing review".

All V2.15 queue watchdog, terminal-move handling, caching, Fast/Deep review,
practical opening grades, capped evaluations, bot play, and middlegame coaching remain.
