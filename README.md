# ChessTool V2.21

Focused Mistake Coach accuracy update.

## Fixed false "King safety / mate threat" trend
V2.20 searched explanation text for the substring `mate`. That accidentally matched
words such as `estimated`, causing unrelated mistakes to be dumped into the king-safety
bucket.

V2.21 only uses actual mate engine states or whole-word mate/checkmate language.

## Smarter categories
Mistakes are now classified into more specific habits:
- Missed forced mate
- King safety / mate threat
- Hanging / undefended piece
- Calculation / exchanges
- Missed opponent threat
- Missed tactic
- Premature queen move / tempo
- Pawn break / central decision
- Premature attack / pawn weakening
- Pawn / endgame technique
- Rook placement / coordination
- Piece activity / coordination
- Tactical oversight
- Decision quality

## Less noise
Long-term Mistake Trends no longer save every tiny engine inaccuracy.
- Inaccuracies must cost roughly 0.75 pawns or more to enter the trend log.
- Mistakes must have a meaningful impact.
- Book moves are never logged as mistakes.

The full Game Review still shows all engine labels; this filter only affects the
persistent habit tracker.

## Better severity and focus
Trend importance is now driven primarily by actual evaluation impact, then adjusted
for the move label and recency.

One game-changing blunder should outweigh several small inaccuracies.

The Current Focus uses severity × recency rather than raw count alone.

## Existing V2.20 data
Stored history is re-normalized when displayed so old V2.20 categories do not continue
to dominate the trends simply because they were saved under the old taxonomy.

All V2.20 replay, phase tracking, review engine, bot behavior, Book handling, and
middlegame training remain unchanged.
