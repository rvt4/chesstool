# ChessTool V2.24

Focused Mistake Coach interpretation update.

## Hierarchical coaching themes
Specific categories are preserved, but related errors also roll up into broader trainable themes:
- Coordination & threat awareness
- Calculation & forcing moves
- King safety & forcing threats
- Pawn structure & timing
- Planning & tempi

This prevents superficially different moves (for example a bishop move and a rook move) from being treated as unrelated when the common issue is piece coordination or failure to account for the opponent's threat.

## Confidence-aware Current Focus
Current Focus now uses impact, recency, number of occurrences, and number of distinct games. A single expensive mistake can matter, but a pattern repeated across several games receives much more confidence. The focus message reports the number of occurrences and games supporting the conclusion.

## Garbage-time filtering
Once the user is already decisively lost (about -6 or worse from the user's perspective, or already being mated), later engine-label noise is no longer saved into persistent habit history. The move that actually caused the collapse is still logged because the position was not yet decisively lost before that move.

This also prevents capped +/-10 evaluations from creating fake 5-10 pawn long-term mistake impacts late in lost games.

## Cleaner semantic categories
- `Pawn break / central decision` is renamed to `Central pawn / structure decision`.
- `Pawn / endgame technique` is only used in the Endgame phase; otherwise late pawn errors use `Pawn structure / technique`.
- Old saved category names are normalized when possible without requiring the user to clear history.

## Retained
Replay correction training, phase tracking, severity/recency weighting, Book handling, bot logic, Fast/Deep Game Review, contextual Brilliant grading, and persistent local history remain unchanged.
