// Magic/Trap item database for Tactics Skirmish (Yu-Gi-Oh reskin).
// Loaded via <script> before the main game script, same plain-global
// convention as units-db.js — no import/export, so the game still runs by
// just opening index.html.
//
// cost is a hand-tuned star-chip shop price. Unlike UNIT_DATABASE's cost
// (the monster's real Duel Monsters Level/Star rating), Spell/Trap cards have
// no Level/Star rating, so that convention doesn't apply here — these are a
// starting balance pass, expected to be retuned after playtesting.
//
// effect is a plain-language description of the item's effect, shown in the
// UI. The actual behavior is implemented in index.html.
//
// Every item must have a matching sprite at assets/items/<item_id>.jpg,
// fetched the same way unit sprites are (see CLAUDE.md).
//
// Items are listed in alphabetical order by name, matching units-db.js's
// convention.

const ITEM_DATABASE = {
  monster_reborn: {
    name: 'Monster Reborn',
    cost: 10,
    effect: 'If the equipped unit would die, it instead revives at full HP. Once triggered, this item is consumed and must be bought again.',
  },
  mystical_space_typhoon: {
    name: 'Mystical Space Typhoon',
    cost: 4,
    effect: 'Removes 1 random hazard tile from the map at the start of each encounter.',
  },
  negate_attack: {
    name: 'Negate Attack',
    cost: 8,
    effect: 'Activate on your turn: blocks all damage to your units on the opponent\'s next turn. Once per mission.',
  },
  nutrient_z: {
    name: 'Nutrient Z',
    cost: 6,
    effect: 'If a hit would kill the equipped unit, it survives at 1 HP instead. Resets every mission.',
  },
  solemn_wishes: {
    name: 'Solemn Wishes',
    cost: 5,
    effect: 'If the equipped unit survives a mission, the squad gains +2 bonus Star Chips on clear.',
  },
  time_seal: {
    name: 'Time Seal',
    cost: 7,
    effect: 'Activate on your turn: freezes an adjacent enemy out of its next turn. Once per mission.',
  },
  united_we_stand: {
    name: 'United We Stand',
    cost: 5,
    effect: 'The equipped unit gains +3 ATK for each living ally adjacent to it.',
  },
  waboku: {
    name: 'Waboku',
    cost: 6,
    effect: 'Activate on your turn: blocks all damage to your buildings on the opponent\'s next turn. Once per mission.',
  },
};
