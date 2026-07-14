## To-do items to improve gameplay

- [ ] **Boss nodes**: special high-value/high-difficulty nodes on the map (single
      scripted high-cost monster — Blue-Eyes, Exodia pieces, etc.) instead of a normal
      AI draft, replacing the old "every N stages" cadence now that stages aren't linear.
- [ ] **Equip-style reward**: still open — could be reframed as another thing purchasable
      with Star Chips at home base (a Spell/Trap-flavored modifier attached to one unit)
      rather than a random per-stage node reward.
- [ ] **Expand the map to ~10 locations**: grow `MAP_NODES` from the current 5 nodes to
      about 10. Location names should stay within the pre-GX Yu-Gi-Oh era (original
      series / Duelist Kingdom / Battle City / Waking the Dragons, etc.) — same theming
      as the existing node names.
- [ ] **Win condition**: clearing every node on the map (see the win-only node-lock in
      `clearedNodes`) should be treated as beating the game — needs an explicit
      win/completion screen rather than just leaving the player with a fully-cleared map.
- [ ] **Act structure**: the current 10-ish node map is "Act 1." Set up the code (node
      data, map rendering, save data) so nodes are labeled/grouped by act now, with
      room to add Act 2, 3, 4+ later without another data-model rewrite.
- [ ] **Kaiser Sea Horse rework**: broaden its effect in `units-db.js` from "adjacent to
      Blue-Eyes White Dragon specifically" to "adjacent to any Dragon-type ally" (mutual
      +6 ATK), instead of naming one specific unit.
- [ ] **Randomize the initial draft pool**: the starting draft screen currently offers
      every unit in `UNIT_DATABASE`. Instead it should show only 8 units chosen at
      random, so the opening squad isn't the same every run.
