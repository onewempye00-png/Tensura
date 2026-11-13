TENSURA REINCARNATION RPG — BEHAVIOR PACK
Target: Minecraft Bedrock 26.60 Android (build 52659835)

INSTALL
1. Import Tensura_Reincarnation_RPG.mcaddon.
2. Create a NEW world for the first run (keep your existing worlds backed up).
3. In World Settings > Behavior Packs, activate "Tensura Reincarnation RPG — Behavior".
4. In World Settings > Resource Packs, activate "Tensura Reincarnation RPG — Visuals".
5. Enter the world. The welcome message and reincarnation carousel appear automatically.

NO CHAT COMMANDS
There are no chat-command gameplay controls. All gameplay menus and progression are item-driven.

MOBILE CONTROLS
- Reincarnation Compass: opens the race carousel. Tap the race card's upper-right arrow or NEXT RACE to advance.
- Magic Horn: opens Magic & Arts. Choose a learned spell to cast it; class, evolution, boss and Primordial summoning and the World Gate network are also available there. The Demon Realm uses the themed Nether, the Spirit Labyrinth uses the themed End, the Great World Tree is generated as a custom landmark in the Overworld, and Veldora’s Cave is a generated boss dungeon containing the Storm Dragon.
- Skill Horn: sneak + tap to show the skill tree overlay at the top-left. Tap to cycle the selected node. Sneak + tap to unlock the selected node, or equip it if already unlocked. When the tree is closed, a normal tap casts your equipped skill. The overlay is a HUD display, not a modal form, so normal movement, camera, joystick, jump and attack input remains available.
- Skill Tomes: use a tome in hand to permanently learn its skill. All 82 catalogued skills have individual effect handlers. Magicule, Healing and Spirit Potions restore MP, HP and SP.
- Spirit Prayer Seal: use it to pray for an elemental spirit.
- Demon Lord Seed: use it with 10,000 souls to begin the three-minute awakening ritual.
- Naming Scroll: use it near another player to offer a naming contract. The target must accept; the namer must have higher MP. Accepted naming evolves the target into a named race form and records them as the namer’s disciple.

HUD
Five meters (HP, MP, AP, SP and EP) are sent through the action-bar channel and repositioned by the resource pack's HUD layout to the upper-left. The Skill Horn tree view appears beneath the meters. HP uses the player's effective health; MP, AP and SP are persistent character resources; EP is shown as progress toward the next 1,000-EP bracket.

PROGRESSION
- Starting races: Slime, Human, Goblin, Ogre, Orc, Lizardman, Dwarf, Elf, Demon, Spirit, Beastman and Vampire.
- Human and Goblin start without a Unique Skill.
- Skill tomes can be found from creatures, elementals, bosses, otherworlders and natural chests.
- Elemental spirits include Light, Darkness, Fire, Spatial, Wind, Earth, Water and Gravity.
- Demon Lord awakening consumes 10,000 souls and requires surviving a three-minute paralysis/darkness ritual. Veldora, Charybdis, Orc Lord, Orc Disaster, Elemental Colossus and the seven color-coded Primordial Demon forms (Diablo, Testarossa, Carrera, Ultima, Misery, Rain and Guy Crimson) are boss encounters with rare rewards. The Primordial forms use a shared daemon rig with distinct aura textures.
- True Hero awakening requires seven distinct Greater Elemental Spirits.
- Every starting race can pursue the True Dragon path at level 50 and 1,000,000 EP.

TECHNICAL
- Script modules: @minecraft/server 2.11.0 and @minecraft/server-ui 2.3.0 (stable APIs for 26.60).
- No experimental API toggle is intentionally required. The Nether and End are used as the Demon Realm and Spirit Labyrinth respectively; they are themed native dimensions, not newly registered custom dimensions.
- The visual pack merges the original 1.7.0 texture atlas with its Bedrock models, animations, sounds, custom HUD, Tensura-styled Overworld terrain palette, Demon Realm Nether textures, Spirit Labyrinth End textures and Great World Tree blocks. You only activate one visual pack; there is no separate texture pack dependency.
- The add-on must be tested in the actual Android client. Static archive and syntax checks cannot replace an in-game run.

CONTENT INVENTORY
- 12 selectable starting races (evolved forms are progression, not starting races).
- 82 learnable skills with per-skill effect handlers and 82 Skill Tome items.
- 33 behavior/client entity pairs, including elementals, otherworlders, bosses, Veldora and seven primordial demon forms.
- 8 custom blocks, 78 recipes and 17 spawn rules.
- Custom Great World Tree landmark and Veldora's Cave boss dungeon.
- Three crafted potions plus magicule crystals and spirit contracts.

VALIDATION STATUS
- All JSON files parsed.
- JavaScript syntax checked.
- Behavior/client entity pairs and model/texture/animation references checked.
- Item and block texture atlas references checked.
- Recipe and loot references checked.
- A mocked script-flow test exercised first-spawn welcome, race selection and Skill Horn tree opening.
- The add-on has NOT yet been executed inside the actual Minecraft Android 26.60 client. The final in-game test is still required; a mocked test cannot guarantee Bedrock runtime behavior.
