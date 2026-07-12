# Roguelike Progression — Design TODO

Currently a "run" is a single battle: draft → fight → win/lose → `resetToDraftScreen()`
wipes everything. Goal: turn this into a run-based roguelike/dungeon-crawl with real
progression, so repeated play doesn't feel like the same loop.

## Straw-man plan (agreed direction)

- [x] **Run structure**: linear stage ladder (Stage 1 → 2 → 3 → ... → Boss). Implemented
      as a plain 5-stage ladder (`stage`/`TOTAL_STAGES` in `index.html`), each stage a
      completely fresh draft (no squad persistence yet — see below). Boss stages not
      yet added. Revisit branching map (Slay the Spire style node choices) later only
      if linear feels flat.
- [ ] **Squad persistence**: draft once at the start of a run — that's your run identity.
      No full redraft between stages. (Current implementation intentionally redrafts
      fresh every stage; this is the next phase.)
- [ ] **Leveling**: units gain stats via per-kill XP (not flat +X per win), echoing the
      existing `baby_dragon` "+3 ATK per kill" effect already in `units-db.js`. Ties
      growth to how the fight actually went.
- [ ] **Between-stage reward node**: instead of a full redraft, offer a small choice —
      e.g. pick 1 of 3 random new units to add to the roster, a stat boost, or an
      equip-style Spell/Trap modifier attached to one unit.
- [x] **Difficulty scaling**: AI draft budget now scales per stage via
      `aiBudgetForStage(stageNum) = DRAFT_BUDGET + (stageNum - 1) * 3` in `index.html`,
      giving stage budgets 10/13/16/19/22 against the player's fixed 10. `draftAITeam`
      itself is unchanged — only its call-site argument varies. Biasing higher-cost
      monsters into the AI pool as stages climb is still open (currently the AI's
      random uniform pick is unaffected, it just has more budget to spend).
- [ ] **Boss stages**: single scripted high-cost monster (Blue-Eyes, Exodia pieces,
      etc.) every N stages instead of a normal AI draft.
- [ ] **Permadeath**: full death sends you back to level 1 / fresh draft for the next
      run (per original idea 2).
- [ ] **Meta-unlock layer**: something needs to survive death so repeated runs still
      feel like progress. Bank a currency/progress metric across runs that unlocks new
      draftable units, alternate starting conditions, or cosmetics for future runs.

## Open questions for later

- Branching map vs. linear ladder — revisit once linear is implemented and played.
- Exact XP curve / stat growth formula per level-up.
- What the "equip modifier" reward actually does mechanically (Spell/Trap flavor).
- What currency the meta-unlock layer uses and what it unlocks first.
