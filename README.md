# ChessTool V2

Personal English Opening + Caro-Kann repertoire and middlegame-plan trainer.

## GitHub Pages structure

Upload every file/folder in this package to the root of the repository while preserving the folders:

```
index.html
styles.css
js/core.js
js/app.js
data/repertoire.js
data/plans.js
README.md
```

GitHub Pages can continue deploying from `main` and `/(root)`.

## Architecture

- `js/core.js` — board pieces, FEN/legal-move engine, repertoire registration helpers
- `data/repertoire.js` — English/Caro-Kann opening tree and drill lines
- `data/plans.js` — middlegame structure/plan knowledge
- `js/app.js` — UI, drill/explorer/quiz/plans/bot behavior and progress
- `styles.css` — layout and mobile styles

V2 intentionally separates knowledge from the chess/UI engine so the repertoire can grow without turning `index.html` into one fragile file.

## V2.1
- Renamed Drill → **Train** and Explorer → **Study** to clarify their roles.
- Train hides answers and auto-plays the opponent; Study shows the repertoire tree and never auto-plays.
- Quiz is now board-based: four legal candidate moves are highlighted and you answer by moving the piece.
- Bot mode no longer treats a blocked Stockfish web worker as game over. It uses a same-origin Blob worker when possible and a built-in fallback engine otherwise.
