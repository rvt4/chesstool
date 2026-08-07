# ChessTool V2.2

Personal English Opening / Caro-Kann repertoire trainer.

## Modes

- **Train** — choose repertoire lines, start a session, and recall your moves from memory. The opponent automatically chooses random compatible continuations from the lines you selected. Any legal move can be played; a repertoire miss is shown, explained, and then the position resets so you can retry.
- **Study** — same autoplay/session engine, but your recommended repertoire moves and explanations are visible. Stored middlegame blueprints appear when the position reaches one of the plan structures.
- **Play vs Bot** — play a complete game. Game Review grades repertoire moves during the opening and gives local-search move grades/evaluations after the game leaves the repertoire.

## Files

- `index.html` — UI shell
- `styles.css` — styling
- `js/core.js` — chess rules, legal moves, SAN/FEN handling, repertoire registration
- `js/app.js` — Train/Study session engine, bot, review, UI behavior
- `data/repertoire.js` — English and Caro-Kann repertoire lines
- `data/plans.js` — middlegame-plan knowledge

## V2.2 changes

- Removed separate Quiz and Plans navigation; plan teaching is folded into Study.
- Train and Study now both autoplay the opponent.
- Opponent choices are random only among selected lines that match the current move history.
- Users can make any legal move in Train/Study.
- Wrong repertoire moves are displayed, explained, then automatically rewound for another try.
- Rebuilt the English vs `1...e5` main branch as a coherent Four Knights line.
- Expanded selected drill definitions to use their full stored continuations.
- Game Review no longer labels every post-opening player move simply “Out of book”; it provides a local-search grade, evaluation, and suggested local-best move when appropriate.
