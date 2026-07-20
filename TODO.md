## To-do items to improve gameplay

- [ ] **Add 12 new hero-side units to close attribute-synergy gaps**: audited
      whether every attribute can reach `ATTRIBUTE_SYNERGY` tier 2 (3+ living
      same-attribute allies, see `index.html` `attributeSynergyTier`) on the
      hero side, under the constraint that the *cheapest 3 units of that
      attribute* must sum to ≤ 10 cost (`DRAFT_BUDGET`, `index.html:3867` —
      the starting squad budget cap; it does grow via "Increase Budget Cap"
      but 10 is the floor every run starts from). Only DARK cleared this
      today (cheapest-3 = 7); EARTH failed by 1 (cheapest-3 = 11); LIGHT,
      WATER, WIND, and FIRE didn't even have 3 non-boss hero units to work
      with. Also wanted, per-attribute, at least one 6+ cost unit so players
      can trade a 3-unit tier-2 core for a 2-unit tier-1 pairing (one strong
      6+ unit + one cheap one) — DARK already has this via dark_magician_girl
      (6)/summoned_skull(6)/dark_magician(7); capped new additions at exactly
      1 six-plus per attribute so as not to crowd out the cheap end.
      `black_luster_soldier` doesn't count toward LIGHT here — it's excluded
      from the draft pool (`isBoss`) and only ever appears on the AI's side
      via `draftBossTeam`, never recruitable by the player.

      Below is the finalized pick list — real pre-GX Yu-Gi-Oh cards, real
      Level used as `cost` (per this file's own rule 1), **no attribute
      reskinning** (every pick's in-game attribute matches its real
      attribute, unlike existing units such as Silver Fang [real EARTH,
      shown as WATER in `units-db.js`] or Time Wizard [real LIGHT, shown as
      DARK]). Still need hp/atk/move/range/effect stat-balancing and sprite
      fetches (see "Adding a new unit" section above) before going into
      `UNIT_DATABASE` — costs/attributes below are locked, stats are not.

  - [ ] **EARTH** (was cheapest-3 = 11, needed ≤ 10 — fixed by adding one
        Lv3): add **Swordsman of Landstar** (cost 3, EARTH, Joey's Starter
        Deck). New cheapest-3: giant_soldier_of_stone(3) + Swordsman(3) +
        beaver_warrior/celtic_guardian(4) = 10. 6+ unit unchanged
        (gaia_fierce_knight, 7).
  - [ ] **LIGHT** (had only 2 non-boss units, no 6+): add **Watapon** (cost
        1, LIGHT) and **Gilford the Lightning** (cost 8, LIGHT — Yugi vs.
        Rafael, Doma arc, matches the existing `waking_the_dragons` map
        node). Cheapest-3: 1 + injection_fairy_lily(2) + mystical_elf(4) = 7.
  - [ ] **WATER** (had only 1 non-boss unit, no 6+): add **Penguin Soldier**
        (cost 2, WATER, Joey's Starter Deck), **7 Colored Fish** (cost 4,
        WATER, Joey's Starter Deck), and **Levia-Dragon - Daedalus** (cost 7,
        WATER — *Invasion of Chaos* 2004, board-wipe effect: destroys all
        Spells/Traps + burns). Cheapest-3: 2 + silver_fang(3) + 4 = 9.
  - [ ] **WIND** (had only 1 non-boss unit, no 6+): add **Princess of
        Tsurugi** (cost 3, WIND, Joey's Starter Deck), **Sky Scout** (cost 4,
        WIND, Joey's Starter Deck), and **Chimera the Flying Mythical Beast**
        (cost 6, WIND — Yugi's own fusion of Gazelle + Berfomet, from
        *Structure Deck: Yugi Muto*). Cheapest-3: baby_dragon(3) + 3 + 4 =
        10.
  - [ ] **FIRE** (had only 1 non-boss unit, no 6+ — tightest budget of all
        five): add **Flame Manipulator** (cost 3, FIRE, Joey's Starter
        Deck), **Little Chimera** (cost 2, FIRE — *Metal Raiders* 2003, real
        piercing-damage effect; unrelated card to the WIND "Chimera" above,
        just a name coincidence), and **Flame Cerebrus** (cost 6, FIRE —
        *Metal Raiders* 2003, vanilla). Cheapest-3: 2 + 3 +
        flame_swordsman(5) = 10.

  Rival-side attribute-synergy audit not yet done — hero side only so far.
