# Into the Yugibreach

## units-db.js conventions

1. **Monster `cost` is always the monster's real Duel Monsters Level/Star rating** — not an independently chosen balance value.
2. **Monsters must be listed in alphabetical order by name** (which also matches alphabetical order by object key, since keys are the snake_case form of the name). When adding a new unit, insert it in the correct alphabetical position rather than appending to the end.

## Adding a new unit — sprite fetch steps

Every unit in `UNIT_DATABASE` must have a matching sprite at `assets/sprites/<unit_id>.jpg`, used for its board token, roster cards, legend, and unit-info panel (see `spritePath()` in `index.html`). When adding a new unit, fetch its art the same way the existing set was sourced:

1. Query the YGOPRODeck public card API for the card's cropped artwork (no card frame/border):
   ```
   curl -s "https://db.ygoprodeck.com/api/v7/cardinfo.php?name=<URL-encoded card name>" \
     | jq -r '.data[0].card_images[0].image_url_cropped'
   ```
2. Download that URL to `assets/sprites/<unit_id>.jpg`, where `<unit_id>` is the exact key used in `UNIT_DATABASE`:
   ```
   curl -s -o "assets/sprites/<unit_id>.jpg" "<cropped_url>"
   ```
3. Don't download or keep the full (non-cropped) card image — only the cropped artwork is used anywhere in the game; unused files shouldn't be added.
4. This is for personal/local use only — the fetched art is Konami's copyrighted card art. Don't publish, distribute, or bundle this project (including `assets/sprites/`) anywhere it'd be shared beyond the user's own machine.

## items-db.js conventions

1. **Item `cost` is a hand-tuned star-chip shop price**, not a Duel Monsters Level/Star rating — Spell/Trap cards have no Level/Star, so the `units-db.js` cost convention doesn't apply here.
2. **Items must be listed in alphabetical order by name**, same convention as `units-db.js`.
3. Every item must have a matching sprite at `assets/items/<item_id>.jpg` (see `itemSpritePath()` in `index.html`), fetched the same way unit sprites are (see steps above) — the YGOPRODeck API works for Spell/Trap cards by name too, not just Monsters.
