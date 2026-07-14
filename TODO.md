# Roguelike Progression — Design TODO

Currently a "run" is a single battle: draft → fight → win/lose → `resetToDraftScreen()`
wipes everything. Goal: turn this into a mission-based meta-progression game with real
stakes and persistence, so repeated play doesn't feel like the same loop.

## Straw-man plan (agreed direction, v2)

- [x] **Run structure — home base + map, not a ladder.** Overhauls the old flat 5-stage
      ladder. Player has a persistent home base. From home base, the player picks which
      node on a map to deploy to (not a strictly linear stage 1→2→3 progression) — think
      choosing a mission rather than climbing a ladder. After an encounter (win or lose),
      the player returns to home base before deploying again.
- [ ] **Difficulty scaling — per-node budget, not per-stage formula.** Replaces the old
      `aiBudgetForStage(stageNum) = DRAFT_BUDGET + (stageNum - 1) * 2` formula. Each node
      on the map has its own AI draft budget baked into that node (harder/farther nodes =
      bigger AI budget), rather than difficulty being purely a function of how many
      stages you've cleared in sequence.
- [x] **Squad persistence — active roster + bench, not a full redraft.** Player owns a
      pool of units across the whole run: some on the **active roster** (deployable,
      counts against the draft budget cap) and some on the **bench** (owned, but not
      currently fielded). Before each encounter, the player drafts their active squad
      for that fight from currently-available roster units within budget — this replaces
      the old "redraft everything from `UNIT_DATABASE` every stage" behavior.
- [x] **Home base actions.** Returning to home base after an encounter lets the player:
      - Fully heal all surviving units (no damage carries between encounters).
      - Swap units between active roster and bench.
      - Spend **Star Chips** (see below) to recruit new units onto the bench, or to
        increase the active roster's max budget cap so more units can be fielded at once.
- [x] **Currency — Star Chips.** Earned as a reward for winning an encounter (no reward
      on a loss — losing should cost real opportunity, not just be a free retry). Spent
      at home base on recruiting bench units and on budget-cap upgrades.
- [x] **Unit death is permanent.** A unit that dies during an encounter is removed from
      the roster *and* the bench forever — it does not return, healed or otherwise. This
      is the real cost of a bad encounter, even though survivors fully heal at home base.
- [ ] **Losing an encounter does not end the run.** If the active squad is wiped in a
      fight, the player returns to home base (dead units are gone per above), can pull
      replacements from the bench, and retries — current default assumption: same node,
      same difficulty, AI redrafts fresh (not literally identical every retry, but not
      escalated just because the player failed). No Star Chip reward for the failed
      attempt.
- [ ] **True game over / permadeath.** The run only fully resets (back to a fresh start,
      per original idea) when the player has **no units left anywhere** — active roster
      and bench both empty, nothing left to field. As long as at least one bench unit
      survives somewhere, the player can keep going.
- [ ] **Leveling — per-instance XP tied to encounter outcomes.** Each roster entry
      (`{rosterId, unitId}`) gains a persistent `level` (starts at 1) and `xp` (starts
      at 0) stored alongside it, so growth survives across encounters the same way the
      roster itself does, and is wiped along with the unit on permadeath. Newly
      recruited or drafted units always start at Level 1 / 0 XP. Enemy AI units are
      never given a roster entry, so they have nothing to level up on and always fight
      at base `UNIT_DATABASE` stats — this falls out of the existing data model for
      free with no special-casing; scaling opponent levels is a separate future item.
      - **XP curve.** XP required to go from level `L` to `L+1` is `10 * L` — leveling
        1→2 costs 10 XP, 2→3 costs 20, 3→4 costs 30, and so on, growing linearly so
        early levels come quickly and later ones take meaningfully longer. Deliberately
        low at level 1 so any unit that survives the very first encounter levels up at
        least once off survival XP alone, making growth felt right away. XP carries any
        remainder past a threshold (a big multi-kill haul can cross more than one level
        at once). Cumulative XP to reach level 5 is 100; level 10 is 450. Same curve for
        every unit — no per-unit XP scaling.
      - **XP rewards.** A unit earns `10 XP` for surviving to the end of an encounter it
        was deployed in (win, or any future non-wipe retreat), plus `40 XP` for every
        kill it personally lands during that encounter — kills are weighted 4x survival
        XP since kills should be heavily rewarded. Only units that survive the encounter
        receive any XP; a unit that died is gone forever regardless (permadeath), so
        awarding XP to it would be moot. Kill credit reuses the "attacker" convention
        `onUnitDeath` already establishes for `baby_dragon`'s growth, so chain-kills
        (man_eater_bug retaliation, flame_swordsman splash, celtic_guardian counters)
        attribute correctly with no new logic needed.
      - **Level-up reward.** Every level grants a flat, uniform `+6 HP` and `+2 ATK`,
        applied identically regardless of the unit's type or cost — no per-unit scaling,
        matching the flat-number style of `baby_dragon`'s own "+3 ATK/kill". No level
        cap — the linearly growing XP curve throttles pace on its own as levels climb.
      - **Interaction with baby_dragon's unique effect.** Its existing "+3 ATK
        permanently per kill" is untouched and keeps firing mid-battle exactly as today,
        stacking on top of (not replacing) the generic per-kill XP it also now earns
        toward leveling — it's meant to end up literally stronger than a same-level unit
        of another type, since that's the point of it being a unique card.
      - **Where stats live.** Base `UNIT_DATABASE` entries are never mutated. A leveled
        unit's effective HP/ATK are computed as `base + growth * (level - 1)` at the
        moment a battlefield instance is created, the same place `rosterId` is already
        threaded through — mirrors the existing hard split between static definitions
        and runtime instances.
      - **UI surfaces.** Level and an XP progress readout should appear anywhere a
        roster entry's card already renders outside of battle — home base squad/bench
        cards and the placement-phase roster list — plus a LEVEL row in the in-battle
        unit-info panel. The one-time initial draft and recruit-pool cards don't need
        it, since every unit shown there is always Level 1.
- [ ] **Boss nodes**: special high-value/high-difficulty nodes on the map (single
      scripted high-cost monster — Blue-Eyes, Exodia pieces, etc.) instead of a normal
      AI draft, replacing the old "every N stages" cadence now that stages aren't linear.
- [ ] **Equip-style reward**: still open — could be reframed as another thing purchasable
      with Star Chips at home base (a Spell/Trap-flavored modifier attached to one unit)
      rather than a random per-stage node reward.

## Open questions for later

- Map generation: procedural vs. fixed layout, how many nodes, node variety/types
  beyond "normal" and "boss."
- Exact Star Chip amounts: recruit cost is `unit cost + 2`, budget-cap upgrade is
  `current cap * 2` for +1 cap, respin/freeze are 3 each — may want tuning once
  playtested. Per-win reward amount still just `node.budget`.
- What the "equip modifier" reward actually does mechanically (Spell/Trap flavor).
- Retry behavior details: confirm "same node/difficulty, fresh AI redraft, no reward"
  is really the desired default for a failed encounter.
