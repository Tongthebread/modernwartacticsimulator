# Modern War Tactics

A playable, original browser strategy game set in the post–Cold War era. The first campaign follows the Gulf War ground offensive through three scenarios: **The Left Hook**, **Breaking the Line**, and **Kuwait Liberated**. Later conflicts appear as planned campaigns.

## Run locally

Requires Node.js 20.11 or later. No packages to install.

```sh
npm run dev
```

Open **http://localhost:3000**. To choose another port, run `PORT=3001 npm run dev`.

```sh
npm test
```

## Play

- Select a Coalition formation on the map or in the roster. Click a blue hex to move; click an enemy outlined in red to attack.
- A formation can move once and attack once per turn. Attacking ends movement. The expanded **26 × 18** theater has **468 hexes**, over twice the original area. Terrain changes movement cost, cover, and ground attack; aircraft ignore terrain movement and cover.
- Use armor, mechanized infantry, specialist infantry, artillery, A-10s, and F-16s together. Coalition artillery fires **5 hexes**, Iraqi artillery **4**; selecting artillery shows an ochre range overlay. Only fighters and anti-air units can target aircraft.
- Urban areas and ridges provide cover. Adjacent ground defenders return fire, and nearby Shilka anti-aircraft units retaliate against air strikes.
- Ground units capture locations by entering their hex. Hold all three primary objectives at once to win and unlock the next operation.
- Resupply restores up to 30 strength and 15 morale for 25 supply and uses a turn. It can rally a unit even at full strength. **Request reinforcements** opens a choice of five infantry types costing 60–80 supply. They deploy at the staging area and become available next turn.
- End your turn to let Iraqi forces respond. Gain 35 supply plus 10 per held primary objective. Keep ground forces alive and finish before the turn limit.
- Use **Escape** to deselect, **E** to end your turn, drag to pan, and the map controls to zoom or toggle labels and grid. Click an objective to locate it.

The game autosaves in browser local storage. Open **Campaigns → Reset current operation** to restart a battlefield; completed mission unlocks remain. Saves are specific to the browser and origin. Google Fonts are optional; system fonts work when offline.

### Infantry roles

| Formation | Role | Reinforcement cost |
| --- | --- | --- |
| Marines | +8 attack against ground units in urban terrain | 60 |
| Anti-tank team | 2-hex range and +23 attack against ground vehicles | 80 |
| Recon infantry | 4 movement; dunes, ridges, and wadis cost only 1 movement per hex | 75 |
| Combat engineers | Repair an adjacent allied ground vehicle by up to 30 strength for 15 supply | 80 |
| Combat medics | Heal adjacent allied foot infantry by up to 30 strength for 10 supply | 70 |

To use engineers or medics, select the specialist, click **Repair vehicle** or **Heal infantry**, then click a damaged ally outlined in green on the map or select it in the roster. Support may follow movement and consumes the specialist's remaining orders. It does not consume the recipient's orders. Engineers cannot repair aircraft; medics cannot heal vehicles or themselves. **Escape** or **Cancel support** cancels targeting.

New operations start with eleven formations, including one of each new specialist. Existing saves retain their formations and mission progress, gain the new rules immediately, and can request specialists through reinforcements.

### Iraqi formations

| Formation | Specialty |
| --- | --- |
| Iraqi rifle infantry | +5 extra cover in urban areas and palm groves |
| RPG team | +24 attack against armored ground vehicles; adjacent attacks only |
| Machine-gun team | 2-hex base range; +16 attack and 8 morale suppression against foot infantry |
| Mortar team | 3-hex base range; 10 morale suppression against ground targets; slow and lightly protected |
| Republican Guard infantry | 100 strength, higher defense, and 50% resistance to encirclement and suppression morale loss, rounded up |

Suppression applies to surviving targets hit by these weapons, including return fire. Machine-gun suppression does not affect armor. RPG, machine-gun, and mortar teams cannot target aircraft. Suppressed units skip natural morale recovery at their next side turn. Morale cannot fall below zero. Ridge range bonuses also apply to machine guns and mortars.

