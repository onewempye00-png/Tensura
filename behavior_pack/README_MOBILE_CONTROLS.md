# Tensura Reincarnation RPG • Complete Mobile Reconstruction 3.2.6

## Mobile controls
- **Tensura Compass**: use to open the Tensura menu. The old Reincarnation Compass and menu crystal are retired.
- **Skill Horn**: use normally to activate the skill assigned to that hotbar slot; sneak-use to assign a learned skill. Each slot stores its own skill.
- **Magic Horn**: use normally to cast the spell assigned to that hotbar slot; sneak-use to assign a learned magic art. Each slot stores its own spell.
- **Naming Horn**: look at a monster and use to enter a name. For another player, the target must accept the naming contract.
- **Character Reset Scroll**: use and confirm to reset race and progression while keeping inventory and gear.
- **Elemental Spirit contracts**: use Lesser, Medium, Greater or Great Spirit items to summon the corresponding elemental companion.
- **Tensura Crafting Table**: craft with 4 iron ingots, 4 amethyst shards and a crafting table; place it and interact to open Tensura crafting disciplines.

## Exploration and dimensions
- Open **Dimensional Gates** from the Tensura Compass for the Demon Realm and Great Spirit Labyrinth.
- Use **Exploration Maps** for Veldora's Cave, Charybdis Cave, Dwarven Village, the Great World Tree and other landmarks.
- Bedrock does not expose Java's arbitrary custom-dimension serializers. The Java Hell dimension is represented by the native Nether with Hell structures/features; the Great Spirit Labyrinth uses the native End and its original Java block layout split into ten connected structures.

## Status bars
HP reads the player's actual health. MP, AP and SP are consumed by their respective magic, combat-skill and spiritual-skill actions. EP follows the remaining resource pools. The left HUD has 18-segment bars and three passive skill slots.

## Import
Import the `.mcaddon` into Minecraft Bedrock. Enable the Behavior Pack and Resource Pack on the world. The pack uses Bedrock Script API 2.11.0 and Script API UI 2.3.0; use a Bedrock release that supports those modules.

Static JSON, JavaScript syntax, model references, item/entity links and all converted structure NBT files were checked. A live Android/Bedrock runtime session was not available in the build environment, so the final on-device import/playtest remains necessary.
