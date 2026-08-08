# ChessTool V2.9

Focused update for more realistic rated opponents and more useful early-middlegame feedback.

## More human 1400–2000 opponents

V2.8's UCI Elo-limited bot could still match Stockfish's first choice far too often. V2.9 changes normal bot play to a MultiPV candidate model:

- Stockfish generates several strong candidate moves.
- 1400 samples more broadly among the top four.
- 1600 samples among the top four with a stronger preference for #1.
- 1800 samples mostly among the top three.
- 2000 strongly favors the top move but can still choose a strong alternative.
- Full remains full-strength.

This creates plausible inaccuracies without intentionally choosing nonsense moves.

The V2.8 tactical-conversion layer remains above this system:
- 1400 converts short forced mates (about M5 or shorter).
- 1600 about M7.
- 1800 about M10.
- 2000 about M14.
- Large forcing tactical wins can also override the humanized choice.

So the bot should make club-player positional errors while still finishing obvious wins.

## Same-parent move accuracy through move 20

For the first 40 plies (move 20), Game Review now performs a second constrained Stockfish search for the move actually played.

Instead of grading a move only by comparing:
`evaluation of position A` vs `separate evaluation of position B`

ChessTool compares the engine's best line and the played move from the **same parent position**. This is specifically intended to reduce false opening labels caused by search-to-search evaluation drift, such as normal English repertoire moves being called inaccuracies.

The displayed evaluation remains the evaluation of the resulting board position. The move grade uses the same-parent comparison when available.

## Better explanations, especially moves 6–20

Game Review now explains more than the label:
- what the played move does;
- what Stockfish preferred;
- the practical purpose of the best move;
- estimated winning-chance loss when meaningful;
- central pawn commitments;
- king-safety consequences of flank pawn moves;
- development/queen-move considerations;
- exchange consequences;
- forcing-move calculation reminders.

Moves 6–20 receive extra early-middlegame strategic prompts because this is the key training transition.

## Better live middlegame coaching

Train mode's middlegame feedback now includes:
- the purpose of Stockfish's preferred move;
- strategic goal;
- key pawn break;
- ideal piece setup;
- opponent's plan/threat when you need to retry.

All V2.8 mate conversion, legal engine gating, strict Brilliant verification, forced-mate grading, repertoire training, and middlegame blueprints remain intact.
