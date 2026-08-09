# ChessTool V2.25

Focused Replay verification update.

## Replay no longer trusts the cached review best move
When you tap Replay, ChessTool now:
1. restores the exact position before your mistake;
2. runs a fresh full-strength Stockfish search with cache bypassed;
3. updates the replay target if the fresh best move differs from the old review result;
4. waits for that verification before allowing a correction attempt.

## Every attempted correction is freshly scored
Your move is analyzed with `searchmoves` from the ORIGINAL position so its evaluation
is directly comparable with the freshly verified best move.

Replay accepts:
- the fresh engine best move; or
- a near-equivalent move within roughly 0.35 pawns of the fresh best.

It no longer says `Correct` solely because your move matches an old stored SAN.

## Opponent strongest-reply sanity check
After your attempted correction, ChessTool freshly analyzes the resulting position and
shows:
- the resulting evaluation;
- the opponent's strongest reply;
- a short description of what that reply does when available.

This is designed for cases like a suggested `O-O-O` where the user notices a possible
`Nf7` rook fork. Even if castling is still objectively best, Replay will surface Nf7 as
the opponent's strongest response instead of hiding the tactical consequence.

If the attempted move is not good enough, Replay returns you to the original position
after showing the fresh best move and opponent response.

## Reliability
Fresh Replay searches deliberately bypass the normal Game Review cache. If Stockfish
cannot fresh-verify a position, Replay refuses to mark a move correct rather than
falling back to stale cached analysis.

All V2.24 Mistake Coach themes, confidence weighting, garbage-time filtering,
Game Review, bot play, opening repertoire, and middlegame training remain unchanged.
