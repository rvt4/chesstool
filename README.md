# ChessTool V2.8

Focused bot-conversion and review-stability update.

## Bot conversion

The 1400 / 1600 / 1800 / 2000 setting still controls ordinary play, so the bot can make rating-appropriate strategic and positional mistakes.

Before each bot move, ChessTool now performs a quick full-strength tactical scan:

- **1400:** automatically converts forced mates of about M5 or shorter.
- **1600:** about M7 or shorter.
- **1800:** about M10 or shorter.
- **2000:** about M14 or shorter.
- **Full:** uses full-strength engine play.

The bot also overrides its weakened move when the full-strength scan finds a large forcing tactical win (capture, check, or promotion). The tactical threshold gets stricter as the rating rises.

This is designed to stop absurd situations where a 1400+ bot sees M1/M2/M3 positions but shuffles for dozens of moves, while still allowing realistic mistakes in ordinary middlegame positions.

The same tactical conversion logic is used by the rated opponent in Train's middlegame phase.

## Game Review stability

- First 10 review positions now search to depth 16.
- Positions 11–20 search to depth 15.
- Later positions use depth 14.
- Failed/stale searches can retry twice.
- Every engine best move still passes ChessTool's legal-move gate before being shown.

## Forced-mate classifications

Review grading now uses mate distance, not just 100% winning probability.

When the mover has a forced mate:
- `! Great` = engine-best move preserving/executing the mate.
- `?! Inaccuracy` = makes the forced mate slightly longer.
- `? Mistake` = materially lengthens the mate.
- `?? Blunder` = greatly lengthens the mate.
- `ⓧ Miss` = throws the forced mate away.
- `# Checkmate` = delivers mate.

When the mover is being forcibly mated:
- `□ Forced` = engine-best resistance / only move.
- Moves that allow mate significantly sooner are downgraded appropriately.

Everything from V2.7 remains: unified Train mode, opening retry behavior, middlegame blueprints, live full-strength feedback on your moves, review icons, strict Brilliant verification, and illegal engine-move rejection.
