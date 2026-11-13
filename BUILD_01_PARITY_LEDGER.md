# Build 01 — Core, Races & Progression: parity ledger

## Scope
Player identity, reincarnation/race selection, racial presentation and attributes, naming, possession, awakening/evolution, progression, and shared MP/AP/SP/EP accounting.

## Implemented Bedrock paths
- Script-driven reincarnation selection and persistent race state.
- Race-specific health/resource starting values and scale/effect approximations.
- Naming Horn flow with target validation, 25% health threshold, player consent, naming tiers, reserve spending, and named evolution bridge.
- Shared dynamic-property resource state; EP is maintained as current MP + AP + SP in the implemented paths.
- Skill retirement/evolution state is preserved in the core progression script.

## Important differences / limitations
- Bedrock Script API cannot reproduce Forge capabilities, Java entity capability storage, arbitrary player attribute modifiers, or Java packet/menu networking exactly. Persistent dynamic properties and scripted forms are substitutes.
- Racial size and health are approximated through scale/effects; this is not equivalent to Java's full attribute/size system.
- Naming evolution is a limited bridge for supported Bedrock entities; unsupported Java entity classes cannot be evolved identically.
- Possession and spiritual-body mechanics require Bedrock-safe entity replacement and cannot preserve every Java capability/component.
- Static checks do not prove in-game behavior. Android Bedrock import, multiplayer consent, death/rejoin persistence, and long-session tests remain manual release gates.

## Source coverage
The accompanying `JAVA_CORE_CLASS_INDEX.txt` is the extracted class-name inventory used for this build's reverse-engineering scope. The original JAR is included unchanged for provenance. This ledger is a scoped implementation record, not a claim that every Java method has a native Bedrock equivalent.

## Status codes
- `recreated`: implemented with Bedrock script/data behavior.
- `approximation`: implemented with materially different Bedrock mechanics.
- `blocked-by-bedrock`: direct parity is unavailable in the public Bedrock add-on API.
- `not-applicable`: Java-only infrastructure not shipped to Bedrock.

| Feature group | Status | Evidence / implementation | Remaining verification |
|---|---|---|---|
| Reincarnation and race selection | approximation | `behavior_pack/scripts/main.js`, `RACES`, `raceCard`, `applyRace` | Android UI, save/rejoin |
| Racial health, scale and traits | approximation | `applyRaceBody`, race maps and effects | Per-race combat/survival balance |
| MP/AP/SP/EP pools | recreated/approximation | shared dynamic properties and HUD | Full evolution/naming edge-case audit |
| Naming Horn | approximation | `nameTargetWithHorn`, Java-derived rule comments | Live mob/player consent and multiplayer |
| Naming evolution | approximation | `evolveByNaming` bridge | Every race/entity evolution path |
| Possession | approximation | core script possession handlers | Entity state transfer and death/rejoin |
| Awakening/progression | approximation | core progression and skill evolution handlers | Full source method-by-method parity |
| Forge capability/packet APIs | blocked-by-bedrock | Script API substitution documented above | No direct equivalent |
