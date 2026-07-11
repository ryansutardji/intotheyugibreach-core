# Into the Yugibreach

## units-db.js conventions

1. **Monster `cost` is always the monster's real Duel Monsters Level/Star rating** — not an independently chosen balance value.
2. **Monsters must be listed in alphabetical order by name** (which also matches alphabetical order by object key, since keys are the snake_case form of the name). When adding a new unit, insert it in the correct alphabetical position rather than appending to the end.
