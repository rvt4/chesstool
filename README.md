# ChessTool V2.19

Repertoire-depth and mistake-pattern release.

## Mistake Trends
Completed Game Reviews now save only **your** meaningful errors (Inaccuracy, Mistake,
Miss, Blunder) to browser localStorage.

The Bot screen shows a persistent Mistake Trends card with:
- games reviewed;
- total logged errors;
- serious errors;
- most frequent mistake categories;
- five recent mistakes and the engine's preferred move;
- a current focus habit based on the most common category.

Categories include hanging/loose pieces, exchange calculation, king safety, central
pawn decisions, queen tempi, piece coordination, missed tactics, and missed forced mate.

Re-running Fast/Deep on the same game replaces that game's log instead of double-counting it.
History is capped at 60 games and can be cleared from the card.

## Deeper repertoire
Four additional common branches were added:
- English vs ...e6 — Exchange/QGD structure
- English Symmetrical — ...e6 / central break
- Caro-Kann Exchange — Nf3/Bd3 setup
- Caro-Kann Advance — 4.Nc3 / g4

These extend training farther into the opening-to-middlegame transition and map into
the existing strategic plan modules.

## Missed forced mate explanation
When a move receives `ⓧ Miss` because it gives up a forced mate, the explanation now
states the previous mate distance, the preferred continuation when available, and that
the forced mate was lost even if the position remains winning.

Everything from V2.18 remains, including Book-only repertoire labels, transposition
recognition, Fast Review reliability/caching, tactical bot overrides, concrete punishment
lines, Brilliant verification, mate grading, and middlegame coaching.
