# ChessTool V2.11

Small corrective patch focused on engine score perspective.

## Fixed: side-to-move score normalization

The Stockfish.js build used by ChessTool reports evaluations from the **side to move**.

V2.10 mistakenly treated those values as if they were already White-relative. That caused impossible-looking alternation such as:

`+3.7 → -3.5 → +3.9 → -3.8`

and mate sequences such as:

`-M8 → M4 → -M3`.

V2.11 restores the correct normalization:

- White to move: use the engine score as-is.
- Black to move: flip the sign.
- Positive always means White is better / White has the forced mate.
- Negative always means Black is better / Black has the forced mate.

This applies equally to centipawn and mate scores.

## Regression safeguards

ChessTool now sanity-checks normalized engine results when they are stored for:

- live middlegame coaching;
- same-parent move analysis;
- position-by-position Game Review.

Game Review also flags unexpected changes in which side has a forced mate between consecutive positions so this class of perspective bug is easier to catch during testing.

## Kept from V2.10

- Same-parent move grading through move 20.
- Deeper early-game analysis.
- Stability warnings when searches disagree materially.
- Strict Brilliant verification.
- Humanized 1400 / 1600 / 1800 / 2000 bots.
- Tactical conversion override.
- Unified opening → middlegame Train mode.
- Rich move explanations.
