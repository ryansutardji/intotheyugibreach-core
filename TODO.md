## To-do items to improve gameplay

- [ ] **Create unit database**: The units-db.js is hard to read so we need to build a view that
      can be accessed in-game with all the units, stats and effects so we can easily see what 
      units have what. There should be filters for attributes, types, cost and team (hero vs rival)
- [ ] **Turn on knockback**: the knockback system is fully wired end-to-end already —
      `hasKnockback()`, push-destination math, pit-shove-kills-on-landing resolution, AI
      turn planning, and its own purple telegraph arrow all exist (`index.html` ~1225-1400,
      1680-1708, 1927-1943) — but zero units in `units-db.js` actually set `knockback: true`,
      despite the in-game legend already describing the mechanic as live (`index.html:714`).
      Highest payoff-to-effort item on the list: just flag a few heavy melee units (Vorse
      Raider, Curse of Dragon, Jinzo, Gaia the Fierce Knight are thematic fits) to unlock
      Into the Breach-style "shove into the pit" plays with no engine changes needed.
- [ ] **Fix Jinzo's untelegraphed turn-start burn**: every other enemy action (move, attack,
      knockback) is shown to the player via the perfect-information turn-plan preview before
      it happens — except Jinzo's 5-dmg-to-adjacent-enemies aura, which runs in
      `applyTurnStartEffects` (`index.html:1825-1858`) after the plan is already frozen and
      shown, so it lands as a genuine surprise. Should be folded into the same telegraph pass
      as everything else for consistency.
- [ ] **Add a second hazard type**: today every hazard tile is the same
      `{ type: 'pit', impassable: true, lethalOnEntry: true }` shape — binary
      instant-death-on-entry. The code already anticipates more variety (the comment at
      `index.html:938-939` explicitly says hazard behavior is driven by flags, not a `type`
      switch, so new hazard types don't need new branching logic). A second, non-lethal
      flavor (e.g. a tile that stalls a unit for a turn, or applies damage-over-time instead
      of instant death) would make knockback pushes a real decision (kill vs. tempo) instead
      of a single binary outcome.
- [ ] **Give Attribute (LIGHT/DARK/EARTH/WIND/FIRE/WATER) a mechanical hook**: Attribute is
      pure flavor today (only referenced in UI display code) while Type has exactly four
      hardcoded, unit-ID-specific interactions (Kaiser Sea Horse/Troop Dragon's Dragon
      adjacency, Silver Fang's Beast adjacency, Blue-Eyes' anti-Spellcaster weakness,
      Insect Queen's Insect-death counter) rather than a generic synergy system. Lower
      priority and more speculative than the items above, but the most under-used axis for
      future draft-time build-crafting/replayability.
- [ ] **Turn on knockback, including into buildings**: activates the already-wired
      knockback system (see the **Turn on knockback** item above) and additionally
      decides what a push into a building tile actually does — blocked like a wall, or
      collision damage like Into the Breach's mountains — now that buildings are a real
      obstacle on the board.

## Buildings-as-objectives overhaul

The core problem today: every enemy attack only ever threatens a *mobile* player unit,
and the telegraph always tells you exactly which tile it'll land on — so dodging is
always available and always correct, and positioning never gets harder than "don't
stand there." Into the Breach avoids this because buildings are a second, *immobile*
set of stakes: attacks aimed at a building can't be solved by moving the building, only
by killing/blocking/shoving the attacker. Below is that overhaul, ordered so each step
is a real dependency for the next rather than just a suggested sequence.

- [x] **Add buildings as a protectable tile asset**: the foundation everything below sits
      on. Give buildings the same flag-driven tile treatment hazards already use
      (`index.html:938-939` already anticipates this — "hazard behavior is driven by
      flags, not a `type` switch") rather than a parallel system: an `impassable` tile
      with its own HP instead of `lethalOnEntry`.
- [x] **Let attacks target buildings**: today every attack-resolution path
      (`enemiesInRange`, `getAttackTargets`, `resolveAttack`, the turn-plan preview)
      assumes exactly two teams, `'player'` and `'enemy'`. Buildings are a third,
      damageable category that needs to be real everywhere an attack gets resolved —
      not just something the AI is aware of.
- [x] **Generate and persist buildings per node**: same shape as the existing hazard-roll
      system (`rollHazardsForNode`/`nodeHazards`) — roll count/placement/HP once per node
      and save it, so a mid-run reload doesn't re-roll buildings out from under the
      player. Confined to the player's own deployment columns (`PLAYER_ZONE_X`) rather
      than the middle of the board, for cover rather than a contested objective.
- [x] **Render buildings and add a building-status HUD element**: buildings need a board
      sprite distinct from unit sprites, plus something like the round-counter/
      turn-indicator pair to show remaining building count/HP at a glance.
- [x] **Refactor win/lose conditions around building collapse**: layer "all your buildings
      destroyed = defeat" as a universal condition under the 4 remaining objective types
      (kill all enemies / survive N rounds / eliminate the priority target / clear within
      N rounds — each becomes "...before your buildings collapse"). Retires
      `defend_tile` (subsumed by buildings existing at all) and `protect_vip` (dropped per
      design discussion) from `OBJECTIVE_TYPES`.
- [x] **Make AI actually threaten buildings**: the enemy AI is one greedy
      nearest-player-unit heuristic for every unit (`chooseAIMove`, `index.html:1595-1616`)
      with no concept of a target that isn't a player unit. Without this, buildings
      existing doesn't change how the AI plays at all — it needs to weigh attacking a
      building against attacking a player unit.

- [ ] **Rework ranged attacks (range 2+) into row/column line fire**: replace
      Manhattan-radius single-target reach with a line attack down the unit's row/column,
      the way Into the Breach's ranged units work. Requires deciding piercing (hits
      everything in the line, friendly fire included) vs. blocking (stops at the first
      thing hit) — that choice drives both the AI's line-up targeting logic and the
      player's attack-highlight UI, both of which currently only understand
      radius-based reach.
- [ ] **Give Dark Magician a new signature effect**: its current unique ability ("attacks
      hit every enemy sharing its row or column within range") is exactly what the
      row/column line-fire item above makes the default for every range 2+ unit, so it
      needs a replacement or it's just a reskin of the base rule.
- [ ] **Balance pass on ranged units' costs**: every ranged unit's `cost` was set assuming
      single-target hits (per the `cost` convention in `units-db.js`); switching to
      line/multi-target attacks is a real power jump specifically for those units and
      will need re-tuning independent of the mechanical work above.