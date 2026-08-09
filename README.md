# ChessTool V2.23

Targeted Mistake Coach / replay update.

## Replay now actually works
The Replay button now enters a dedicated correction mode instead of only changing the board position. This fixes the old conflict where VS BOT click handling ignored board input after a completed game.

- Replay restores the exact position immediately before the saved mistake.
- Pieces are movable normally and all legal moves can be attempted.
- A wrong correction is shown on the board, gets immediate feedback, then resets to the key position so you can try again.
- The saved engine-best move is the correction target.
- A correct move is confirmed and the replay exercise ends.
- Replay works even though the original bot game is already over.
- Starting/resetting another mode safely exits replay mode.

## Mistake Trends UI
- Game-phase cards now keep the phase name and impact percentage on separate lines on mobile.

V2.21's meaningful-error thresholds, severity/recency weighting, persistent local history, repertoire data, bot behavior, review engine, and middlegame training remain intact.


## V2.23
- Brilliant moves now require meaningful practical result context; best sacrifices in already-lost positions are no longer labeled Brilliant.
- Replaced the generic Decision quality fallback with more concrete king, queen, exchange, tactical, and positional-plan diagnoses.
- Current Focus now includes a habit-specific training cue so the trend tracker teaches the underlying decision process.
