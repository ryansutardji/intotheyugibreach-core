## To-do items to improve gameplay

- [ ] **Boss nodes**: special high-value/high-difficulty nodes on the map (single
      scripted high-cost monster — Blue-Eyes, Exodia pieces, etc.) instead of a normal
      AI draft, replacing the old "every N stages" cadence now that stages aren't linear.
- [ ] **Equip-style reward**: still open — could be reframed as another thing purchasable
      with Star Chips at home base (a Spell/Trap-flavored modifier attached to one unit)
      rather than a random per-stage node reward.
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
- [ ] **Give boss nodes distinct AI behavior**: the enemy AI is currently one greedy
      heuristic for every unit (nearest-target Manhattan distance, `index.html:1595-1616`) —
      no role-based prioritization, no bespoke patterns. Ties directly into the **Boss
      nodes** item above: a boss with a scripted, still-telegraphed-but-distinct behavior
      (e.g. always targets lowest current HP, always retreats after attacking) would read
      as a real set-piece rather than just a bigger stat total.
- [ ] **Give Attribute (LIGHT/DARK/EARTH/WIND/FIRE/WATER) a mechanical hook**: Attribute is
      pure flavor today (only referenced in UI display code) while Type has exactly four
      hardcoded, unit-ID-specific interactions (Kaiser Sea Horse/Troop Dragon's Dragon
      adjacency, Silver Fang's Beast adjacency, Blue-Eyes' anti-Spellcaster weakness,
      Insect Queen's Insect-death counter) rather than a generic synergy system. Lower
      priority and more speculative than the items above, but the most under-used axis for
      future draft-time build-crafting/replayability.