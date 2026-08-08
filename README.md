# ChessTool V2.13

## Faster Game Review

Game Review defaults to **Fast** mode. It analyzes each position once, caches results by FEN in localStorage, and only performs a second same-parent search on meaningful errors, mate positions, tactical swings, or ambiguous early repertoire moves. Repeated English/Caro-Kann positions get progressively faster.

**Deep** review is still available from the Game Review panel and uses the higher-depth V2.12 approach.

## Practical opening grading

Stored repertoire moves with only tiny expected-points differences no longer receive scary early-opening labels merely because the engine slightly prefers another main line.

## Stockfish 18 local-engine folder

`engine/` contains the exact upstream filenames, official source information, and expected WASM hash for Stockfish 18 lite-single. The environment that generated this ZIP would not allow the 7.3 MB executable WASM binary to be materialized, so the binary is not falsely represented as included. The current browser engine loader remains active.

## Retained

- humanized 1400 / 1600 / 1800 / 2000 bots
- tactical mate-conversion override
- unified opening → middlegame Train mode
- strategic blueprints and live middlegame feedback
- legal engine-move validation
- persistent-sacrifice Brilliant verification
- conversion-aware forced-mate grading
