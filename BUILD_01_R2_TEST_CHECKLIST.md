# Build 01 R1.0.1 — Android test checklist

## A. What should work (test these)
- [ ] Import both packs and activate them in a fresh test world.
- [ ] Reincarnate and confirm racial health still works (known-good regression check).
- [ ] Check the HUD is smaller than the previous build and displays HP, MP, AP, SP and EP in compact rectangular gauges with numbers inside.
- [ ] Use the vanilla Minecraft crafting table; confirm Tensura recipes appear in its recipe book / crafting interface.
- [ ] Test several converted smithing recipes, including one weapon, one armour piece and one material recipe.
- [ ] Aim at a weakened eligible mob and use the Naming Horn; confirm the naming form opens.
- [ ] Complete LOW naming on a mob and confirm its name, named tags/bond, resource increase and healing.
- [ ] Test MEDIUM/HIGH naming and the correct resource costs and evolution where eligible.
- [ ] Kill a mob with a melee weapon and confirm XP, souls and EP rewards.
- [ ] Kill a mob with a projectile and confirm XP and progression rewards.
- [ ] Reach a level threshold and confirm level and skill-point increases.
- [ ] Test race evolution requirements and confirm the evolved race persists after rejoining.
- [ ] Test Demon Lord Seed acquisition and the three-minute awakening ritual.
- [ ] Test possession with an eligible vessel and verify transferred stats and appearance.

## B. Known failures / limitations (do not mark as fixed without testing)
- [ ] Player slime geometry/appearance is still unresolved; scale-only player transformation was removed because it did not work.
- [ ] The actionbar gauges are still text-rendered, not true native graphical bars.
- [ ] Mob naming and evolution are not gameplay-certified.
- [ ] Converted shapeless recipes may need ingredient/layout/balance adjustments.
- [ ] Awakening and progression have not been live-tested.
- [ ] Possession has not been corrected or live-tested.

## C. Still missing / follow-up work
- [ ] Implement a reliable visible slime player form using a Bedrock-supported appearance approach.
- [ ] Replace text HUD gauges with validated native rectangular UI bars if the target Bedrock UI permits it.
- [ ] Verify the full 70-entry Java nameable entity tag against actual Bedrock entity identifiers.
- [ ] Validate all 298 converted recipes and resolve unsupported ingredients or duplicate outputs.
- [ ] Test and repair awakening/progression end-to-end, including all race-specific paths and save/rejoin.
- [ ] Test and repair possession end-to-end, including vessel expiration and recovery.
