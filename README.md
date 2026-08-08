# ChessTool V2.10

Focused engine-analysis correction and stability update.

## Corrected evaluation perspective
ChessTool's bundled `stockfish.js` build reports scores from White's perspective already. Earlier versions treated those scores as side-to-move scores and flipped the sign whenever Black was to move.

That caused the recognizable opening pattern:

`-0.4 → +0.6 → -0.3 → +0.5`

even when both players were making normal moves.

V2.10 removes that incorrect sign flip. Positive values now consistently mean White is better; negative values mean Black is better.

## More stable early-game review
- Positions 1–10: depth 18
- Positions 11–20: depth 17
- Positions 21–40: depth 15
- Later positions: depth 14
- Played-move same-parent searches are also deeper through move 20.
- When the same-parent search and resulting-position search still disagree materially, ChessTool explicitly flags that evaluation as approximate instead of silently presenting false precision.

The move grade continues to prefer the same-parent comparison through move 20.

## Stricter Brilliant verification
`‼ Brilliant` now requires all of the following:
1. Stockfish's top move.
2. Essentially no loss versus the best line.
3. A meaningful non-pawn sacrifice.
4. The principal variation actually shows the opponent accepting the offered piece.
5. After acceptance, the mover is genuinely down at least about 2.5 pawns of material.

This is meant to eliminate false Brilliant labels on moves that merely place a piece on an attacked square or permit an immediate equal recapture.

## Everything else retained
- Humanized 1400 / 1600 / 1800 / 2000 bot choices.
- Tactical mate/conversion override.
- Unified opening → middlegame Train mode.
- Full-strength feedback on your middlegame moves.
- Rich move explanations and review navigation.
- Forced-mate-aware grading.
- Legal-engine-move validation.
