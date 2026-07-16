## To-do items to improve gameplay

- [ ] **Boss nodes**: special high-value/high-difficulty nodes on the map (single
      scripted high-cost monster — Blue-Eyes, Exodia pieces, etc.) instead of a normal
      AI draft, replacing the old "every N stages" cadence now that stages aren't linear.
- [ ] **Equip-style reward**: still open — could be reframed as another thing purchasable
      with Star Chips at home base (a Spell/Trap-flavored modifier attached to one unit)
      rather than a random per-stage node reward.
- [ ] **Act structure**: the current 10-ish node map is "Act 1." Set up the code (node
      data, map rendering, save data) so nodes are labeled/grouped by act now, with
      room to add Act 2, 3, 4+ later without another data-model rewrite.

## Battle-puzzle overhaul (Into the Breach-style)

The meta-loop (star chips, recruiting, XP/leveling, permadeath, the node map) already
works. The battle-to-battle gameplay doesn't yet deliver the "Into the Breach" feel —
it plays as a generic tactics skirmish because it borrows ITB's setup (grid, budget
squads, turns) without ITB's actual verb: perfect information about incoming threats,
plus terrain/knockback to redirect them. These three items close that gap and are
meant to be done **in this order** — each one's payoff depends on the previous one
existing (terrain/knockback is only satisfying if you can see the threat coming first;
objective tiles only create tension if you can see what's about to hit them).

- [x] **Telegraph enemy intent**: show each living enemy's planned move-destination
      and attack target at the start of the player's turn, instead of the AI deciding
      and executing blind inside `startEnemyTurn` (index.html:1143). Highest-value,
      lowest-cost change of the three — do this first.
    - Split decision from execution: add `planEnemyTurn()`, run once at the start of
      the player's turn (or the moment the prior enemy turn ends), producing a
      locked-in plan per enemy: `{ unit, destTile, targetUnitId }`. Reuses the
      existing `chooseAIMove` / `bfsReachable` / target-selection logic, just called
      earlier and captured as data instead of applied immediately.
    - `executeEnemyTurn(plan)` replaces the body of `startEnemyTurn`'s per-unit loop —
      it replays the stored plan instead of recomputing from scratch.
    - Sequential dependency: enemies already act one at a time, and each one's live
      decision today depends on what earlier enemies in the *same* turn just did
      (position, kills). When planning ahead of time, simulate each planned step
      against a working copy of board state as you go, in the same order they'll
      execute in, so later enemies' plans account for earlier enemies' *planned*
      moves — this preserves today's behavior, just moved earlier in time.
    - Rendering: destination-tile highlight + arrow from the enemy's current
      position, plus a highlighted target tile/unit for the planned attack, visible
      throughout the player's turn (reuse the reachable-tile / attackable-target
      highlight styles already in `draw()`, index.html:1259).
    - Staleness handling (the hard part) — pick one of these before implementing,
      it's a real design fork, not just an implementation detail:
        - *Unit-locked plan* (simpler, fits the current chase-AI): if the planned
          target dies before execution, that enemy's attack step is skipped (or it
          re-picks a live target in range at execution time — decide which). If the
          planned destination tile is blocked by something that moved there, fall
          back to recomputing movement only while keeping the same target intent.
        - *Tile-locked plan* (more ITB-authentic, more robust, bigger behavioral
          shift): the enemy commits to attacking a specific *tile*, not a unit — if
          the player moves the threatened ally away, the attack still lands on the
          tile but hits nothing; if a different unit steps onto that tile, it eats
          the hit instead. Avoids retarget logic entirely, but is a bigger step away
          from the current mobile chase-AI and may want slower/more stationary enemy
          archetypes to feel right.
    - Once this lands, revisit damage variance (`applyAttackDamage`, index.html:930,
      currently `0.85 + Math.random() * 0.3`, i.e. ±15-30% RNG): a telegraph that's
      still subject to a wide damage roll undercuts the "I solved this" feeling.
      Consider shrinking or removing the variance so telegraphed outcomes are close
      to deterministic.

- [ ] **Terrain + knockback**: add hazard tiles and a push-on-hit mechanic so
      positioning matters and telegraphed attacks can be redirected or countered
      instead of just dodged or tanked. Do this after intent telegraphing — knockback
      is only satisfying when you can see the threat coming and choose to block or
      redirect it; without telegraphing it's just more variance.
    - Start small: one hazard type (e.g. a "pit" tile that instantly destroys
      whatever gets shoved into it) plus knockback as a property of specific
      units/attacks, not a universal mechanic or a general hazard framework — smaller
      surface, still delivers the "turn their own attack against them" moment.
    - Data: per-node hazard tile layout — extend `MAP_NODES` entries (index.html:654)
      with a hazard-tile list (coordinates + hazard type), rendered as part of the
      board loop in `draw()`.
    - Combat: a knockback-resolution step in `applyAttackDamage` / `resolveAttack`
      (index.html:927 / 970) — on a knockback-flagged attack, compute the tile
      directly behind the defender (attacker→defender direction extended one tile);
      if it's off-board or occupied, the push fails (or the occupant takes collision
      damage — decide); if it's a hazard tile, resolve the hazard effect (e.g.
      instant death for a pit).
    - AI awareness: at minimum, `chooseAIMove` should avoid obviously bad knockback
      lanes for the AI's own units; stretch goal is enemies that actively try to
      shove player units into hazards.
    - Each node's hazard layout becomes part of that node's identity and difficulty,
      not just its budget number — gives the map real variety, since every node
      today is the same empty 8x8 checkerboard.

- [x] **Objective-based win conditions**: six win/loss modes beyond plain
      kill-all-enemies, randomly assigned across all 10 map nodes each run (kill-all
      included as just one of the six, not a fallback) via `rollNodeObjectives()`,
      persisted through `saveGame`/`loadGame` alongside `clearedNodes` so a reload
      doesn't re-roll them.
        - *Kill All Enemies* — unchanged baseline.
        - *Protect the VIP* — one already-placed unit from the player's own squad is
          flagged at random when `beginBattle()` runs (not a separate scripted NPC —
          simpler, and reuses the existing roster). Losing it is defeat regardless of
          the rest of the squad.
        - *Defend the Tile* — a board square rolled in the player's deployment zone;
          instant defeat the moment an enemy's move lands it there (`checkTileBreach`,
          called from `startEnemyTurn` right after each move resolves). Enemies also
          treat the tile as an extra pathing target in `planEnemyTurn` (alongside
          player units), since without that they'd only ever reach it by coincidence.
        - *Survive N Rounds* / *Turn-Limited Clear* — a round threshold scaled off
          node budget, checked in `startPlayerTurn` right after `round` increments;
          survive wins automatically past the threshold, timed-clear loses
          automatically past it if enemies remain.
        - *Eliminate the Priority Target* — the drafted enemy team's highest-cost unit
          is flagged in `enterPlacementPhase` right after `placeAITeam`; killing it
          ends the battle in victory instantly via an additive check in
          `checkGameOver`, independent of the rest of the enemy team.
    - UI: objective badges on map node cards (`renderMap`), full description on the
      draft/preview screen (`renderMissionIndicator`, `confirmTeam`), live status in
      the battle turn panel (`renderObjectiveStatus`), board markers (guarded-tile
      glow, VIP/priority-target rings in `draw()`), and objective-aware victory/defeat
      banner text in `endGame`.
