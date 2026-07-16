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

## Roster expansion: hero/rival side-locked pools (not yet in units-db.js)

Every unit already has a `side: 'hero' | 'rival'` field (added, in place today). Long-term
goal: let the player pick a side at the start of a run, and draft/recruit pools only pull
from that side's units — no more risk of drafting a mirror match (e.g. Dark Magician vs.
Dark Magician). Current split is intentionally uneven (14 hero / 4 rival) — this section is
the plan to round the rival side out to parity so an 8-unit draft pool reliably offers a way
to fill a 10-cost budget on *either* side, the same way the combined 18-unit pool does today.

Target: match hero's cost-tier counts exactly (treating 7★ and 8★ as one combined bucket
since hero has none at 8): 1×cost1, 2×cost2, 3×cost3, 4×cost4, 2×cost5, 2×cost6, 2×cost7/8.
Also: rival gets a 2nd Dragon-type (alongside Blue-Eyes) so Kaiser Sea Horse's "+ATK while
adjacent to a Dragon" effect has more than one payoff partner to draft alongside it.

- [x] **Add 2 new hero units** (fills hero's cost-2 tier, which was previously empty):
    - **Time Wizard** — cost 2, hp 26, atk 9, move 3, range 2, Spellcaster, DARK.
      Effect: "Adjacent friendly units have a 50% chance to deal double damage on their
      attacks — or none at all." Support/aura unit, not a self-buff — mirrors the existing
      Giant Soldier of Stone aura-via-adjacency pattern (just on outgoing damage instead of
      incoming). Same expected value as a normal hit, just much higher variance for whoever
      stands next to it.
    - **Injection Fairy Lily** — cost 2, hp 34, atk 7, move 2, range 1, Fairy, LIGHT.
      Effect: "Deals +200% damage on attacks while below 50% HP." Adapts the real card's
      "pay Life Points for a huge ATK spike" identity into an automatic HP-threshold trigger
      (mirrors Feral Imp's existing "+40% dmg vs targets below half HP" shape, just checking
      the attacker's own HP instead of the target's) rather than inventing a new
      player-activated-ability system that doesn't exist anywhere else in the codebase.

- [x] **Add 12 new rival units:**
    - **Sinister Serpent** — cost 1, hp 20, atk 8, move 4, range 1, Reptile, WATER.
      Effect: "The first time it would be destroyed each battle, survives with 1 HP instead."
    - **Petit Dragon** — cost 2, hp 26, atk 8, move 4, range 1, Dragon, WIND.
      Effect: "Heals 5 HP at the start of each of its side's turns." (2nd Dragon-type, cheap
      tier — gives Kaiser Sea Horse a low-cost synergy partner.)
    - **Cyber Jar** — cost 3, hp 44, atk 12, move 2, range 1, Machine, DARK.
      Effect: "When destroyed, deals damage equal to half its max HP to all enemies within
      1 tile."
    - **Sangan** — cost 3, hp 32, atk 10, move 3, range 1, Fiend, DARK.
      Effect: "When destroyed, heals the most wounded allied unit for 15 HP."
    - **Dragon Zombie** — cost 3, hp 28, atk 18, move 3, range 1, Zombie, DARK.
      Effect: "The first time it's destroyed each battle, revives at half HP instead."
    - **Troop Dragon** — cost 4, hp 58, atk 14, move 3, range 1, Dragon, WIND.
      Effect: "Gains +5 ATK while adjacent to another Dragon-type ally (and grants the same
      to it)." (3rd Dragon-type — same cost as Kaiser Sea Horse, easy to field together.)
    - **Vorse Raider** — cost 4, hp 50, atk 18, move 3, range 1, Beast-Warrior, DARK.
      Effect: "On kill, permanently gains 15% of the destroyed unit's ATK." (Rival's mirror
      of Baby Dragon's kill-growth — scales off the victim's ATK instead of a flat amount.)
    - **Reaper of the Cards** — cost 5, hp 64, atk 15, move 3, range 2, Spellcaster, DARK.
      Effect: "Instantly destroys any target already at 20% HP or below when it attacks."
    - **D.D. Warrior** — cost 5, hp 56, atk 14, move 3, range 1, Warrior, LIGHT.
      Effect: "Attacks permanently reduce the target's ATK by 20%."
    - **Jinzo** — cost 6, hp 52, atk 24, move 2, range 1, Machine, DARK.
      Effect: "Adjacent enemies cannot trigger negate, counter, retaliation, or revival
      effects." **Flagged as the most involved to implement** — unlike every other effect
      above (each a light variant of an existing pattern: on-death triggers, kill-growth,
      on-hit debuffs, used-once flags), this one has to reach into several *other* units'
      existing effect checks (Kuriboh's negate, Celtic Guardian's counter, Man-Eater Bug's
      retaliation, Sinister Serpent's/Dragon Zombie's revive) rather than being fully
      self-contained. Simplify to a flat damage aura instead if that touch-everywhere shape
      isn't worth it at implementation time.
      **Implemented as the flat aura**: deals 5 dmg to all adjacent enemies at the start of
      each of its side's turns, rather than touching every other unit's effect checks.
    - **Insect Queen** — cost 6, hp 62, atk 19, move 2, range 1, Insect, EARTH.
      Effect: "Gains +3 ATK for every allied Insect-type unit destroyed so far this battle."
      Reuses Dark Magician Girl's existing death-counter pattern, filtered to Insect-type.
    - **Barrel Dragon** — cost 7, hp 70, atk 22, move 2, range 2, Machine, DARK.
      Effect: "The first attack it makes each battle has a 37.5% chance to instantly destroy
      the target regardless of HP — otherwise it deals normal damage." Deliberately a coin-flip
      gamble, not a guaranteed kill (matches the real card's "flip up to twice, need at least
      one heads" mechanic — 3 flips needed for exactly 2 heads per the ruling used here, i.e.
      3/8 odds) — an unconditional guaranteed one-shot on anything, regardless of the target's
      HP, was the one effect in this batch with no counterplay at all, unlike every other
      execute-style effect here which requires the target to already be weakened first.

Resulting rival pool after all 12 additions: 16 units, matching hero's post-addition total of
16 exactly, same cost-tier-by-cost-tier counts, 3 Dragon-types instead of 1.