The Iraqi AI chooses attacks by expected damage, with a bonus for finishing a target, and positions ranged troops near their firing range. The first mission includes rifle infantry, RPG, machine-gun, and mortar teams. Later missions introduce Republican Guard infantry alongside armor, artillery, and anti-aircraft vehicles. Click an enemy formation to read its specialty.

Existing saves retain their enemy formations. Start the next operation or use **Campaigns → Reset current operation** to load the new Iraqi deployments; completed mission unlocks are kept. These are abstract gameplay roles, not a historical order of battle.

### Morale and encirclement

Every unit starts with 100 morale. At the beginning of its side's turn, a ground formation facing three adjacent enemy ground units loses **10 morale**; four or more cause **15** loss. A full encirclement with at least three enemies and no neighboring land escape route causes **25** loss. Rivers, sea, and map edges can close routes. Friendly troops and aircraft do not count as encircling enemies; aircraft are immune to morale loss.

Lower morale reduces attack and defense. At zero morale, attack is scaled to 55% and unit defense to 60%, before terrain cover and the minimum damage rule. At 25 morale or lower, movement loses one point, to a minimum of one. Shaken formations (60 morale or less) and encirclement warnings appear in the unit inspector; the thin bar below unit strength shows morale.

Break the enemy ring to recover **5 morale per turn** without encirclement pressure, or use **Resupply / rally** for up to **15 morale**. These rules affect Coalition and Iraqi ground forces equally. Encirclement does not automatically destroy a formation or force surrender.

### Terrain and routes

| Terrain | Foot / vehicle movement cost | Tactical effect |
| --- | --- | --- |
| Open desert | 1 / 1 | No cover |
| Highway | 0.5 / 0.5 | Rapid advances without cover |
| Sand dunes | 2 / 2 | 2 cover, −4 ground attack |
| Rocky ridge | 2 / 3 | 9 infantry / 5 vehicle cover; +6 ground attack; +1 range for ranged ground units |
| Urban area | 1 / 2 | 12 infantry / 7 vehicle cover; Marine assault bonus |
| Palm grove | 1 / 2 | 12 infantry / 5 vehicle cover |
| Marshland | 2 / 3 | 5 infantry cover, no vehicle cover; −8 ground attack |
| Dry wadi | 2 / 2 | 5 cover; −2 ground attack |
| Salt flats | 1 / 1 | −4 cover: exposed to additional damage |
| River bridge | 1 / 1 | Crosses the river; −3 cover |
| River / sea | Blocked | Aircraft can cross; ground forces must use bridges to cross rivers |

Hover over a hex to inspect its terrain, or select a unit to see its current terrain effects. Movement uses a budget of movement points, so roads let a formation travel farther than its nominal movement stat. Recon ignores the rough-ground surcharge on dunes, ridges, and wadis. Ridge range bonuses stack with artillery's base range of 5 for Coalition and 4 for Iraqi batteries.

The expanded map includes connected highways and two river bridges. Pan and zoom to inspect its outer sectors. Mission limits are now **22 / 20 / 20 turns**. Legacy saves move their formations and objective locations together onto the expanded theater; any ground unit caught on a newly introduced river hex relocates to the nearest free land hex. This migration runs once and preserves mission unlocks, supply, orders, strength, and turn number.

## Implementation

Buildless HTML, CSS, JavaScript ES modules, and original SVG artwork. `engine.js` contains the deterministic rules, scenarios, weighted hex pathfinding, combat, economy, and defensive AI. `app.js` renders the map and command interface and handles local saves. `server.mjs` is a local static server. Engine tests use Node's built-in test runner.

This is a single-player tactical prototype. Enemy positions are visible. Dates and theater names are historical; geography, unit positions, formation strength, and turn duration are abstracted. Later campaigns are not yet implemented.

See [design/reference-notes.md](design/reference-notes.md) for public reference sources and reverse-engineering limitations. No World Conqueror code, graphics, or game data are included.
