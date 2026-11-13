# Tensura Build 01 — Core, Races & Progression — Revision 1.0.1

## Revision scope
This is a correction revision based on the user's Android gameplay report. It preserves the original Java JAR in the editable source archive.

## Applied changes
- Replaced the oversized multi-line ASCII HUD frames with compact rectangular one-line gauges. Values are shown inside each framed gauge with coloured fill segments.
- Removed the custom `tensura:crafting_smithing_table` item and its recipe. The starter kit supplies `minecraft:crafting_table`.
- Removed the separate custom smithing-bench block/recipe path from the playable pack.
- Converted 298 Java custom smithing-bench recipe records into Bedrock shapeless recipes tagged for the vanilla `crafting_table`; the generated recipe conversion report is in `behavior_pack/recipes/mobile_smithing/CONVERSION_REPORT.json`.
- Improved Naming Horn target acquisition with ray-hit targeting and a wider forward-cone fallback.
- Isolated the optional mob race-evolution bridge so an evolution-bridge exception does not cancel an otherwise successful naming operation.
- Added projectile-owner resolution to the kill progression event so projectile kills can award XP and progression.
- Removed the ineffective player `minecraft:scale` attempt. Racial health/effects remain; actual player slime geometry is a documented Bedrock limitation and is not claimed fixed.

## Static validation
- Behavior/resource JSON files parsed: 6,586
- JSON parse errors: 0
- Top-level behavior JavaScript files syntax-checked with Node: 8
- Java smithing recipes converted: 298
- ZIP integrity: checked at packaging
- Live Minecraft Android gameplay: not available in this build environment; runtime behavior remains unverified.

## Known unresolved / requires in-game verification
- Player slime body/geometry replacement: not implemented; standard Bedrock player geometry cannot be swapped by setting `minecraft:scale` on the player. A true visible slime form needs a separately designed supported player-appearance system or a controlled slime vessel entity.
- Naming on mobs: targeting and exception handling improved, but must be tested in-game against the exact Java `can_be_named` entity set. Dynamic-property compatibility and entity evolution vary by Bedrock runtime.
- HUD: compact framed actionbar gauges are text-rendered approximations, not a native graphical progress-bar widget. Exact centered digits over a coloured rectangular fill requires a custom Bedrock HUD UI layout and runtime validation.
- Crafting: 298 custom smithing recipes are now shapeless vanilla crafting-table recipes. Confirm ingredients, schematic requirements and balance in-game; the original custom station's spatial recipe layout cannot be represented exactly by this conversion.
- Awakening/progression: kill XP, level thresholds, evolution and awakening flows remain present; projectile-owner resolution was added. Full progression still needs live testing for melee kills, projectile kills, souls, seed acquisition, ritual survival, evolution requirements and persistence.
- Possession: no functional fix is claimed; verify vessel targeting, stat transfer, expiry/death and rejoin persistence.

## Test status
Static checks passed. This is not Minecraft gameplay certification.
