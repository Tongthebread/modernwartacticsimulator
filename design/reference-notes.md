# Reference and evidence notes

## Scope

Use World Conqueror 4 as inspiration for an original turn-based game, starting with the Gulf War and a map, troops, and air forces.

## Public observations

- EasyTech's publisher listing describes historical scenarios with time-limited objectives, multiple unit types, resource management, and a zoomable map. Source: [World Conqueror 4 publisher listing on the App Store](https://apps.apple.com/ae/app/world-conqueror-4/id1258468290).
- The US Naval History and Heritage Command dates Desert Storm to 17 January–28 February 1991 and the ground assault to 24 February. Source: [The Gulf War 1990–1991](https://www.history.navy.mil/our-collections/art/exhibits/conflicts-and-operations/the-gulf-war-1990-1991--operation-desert-shield--desert-storm-.html).
- Army University Press describes the western envelopment known as the Left Hook. Source: [Deception in the Desert](https://www.armyupress.army.mil/Books/Browse-Books/iBooks-and-EPUBs/Deception-in-the-Desert/).

## Original design decisions

The hex map, weighted movement, formation statistics, deterministic damage, retaliation, supply economy, defensive AI, objective sets, three mission layouts, visual design, and SVG assets are original implementation choices. They are not claims about World Conqueror 4's internal rules. The Gulf War scenarios compress geography and chronology and do not reproduce historical orders of battle.

## Reverse-engineering boundary

The requested reverse-engineer-anything skill and its recovery guide were read. No REA MCP tools were exposed, no World Conqueror 4 binary or package was supplied, and the application was not found in the inspected application inventory or the specifically checked Steam installation location.

The REA CLI's read-only `doctor --client codex --json` workflow was attempted. Package acquisition required network permission; the installed latest release, rea-agents 6.9.0, then refused to run because the available Node 22.12.0 is below its minimum supported version (22.23.4 on the Node 22 line). No runtime/toolchain upgrades or client configuration changes were made.

Consequently there is no REA Evidence ID, decompilation, private resource extraction, or observed World Conqueror 4 runtime behavior to cite. Public publisher descriptions establish inspiration only. Inspecting internals would require a supplied lawful game artifact and a compatible REA runtime.

Agent Reach's routing instructions were consulted for public research. Its CLI and Exa backend were absent, so the available web search tool was used as a fallback.
