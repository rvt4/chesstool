# ChessTool V2.4

Personal English Opening + Caro-Kann trainer.

## V2.4
- Study now flows directly from the opening into a **Middlegame Lab** for roughly 10 more moves (about 20 plies).
- Middlegame Lab keeps the strategic blueprint visible: goal, pawn breaks, piece map, opponent plan, trigger, and common mistake.
- Bot presets: 1400 / 1600 / 1800 / Full.
- Game Review now uses Stockfish depth 14 rather than a 220 ms search.
- Mate evaluations display as M# / -M# rather than fake +99 scores.
- Move grades use estimated winning-chance loss, which is more stable than raw pawn thresholds.
- Repertoire is a tag; it no longer automatically overrides the engine's quality grade.
- Review explanations include strategic move descriptions and engine alternatives.
- Positive evaluation = White better; negative = Black better.

GitHub Pages: deploy `main` from `/ (root)`.
