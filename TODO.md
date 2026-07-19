## To-do items to improve gameplay

- [ ] **Fix enemy plan desync after a mid-turn knockback**: the enemy turn is
      planned once at the start of the player's turn (`planEnemyTurn`,
      `index.html` ~2312) and captured as fixed absolute tiles — `path`,
      `destX`/`destY`, `primaryStrikeTiles` — then replayed verbatim in
      `startEnemyTurn` (~2515-2569). The replay loop already tolerates the
      *board* changing since planning (a blocker moving in, the attacker
      dying) but not the *planned unit itself* moving: since every attack now
      knocks its target back, a player attack during their own turn can shove
      an enemy off the tile its plan was built from, so by the time that
      enemy's turn comes up `unit.x/y` no longer matches `entry.fromX/fromY`.
      The replay still walks `entry.path`'s stale absolute waypoints from the
      unit's new (shoved) position without checking they're even adjacent to
      it, so the unit can land wherever the stale path happens to end up —
      including right back on its own current tile, which reads as "didn't
      move at all," silently ditching the telegraphed advance. Its
      `primaryStrikeTiles` attack targets are similarly pinned to the
      pre-knockback plan, so the follow-up attack can also miss or hit the
      wrong tile. Needs either a fresh re-path (at minimum) for any unit whose
      position no longer matches its `fromX`/`fromY` when its turn comes up,
      or invalidating/re-telegraphing that unit's whole plan entry. Another option
      is to actually have the opponent units move first then telegraph their attack,
      which is very similar to how Into the Breach does it.
- [ ] **Add a second hazard type**: today every hazard tile is the same
      `{ type: 'pit', impassable: true, lethalOnEntry: true }` shape — binary
      instant-death-on-entry. The code already anticipates more variety (the comment at
      `index.html:938-939` explicitly says hazard behavior is driven by flags, not a `type`
      switch, so new hazard types don't need new branching logic). A second, non-lethal
      flavor (e.g. a tile that stalls a unit for a turn, or applies damage-over-time instead
      of instant death) would make knockback pushes a real decision (kill vs. tempo) instead
      of a single binary outcome. Candidate flavors, roughly in order of how cleanly they
      fit the existing flag system:
  - [ ] **Chasm/wall** (near-free): `{ impassable: true, lethalOnEntry: false }` already
        works with the existing flags — no new fields needed. Just needs a "blocked, no
        death" branch in the knockback resolution block (`index.html` ~1761-1799),
        parallel to the existing building-blocks-knockback case.
  - [ ] **Mountain**: passable, non-lethal, `damageReduction: 0.5` while a unit stands on
        it. Hooks into `incomingDamageMultiplier` (`index.html:1548`) by checking the
        defender's current tile against `currentHazards()`. Doesn't interact with
        knockback resolution at all since it's passable.
  - [ ] **Lava / damage-over-time**: passable, non-lethal on entry, but ticks damage
        (`dotOnTurnEnd: N`) at end of turn for whoever's standing on it — including units
        that walked on voluntarily, not just ones knocked in. Most directly answers the
        "damage-over-time instead of instant death" idea above, but touches turn-end
        resolution rather than just the attack path, so it's a bigger change than the
        other flavors.
  - [ ] **Ice / slippery**: passable, `slippery: true` — a knockback onto it doesn't stop
        after one tile, it keeps sliding until blocked by something. Changes knockback's
        *reach* instead of its *outcome* (e.g. could chain into a pit two tiles away).
        Most fun, but riskiest: needs to handle sliding into another hazard, off-board, or
        through multiple slippery tiles in a row.
- [ ] **Give Attribute (LIGHT/DARK/EARTH/WIND/FIRE/WATER) a mechanical hook**: Attribute is
      pure flavor today (only referenced in UI display code) while Type has exactly four
      hardcoded, unit-ID-specific interactions (Kaiser Sea Horse/Troop Dragon's Dragon
      adjacency, Silver Fang's Beast adjacency, Blue-Eyes' anti-Spellcaster weakness,
      Insect Queen's Insect-death counter) rather than a generic synergy system. Lower
      priority and more speculative than the items above, but the most under-used axis for
      future draft-time build-crafting/replayability.