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
- [ ] **Home base actions.** Returning to home base after an encounter lets the player:
      - Fully heal all surviving units (no damage carries between encounters).
      - Swap units between active roster and bench.
      - Spend **Star Chips** (see below) to recruit new units onto the bench, or to
        increase the active roster's max budget cap so more units can be fielded at once.
- [ ] **Currency — Star Chips.** Earned as a reward for winning an encounter (no reward
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
- [ ] **Leveling**: units gain stats via per-kill XP (not flat +X per win), echoing the
      existing `baby_dragon` "+3 ATK per kill" effect already in `units-db.js`. Ties
      growth to how the fight actually went. Now sits on top of persistent units rather
      than being moot (previously units never survived past one stage, so growth had
      nowhere to accumulate).
- [ ] **Boss nodes**: special high-value/high-difficulty nodes on the map (single
      scripted high-cost monster — Blue-Eyes, Exodia pieces, etc.) instead of a normal
      AI draft, replacing the old "every N stages" cadence now that stages aren't linear.
- [ ] **Equip-style reward**: still open — could be reframed as another thing purchasable
      with Star Chips at home base (a Spell/Trap-flavored modifier attached to one unit)
      rather than a random per-stage node reward.

## Open questions for later

- Map generation: procedural vs. fixed layout, how many nodes, node variety/types
  beyond "normal" and "boss."
- Exact Star Chip amounts: recruit cost curve, budget-cap upgrade cost curve, per-win
  reward amount (probably scales with node difficulty).
- Exact XP curve / stat growth formula per level-up.
- What the "equip modifier" reward actually does mechanically (Spell/Trap flavor).
- Retry behavior details: confirm "same node/difficulty, fresh AI redraft, no reward"
  is really the desired default for a failed encounter.
