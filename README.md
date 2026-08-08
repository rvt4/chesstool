# ChessTool V2.12

Focused review-accuracy patch.

## More stable opening evaluations

Through move 20, ChessTool already runs a constrained Stockfish search on the move actually played from the same parent position.

V2.12 now uses that same-parent result for the **displayed evaluation as well as the move grade** when available. The independently analyzed resulting position remains a cross-check.

This is designed to reduce misleading quiet-opening swings caused by two separately searched positions disagreeing by 0.5–1.0+ pawns.

If the searches disagree materially, the move explanation says so explicitly.

## Brilliant now requires a persistent sacrifice

A temporary material drop is no longer enough.

ChessTool follows the principal variation through the immediate capture/recapture window. If the material is simply recovered immediately — for example:

`Qxd5 Qxd5 Bxd5`

— the move is treated as an exchange sequence, not a Brilliant sacrifice.

A Brilliant still requires:
- Stockfish's top move;
- essentially no loss versus best;
- meaningful non-pawn material offered;
- opponent accepts it in the PV;
- material remains genuinely sacrificed after the immediate recapture window.

## Forced-mate grading is conversion-aware

If you have a forced mate and preserve it:
- fastest/best mate: `! Great`
- same or faster non-best mate: `✓ Excellent`
- only 1–2 moves slower: `● Good`
- 3–4 moves slower: `?! Inaccuracy`
- 5–7 moves slower: `? Mistake`
- very large delay: `?? Blunder`
- throw away the forced mate entirely: `ⓧ Miss`

If you are already being forcibly mated, ChessTool now focuses on resistance quality. Small changes in mate distance are no longer called Blunders.

Everything else from V2.11 remains intact.
