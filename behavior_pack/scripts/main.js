import { world, system, ItemStack, EntityDamageCause, EquipmentSlot } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";

// Stable Script API compatibility layer. CustomForm is not a public Bedrock export.
class CustomForm {
 constructor(player,title){this.player=player;this.form=new ActionFormData().title(title);this.lines=[];this.actions=[];}
 header(text){this.lines.push(`\n§l${text}§r`);return this;}
 label(text){this.lines.push(String(text));return this;}
 divider(){this.lines.push("§8────────────────────────§r");return this;}
 image(texture,_pack,options={}){if(options?.onClick)this.button("VIEW / NEXT →",options.onClick,texture);else this.lines.push(" ");return this;}
 button(text,callback,icon){this.actions.push(typeof callback==="function"?callback:null);this.form.button(String(text),icon);return this;}
 closeButton(){this.button("CLOSE",null);return this;}
 close(){}
 show(){this.form.body(this.lines.join("\n\n"));return this.form.show(this.player).then(result=>{if(!result.canceled&&Number.isInteger(result.selection)){const fn=this.actions[result.selection];if(fn)try{fn();}catch(e){try{this.player.sendMessage(`§cTensura menu action failed: ${String(e)}`);}catch{}}}return result;});}
}
import { SKILL_CATALOG } from "./skill_catalog.js";
if(!SKILL_CATALOG.some(s=>s.id==="ciel"))SKILL_CATALOG.push({id:"ciel",name:"Ciel",description:"Manas evolution of Raphael; a passive Unique Skill with active analytical authorities."});
for(const skill of [
 {id:"physical_enhancement",name:"Physical Enhancement",description:"Reinforce the body with aura. Consumes AP, not MP."},
 {id:"aura_slash",name:"Aura Slash",description:"Condense aura along a weapon and release a cutting wave. Battlewill technique."},
 {id:"aura_shield",name:"Aura Shield",description:"Condense aura into a defensive shield. Battlewill technique."},
 {id:"battlewill",name:"Battlewill",description:"Focus fighting spirit to strengthen physical combat. Consumes AP."},
 {id:"aura_sword",name:"Aura Sword",description:"Coat a weapon in aura for enhanced strikes. Consumes AP."},
 {id:"heavy_slash",name:"Heavy Slash",description:"Deliver a powerful aura-driven weapon strike. Consumes AP."},
 {id:"instant_move",name:"Instant Move",description:"Use aura and battlewill to move explosively. Consumes AP."},
 ...["earthshatter_kick","ogre_sword_guillotine","roaring_lion_punch","five_petals_thrust","eight_petals_flash","dark_eight_palms","death_march_dance","elephant_stampede","magic_bullet","maximum_magic_bullet","ogre_flame","ogre_sword_cannon","air_flight","diamond_path","formhide","haze","violent_break"].map(id=>({id,name:id.split("_").map(x=>x[0].toUpperCase()+x.slice(1)).join(" "),description:"Java JAR Battlewill technique. Uses aura (AP), not magicules (MP)."}))
])if(!SKILL_CATALOG.some(s=>s.id===skill.id))SKILL_CATALOG.push(skill);
const NON_SKILL_AP_TECHNIQUES=new Set(["magic_aura"]);
for(const id of NON_SKILL_AP_TECHNIQUES){const i=SKILL_CATALOG.findIndex(s=>s.id===id);if(i>=0)SKILL_CATALOG.splice(i,1);}
import { FORGE_CATALOG } from "./forge_catalog.js";
import { KILN_CATALOG } from "./kiln_catalog.js";
import { MIXING_CATALOG } from "./mixing_catalog.js";
import { ALCHEMY_CATALOG } from "./alchemy_catalog.js";
import { MINING_CATALOG } from "./mining_catalog.js";

const DP = {
  race: "ts26_race", baseRace: "ts26_base_race", raceChosen: "ts26_race_chosen",
  hp: "ts26_hp", mp: "ts26_mp", maxMp: "ts26_max_mp", ap: "ts26_ap", maxAp: "ts26_max_ap",
  sp: "ts26_sp", maxSp: "ts26_max_sp", ep: "ts26_ep", jewels: "ts26_magic_jewels",
  level: "ts26_level", xp: "ts26_xp", skillPoints: "ts26_skill_points", souls: "ts26_souls",
  skills: "ts26_skills", unique: "ts26_unique_skill", equipped: "ts26_equipped_skill",
  equippedMagic: "ts26_equipped_magic", mastery: "ts26_mastery",
  treeMode: "ts26_tree_mode", treeIndex: "ts26_tree_index", class: "ts26_class",
  spiritRanks: "ts26_spirit_ranks", trueHero: "ts26_true_hero", trueDragon: "ts26_true_dragon",
  demonRitual: "ts26_demon_ritual", cooldowns: "ts26_cooldowns", bossKills: "ts26_boss_kills",
  kills: "ts26_kills", named: "ts26_named", disciples: "ts26_disciples", reflector: "ts26_reflector", spiritBodyTime: "ts26_spirit_body_time"
};

const RACES = [
  { id:"slime", name:"Slime", desc:"A resilient magic-born monster. Natural regeneration, high magicule affinity and exceptional absorption potential.", art:"slime", hp:24, mp:160, ap:110, sp:110, ep:140, jewels:[100,10000], skills:["predator","great_sage","ultraspeed_regeneration"] },
  { id:"human", name:"Human", desc:"A versatile and adaptable race. Humans can pursue martial, magical, political and True Hero paths. No starting Unique Skill.", art:"human", hp:20, mp:100, ap:100, sp:100, ep:100, jewels:[250,1500], skills:["magic_bolt"] },
  { id:"goblin", name:"Goblin", desc:"A resourceful monster race with balanced survival traits and strong community potential. No starting Unique Skill.", art:"goblin", hp:22, mp:95, ap:105, sp:110, ep:110, jewels:[150,1800], skills:["magic_bolt"] },
  { id:"ogre", name:"Ogre", desc:"A powerful warrior lineage with high vitality, physical strength and strong battle instincts.", art:"ogre", hp:34, mp:110, ap:155, sp:125, ep:180, jewels:[500,3500], skills:["steel_strength","body_armor"] },
  { id:"orc", name:"Orc", desc:"A hardy monster race with high endurance, physical growth and a hunger-driven evolution path.", art:"orc", hp:32, mp:95, ap:145, sp:120, ep:160, jewels:[350,3000], skills:["steel_strength","survivor"] },
  { id:"lizardman", name:"Lizardman", desc:"An amphibious warrior race with natural resilience, water affinity and strong close-range combat.", art:"lizardman", hp:29, mp:115, ap:125, sp:125, ep:160, jewels:[300,2600], skills:["water_blade","body_armor"] },
  { id:"dwarf", name:"Dwarf", desc:"A master artisan lineage with exceptional crafting aptitude, resilience and equipment affinity.", art:"dwarf", hp:28, mp:110, ap:120, sp:120, ep:150, jewels:[300,2200], skills:["absorb_and_dissolve","body_armor"] },
  { id:"elf", name:"Elf", desc:"A long-lived forest lineage with keen perception, spirit affinity and excellent magic control.", art:"elf", hp:22, mp:155, ap:95, sp:115, ep:150, jewels:[400,3000], skills:["wind_blade","universal_perception"] },
  { id:"demon", name:"Demon", desc:"A spiritual monster from the Demon Realm. High magicule reserves and a dangerous evolution path.", art:"demon", hp:30, mp:220, ap:130, sp:120, ep:320, jewels:[700,5000], skills:["fire","shadow_motion"] },
  { id:"spirit", name:"Spirit", desc:"A spiritual lifeform aligned with an element. Powerful magic potential, but its physical vessel requires care.", art:"spirit", hp:25, mp:210, ap:105, sp:115, ep:300, jewels:[600,4500], skills:["healing","universal_perception"] },
  { id:"beastman", name:"Beastman", desc:"A physically gifted lineage with enhanced senses, mobility and close-combat potential.", art:"beastman", hp:30, mp:100, ap:140, sp:150, ep:170, jewels:[300,2800], skills:["agility","shadow_motion"] },
  { id:"vampire", name:"Vampire", desc:"A night-adapted lineage with blood affinity, heightened senses and regenerative potential.", art:"vampire", hp:27, mp:170, ap:125, sp:120, ep:250, jewels:[650,4200], skills:["shadow_motion","ultraspeed_regeneration"] },
  { id:"dragon", name:"Dragon", desc:"A mighty dragon lineage with a larger physical form, immense vitality, natural scales and aerial dominance.", art:"dragon", hp:60, mp:220, ap:210, sp:170, ep:500, jewels:[1200,8000], skills:["dragon_skin","dragon_eye","dragon_ear","flame_breath","air_flight"] }
];
const RACE_BY_ID = new Map(RACES.map(r=>[r.id,r]));
const SKILL_BY_ID = new Map(SKILL_CATALOG.map(s=>[s.id,s]));

const CORE_TREE = [
  {id:"magic_bolt",cost:0,ep:0,req:[],tier:0},
  {id:"fireball",cost:2,ep:0,req:["magic_bolt"],tier:1},
  {id:"water_blade",cost:2,ep:0,req:["magic_bolt"],tier:1},
  {id:"wind_blade",cost:2,ep:0,req:["magic_bolt"],tier:1},
  {id:"healing",cost:2,ep:0,req:["magic_bolt"],tier:1},
  {id:"arcane_barrier",cost:2,ep:0,req:["magic_bolt"],tier:1},
  {id:"agility",cost:4,ep:300,req:["magic_bolt"],tier:2},
  {id:"steel_strength",cost:4,ep:300,req:["magic_bolt"],tier:2},
  {id:"predator",cost:8,ep:250,req:["magic_bolt"],tier:2},
  {id:"great_sage",cost:8,ep:250,req:["magic_bolt"],tier:2},
  {id:"thought_acceleration",cost:5,ep:500,req:["great_sage"],tier:3},
  {id:"gluttony",cost:10,ep:1200,req:["predator"],tier:3},
  {id:"degenerate",cost:10,ep:1200,req:["great_sage"],tier:3},
  {id:"ultraspeed_regeneration",cost:6,ep:800,req:["healing"],tier:3},
  {id:"guardian",cost:7,ep:1200,req:["arcane_barrier"],tier:3},
  {id:"chosen_one",cost:10,ep:2500,req:["steel_strength"],tier:3},
  {id:"universal_perception",cost:6,ep:800,req:["thought_acceleration"],tier:4},
  {id:"spatial_motion",cost:8,ep:1800,req:["wind_blade"],tier:4},
  {id:"multilayer_barrier",cost:8,ep:1800,req:["arcane_barrier","guardian"],tier:4},
  {id:"black_flame",cost:9,ep:2200,req:["fireball"],tier:4},
  {id:"shadow_motion",cost:8,ep:1800,req:["agility"],tier:4},
  {id:"absolute_severance",cost:10,ep:3000,req:["steel_strength"],tier:5},
  {id:"raphael",cost:25,ep:10000,req:["great_sage","thought_acceleration","universal_perception"],tier:6},
  {id:"beelzebuth",cost:25,ep:10000,req:["predator","gluttony"],tier:6},
  {id:"uriel",cost:25,ep:10000,req:["multilayer_barrier","spatial_motion"],tier:6},
  {id:"michael",cost:30,ep:15000,req:["chosen_one","guardian"],tier:7},
  {id:"azathoth",cost:60,ep:100000,req:["raphael","beelzebuth"],tier:8},
  {id:"shub_niggurath",cost:60,ep:100000,req:["raphael","degenerate"],tier:8},
  {id:"ciel",cost:60,ep:120000,req:["raphael","universal_perception"],tier:8}
];
const CORE_TREE_IDS = new Set(CORE_TREE.map(node=>node.id));
const ANGEL_ULTIMATE_SKILLS=new Set(["michael","uriel","sariel","metatron","raguel","gabriel","sandalphon","melchizedek","azrael","astarte","haniel","israfil","jibril","beelzebuth","azathoth","shub_niggurath","nyarlathotep"]);
// Ultimate is a tier; active/passive is a separate activation mode.
const SKILL_TIER = id => ANGEL_ULTIMATE_SKILLS.has(id) ? "ultimate" : (UNIQUE_EXTRA_SKILLS.has(id) ? "unique" : "ordinary");
const SKILL_ACTIVATION = id => PASSIVE_SKILLS.has(id) ? "passive" : "active";
const UNIQUE_EXTRA_SKILLS = new Set(["raphael","ciel","absolute_severance","analyst","anti_skill","berserker","berserk","bewilder","chef","chosen_one","commander","cook","creator","degenerate","divine_berserker","engorger","envy","falsifier","fighter","fusionist","gluttony","godly_craftsman","gourmand","gourmet","great_sage","greed","guardian","healer","infinity_prison","lust","martial_master","mathematician","merciless","murderer","musician","observer","oppressor","predator","pride","reflector","researcher","royal_beast","reaper","reverser","seeker","seer","severer","shadow_striker","sloth","sniper","spearhead","starved","suppressor","survivor","thrower","traveler","tuner","unyielding","usurper","villain","wrath"]);
const EXTRA_TREE = SKILL_CATALOG.filter(skill=>!CORE_TREE_IDS.has(skill.id)).map(skill=>{
 const rare=UNIQUE_EXTRA_SKILLS.has(skill.id),ultimate=ANGEL_ULTIMATE_SKILLS.has(skill.id);
 return {id:skill.id,cost:ultimate?25:rare?12:5,ep:ultimate?10000:rare?5000:500,req:["magic_bolt"],tier:ultimate?7:rare?5:2};
});
const TREE = [...CORE_TREE,...EXTRA_TREE];
const DROP_SKILLS = SKILL_CATALOG.map(skill=>skill.id);
const MAGIC_SKILLS = ["acid_rain", "acid_shell", "aerial_blade", "agility", "airflow_shut", "analyze", "anti_magic_area", "anti_shock_area", "antidote", "arcane_barrier", "barrier", "black_flame", "blizzard", "burden", "chain_explosion", "clairvoyance", "confusion", "create_greater_undead", "create_lesser_undead", "curse", "curse_bind", "dark_cube", "darkness", "darkness_cannon", "demon_dominate", "demon_marionette", "dimension_cutter", "dominate", "doppelganger", "drainage", "earth", "earth_jail", "earth_lock", "earth_spike", "earth_spikes", "earth_storm", "earth_wall", "electro_blast", "escape", "explosion", "fire", "fire_aspectual", "fire_ball", "fire_bolt", "fire_breath", "fire_lance", "fire_storm", "fire_wall", "fireball", "flame_wall", "flare_circle", "flight", "float", "freeze", "full_recovery", "gate", "healing", "healing_rain", "healthcare", "hellfire", "hypnos", "ice_blizzard", "ice_breaker", "ice_lance", "ice_wall", "icicle_lance", "icicle_rain", "icicle_spear", "invisible", "light", "lighten", "lightning_lance", "lightning_spear", "liquidize", "magic_barrier", "magic_bolt", "magic_wall", "magma_surge", "megiddo", "mental_crush", "mirage", "mud_hand", "mud_spears", "possession_magic", "protection", "recovery", "reincarnation", "reinforced_barrier", "reinforcement", "search_enemy", "shadow_bind", "shrink", "sleep_mist", "solar_beam", "solar_flare", "solar_rain", "solar_wave", "space", "spatial_storage", "stone_shot", "strength_aspectual", "summon_basilisk", "summon_daemon", "summon_greater_elemental", "summon_hound_dog", "summon_medium_elemental", "summon_otherworlder", "swipe", "teleport", "thunder", "thunder_lance", "thunder_orb", "thunder_rain", "tornado_blade", "true_darkness", "warp_portal", "water", "water_aspectual", "water_cutter", "water_cutter_aspectual", "water_jail", "wind", "wind_blade", "wind_cutter", "wind_gust", "wind_protection"];
const MAGIC_SKILL_IDS = new Set(MAGIC_SKILLS);
const BATTLEWILL_SKILLS = new Set(["aura_slash", "aura_sword", "earthshatter_kick", "heavy_slash", "ogre_sword_guillotine", "roaring_lion_punch", "five_petals_thrust", "eight_petals_flash", "dark_eight_palms", "death_march_dance", "elephant_stampede", "magic_bullet", "maximum_magic_bullet", "ogre_flame", "ogre_sword_cannon", "air_flight", "aura_shield", "battlewill", "diamond_path", "formhide", "haze", "instant_move", "violent_break"]);
const BATTLEWILL_MANUAL_POOLS = {"low_manual_dwarf_trade":["aura_sword","instant_move","violent_break"],"medium_manual_dwarf_trade":["formhide","aura_slash","earthshatter_kick"],"high_manual_dwarf_trade":["air_flight","aura_shield","magic_bullet"],"rare_manual_dwarf_trade":["battlewill","diamond_path"]};
const AURA_SKILLS = new Set([...BATTLEWILL_SKILLS,"physical_enhancement","steel_strength","body_armor","absolute_severance"]);
function isMagicSkill(id){return MAGIC_SKILL_IDS.has(id)&&!BATTLEWILL_SKILLS.has(id);}
const raceFormsOpen = new Set();
const magicFormsOpen = new Set();
const raceCursor = new Map();

function get(p,k,d){try{const v=p.getDynamicProperty(k);return v===undefined?d:v;}catch{return d;}}
function set(p,k,v){try{p.setDynamicProperty(k,v);}catch{}}
function n(p,k,d=0){const v=Number(get(p,k,d));return Number.isFinite(v)?v:d;}
function list(p,k){try{const v=JSON.parse(get(p,k,"[]"));return Array.isArray(v)?v:[];}catch{return [];}}
function saveList(p,k,a){set(p,k,JSON.stringify([...new Set(a)]));}
function say(p,s){try{p.sendMessage(`§b[TENSURA]§r ${s}`);}catch{}}
function inv(p){try{return p.getComponent("minecraft:inventory")?.container;}catch{return undefined;}}
function consumeHeld(p,id){const c=inv(p);if(!c)return false;const slot=p.selectedSlotIndex;const it=c.getItem(slot);if(!it||it.typeId!==id)return false;c.setItem(slot,it.amount>1?new ItemStack(id,it.amount-1):undefined);return true;}
function give(p,id,count=1){try{const c=inv(p);if(c){const rem=c.addItem(new ItemStack(id,count));if(rem)p.dimension.spawnItem(rem,p.location);}else p.dimension.spawnItem(new ItemStack(id,count),p.location);}catch{}}
function hasSkill(p,id){return list(p,DP.skills).includes(id);}
function addSkill(p,id){if(!SKILL_BY_ID.has(id)||NON_SKILL_AP_TECHNIQUES.has(id)||list(p,"ts26_retired_skills").includes(id))return false;const a=list(p,DP.skills);if(a.includes(id))return false;a.push(id);saveList(p,DP.skills,a);return true;}
function evolveSkill(p,from,to){
 if(!hasSkill(p,from)||!SKILL_BY_ID.has(to)||hasSkill(p,to))return false;
 const owned=list(p,DP.skills).filter(x=>x!==from);owned.push(to);saveList(p,DP.skills,owned);
 const retired=list(p,"ts26_retired_skills");if(!retired.includes(from))retired.push(from);saveList(p,"ts26_retired_skills",retired);
 if(get(p,DP.equipped,"")===from)set(p,DP.equipped,to);
 if(get(p,DP.equippedMagic,"")===from)set(p,DP.equippedMagic,to);
 for(let i=0;i<9;i++){const k=`ts26_horn_${i}`;if(get(p,k,"")===from)set(p,k,to);}
 const m=masteryData(p);m[to]=Math.max(Number(m[to]||0),Number(m[from]||0));delete m[from];set(p,DP.mastery,JSON.stringify(m));
 say(p,`§dSKILL EVOLUTION§r ${skillName(from)} → ${skillName(to)}. The previous stage is permanently retired.`);return true;
}
function bar(v,m,color){const width=12,ratio=Math.max(0,Math.min(1,m>0?v/m:0)),fill=Math.round(ratio*width);return `${color}┌${"─".repeat(width)}┐\n│${color}${"━".repeat(fill)}§8${"━".repeat(width-fill)}§r│`; }
const PASSIVE_SKILLS = new Set(["great_sage","raphael","ciel","sariel","raguel","gabriel","azrael","astarte","haniel","ultraspeed_regeneration","guardian","universal_perception","thought_acceleration","steel_strength","agility","body_armor","survivor","healer","observer","anti_magic_area","anti_shock_area","poison_resistance","fire_resistance","water_resistance","physical_resistance","mental_resistance","abnormal_condition_nullification","abnormal_condition_resistance","cold_nullification","cold_resistance","corrosion_nullification","corrosion_resistance","danger_sense","darkness_attack_nullification","darkness_attack_resistance","demon_lord_haki","dragon_ear","dragon_eye","dragon_skin","earth_attack_nullification","earth_attack_resistance","electricity_nullification","electricity_resistance","farsight","flame_attack_nullification","flame_attack_resistance","giantification","gravity_attack_nullification","gravity_attack_resistance","haki","heat_nullification","heat_resistance","hero_haki","holy_attack_nullification","holy_attack_resistance","infinite_regeneration","light_attack_nullification","light_attack_resistance","magic_nullification","magic_resistance","magic_sense","majesty","pain_nullification","pain_resistance","paralysis_nullification","paralysis_resistance","physical_attack_nullification","physical_attack_resistance","pierce_nullification","pierce_resistance","poison_nullification","poison_resistance","sacred_haki","self_regeneration","spatial_attack_nullification","spatial_attack_resistance","spiritual_attack_nullification","spiritual_attack_resistance","thermal_fluctuation_nullification","thermal_fluctuation_resistance","titanification","water_attack_nullification","water_attack_resistance","water_breathing","wind_attack_nullification","wind_attack_resistance"]);
const LANDMARKS = {veldora:{name:"Veldora's Cave",x:1500,z:1500},labyrinth:{name:"Great Spirit Labyrinth",x:2200,z:2200},charybdis:{name:"Charybdis Cave",x:5000,z:5000},dwarf:{name:"Dwarven Village",x:6000,z:6000}};
function compassBearing(p){const kind=get(p,"ts26_active_compass","");let t=LANDMARKS[kind];if(kind==="hell_gate"){const sp=world.getDefaultSpawnLocation();t={name:"Hell Gate",x:sp.x+120,z:sp.z+120};}if(!t)return "";const dx=t.x-p.location.x,dz=t.z-p.location.z;const deg=((Math.atan2(dx,dz)*180/Math.PI)+360)%360;const dirs=["N","NE","E","SE","S","SW","W","NW"];return `§e${t.name} ${dirs[Math.round(deg/45)%8]} ${Math.round(Math.hypot(dx,dz))}m§r`;}
function statsText(p){
 const h=p.getComponent("minecraft:health"),hp=h?Math.ceil(h.currentValue):n(p,DP.hp,20),hm=h?Math.ceil(h.effectiveMax):20;
 const mp=n(p,DP.mp),mm=n(p,DP.maxMp,100),ap=n(p,DP.ap),am=n(p,DP.maxAp,100),sp=n(p,DP.sp),sm=n(p,DP.maxSp,100),ep=n(p,DP.ep),epMax=Math.max(1,n(p,"ts26_max_ep",n(p,DP.maxMp)+n(p,DP.maxAp)+n(p,DP.maxSp)));
 const box=(label,v,m,color)=>{const width=8,ratio=Math.max(0,Math.min(1,m>0?v/m:0)),fill=Math.round(ratio*width),digits=`${Math.floor(v)}/${Math.floor(m)}`,left=Math.max(0,Math.floor((width-digits.length)/2)),right=Math.max(0,width-digits.length-left);return `§7[§f${label} §7|${color}${"━".repeat(fill)}§8${"━".repeat(width-fill)} §f${digits}§7]`;};
 return [box("HP",hp,hm,"§c"),box("MP",mp,mm,"§b"),box("AP",ap,am,"§6"),box("SP",sp,sm,"§a"),box("EP",ep,epMax,"§d"),compassBearing(p)].filter(Boolean).join("\n");
}
function skillName(id){return SKILL_BY_ID.get(id)?.name||id.replaceAll("_"," ");}
const SKILL_ICON_IDS=new Set(["abnormal_condition_nullification","abnormal_condition_resistance","absolute_severance","absorb_and_dissolve","air_flight","all_seeing_eye","analyst","analytical_appraisal","anti_skill","aura_shield","aura_slash","aura_sword","battlewill","beast_transformation","berserk","berserker","bewilder","black_flame","black_lightning","blood_mist","body_armor","body_double","chant_annulment","charm","chef","chosen_one","coercion","cold_nullification","cold_resistance","commander","cook","corrosion","corrosion_nullification","corrosion_resistance","creator","danger_sense","dark_eight_palms","darkness_attack_nullification","darkness_attack_resistance","darkness_transform","death_march_dance","degenerate","demon_lord_haki","diamond_path","divine_berserker","divine_ki_release","dragon_ear","dragon_eye","dragon_mode","dragon_skin","drain","earth_attack_nullification","earth_attack_resistance","earth_domination","earth_manipulation","earth_transform","earthshatter_kick","eight_petals_flash","electricity_nullification","electricity_resistance","elephant_stampede","engorger","envy","eye_of_truth","falsifier","farsight","fighter","five_petals_thrust","flame_attack_nullification","flame_attack_resistance","flame_breath","flame_domination","flame_manipulation","flame_transform","formhide","fusionist","giantification","gluttony","godly_craftsman","godwolf_sense","gourmand","gourmet","gravity_attack_nullification","gravity_attack_resistance","gravity_domination","gravity_field","gravity_flight","gravity_manipulation","great_sage","greed","guardian","haki","haze","healer","heat_nullification","heat_resistance","heat_wave","heavenly_eye","heavy_slash","hero_haki","holy_attack_nullification","holy_attack_resistance","hydraulic_propulsion","ice_breath","infinite_regeneration","infinity_prison","instant_move","law_manipulation","light_attack_nullification","light_attack_resistance","light_transform","lightning_domination","lightning_manipulation","lust","magic_aura","magic_bullet","magic_darkness_transform","magic_earth_transform","magic_flame_transform","magic_jamming","magic_light_transform","magic_manipulation","magic_nullification","magic_resistance","magic_sense","magic_space_transform","magic_water_transform","magic_wind_transform","majesty","mana_manipulation","martial_master","mathematician","maximum_magic_bullet","merciless","molecular_manipulation","mortal_fear","multilayer_barrier","murderer","musician","observer","ogre_berserker","ogre_flame","ogre_sword_cannon","ogre_sword_guillotine","oppressor","pain_nullification","pain_resistance","paralysing_breath","paralysis","paralysis_nullification","paralysis_resistance","physical_attack_nullification","physical_attack_resistance","pierce_nullification","pierce_resistance","poison","poison_nullification","poison_resistance","poisonous_breath","possession","predator","pride","ranged_barrier","reaper","reflector","researcher","reverser","roaring_lion_punch","royal_beast","sacred_haki","sage","scale_armor","seeker","seer","self_regeneration","sense_heat_source","sense_soundwave","severer","shadow_motion","shadow_striker","sloth","snake_eye","sniper","sound_domination","sound_manipulation","space_transform","spatial_attack_nullification","spatial_attack_resistance","spatial_domination","spatial_manipulation","spatial_motion","spearhead","spiritual_attack_nullification","spiritual_attack_resistance","starved","steel_strength","sticky_steel_thread","strength","strengthen_body","suppressor","survivor","telepathy","thermal_fluctuation_nullification","thermal_fluctuation_resistance","thought_acceleration","thought_communication","thrower","thunder_breath","titanification","traveler","tuner","ultra_instinct","ultrasonic_waves","ultraspeed_regeneration","universal_perception","unpredictability","unyielding","usurper","villain","violent_break","voice_cannon","water_attack_nullification","water_attack_resistance","water_blade","water_breathing","water_current_control","water_domination","water_manipulation","water_transform","weather_domination","weather_manipulation","wind_attack_nullification","wind_attack_resistance","wind_domination","wind_manipulation","wind_transform","wrath"]);
function skillIcon(id){const alias={physical_enhancement:"strengthen_body",aura_shield:"aura_shield",aura_slash:"aura_slash",battlewill:"battlewill",aura_sword:"aura_sword",heavy_slash:"heavy_slash",instant_move:"instant_move"};const key=alias[id]||id;return SKILL_ICON_IDS.has(key)||BATTLEWILL_SKILLS?.has(id)||["aura_shield","aura_slash","battlewill","aura_sword","heavy_slash","instant_move"].includes(key)?`textures/skill/icons/${key}`:undefined;}
function masteryData(p){try{return JSON.parse(get(p,DP.mastery,"{}"))||{};}catch{return {};}}
function masteryLevel(p,id){return Math.max(0,Number(masteryData(p)[id]||0));}
function recordMastery(p,id){const data=masteryData(p);data[id]=Math.min(100,Number(data[id]||0)+1);set(p,DP.mastery,JSON.stringify(data));const level=Math.floor(data[id]/10);if(data[id]%10===0)say(p,`§b${skillName(id)} mastery increased to Rank ${level+1}!§r (${data[id]} uses)`);}
function treeBranch(id){
 if(ANGEL_ULTIMATE_SKILLS.has(id))return "ULTIMATE SKILLS";
 if(["fireball","black_flame","lightning_spear","ice_lance","acid_rain","earth_spike","water_blade","wind_blade"].includes(id))return "ELEMENTAL ARTS";
 if(["healing","ultraspeed_regeneration","guardian","arcane_barrier","multilayer_barrier","uriel"].includes(id))return "SUPPORT & DEFENCE";
 if(["agility","steel_strength","shadow_motion","absolute_severance","chosen_one","michael"].includes(id))return "COMBAT & BODY";
 if(["predator","gluttony","beelzebuth","great_sage","thought_acceleration","universal_perception","raphael","degenerate","shub_niggurath"].includes(id))return "UNIQUE & ANALYSIS";
 if(["azathoth"].includes(id))return "ULTIMATE SKILLS";
 return "GENERAL / SPECIAL";
}
function showHud(p){try{p.onScreenDisplay.setActionBar(statsText(p));}catch{}}
function initPlayer(p){
 if(!get(p,DP.raceChosen,false))return false;
 if(get(p,DP.skills,null)===null)set(p,DP.skills,JSON.stringify(["magic_bolt"]));
 if(get(p,DP.level,null)===null)set(p,DP.level,1);
 if(get(p,DP.xp,null)===null)set(p,DP.xp,0);
 if(get(p,DP.skillPoints,null)===null)set(p,DP.skillPoints,0);
 if(get(p,DP.souls,null)===null)set(p,DP.souls,0);
 if(get(p,DP.cooldowns,null)===null)set(p,DP.cooldowns,"{}");
 if(get(p,DP.mastery,null)===null)set(p,DP.mastery,"{}");
 if(get(p,DP.equippedMagic,null)===null)set(p,DP.equippedMagic,"magic_bolt");
 if(!get(p,"ts27_start_rerolls_granted",false)){give(p,"tensura:unique_skill_reroll",3);set(p,"ts27_start_rerolls_granted",true);set(p,"ts26_start_unique_rerolls",3);set(p,"ts26_start_unique_rerolls_used",0);}
 if(!get(p,"ts26_menu_migrated",false)){
  removeItemById(p,"tensura:reincarnation_compass");removeItemById(p,"tensura:menu_crystal");
  const c=inv(p);let hasMenu=false,hasMagic=false,hasSkill=false,hasNaming=false,hasTable=false;if(c){for(let i=0;i<c.size;i++){const id=c.getItem(i)?.typeId;if(id==="tensura:tensura_compass")hasMenu=true;if(id==="tensura:magic_horn")hasMagic=true;if(id==="tensura:skill_horn")hasSkill=true;if(id==="tensura:naming_horn")hasNaming=true;if(id==="minecraft:crafting_table")hasTable=true;}}
  if(!hasMenu)give(p,"tensura:tensura_compass");if(!hasMagic)give(p,"tensura:magic_horn");if(!hasSkill)give(p,"tensura:skill_horn");if(!hasNaming)give(p,"tensura:naming_horn");if(!hasTable)give(p,"minecraft:crafting_table");
  set(p,"ts26_menu_migrated",true);
 }
 return true;
}
function raceCard(p,index){
 const race=RACES[(index+RACES.length)%RACES.length];
 if(raceFormsOpen.has(p.id))return;
 raceFormsOpen.add(p.id);
 const form=new CustomForm(p,"TENSURA • REINCARNATION");
 try{form.image(`textures/gui/races/${race.art}.png`,"tensura",{width:1,onClick:()=>{try{form.close();}catch{}raceFormsOpen.delete(p.id);const next=(index+1)%RACES.length;raceCursor.set(p.id,next);system.runTimeout(()=>raceCard(p,next),2);}});}catch{form.label(`${race.name} — ${race.desc}`);}
 form.header(`${race.name.toUpperCase()}  •  ${index+1}/${RACES.length}`);
 form.label(race.desc);
 form.label(`VITALITY ${race.hp}   MAGICULES ${race.mp}   AURA ${race.ap}\nSTAMINA ${race.sp}   EP ${race.ep}\nMAGIC JEWELS ${race.jewels[0].toLocaleString()}–${race.jewels[1].toLocaleString()}`);
 form.divider();
 form.button("← PREVIOUS RACE",()=>{try{form.close();}catch{}raceFormsOpen.delete(p.id);raceCursor.set(p.id,(index-1+RACES.length)%RACES.length);system.runTimeout(()=>raceCard(p,index-1),2);});
 form.button("NEXT RACE →",()=>{try{form.close();}catch{}raceFormsOpen.delete(p.id);raceCursor.set(p.id,(index+1)%RACES.length);system.runTimeout(()=>raceCard(p,index+1),2);});
 form.button(`REINCARNATE AS ${race.name.toUpperCase()}`,()=>{try{form.close();}catch{}raceFormsOpen.delete(p.id);system.runTimeout(()=>chooseRace(p,race),2);});
 try{form.show().then(()=>{raceFormsOpen.delete(p.id);if(p.isValid&&!get(p,DP.raceChosen,false)){system.runTimeout(()=>raceCard(p,Number(raceCursor.get(p.id)||index)),40);}}).catch(()=>{raceFormsOpen.delete(p.id);if(p.isValid&&!get(p,DP.raceChosen,false))system.runTimeout(()=>raceCard(p,index),60);});}
 catch{raceFormsOpen.delete(p.id);if(p.isValid&&!get(p,DP.raceChosen,false))system.runTimeout(()=>raceCard(p,index),60);}
}
function showRaceSelection(p){if(!p?.isValid||get(p,DP.raceChosen,false)||raceFormsOpen.has(p.id))return;const idx=Number(raceCursor.get(p.id)||0);raceCard(p,idx);}
function chooseRace(p,race){
 if(!p?.isValid||get(p,DP.raceChosen,false)){say(p,"Your reincarnation choice is permanent. Race selection can only be completed once.");return;}
 applyRace(p,race,false);
}
function removeItemById(p,id){const c=inv(p);if(!c)return;for(let i=0;i<c.size;i++){const it=c.getItem(i);if(it?.typeId===id)c.setItem(i,undefined);}}
function applyRaceBody(p){
 const race=String(get(p,DP.race,"human"));
 const scaleMap={slime:0.55,named_slime:0.62,demon_slime:0.9,human:1,named_human:1,goblin:0.92,hobgoblin:1.02,ogre:1.18,kijin:1.24,oni:1.32,orc:1.12,high_orc:1.2,orc_king:1.32,lizardman:1.08,dragonewt:1.3,dwarf:0.84,high_dwarf:0.9,elf:0.96,high_elf:1.02,demon:1.08,arch_demon:1.22,majin:1.3,spirit:0.96,elemental_lord:1.12,beastman:1.1,high_beastman:1.2,vampire:1.02,noble_vampire:1.12,dragon:1.85,true_dragon:2.2};
 const hpMap={slime:24,named_slime:32,demon_slime:48,human:20,goblin:22,hobgoblin:30,ogre:34,kijin:42,oni:52,orc:32,high_orc:40,orc_king:56,lizardman:29,dragonewt:44,dwarf:28,high_dwarf:34,elf:22,high_elf:30,demon:30,arch_demon:50,majin:80,spirit:25,elemental_lord:55,beastman:30,high_beastman:42,vampire:27,noble_vampire:44,dragon:60,true_dragon:120};
 // Bedrock player geometry is not replaceable through minecraft:scale. Do not pretend this changes the player model.
 set(p,"ts27_body_form_pending",race);
 const raceHp=Number(get(p,DP.hp,hpMap[race]||20))||hpMap[race]||20;const boost=Math.max(0,Math.ceil((raceHp-20)/4)-1);
 try{if(raceHp>20)p.addEffect("health_boost",40,{amplifier:boost,showParticles:false});else p.removeEffect("health_boost");const hc=p.getComponent("minecraft:health");if(hc&&hc.currentValue>hc.effectiveMax)hc.setCurrentValue(hc.effectiveMax);}catch{}
 // Refresh short-duration effects every second so racial traits remain continuously active.
 const racial={slime:[["resistance",40,0],["regeneration",40,0],["slow_falling",40,0]],goblin:[["speed",40,0]],ogre:[["strength",40,1]],orc:[["resistance",40,0],["strength",40,0]],lizardman:[["water_breathing",40,0],["strength",40,0]],dwarf:[["haste",40,0],["resistance",40,0]],elf:[["night_vision",40,0]],demon:[["fire_resistance",40,0],["strength",40,0]],spirit:[["resistance",40,0],["night_vision",40,0]],beastman:[["speed",40,0],["jump_boost",40,0]],vampire:[["night_vision",40,0],["regeneration",40,0]],dragon:[["fire_resistance",40,0],["strength",40,1],["slow_falling",40,0]],true_dragon:[["fire_resistance",40,1],["strength",40,2],["slow_falling",40,0],["resistance",40,1]]};
 for(const [id,duration,amp] of (racial[race]||[]))effect(p,id,duration,amp);
}
function applyRace(p,race,reset){
 if(get(p,DP.raceChosen,false))return;
 set(p,DP.race,race.id);set(p,DP.baseRace,race.id);set(p,DP.raceChosen,true);if(!reset){set(p,"ts26_start_unique_rerolls",3);set(p,"ts26_start_unique_rerolls_used",0);}
 set(p,DP.hp,race.hp);set(p,DP.mp,race.mp);set(p,DP.maxMp,race.mp);set(p,DP.ap,race.ap);set(p,DP.maxAp,race.ap);set(p,DP.sp,race.sp);set(p,DP.maxSp,race.sp);set(p,"ts26_max_ep",race.mp+race.ap+race.sp);set(p,DP.ep,race.mp+race.ap+race.sp);
 set(p,DP.jewels,Math.floor(race.jewels[0]+Math.random()*(race.jewels[1]-race.jewels[0]+1)));
 if(reset){saveList(p,DP.skills,[...list(p,DP.skills),"magic_bolt",...race.skills]);set(p,DP.unique,race.skills.find(x=>!["magic_bolt"].includes(x))||"");}
 else {
  let startSkills=["magic_bolt",...race.skills];
  let startUnique=race.id==="slime"?(Math.random()<0.01?"both":Math.random()<0.52?"great_sage":"gluttony"):( ["human","goblin"].includes(race.id)?"":(race.skills[0]||"") );
  if(race.id==="slime"){
   startSkills=startSkills.filter(x=>x!=="great_sage"&&x!=="gluttony");
   if(startUnique==="both")startSkills.push("great_sage","gluttony");else startSkills.push(startUnique);
  }
  saveList(p,DP.skills,startSkills);set(p,DP.unique,startUnique==="both"?"Great Sage + Gluttony":startUnique);
 }
 set(p,DP.equipped,race.skills.find(x=>!isMagicSkill(x)&&!PASSIVE_SKILLS.has(x))||"");set(p,DP.treeMode,false);set(p,DP.treeIndex,0);
 removeItemById(p,"tensura:reincarnation_compass");
 if(!get(p,"ts26_starter_items",false)){removeItemById(p,"tensura:menu_crystal");give(p,"tensura:tensura_compass");give(p,"tensura:magic_horn");give(p,"tensura:skill_horn");give(p,"tensura:naming_horn");give(p,"minecraft:crafting_table");set(p,"ts26_starter_items",true);}
 try{p.removeEffect("health_boost");const boost=Math.max(0,Math.ceil((race.hp-20)/4)-1);if(race.hp>20)p.addEffect("health_boost",999999,{amplifier:boost,showParticles:false});p.addEffect("regeneration",200,{amplifier:0,showParticles:false});if(race.id==="slime")p.addEffect("resistance",200,{amplifier:0,showParticles:false});if(race.id==="ogre"||race.id==="orc")p.addEffect("strength",200,{amplifier:0,showParticles:false});}catch{}
 say(p,`§aReincarnation complete. You are now a §d${race.name}§a. Your race choice is permanent. Tensura Menu opens your character profile; sneak-use Magic Horn to equip spells; sneak-use Skill Horn to open the skill tree.`);
 try{p.dimension.playSound("random.levelup",p.location);}catch{}
 applyRaceBody(p);showHud(p);
 if(!reset&&race.id==="spirit")system.runTimeout(()=>{if(p?.isValid)travelSpiritLabyrinth(p);},40);
 if(!reset&&race.id==="demon")system.runTimeout(()=>{if(p?.isValid)enterCustomRealm(p,"tensura:hell","Hell",0);},40);
}

function openMagicMenu(p){if(!initPlayer(p)){showRaceSelection(p);return;}if(magicFormsOpen.has(p.id))return;magicFormsOpen.add(p.id);const form=new CustomForm(p,"TENSURA • SPELL EQUIPMENT");try{form.image("textures/gui/magic/magic_gui.png","tensura");}catch{}const known=[...MAGIC_SKILL_IDS].filter(id=>hasSkill(p,id)&&isMagicSkill(id));const size=15,total=Math.ceil(known.length/size),page=Math.max(0,Math.min(total-1,n(p,"ts26_magic_page",0)));form.header(`MAGIC DISCIPLINE • ${page+1}/${Math.max(1,total)}`);form.label(`Equipped: ${skillName(get(p,DP.equippedMagic,"magic_bolt"))}
MP ${n(p,DP.mp)}/${n(p,DP.maxMp)} • ${known.length} learned magical arts
Sneak-use the Magic Horn to choose; normal use casts the equipped art.`);form.divider();if(!known.length)form.label("No magic arts learned yet. Find magic tomes in chests and creature drops.");for(const id of known.slice(page*size,(page+1)*size)){const cost=skillCost(id),rank=masteryLevel(p,id);form.button(`${id===get(p,DP.equippedMagic,"magic_bolt")?"§a◆ EQUIPPED":"§f◇"} ${skillName(id)} • ${cost} MP • M${rank}`,()=>{try{form.close();}catch{}magicFormsOpen.delete(p.id);set(p,DP.equippedMagic,id);say(p,`${skillName(id)} equipped. Use the Magic Horn normally to cast it.`);showHud(p);});}if(page>0)form.button("← PREVIOUS MAGIC ARTS",()=>{set(p,"ts26_magic_page",page-1);try{form.close();}catch{}magicFormsOpen.delete(p.id);openMagicMenu(p);});if(page+1<total)form.button("NEXT MAGIC ARTS →",()=>{set(p,"ts26_magic_page",page+1);try{form.close();}catch{}magicFormsOpen.delete(p.id);openMagicMenu(p);});form.closeButton();form.show().then(()=>magicFormsOpen.delete(p.id)).catch(()=>magicFormsOpen.delete(p.id));}

function magicHornKey(p){return `ts26_magic_horn_${p.selectedSlotIndex}`;}
function assignMagicToHeldHorn(p){
 const key=magicHornKey(p),raw=get(p,key,get(p,DP.equippedMagic,"magic_bolt")),current=isMagicSkill(raw)?raw:"magic_bolt";
 const form=new CustomForm(p,"TENSURA • MAGIC HORN CONFIGURATION");
 form.header(`MAGIC HORN IN HOTBAR SLOT ${p.selectedSlotIndex+1}`);
 form.label(`This Magic Horn has its own spell assignment. Current: ${skillName(current)}. Each horn slot is independent.`);
 const known=[...MAGIC_SKILL_IDS].filter(id=>hasSkill(p,id)&&isMagicSkill(id));
 for(const id of known)form.button(`${id===current?"§a◆ EQUIPPED":"§f◇"} ${skillName(id)} • ${skillCost(id)} MP`,()=>{try{form.close();}catch{}set(p,key,id);say(p,`Magic Horn in slot ${p.selectedSlotIndex+1} is now assigned to ${skillName(id)}.`);},skillIcon(id));
 form.closeButton();form.show().catch(()=>{});
}
function magicHornUse(p){
 if(!initPlayer(p)){showRaceSelection(p);return;}
 const key=magicHornKey(p);
 if(p.isSneaking){assignMagicToHeldHorn(p);return;}
 const assigned=get(p,key,get(p,DP.equippedMagic,"magic_bolt"));if(!isMagicSkill(assigned)){set(p,key,"magic_bolt");say(p,"This Magic Horn was reset to Magic Bolt because its old assignment was not a magic art.");assignMagicToHeldHorn(p);return;}
 castSkill(p,assigned);
}
function tensuraCraftingMenu(p){
 const f=new CustomForm(p,"TENSURA • CRAFTING WORKSHOP");f.header("TENSURA CRAFTING TABLE");f.label("Dedicated Tensura workstation. Select a discipline to craft Tensura equipment, materials, potions and tools.");
 f.button("FORGE • WEAPONS & ARMOUR",()=>{try{f.close();}catch{}forgeMenu(p);});
 f.button("MAGIC KILN • SMELTING & MIXING",()=>{try{f.close();}catch{}processingMenu(p,"kiln");});
 f.button("ALCHEMY • POTIONS & REFINING",()=>{try{f.close();}catch{}processingMenu(p,"alchemy");});
 f.button("MINING • ORE CRUSHING",()=>{try{f.close();}catch{}miningStationMenu(p);});
 f.button("SPELLBINDING • MAGIC ARTS",()=>{try{f.close();}catch{}openMagicMenu(p);});
 f.closeButton();f.show().catch(()=>{});
}

function openTensuraMenu(p){
 if(!initPlayer(p)){showRaceSelection(p);return;}
 const form=new CustomForm(p,"TENSURA • CHARACTER MENU");
 try{form.image("textures/gui/background/tr_menu.png","tensura");}catch{}
 form.header("TENSURA MENU");
 form.label(`Race / Form: ${get(p,DP.race,"Unknown")}\nLevel ${n(p,DP.level,1)}  •  EP ${n(p,DP.ep)}  •  Souls ${n(p,DP.souls)}\nHP ${Math.ceil(p.getComponent("minecraft:health")?.currentValue||n(p,DP.hp))}  •  MP ${n(p,DP.mp)}  •  AP ${n(p,DP.ap)}  •  SP ${n(p,DP.sp)}\nMagic Jewels ${n(p,DP.jewels)}  •  Skill Points ${n(p,DP.skillPoints)}`);
 form.button("CHARACTER STATS & ATTRIBUTES",()=>{try{form.close();}catch{}const f=new CustomForm(p,"TENSURA • CHARACTER STATS");f.header("STATUS & ATTRIBUTES");f.label(statsText(p));f.label(`Race: ${get(p,DP.race,"Unknown")}\nBase race: ${get(p,DP.baseRace,"Unknown")}\nClass: ${get(p,DP.class,"None")}\nUnique Skill: ${get(p,DP.unique,"None")||"None"}`);f.closeButton();f.show().catch(()=>{});});
 form.button("RACE & EVOLUTION",()=>{try{form.close();}catch{}evolutionMenu(p);});
 form.button("SKILL TREE & MASTERY",()=>{try{form.close();}catch{}openSkillTree(p);});
 if(n(p,DP.level,1)>=10||n(p,DP.ep)>=10000)form.button("BOSS ENCOUNTERS & CONTRACTS",()=>{try{form.close();}catch{}primordialSummonMenu(p);});
 else form.label("§8Boss Encounters unlocks at Level 10 or 10,000 EP.§r");
 if(list(p,"ts26_defeated_bosses").length)form.button("DEFEATED BOSS COMPANIONS",()=>{try{form.close();}catch{}companionContractMenu(p);});
 form.closeButton();form.show().catch(()=>{});
}
function summonBoss(p,id,mpCost,epCost){
 if(n(p,DP.mp)<mpCost||n(p,DP.ep)<epCost){say(p,`Boss summoning requires ${mpCost} MP and ${epCost} EP.`);return;}
 set(p,DP.mp,n(p,DP.mp)-mpCost);
 try{const rot=p.getRotation(),yaw=rot.y*Math.PI/180;const pos={x:p.location.x-Math.sin(yaw)*8,y:p.location.y,z:p.location.z+Math.cos(yaw)*8};const boss=p.dimension.spawnEntity(id,pos);boss.addTag("tensura_boss");try{p.dimension.playSound("tensura.phase3.boss_aura",pos);}catch{}say(p,`§4${id.replace("tensura:","").replaceAll("_"," ").toUpperCase()} HAS AWAKENED.§r Prepare for battle.`);}catch(e){set(p,DP.mp,n(p,DP.mp)+mpCost);say(p,"The boss could not be summoned at this location.");}
}
function discipleMenu(p){
 const form=new CustomForm(p,"TENSURA • DISCIPLE RECORD");
 form.header("NAMING BONDS");
 const disciples=list(p,DP.disciples);
 form.label(disciples.length?`Your named disciples (${disciples.length}):\n${disciples.map((x,i)=>`${i+1}. ${x}`).join("\n")}`:"You have not named any disciples yet. Use a Naming Scroll near another player with less MP and wait for their acceptance.");
 const master=get(p,"ts26_named_by","");
 if(master)form.label(`Your naming master: ${master}. The naming bond evolved your race and anchored your spirit body.`);
 form.closeButton();form.show().catch(()=>{});
}
function primordialSummonMenu(p){
 const form=new CustomForm(p,"TENSURA • PRIMORDIAL DEMONS");
 try{form.image("textures/gui/magic/summoning_magic_button.png","tensura");}catch{}
 form.header("DEMON LORDS & PRIMORDIALS");
 form.label("Primordial demons are high-tier boss encounters. Summoning consumes MP. Defeating them can yield rare Skill Tomes, souls and a Demon Lord Seed.");
 const list=[["Milim Nava","tensura:milim",1500,30000],["Ramiris","tensura:ramiris",650,12000],["Luminus Valentine","tensura:luminus",1200,24000],["Dagruel","tensura:dagruel",1800,36000],["Leon Cromwell","tensura:leon",1600,32000],["Velzard","tensura:velzard",2200,44000],["Dino","tensura:dino",1300,26000],["Clayman","tensura:clayman",700,14000],["Carrion","tensura:carrion",1100,22000],["Frey","tensura:frey",1000,20000],["Hinata Sakaguchi","tensura:hinata",1250,25000],["Diablo","tensura:diablo",900,18000],["Testarossa","tensura:testarossa",850,17000],["Carrera","tensura:carrera",880,17500],["Ultima","tensura:ultima",800,16000],["Misery","tensura:misery",800,16000],["Rain","tensura:rain",780,15500],["Guy Crimson","tensura:guy_crimson",2400,48000]];
 for(const [name,id,mp,ep] of list)form.button(`${name}  •  ${mp} MP / ${ep} EP`,()=>{try{form.close();}catch{}if(n(p,DP.mp)<mp||n(p,DP.ep)<ep){say(p,`Summoning requires ${mp} MP and ${ep} EP.`);return;}if(!consumeHeld(p,"tensura:demon_lord_summoning_seal")){say(p,"Hold a Demon Lord Summoning Seal to complete the ritual.");return;}system.runTimeout(()=>summonBoss(p,id,mp,ep),2);});
 form.closeButton();form.show().catch(()=>{});
}
function explorationMapMenu(p){
 const f=new CustomForm(p,"TENSURA • EXPLORATION ATLAS");f.header("JAVA-DERIVED LANDMARKS");f.label("Choose a landmark. The compass bearing points you toward the Overworld site; the structure is placed when you arrive.");
 for(const [label,key] of [["Veldora's Cave","veldora"],["Great Spirit Labyrinth","labyrinth"],["Charybdis Cave","charybdis"],["Dwarven Village","dwarf"],["Great World Tree","tree"],["Spirit Sanctuary","spirit"],["Demon Realm Ruins","demon"]])f.button(label,()=>{try{f.close();}catch{}mapDiscovery(p,key);});
 f.closeButton();f.show().catch(()=>{});
}
function landmarkCompassMenu(p){
 const f=new CustomForm(p,"TENSURA • CARTOGRAPHER'S COMPASS");f.header("JAVA-DERIVED LANDMARKS");f.label("Choose a destination. Your compass bearing will guide you to the Overworld entrance; Veldora's Cave, Charybdis Cave and the Great Spirit Labyrinth open in their own dimensions.");
 for(const [label,key] of [["Hell Gate","hell_gate"],["Veldora's Cave","veldora"],["Great Spirit Labyrinth","labyrinth"],["Charybdis Cave","charybdis"],["Dwarven Village","dwarf"]])f.button(label,()=>{try{f.close();}catch{}mapDiscovery(p,key);});f.closeButton();f.show().catch(()=>{});
}
function worldGateMenu(p){
 const form=new CustomForm(p,"TENSURA • DIMENSIONAL GATES");
 form.header("FOUR INDEPENDENT JAVA-INSPIRED REALMS");
 form.label("These destinations are separate custom Bedrock dimensions. None uses the Nether or End dimension or their texture overrides. Each realm is generated and assembled inside its own void dimension.");
 form.button("HELL • UNDERWORLD",()=>{try{form.close();}catch{}enterCustomRealm(p,"tensura:hell","Hell",0);});
 form.button("GREAT SPIRIT LABYRINTH",()=>{try{form.close();}catch{}travelSpiritLabyrinth(p);});
 form.button("CHARYBDIS CAVE",()=>{try{form.close();}catch{}enterCustomRealm(p,"tensura:charybdis_cave","Charybdis Cave",1);});
 form.button("VELDORA'S CAVE",()=>{try{form.close();}catch{}enterCustomRealm(p,"tensura:veldora_cave","Veldora's Cave",2);});
 form.button("RETURN TO OVERWORLD",()=>{try{form.close();}catch{}travelOverworld(p);});
 form.closeButton();form.show().catch(()=>{});
}
function enterCustomRealm(p,id,label,kind){
 if(!p?.isValid)return;
 try{
  const dim=world.getDimension(id);
  // Teleport first so Bedrock loads the destination chunks before block placement begins.
  p.teleport({x:0.5,y:60,z:0.5},{dimension:dim,keepVelocity:false});
  try{dim.runCommand(`tickingarea add circle 0 40 0 4 ts27_${kind}_build true`);}catch{}

  system.runTimeout(()=>{
   try{
    if(kind===2)buildVeldoraVoidCave(dim,p);else buildCustomRealm(dim,kind);
    if(kind===1){
     const zStarts=[-48,5,59];let partIndex=Math.max(0,Number(world.getDynamicProperty("ts27_charybdis_part")||0)),partAttempts=0;
     const loadCharybdisPart=()=>{
      if(partIndex>=12){system.runTimeout(()=>{try{const boss=dim.spawnEntity("tensura:charybdis",{x:0.5,y:44,z:0.5});boss.addTag("tensura_boss");boss.nameTag="Charybdis • Catastrophe Dragon";}catch(e){say(p,`Charybdis spawn failed: ${String(e).slice(0,120)}`);}},20);return;}
      const zi=Math.floor(partIndex/4),xi=partIndex%4,name=`part_${zi}_${xi}`,sx=-48+xi*25,sz=zStarts[zi],area=`ts27_charybdis_${zi}_${xi}`;
      try{try{dim.runCommand(`tickingarea add circle ${sx+12} 70 ${sz+27} 4 ${area} true`);}catch{}const r=dim.runCommand(`structure load tensura:charybdis_cave/split/${name} ${sx} 40 ${sz}`);if(r&&typeof r.successCount==="number"&&r.successCount===0)throw new Error(`${name} rejected`);try{dim.runCommand(`tickingarea remove ${area}`);}catch{}partIndex++;partAttempts=0;world.setDynamicProperty("ts27_charybdis_part",partIndex);system.runTimeout(loadCharybdisPart,8);}catch(e){partAttempts++;if(partAttempts<20)system.runTimeout(loadCharybdisPart,Math.min(100,10+partAttempts*5));else say(p,`Charybdis cave section ${partIndex+1}/12 failed after 20 retries: ${String(e).slice(0,120)}. Re-enter to resume.`);}
     };
     loadCharybdisPart();
    }
    p.teleport({x:0.5,y:42,z:0.5},{dimension:dim,keepVelocity:false});effect(p,"slow_falling",100,0);if(kind===0)effect(p,"fire_resistance",1200,0);
    say(p,`Entered ${label}. This is its own custom dimension, independent of the Nether and End.`);
   }catch(e){say(p,`${label} build failed: ${String(e).slice(0,180)}`);}
  },20);
 }catch(e){say(p,`${label} could not open: ${String(e).slice(0,180)}`);}
}
function buildCustomRealm(dim,kind){
 const key=`ts27_custom_realm_built_${dim.id.replace(/[^a-z0-9]/gi,"_")}`;if(world.getDynamicProperty(key))return;
 const radius=kind===0?62:kind===2?30:kind===3?30:42;
 makeLanding(dim,0,40,0,kind===0?"minecraft:basalt":kind===2?"minecraft:deepslate_bricks":"minecraft:prismarine_bricks");
 const floor=kind===0?"minecraft:basalt":kind===1?"minecraft:polished_deepslate":kind===2?"minecraft:deepslate_bricks":"minecraft:prismarine_bricks";
 const wall=kind===0?"minecraft:blackstone":kind===1?"minecraft:deepslate_bricks":kind===2?"minecraft:obsidian":"minecraft:prismarine_bricks";
 let x=-radius,z=-radius;
 const buildBatch=()=>{
  let done=0;
  while(z<=radius&&done<48){
   const r=Math.sqrt(x*x+z*z);
   if(r<=radius){
    const relief=kind===0?Math.max(-7,Math.min(12,Math.floor(4*Math.sin(x*.12)+5*Math.cos(z*.10)+3*Math.sin((x+z)*.08)))):0;
    const top=39+relief;
    const ground=kind===0?(Math.sin(x*.19+z*.11)>0.79?"minecraft:soul_sand":Math.cos(z*.17-x*.09)>0.82?"minecraft:magma_block":floor):floor;
    placeBlock(dim,x,top-2,z,kind===0?"minecraft:netherrack":floor);placeBlock(dim,x,top-1,z,ground);placeBlock(dim,x,top,z,ground);
    if(kind===0&&r>12&&r<radius-6&&Math.sin(x*.13)*Math.cos(z*.12)>0.78)placeBlock(dim,x,top+1,z,"minecraft:lava");
    if(kind===0)placeBlock(dim,x,70,z,"minecraft:polished_blackstone");
    if(r>=radius-2)for(let y=40;y<=58;y++)placeBlock(dim,x,y,z,wall);
    if(kind===0&&r>20&&r<radius-4&&((x*17+z*31)%97===0)){for(let y=top+1;y<top+7;y++)placeBlock(dim,x,y,z,"minecraft:basalt");}
   }
   x++;if(x>radius){x=-radius;z++;}done++;
  }
  if(z<=radius){system.runTimeout(buildBatch,1);return;}
  world.setDynamicProperty(key,true);
  if(kind===0)buildHellGatePair(dim);
  if(kind===0)spawnHellResidents(dim);
  try{dim.runCommand(`tickingarea remove ts27_${kind}_build`);}catch{}
 };
 buildBatch();
}
function buildHellGatePair(hell){
 const queue=[];
 if(!world.getDynamicProperty("ts27_hell_gate_in_hell"))for(let half=0;half<2;half++)queue.push({dim:hell,cx:0,cy:20,cz:-20,half,key:"ts27_hell_gate_in_hell"});
 try{const ow=world.getDimension("minecraft:overworld"),sp=world.getDefaultSpawnLocation();if(!world.getDynamicProperty("ts27_hell_gate_overworld"))for(let half=0;half<2;half++)queue.push({dim:ow,cx:Math.floor(sp.x+120),cy:Math.max(-40,Math.floor(sp.y-35)),cz:Math.floor(sp.z+120),half,key:"ts27_hell_gate_overworld"});}catch{}
 let i=0,gateAttempts=0;const next=()=>{
  if(i>=queue.length){world.setDynamicProperty("ts27_hell_gate_in_hell",true);if(queue.some(q=>q.key==="ts27_hell_gate_overworld"))world.setDynamicProperty("ts27_hell_gate_overworld",true);return;}
  const q=queue[i],x=q.cx-40+q.half*40,area=`ts27_gate_${q.key}_${q.half}`;
  try{try{q.dim.runCommand(`tickingarea add circle ${x+20} ${q.cy+65} ${q.cz+20} 4 ${area} true`);}catch{}const r=q.dim.runCommand(`structure load tensura:hell/gate/split/part_0_${q.half} ${x} ${q.cy} ${q.cz}`);if(r&&typeof r.successCount==="number"&&r.successCount===0)throw new Error("Structure load rejected");try{q.dim.runCommand(`tickingarea remove ${area}`);}catch{}gateAttempts=0;i++;}
  catch{gateAttempts++;if(gateAttempts<20){system.runTimeout(next,Math.min(100,10+gateAttempts*5));return;}for(let xx=-1;xx<=1;xx++)for(let yy=1;yy<=4;yy++)placeBlock(q.dim,x+40+xx,q.key==="ts27_hell_gate_in_hell"?40+yy:q.cy+yy,q.cz,"tensura:hell_portal");gateAttempts=0;i++;}
  system.runTimeout(next,10);
 };
 if(queue.length)next();
 // The Hell-side portal surface is kept clickable even if its Java gate structure has unsupported block states.
 for(let x=-1;x<=1;x++)for(let y=1;y<=4;y++)placeBlock(hell,x,40+y,-20,"tensura:hell_portal");
 // Broad glowstone columns provide a visible light source beneath the ceiling built with the terrain batches.
 for(const [lx,lz] of [[0,0],[-24,-24],[24,-24],[-24,24],[24,24]])for(let y=66;y<=69;y++)placeBlock(hell,lx,y,lz,"minecraft:glowstone");
}

function buildCaveExitGate(dim){
 for(let x=-2;x<=2;x++)for(let y=0;y<=5;y++)placeBlock(dim,x,39+y,-24,(Math.abs(x)===2||y===0||y===5)?"minecraft:obsidian":"tensura:hell_portal");
}

function spawnHellResidents(dim){
 if(world.getDynamicProperty("ts27_hell_initial_spawns"))return;
 const seeds=[["tensura:greater_daemon",-18,-18],["tensura:lesser_daemon",18,-18],["tensura:greater_daemon",-18,18],["tensura:lesser_daemon",18,18],["tensura:hell_moth",0,-24],["tensura:hell_caterpillar",24,0]];
 let n=0;for(const [id,x,z] of seeds)try{const y=findSurfaceY(dim,x,z);dim.spawnEntity(id,{x:x+0.5,y:y+0.2,z:z+0.5});n++;}catch{}
 if(n>=4)world.setDynamicProperty("ts27_hell_initial_spawns",true);
}
function buildVeldoraVoidCave(dim,p){
 const key="ts27_veldora_void_cave_built";if(world.getDynamicProperty(key))return;
 makeLanding(dim,0,40,0,"minecraft:deepslate_bricks");
 const radius=26;let x=-radius,z=-radius;
 const batch=()=>{
  let done=0;while(z<=radius&&done<64){
   const r=Math.sqrt(x*x+z*z);if(r<=radius){
    placeBlock(dim,x,39,z,"minecraft:deepslate_bricks");
    const roof=54-Math.floor(Math.max(0,1-r/28)*8);
    if(r>=23){for(let y=40;y<=roof;y++)placeBlock(dim,x,y,z,"minecraft:deepslate_bricks");}
    else {placeBlock(dim,x,roof,z,"minecraft:deepslate");for(let y=40;y<roof;y++)placeBlock(dim,x,y,z,"minecraft:air");}
    if(r>8&&r<20&&((x*11+z*19)%71===0))placeBlock(dim,x,40,z,"minecraft:amethyst_block");
    if(r>5&&r<8)placeBlock(dim,x,40,z,"minecraft:obsidian");
   }
   x++;if(x>radius){x=-radius;z++;}done++;
  }
  if(z<=radius){system.runTimeout(batch,1);return;}
  for(const [px,pz] of [[-18,-18],[18,-18],[-18,18],[18,18]]){for(let y=40;y<=49;y++)placeBlock(dim,px,y,pz,"minecraft:amethyst_block");placeBlock(dim,px,50,pz,"minecraft:glowstone");}
  buildCaveExitGate(dim);
  world.setDynamicProperty(key,true);try{dim.runCommand("tickingarea remove ts27_2_build");}catch{}
  system.runTimeout(()=>{let tries=0;const spawn=()=>{try{const dragon=dim.spawnEntity("tensura:veldora",{x:0.5,y:42,z:0.5});dragon.addTag("tensura_boss");dragon.nameTag="Veldora • Storm Dragon";}catch(e){if(++tries<8)system.runTimeout(spawn,40);else if(p?.isValid)say(p,`Veldora could not manifest: ${String(e).slice(0,120)}`);}};spawn();},40);
 };
 batch();
}

function travelSpiritLabyrinth(p){
 if(!p?.isValid)return;
 let dim;try{dim=world.getDimension("tensura:great_spirit_labyrinth");}catch(e){say(p,`Great Spirit Labyrinth dimension unavailable: ${String(e).slice(0,160)}`);return;}
 if(get(p,"ts26_labyrinth_loading",false)){say(p,"The Great Spirit Labyrinth is already being assembled. Please wait.");return;}
 try{
  p.teleport({x:0.5,y:251,z:-166.5},{dimension:dim,keepVelocity:false});
  makeLanding(dim,0,250,-166,"minecraft:polished_deepslate");buildSpiritExitPortal(dim);
  if(world.getDynamicProperty("ts27_spirit_labyrinth_built")){
   spawnLabyrinthResidents(dim,p);say(p,"You have entered the Great Spirit Labyrinth. Its Java-derived sections are assembled.");return;
  }
  set(p,"ts26_labyrinth_loading",true);
  let segment=Math.max(0,Number(world.getDynamicProperty("ts27_spirit_labyrinth_segment")||0));
  const origin={x:-55,y:0,z:-158};
  const fail=(err)=>{set(p,"ts26_labyrinth_loading",false);try{dim.runCommand("tickingarea remove ts27_labyrinth_half_a");dim.runCommand("tickingarea remove ts27_labyrinth_half_b");}catch{}if(p?.isValid)say(p,`Labyrinth assembly stopped at section ${segment+1}/10: ${String(err).slice(0,180)}. Your progress is saved; re-enter to resume.`);};
  let labyrinthAttempts=0;const loadHalf=(half)=>{
   if(segment>=10){
    world.setDynamicProperty("ts27_spirit_labyrinth_built",true);set(p,"ts26_labyrinth_loading",false);spawnLabyrinthResidents(dim,p);
    if(p?.isValid)say(p,"The Great Spirit Labyrinth is ready. All ten original Java sections have been assembled.");return;
   }
   try{
    const z=origin.z+segment*32,x=half===0?origin.x:0,name=`segment_${String(segment).padStart(2,"0")}_${half===0?"a":"b"}`;
    const area=half===0?"ts27_labyrinth_half_a":"ts27_labyrinth_half_b";
    try{dim.runCommand(`tickingarea add circle ${x+27} 120 ${z+16} 4 ${area} true`);}catch{}
    const result=dim.runCommand(`structure load tensura:labyrinth/${name} ${x} 0 ${z}`);
    if(result&&typeof result.successCount==="number"&&result.successCount===0)throw new Error(`Bedrock rejected ${name}`);
    try{dim.runCommand(`tickingarea remove ${area}`);}catch{}
    labyrinthAttempts=0;if(half===0){system.runTimeout(()=>loadHalf(1),10);return;}
    segment++;world.setDynamicProperty("ts27_spirit_labyrinth_segment",segment);system.runTimeout(()=>loadHalf(0),10);
   }catch(e){labyrinthAttempts++;if(labyrinthAttempts<20){system.runTimeout(()=>loadHalf(half),Math.min(100,10+labyrinthAttempts*5));}else fail(e);}
  };
  system.runTimeout(()=>loadHalf(0),20);
 }catch(e){set(p,"ts26_labyrinth_loading",false);say(p,`The Great Spirit Labyrinth gate failed: ${String(e).slice(0,180)}`);}
}
function buildSpiritExitPortal(dim){
 for(let x=-2;x<=2;x++)for(let y=0;y<=5;y++)placeBlock(dim,x,248+y,-184,(Math.abs(x)===2||y===0||y===5)?"minecraft:amethyst_block":"tensura:hell_portal");
}
function spawnLabyrinthResidents(dim,p){
 if(!world.getDynamicProperty("ts27_spirit_labyrinth_residents")){
  const spawns=[["tensura:spirit_light",-8,249,-170],["tensura:spirit_darkness",8,249,-170],["tensura:spirit_fire",-10,249,-154],["tensura:spirit_water",10,249,-154],["tensura:spirit_wind",-15,249,-166],["tensura:spirit_earth",15,249,-166],["tensura:spirit_spatial",0,249,-180],["tensura:spirit_gravity",0,249,-150]];
  let count=0;for(const [id,x,y,z] of spawns)try{const e=dim.spawnEntity(id,{x,y,z});e.addTag("tensura_labyrinth_resident");count++;}catch{}
  try{const g=dim.spawnEntity("tensura:elemental_colossus",{x:-3.5,y:249,z:-166.5});g.addTag("tensura_boss");g.nameTag="Great Spirit Labyrinth Guardian";count++;}catch{}
  try{const h=dim.spawnEntity("tensura:hound_dog",{x:4.5,y:249,z:-166.5});h.nameTag="Grid Spirit Labyrinth Hound";h.addTag("tensura_labyrinth_guardian");count++;}catch{}
  if(count>=8)world.setDynamicProperty("ts27_spirit_labyrinth_residents",true);
 }
}

function placeBlock(dim,x,y,z,type){try{const b=dim.getBlock({x,y,z});if(b)b.setType(type);}catch{}}
function makeLanding(dim,x,y,z,floor){
 for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++)placeBlock(dim,x+dx,y-2,z+dz,floor);
 for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let dy=-1;dy<=4;dy++)placeBlock(dim,x+dx,y+dy,z+dz,"minecraft:air");
}
function travelOverworld(p){
 try{const d=world.getDimension("minecraft:overworld"),s=world.getDefaultSpawnLocation();p.teleport({x:s.x+0.5,y:s.y+2,z:s.z+0.5},{dimension:d,keepVelocity:false});say(p,"Returned to the Overworld.");}catch{say(p,"The Overworld gate could not stabilize.");}
}
function findSurfaceY(dim,x,z){
 for(let y=280;y>=20;y--){try{const b=dim.getBlock({x,y,z});if(b&&b.typeId!=="minecraft:air"&&b.typeId!=="minecraft:water"&&b.typeId!=="minecraft:lava"&&b.typeId!=="minecraft:leaves"&&b.typeId!=="minecraft:oak_leaves")return y+1;}catch{}}
 return 64;
}
function buildWorldTree(p,discoverOnly=false){
 const dim=world.getDimension("minecraft:overworld"),cx=1000,cz=1000;
 let ground=Number(world.getDynamicProperty("ts26_world_tree_y")||0);
 let treeExists=false;try{treeExists=dim.getBlock({x:cx,y:ground+1,z:cz})?.typeId==="tensura:world_tree_log";}catch{}
 if(!world.getDynamicProperty("ts26_world_tree_built")||!ground||!treeExists){ground=findSurfaceY(dim,cx,cz);
  // Tall living trunk.
  for(let y=0;y<48;y++)for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)placeBlock(dim,cx+dx,ground+y,cz+dz,"tensura:world_tree_log");
  // Four sweeping branches and a small viewing platform.
  for(const dir of [[1,0],[-1,0],[0,1],[0,-1]])for(let h of [17,29,39])for(let i=1;i<=12;i++)placeBlock(dim,cx+dir[0]*i,ground+h+Math.floor(i/5),cz+dir[1]*i,"tensura:world_tree_log");
  // Broad layered canopy, built as an ellipsoid shell to keep block placement bounded.
  const cy=ground+48,rx=13,rz=13,ry=8;
  for(let dx=-rx;dx<=rx;dx++)for(let dz=-rz;dz<=rz;dz++)for(let dy=-ry;dy<=ry;dy++){
   const q=(dx*dx)/(rx*rx)+(dz*dz)/(rz*rz)+(dy*dy)/(ry*ry);
   if(q<=1.0&&q>=0.55)placeBlock(dim,cx+dx,cy+dy,cz+dz,"tensura:world_tree_leaves");
  }
  // Branch landing platform for visitors.
  for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)placeBlock(dim,cx+7+dx,ground+36,cz+dz,"tensura:world_tree_log");
  world.setDynamicProperty("ts26_world_tree_y",ground);world.setDynamicProperty("ts26_world_tree_built",true);try{p.dimension.playSound("tensura.phase3.spirit_grove",{x:cx,y:ground+20,z:cz});}catch{}
 }
 if(!discoverOnly){p.teleport({x:cx+7.5,y:ground+38,z:cz+0.5},{dimension:dim,keepVelocity:false});effect(p,"slow_falling",200,0);say(p,"You have reached the Great World Tree. Its branches form a sanctuary above the Overworld.");}
}
function travelGreatWorldTree(p){
 if(!p?.isValid)return;
 try{const dim=world.getDimension("minecraft:overworld");p.teleport({x:1000,y:100,z:1000},{dimension:dim,keepVelocity:false});effect(p,"slow_falling",400,0);system.runTimeout(()=>{if(p.isValid)buildWorldTree(p);},60);}catch{say(p,"The Great World Tree gate could not open.");}
}
function buildVeldoraCave(p,discoverOnly=false){
 const dim=world.getDimension("minecraft:overworld"),cx=1500,cz=1500,baseY=40;
 let caveExists=false;try{caveExists=dim.getBlock({x:cx,y:baseY+24,z:cz})?.typeId==="minecraft:deepslate";}catch{}
 if(!world.getDynamicProperty("ts26_veldora_cave_built")||!caveExists){
  // Large walkable dragon cavern with continuous floor, 12-block headroom and a vaulted roof.
  for(let x=-20;x<=20;x++)for(let z=-20;z<=20;z++){
   placeBlock(dim,cx+x,baseY,cz+z,"minecraft:deepslate_bricks");
   placeBlock(dim,cx+x,baseY+13,cz+z,"minecraft:deepslate");
   for(let y=baseY+1;y<baseY+13;y++){
    if(Math.abs(x)===20||Math.abs(z)===20)placeBlock(dim,cx+x,y,cz+z,"minecraft:deepslate_bricks");
    else placeBlock(dim,cx+x,y,cz+z,"minecraft:air");
   }
  }
  for(const [lx,lz] of [[-15,-15],[15,-15],[-15,15],[15,15],[0,0]]){placeBlock(dim,cx+lx,baseY+10,cz+lz,"minecraft:sea_lantern");}
  // Carved entry passage to the east.
  for(let z=10;z<=18;z++)for(let x=-2;x<=2;x++)for(let y=baseY+1;y<=baseY+20;y++)placeBlock(dim,cx+x,y,cz+z,"minecraft:air");
  for(let z=11;z<=18;z++){for(let x=-3;x<=3;x++){placeBlock(dim,cx+x,baseY,cz+z,"minecraft:deepslate_bricks");placeBlock(dim,cx+x,baseY+21,cz+z,"minecraft:deepslate");}for(let y=baseY+1;y<=baseY+20;y++){placeBlock(dim,cx-3,y,cz+z,"minecraft:deepslate_bricks");placeBlock(dim,cx+3,y,cz+z,"minecraft:deepslate_bricks");}}
  // Crystal pillars, magic ore deposits and the dragon's obsidian nest.
  for(const [dx,dz] of [[-7,-7],[7,-7],[-7,7],[7,7]]){
   for(let y=1;y<=4;y++)placeBlock(dim,cx+dx,baseY+y,cz+dz,"minecraft:amethyst_block");
   placeBlock(dim,cx+dx,baseY+5,cz+dz,"minecraft:glowstone");
   placeBlock(dim,cx+dx,baseY+1,cz+dz,"tensura:magic_crystal_ore");
  }
  for(let a=-4;a<=4;a++)for(let b=-4;b<=4;b++){
   const r=Math.sqrt(a*a+b*b);if(r>=3.2&&r<=4.2)placeBlock(dim,cx+5+a,baseY+1,cz+5+b,"minecraft:obsidian");
  }
  for(let y=1;y<=3;y++)placeBlock(dim,cx+5,baseY+y,cz+5,"minecraft:crying_obsidian");
  world.setDynamicProperty("ts26_veldora_cave_built",true);
 }
 if(!discoverOnly)p.teleport({x:cx-12.5,y:baseY+2,z:cz-12.5},{dimension:dim,keepVelocity:false});
 // Give the cave chunks time to load, then force a visible boss spawn and retry transient failures.
 const spawnDragon=(attempt)=>{try{const found=dim.getEntities({location:{x:cx,y:baseY+5,z:cz},maxDistance:28}).find(e=>e.typeId==="tensura:veldora");if(found){found.teleport({x:cx,y:baseY+5,z:cz},{dimension:dim,keepVelocity:false});found.addTag("tensura_boss");return;}const dragon=dim.spawnEntity("tensura:veldora",{x:cx,y:baseY+5,z:cz});dragon.addTag("tensura_boss");dragon.nameTag="Veldora • Storm Dragon";}catch(e){if(attempt<6)system.runTimeout(()=>spawnDragon(attempt+1),40);else say(p,"Veldora could not spawn. Check the Content Log for the entity error.");}};
 system.runTimeout(()=>spawnDragon(0),40);
 say(p,discoverOnly?"Veldora's Cave has been charted. Follow the map to reach the Storm Dragon's cavern.":"You have entered Veldora's Cave. The Storm Dragon will appear in the central obsidian nest. Defeat him for rare Ultimate Skill Tomes and a Demon Lord Seed.");
}
function travelVeldoraCave(p){
 if(!p?.isValid)return;
 try{const dim=world.getDimension("minecraft:overworld");p.teleport({x:1500,y:220,z:1500},{dimension:dim,keepVelocity:false});effect(p,"slow_falling",500,0);system.runTimeout(()=>{if(p.isValid)buildVeldoraCave(p);},40);}catch{say(p,"The gate to Veldora's Cave could not open.");}
}
function classMenu(p){
 const form=new CustomForm(p,"TENSURA • HUMAN CAREER");
 const race=get(p,DP.race,"");
 if(get(p,DP.baseRace,race)!=="human"){form.header("Human careers only");form.label("Only humans can select the starting human career paths. Other races follow their own evolution and combat specializations.");form.closeButton();form.show().catch(()=>{});return;}
 const current=get(p,DP.class,"");
 if(current){form.header(`Career locked: ${current.toUpperCase()}`);form.label("You have already chosen your human career. A character may only select one starting class.");form.closeButton();form.show().catch(()=>{});return;}
 form.header("Choose your class");form.label("Your class permanently shapes your early combat growth. You may choose only one class.");
 for(const c of ["Warrior","Mage","Knight","Priest","Ranger"]){form.button(c.toUpperCase(),()=>{try{form.close();}catch{}if(get(p,DP.class,"")){say(p,"You already have a class.");return;}set(p,DP.class,c.toLowerCase());if(c==="Warrior"){set(p,DP.maxAp,n(p,DP.maxAp)+20);set(p,DP.ap,n(p,DP.ap)+20);effect(p,"strength",600,0);effect(p,"health_boost",600,0);}if(c==="Mage"){set(p,DP.maxMp,n(p,DP.maxMp)+60);set(p,DP.mp,n(p,DP.mp)+60);set(p,DP.ep,n(p,DP.ep)+100);}if(c==="Knight"){set(p,DP.maxAp,n(p,DP.maxAp)+15);set(p,DP.ap,n(p,DP.ap)+15);effect(p,"resistance",600,1);}if(c==="Priest"){set(p,DP.maxMp,n(p,DP.maxMp)+40);set(p,DP.mp,n(p,DP.mp)+40);addSkill(p,"healing");}if(c==="Ranger"){set(p,DP.maxSp,n(p,DP.maxSp)+30);set(p,DP.sp,n(p,DP.sp)+30);addSkill(p,"agility");}say(p,`Human class selected: ${c}. Your career cannot be changed.`);});}
 form.closeButton();form.show().catch(()=>{});
}

function skillCost(id){const map={magic_bolt:5,fireball:12,water_blade:10,wind_blade:10,lightning_spear:18,ice_lance:14,earth_spike:14,healing:18,arcane_barrier:16,black_flame:28,acid_rain:22,spatial_motion:25,physical_enhancement:12,aura_slash:18,aura_shield:14,battlewill:10,aura_sword:16,heavy_slash:20,instant_move:15};return map[id]||16;}
function getTarget(p,range=18,includePlayers=false){
 // Never allow the acting player to become their own target. The old nearby-entity
 // fallback did exactly that when includePlayers=true because the player is at distance 0.
 const allowed=e=>e&&e.isValid&&e.id!==p.id&&(includePlayers||e.typeId!=="minecraft:player")&&e.typeId!=="minecraft:item"&&e.typeId!=="minecraft:xp_orb";
 try{const hits=p.getEntitiesFromViewDirection({maxDistance:range});for(const h of hits){const e=h.entity;if(allowed(e))return e;}}catch{}
 try{
  const rot=p.getRotation(),yaw=rot.y*Math.PI/180,pitch=rot.x*Math.PI/180;
  const dir={x:-Math.sin(yaw)*Math.cos(pitch),y:-Math.sin(pitch),z:Math.cos(yaw)*Math.cos(pitch)};
  return p.dimension.getEntities({location:p.location,maxDistance:range}).filter(allowed).map(e=>{
   const dx=e.location.x-p.location.x,dy=(e.location.y+0.5)-p.location.y,dz=e.location.z-p.location.z;
   const d=Math.sqrt(dx*dx+dy*dy+dz*dz)||1,dot=(dx*dir.x+dy*dir.y+dz*dir.z)/d;
   return {e,d,dot};
  }).filter(x=>x.dot>0.72).sort((a,b)=>a.d-b.d)[0]?.e;
 }catch{return undefined;}
}
function dist(a,b){const x=a.x-b.x,y=a.y-b.y,z=a.z-b.z;return Math.sqrt(x*x+y*y+z*z);}
function hurt(p,t,amount){if(!t?.isValid)return;const active=get(p,"ts26_active_cast","");const rank=active?Math.floor(masteryLevel(p,active)/10):0;const scaled=Math.round(amount*(1+Math.min(20,rank)*0.025));try{t.applyDamage(scaled,{cause:EntityDamageCause.magic,damagingEntity:p});}catch{try{t.applyDamage(scaled);}catch{}}}
function effect(e,id,dur,amp=0){try{e.addEffect(id,dur,{amplifier:amp,showParticles:true});}catch{}}
function nearHostiles(p,r=8){try{return p.dimension.getEntities({location:p.location,maxDistance:r}).filter(e=>e.isValid&&e.typeId!=="minecraft:player"&&e.typeId!=="minecraft:item"&&e.typeId!=="minecraft:xp_orb");}catch{return [];}}
function heal(p,amp=1){effect(p,"instant_health",1,amp);}
function forwardTeleport(p,distBlocks=5){try{const rot=p.getRotation(),yaw=rot.y*Math.PI/180;const dx=-Math.sin(yaw)*distBlocks,dz=Math.cos(yaw)*distBlocks;p.teleport({x:p.location.x+dx,y:p.location.y,z:p.location.z+dz},{dimension:p.dimension,keepVelocity:false});}catch{}}

function scanTargetSkill(p,target,baseChance=0.9){
 if(!target?.isValid)return false;
 const seen=list(p,"ts26_scanned_mob_ids");
 if(seen.includes(target.id)){say(p,"This creature has already yielded its one skill to you. You may continue scanning until the scan succeeds before it is recorded.");return false;}
 const type=target.typeId.split(":").pop();
 const pools={slime:["fluid_control","ultraspeed_regeneration","water_blade"],orc:["steel_strength","survivor","body_armor"],ogre:["steel_strength","body_armor","agility"],goblin:["agility","observer","survivor"],direwolf:["danger_sense","agility","shadow_motion"],armorsaurus:["body_armor","dragon_skin","steel_strength"],lizardman:["water_blade","water_breathing","physical_resistance"],megalodon:["water_domination","water_breathing","water_attack_resistance"]};
 const pool=(pools[type]||DROP_SKILLS).filter(x=>SKILL_BY_ID.has(x)&&!hasSkill(p,x)&&!list(p,"ts26_retired_skills").includes(x));
 if(!pool.length){say(p,"No unlearned skill remains in this creature's skill pool.");return false;}
 if(Math.random()>baseChance){say(p,"The scan failed to extract a skill. You can scan this same creature again.");return false;}
 const skill=pool[Math.floor(Math.random()*pool.length)];
 if(!addSkill(p,skill))return false;
 seen.push(target.id);saveList(p,"ts26_scanned_mob_ids",seen.slice(-256));
 say(p,`§dSuccessful analysis: ${skillName(skill)} acquired from ${type}. This creature cannot grant you another skill.`);return true;
}

const SPIRITUAL_SKILL_IDS=new Set(["spirit_burst","spirit_blast","spiritual_burst","summon_greater_elemental","summon_medium_elemental","elemental_domination","spirit_fusion"]);
function castSkill(p,id){
 if(!p?.isValid||!hasSkill(p,id)){say(p,"You have not learned that skill yet.");return;}
 const cost=skillCost(id),resource=isMagicSkill(id)?"MP":SPIRITUAL_SKILL_IDS.has(id)?"SP":"AP",resourceKey=resource==="MP"?DP.mp:resource==="SP"?DP.sp:DP.ap,current=n(p,resourceKey);
 if(current<cost){say(p,`Not enough ${resource}. Need ${cost}, have ${current}.`);return;}
 let cds={};try{cds=JSON.parse(get(p,DP.cooldowns,"{}"));}catch{}
 const now=system.currentTick||0,cd=cds[id]||0;if(now<cd){say(p,`Skill recovering: ${Math.ceil((cd-now)/20)}s.`);return;}
 set(p,resourceKey,current-cost);const mastered=masteryLevel(p,id);const cooldownTicks=Math.max(20,Math.round(80-mastered*0.6));cds[id]=now+cooldownTicks;set(p,DP.cooldowns,JSON.stringify(cds));
 set(p,"ts26_active_cast",id);recordMastery(p,id);
 const t=getTarget(p,24),near=nearHostiles(p,8),hp=p.getComponent("minecraft:health");
 try{p.dimension.playSound("random.orb",p.location,{volume:0.7,pitch:1.1});}catch{}
 switch(id){
  case "magic_bolt": if(t){hurt(p,t,5);say(p,"Magic Bolt fired.");}else say(p,"No target in range.");break;
  case "fire": case "fireball": if(t){hurt(p,t,id==="fire"?6:12);try{t.setOnFire(5,true);}catch{}say(p,`${skillName(id)} hit ${t.typeId}.`);}else say(p,"No target in range.");break;
  case "water_blade": if(t){hurt(p,t,8);effect(t,"slowness",80,1);say(p,"Water Blade cut through the target.");}else say(p,"No target in range.");break;
  case "wind_blade": if(t){hurt(p,t,7);try{const dx=t.location.x-p.location.x,dz=t.location.z-p.location.z,l=Math.max(1,Math.hypot(dx,dz));t.applyImpulse({x:dx/l*1.3,y:0.35,z:dz/l*1.3});}catch{}say(p,"Wind Blade launched the target backwards.");}else say(p,"No target in range.");break;
  case "black_flame": if(t){hurt(p,t,15);try{t.setOnFire(8,true);}catch{}effect(t,"wither",100,1);say(p,"Black Flame engulfed the target.");}else say(p,"No target in range.");break;
  case "ultraspeed_regeneration": effect(p,"regeneration",240,2);effect(p,"absorption",240,1);say(p,"Ultraspeed Regeneration activated.");break;
  case "universal_perception": effect(p,"night_vision",400,0);near.forEach(e=>effect(e,"glowing",160,0));say(p,`Universal Perception revealed ${near.length} nearby entities.`);break;
  case "spatial_motion": forwardTeleport(p,7);effect(p,"slow_falling",80,0);say(p,"Spatial Motion — space folded around you.");break;
  case "physical_enhancement": case "steel_strength": effect(p,"strength",300,2);effect(p,"resistance",160,0);say(p,`${skillName(id)} reinforced your body with aura. AP consumed.`);break;
  case "aura_shield": effect(p,"resistance",240,2);effect(p,"absorption",160,1);say(p,"Aura Shield condensed your aura into a defensive shell.");break;
  case "aura_slash": case "heavy_slash": if(t){hurt(p,t,id==="heavy_slash"?22:16);say(p,`${skillName(id)} struck with concentrated aura.`);}else say(p,"No target in range.");break;
  case "battlewill": case "aura_sword": effect(p,"strength",260,1);effect(p,"resistance",120,0);say(p,`${skillName(id)} focused your battlewill and aura.`);break;
  case "instant_move": forwardTeleport(p,9);effect(p,"speed",80,1);say(p,"Instant Move propelled you forward with aura.");break;
  case "earthshatter_kick": if(t){hurt(p,t,22);try{t.applyImpulse({x:0,y:0.9,z:0});}catch{}say(p,"Earthshatter Kick ruptured the ground beneath your target.");}else say(p,"No target in range.");break;
  case "ogre_sword_guillotine": case "ogre_sword_cannon": if(t){hurt(p,t,id==="ogre_sword_cannon"?30:26);effect(t,"weakness",100,1);say(p,`${skillName(id)} released a devastating ogre sword strike.`);}else say(p,"No target in range.");break;
  case "roaring_lion_punch": if(t){hurt(p,t,24);try{const dx=t.location.x-p.location.x,dz=t.location.z-p.location.z,l=Math.max(1,Math.hypot(dx,dz));t.applyImpulse({x:dx/l*1.8,y:0.5,z:dz/l*1.8});}catch{}say(p,"Roaring Lion Punch blasted the target backwards.");}else say(p,"No target in range.");break;
  case "five_petals_thrust": if(t){hurt(p,t,18);effect(t,"slowness",40,0);say(p,"Five Petals Thrust landed five rapid aura strikes.");}else say(p,"No target in range.");break;
  case "eight_petals_flash": if(t){hurt(p,t,28);effect(t,"weakness",80,1);say(p,"Eight Petals Flash unleashed a rapid eight-hit assault.");}else say(p,"No target in range.");break;
  case "dark_eight_palms": if(t){hurt(p,t,25);effect(t,"blindness",80,0);effect(t,"weakness",100,1);say(p,"Dark Eight Palms disrupted the target's body and senses.");}else say(p,"No target in range.");break;
  case "death_march_dance": near.forEach(e=>hurt(p,e,14));effect(p,"speed",160,1);say(p,`Death March Dance struck ${near.length} nearby enemies.`);break;
  case "elephant_stampede": forwardTeleport(p,5);near.filter(e=>dist(e.location,p.location)<5).forEach(e=>{hurt(p,e,20);try{e.applyImpulse({x:0,y:0.8,z:0});}catch{}});say(p,"Elephant Stampede charged through nearby enemies.");break;
  case "magic_bullet": case "maximum_magic_bullet": if(t){hurt(p,t,id==="maximum_magic_bullet"?36:20);effect(t,"weakness",60,0);say(p,`${skillName(id)} fired a concentrated aura projectile.`);}else say(p,"No target in range.");break;
  case "ogre_flame": if(t){hurt(p,t,18);try{t.setOnFire(8,true);}catch{}say(p,"Ogre Flame engulfed the target.");}else effect(p,"fire_resistance",180,0);break;
  case "diamond_path": effect(p,"resistance",260,1);effect(p,"strength",180,1);effect(p,"speed",120,0);say(p,"Diamond Path hardened your aura and sharpened your movement.");break;
  case "formhide": effect(p,"resistance",320,2);effect(p,"absorption",180,1);say(p,"Formhide condensed aura around your body as armor.");break;
  case "haze": effect(p,"invisibility",180,0);effect(p,"speed",180,1);effect(p,"slow_falling",180,0);say(p,"Haze concealed your body in a shifting aura veil.");break;
  case "violent_break": if(t){hurt(p,t,32);effect(t,"slowness",60,1);say(p,"Violent Break shattered the target's guard.");}else say(p,"No target in range.");break;
  case "body_armor": effect(p,"resistance",240,1);say(p,"Body Armor formed around you.");break;
  case "thought_acceleration": effect(p,"haste",240,2);effect(p,"speed",240,0);say(p,"Thought Acceleration heightened your reactions.");break;
  case "multilayer_barrier": effect(p,"resistance",300,2);effect(p,"absorption",300,2);say(p,"Multilayer Barrier deployed.");break;
  case "shadow_motion": effect(p,"invisibility",180,0);effect(p,"speed",180,2);say(p,"You melted into the shadows.");break;
  case "absolute_severance": if(t){hurt(p,t,22);say(p,"Absolute Severance struck with a cutting wave.");}else say(p,"No target in range.");break;
  case "acid_rain": near.forEach(e=>{hurt(p,e,3);effect(e,"poison",120,1);});say(p,`Acid Rain corroded ${near.length} nearby enemies.`);break;
  case "agility": effect(p,"speed",300,2);effect(p,"jump_boost",200,1);say(p,"Agility enhanced your movement.");break;
  case "air_flight": effect(p,"slow_falling",220,0);effect(p,"jump_boost",220,2);effect(p,"speed",220,1);say(p,"Air Flight lifted your body.");break;
  case "lightning_spear": if(t){hurt(p,t,16);effect(t,"weakness",100,1);say(p,"Lightning Spear pierced the target.");}else say(p,"No target in range.");break;
  case "ice_lance": if(t){hurt(p,t,10);effect(t,"slowness",160,3);say(p,"Ice Lance froze the target's movement.");}else say(p,"No target in range.");break;
  case "earth_spike": if(t){hurt(p,t,12);effect(t,"levitation",25,0);say(p,"Earth Spike launched the target upwards.");}else say(p,"No target in range.");break;
  case "healing": heal(p,2);p.removeEffect("poison");p.removeEffect("wither");say(p,"Healing restored your vitality.");break;
  case "arcane_barrier": effect(p,"resistance",220,1);effect(p,"absorption",120,0);say(p,"Arcane Barrier activated.");break;
  case "predator": if(t){hurt(p,t,10);set(p,DP.ep,n(p,DP.ep)+15);set(p,DP.mp,Math.min(n(p,DP.maxMp),n(p,DP.mp)+10));scanTargetSkill(p,t,0.90);}else say(p,"Predator found no target to consume.");break;
  case "great_sage": if(t){const h=t.getComponent("minecraft:health");say(p,`ANALYTICAL APPRAISAL\nTarget: ${t.nameTag||t.typeId}\nHP: ${h?Math.ceil(h.currentValue)+" / "+Math.ceil(h.effectiveMax):"unknown"}\nDistance: ${dist(p.location,t.location).toFixed(1)} blocks.`);}else say(p,"Great Sage: no target to appraise.");effect(p,"haste",100,1);break;
  case "gourmet": case "gourmand": case "engorger": if(t){hurt(p,t,10);scanTargetSkill(p,t,0.90);}else say(p,"No target in range.");break;
  case "gluttony": if(t){hurt(p,t,16);set(p,DP.mp,Math.min(n(p,DP.maxMp),n(p,DP.mp)+35));set(p,DP.ep,n(p,DP.ep)+40);scanTargetSkill(p,t,0.95);}else say(p,"No target in range.");break;
  case "degenerate": p.removeEffect("slowness");p.removeEffect("weakness");p.removeEffect("poison");effect(p,"resistance",200,1);effect(p,"strength",120,0);say(p,"Degenerate separated harmful effects and recombined your combat properties.");break;
  case "chosen_one": effect(p,"strength",300,1);effect(p,"resistance",300,1);effect(p,"speed",300,1);say(p,"Chosen One awakened your battle instincts.");break;
  case "survivor": effect(p,"regeneration",260,2);effect(p,"resistance",180,1);say(p,"Survivor adapted to danger.");break;
  case "starved": if(t){hurt(p,t,8);set(p,DP.mp,Math.min(n(p,DP.maxMp),n(p,DP.mp)+50));set(p,DP.jewels,n(p,DP.jewels)+25);say(p,"Starved converted stolen energy into magic jewels.");}else say(p,"Starved needs a target.");break;
  case "berserker": effect(p,"strength",240,2);effect(p,"speed",240,1);effect(p,"weakness",240,0);say(p,"Berserker entered a high-risk battle state.");break;
  case "greed": if(t){hurt(p,t,8);set(p,DP.jewels,n(p,DP.jewels)+40);say(p,"Greed extracted 40 magic jewels.");}else say(p,"Greed found no target.");break;
  case "guardian": near.forEach(e=>{if(e.typeId==="minecraft:player")effect(e,"resistance",200,1);});effect(p,"resistance",200,1);say(p,"Guardian protected nearby allies.");break;
  case "healer": heal(p,2);near.filter(e=>e.typeId==="minecraft:player").forEach(e=>effect(e,"regeneration",180,1));say(p,"Healer spread restorative energy.");break;
  case "seeker": if(t){effect(t,"glowing",260,0);say(p,`Seeker marked ${t.nameTag||t.typeId}.`);}else say(p,"No target to mark.");break;
  case "shadow_striker": effect(p,"invisibility",120,0);effect(p,"strength",120,2);say(p,"Shadow Striker concealed you and empowered your next assault.");break;
  case "investigator": if(t){const h=t.getComponent("minecraft:health");say(p,`Investigator report: ${t.typeId}, HP ${h?Math.ceil(h.currentValue):"?"}, distance ${dist(p.location,t.location).toFixed(1)}.`);}else say(p,"No target to investigate.");effect(p,"night_vision",160,0);break;
  case "usurper": if(t){effect(t,"weakness",160,1);effect(t,"slowness",100,0);effect(p,"strength",180,1);say(p,"Usurper suppressed the target and appropriated its momentum.");}else say(p,"No target to usurp.");break;
  case "wrath": effect(p,"strength",240,2);effect(p,"fire_resistance",240,0);say(p,"Wrath converted battle pressure into power.");break;
  case "reflector": effect(p,"resistance",220,2);set(p,DP.reflector,system.currentTick+220);say(p,"Reflector is active. Incoming damage will be returned.");break;
  case "creator": if(n(p,DP.jewels)>=100){set(p,DP.jewels,n(p,DP.jewels)-100);give(p,"tensura:magicule_crystal",1);say(p,"Creator shaped 100 jewels into a Magicule Crystal.");}else say(p,"Creator requires 100 magic jewels.");break;
  case "commander": near.filter(e=>e.typeId==="minecraft:player").forEach(e=>effect(e,"strength",180,0));effect(p,"strength",180,0);say(p,"Commander rallied nearby allies.");break;
  case "falsifier": if(t){effect(t,"blindness",100,0);effect(p,"invisibility",120,0);say(p,"Falsifier distorted the target's perception.");}else say(p,"No target to deceive.");break;
  case "traveler": forwardTeleport(p,10);effect(p,"slow_falling",80,0);say(p,"Traveler crossed space in a single step.");break;
  case "envy": if(t){effect(p,"strength",160,0);effect(p,"resistance",160,0);effect(t,"weakness",100,0);say(p,"Envy mirrored the target's combat advantage.");}else say(p,"No target to mirror.");break;
  case "pride": effect(p,"strength",260,1);effect(p,"resistance",260,1);say(p,"Pride asserted your authority.");break;
  case "sloth": near.forEach(e=>{effect(e,"slowness",180,2);effect(e,"weakness",120,0);});say(p,"Sloth suppressed the movement of nearby enemies.");break;
  case "lust": if(t){effect(t,"weakness",160,1);effect(p,"absorption",160,1);say(p,"Lust drained the target's vitality into a shield.");}else say(p,"No target in range.");break;
  case "reaper": if(t){const th=t.getComponent("minecraft:health"),low=th&&th.currentValue<th.effectiveMax*0.5;hurt(p,t,low?28:10);say(p,low?"Reaper executed a weakened target.":"Reaper marked the target for execution.");}else say(p,"No target in range.");break;
  case "sniper": if(t){hurt(p,t,18);effect(t,"slowness",60,0);say(p,"Sniper delivered a focused long-range strike.");}else say(p,"No target in range.");break;
  case "martial_master": effect(p,"strength",180,1);effect(p,"speed",180,1);if(t)hurt(p,t,9);say(p,"Martial Master entered a precise combat stance.");break;
  case "merciless": if(t){const th=t.getComponent("minecraft:health"),low=th&&th.currentValue<th.effectiveMax*0.5;hurt(p,t,low?32:7);say(p,"Merciless punished the vulnerable target.");}else say(p,"No target in range.");break;
  case "observer": say(p,"Nearby entities: "+near.slice(0,8).map(e=>e.nameTag||e.typeId).join(", "));break;
  case "suppressor": near.forEach(e=>{effect(e,"weakness",160,1);effect(e,"slowness",160,1);});say(p,"Suppressor disrupted nearby enemies.");break;
  case "unyielding": effect(p,"resistance",300,2);effect(p,"absorption",300,1);say(p,"Unyielding fortified your resolve.");break;
  case "raphael": effect(p,"haste",240,3);effect(p,"night_vision",240,0);effect(p,"resistance",120,0);if(t){const h=t.getComponent("minecraft:health");say(p,`Raphael analysis: ${t.typeId}, HP ${h?Math.ceil(h.currentValue):"?"}.`);}else say(p,"Raphael — Lord of Wisdom activated parallel processing.");break;
  case "uriel": effect(p,"resistance",320,3);effect(p,"absorption",320,2);forwardTeleport(p,3);say(p,"Uriel — Lord of Vows established a multilayer spatial barrier.");break;
  case "beelzebuth": if(t){hurt(p,t,24);set(p,DP.mp,Math.min(n(p,DP.maxMp),n(p,DP.mp)+60));set(p,DP.ep,n(p,DP.ep)+100);scanTargetSkill(p,t,0.98);}effect(p,"regeneration",120,1);break;
  case "michael": effect(p,"strength",320,2);effect(p,"resistance",320,2);near.forEach(e=>effect(e,"slowness",80,1));say(p,"Michael — Lord of Justice imposed absolute command.");break;
  case "azathoth": near.forEach(e=>hurt(p,e,28));effect(p,"resistance",180,2);say(p,"Azathoth — Lord of Void released a destructive aura.");break;
  case "shub_niggurath": {const unlearned=DROP_SKILLS.filter(s=>SKILL_BY_ID.has(s)&&!hasSkill(p,s));if(unlearned.length){const sid=unlearned[Math.floor(Math.random()*unlearned.length)];give(p,`tensura:skill_book_${sid}`);say(p,`Shub-Niggurath created a Skill Tome: ${skillName(sid)}.`);}else say(p,"All catalogued skills are already learned.");break;}
  case "nyarlathotep": near.forEach(e=>{effect(e,"blindness",100,0);effect(e,"slowness",100,1);});effect(p,"invisibility",160,0);say(p,"Nyarlathotep cloaked the field in illusion.");break;
  case "fire": if(t){hurt(p,t,9);try{t.setOnFire(6,true);}catch{}say(p,"Fire manipulation scorched the target.");}else effect(p,"fire_resistance",160,0);break;
  case "telepathy": {const nearby=world.getPlayers().filter(x=>x.id!==p.id&&x.dimension.id===p.dimension.id&&dist(x.location,p.location)<24);nearby.forEach(x=>x.sendMessage(`§d[Telepathy] ${p.name}:§r A mental message reaches you.`));say(p,`Telepathy reached ${nearby.length} nearby minds.`);break;}
  case "abnormal_condition_nullification": ["poison","wither","slowness","weakness","blindness","nausea","hunger","mining_fatigue"].forEach(x=>p.removeEffect(x));effect(p,"resistance",120,0);say(p,"Abnormal Condition Nullification purged harmful conditions.");break;
  case "abnormal_condition_resistance": effect(p,"resistance",260,1);effect(p,"fire_resistance",260,0);effect(p,"water_breathing",260,0);say(p,"Abnormal Condition Resistance fortified your body against hostile effects.");break;
  case "absorb_and_dissolve": if(t){hurt(p,t,7);set(p,DP.mp,Math.min(n(p,DP.maxMp),n(p,DP.mp)+20));set(p,DP.jewels,n(p,DP.jewels)+15);say(p,"Absorb and Dissolve converted the target's matter into magicules.");}else say(p,"No target to absorb.");break;
  case "acid_shell": effect(p,"resistance",220,1);near.forEach(e=>{if(dist(e.location,p.location)<3)effect(e,"poison",100,0);});say(p,"Acid Shell coated your body and corroded close attackers.");break;
  case "aerial_blade": if(t){hurt(p,t,11);try{t.applyImpulse({x:0,y:0.8,z:0});}catch{}say(p,"Aerial Blade carved upward through the target.");}else effect(p,"slow_falling",120,0);break;
  case "airflow_shut": if(t){effect(t,"slowness",180,3);effect(t,"weakness",180,1);hurt(p,t,4);say(p,"Airflow Shut deprived the target of movement.");}else say(p,"No target in range.");break;
  case "all_seeing_eye": effect(p,"night_vision",360,0);near.forEach(e=>effect(e,"glowing",300,0));say(p,"All-Seeing Eye revealed every nearby presence.");break;
  case "analyst": if(t){const h=t.getComponent("minecraft:health");say(p,`Analyst: ${t.nameTag||t.typeId} • HP ${h?Math.ceil(h.currentValue)+"/"+Math.ceil(h.effectiveMax):"?"} • ${dist(p.location,t.location).toFixed(1)}m`);}effect(p,"haste",120,1);break;
  case "analytical_appraisal": if(t){const h=t.getComponent("minecraft:health");say(p,`Analytical Appraisal
Species: ${t.typeId}
Vitality: ${h?Math.ceil(h.currentValue)+" / "+Math.ceil(h.effectiveMax):"unknown"}
Threat: ${h&&h.effectiveMax>100?"High":"Standard"}`);}else say(p,"Analytical Appraisal requires a target in view.");break;
  case "analyze": if(t){const h=t.getComponent("minecraft:health");say(p,`Analyze: ${t.typeId} • ${h?Math.ceil(h.currentValue)+" HP":"no health data"}`);effect(t,"glowing",100,0);}else say(p,"No target to analyze.");break;
  case "anti_magic_area": near.forEach(e=>{effect(e,"weakness",160,1);effect(e,"slowness",100,0);});effect(p,"resistance",160,0);say(p,"Anti-Magic Area suppressed hostile magic users.");break;
  case "anti_shock_area": near.forEach(e=>{if(e.typeId==="minecraft:player")effect(e,"resistance",180,1);else try{e.applyImpulse({x:0,y:0.45,z:0});}catch{}});say(p,"Anti-Shock Area dampened incoming force and protected allies.");break;
  case "anti_skill": if(t){["strength","speed","resistance","regeneration","absorption","invisibility"].forEach(x=>t.removeEffect(x));effect(t,"weakness",180,1);effect(t,"slowness",100,0);say(p,"Anti-Skill stripped the target's active enhancements.");}else say(p,"No target to suppress.");break;
  case "antidote": ["poison","wither","nausea","hunger","blindness"].forEach(x=>p.removeEffect(x));heal(p,0);say(p,"Antidote neutralized toxins and restored vitality.");break;
  case "aura_shield": effect(p,"resistance",240,2);effect(p,"absorption",240,2);set(p,DP.reflector,system.currentTick+240);say(p,"Aura Shield raised a reflective magicule shell.");break;
  case "aura_slash": if(t){hurt(p,t,14);effect(t,"weakness",100,1);say(p,"Aura Slash released a compressed wave of aura.");}else say(p,"No target in range.");break;
  case "wind_cutter": if(t){hurt(p,t,10);try{t.applyImpulse({x:0,y:0.25,z:1.2});}catch{}say(p,"Wind Cutter launched a razor-thin gust.");}else say(p,"No target in range.");break;
  case "royal_beast": effect(p,"strength",300,2);effect(p,"speed",300,1);effect(p,"resistance",180,1);near.forEach(e=>effect(e,"weakness",100,0));say(p,"Royal Beast released an overwhelming dominance aura.");break;
  case "taming": if(t){const h=t.getComponent("minecraft:health");if(h&&h.currentValue<=h.effectiveMax*0.35){try{t.addTag("tensura_tamed");t.addTag("tensura_companion");t.addTag(`tensura_owner_${p.id.replace(/[^a-zA-Z0-9_]/g,"_")}`);t.nameTag=`${t.typeId.replace("tensura:","").replaceAll("_"," ")} • Tamed`; }catch{}effect(t,"slowness",60,5);say(p,"Taming successful. The creature is now bound to you and will follow you and defend you.");}else say(p,"Weaken the creature below 35% health before attempting to tame it.");}else say(p,"Look at a creature to tame it.");break;
  default: genericSkillEffect(p,id,t,near);
 }
 set(p,"ts26_active_cast","");
}
function genericSkillEffect(p,id,t,near){
 const name=skillName(id).toLowerCase();
 if(/heal|regeneration|recovery|antidote/.test(name)){heal(p,1);effect(p,"regeneration",120,1);}
 else if(/barrier|armor|shield|protection|resistance|nullification/.test(name)){effect(p,"resistance",180,1);effect(p,"absorption",100,0);}
 else if(/speed|agility|flight|motion|travel|teleport/.test(name)){effect(p,"speed",180,1);effect(p,"jump_boost",120,1);}
 else if(/fire|flame|burn|explosion|lightning|ice|water|wind|earth|acid|poison|gravity|sever|slash|blade|spear|attack/.test(name)){if(t){hurt(p,t,8);if(/fire|flame|burn/.test(name))try{t.setOnFire(4,true);}catch{}if(/ice|water|wind/.test(name))effect(t,"slowness",80,0);if(/poison|acid/.test(name))effect(t,"poison",100,0);}}
 else if(/analysis|appraisal|perception|sense|eye|observer/.test(name)){if(t){const h=t.getComponent("minecraft:health");say(p,`${skillName(id)}: ${t.typeId} • HP ${h?Math.ceil(h.currentValue):"?"}`);}effect(p,"night_vision",160,0);}
 else if(t){hurt(p,t,6);effect(t,"weakness",80,0);}else effect(p,"strength",120,0);
}

function openSkillNode(p,id){
 const node=TREE.find(x=>x.id===id);if(!node)return;
 const form=new CustomForm(p,"TENSURA • SKILL NODE");
 form.header(`${skillName(id).toUpperCase()}  •  ${treeBranch(id)}`);
 const owned=hasSkill(p,id),retired=list(p,"ts26_retired_skills").includes(id),mastery=masteryLevel(p,id),req=node.req.length?node.req.map(skillName).join(" + "):"No prerequisites";
 const desc=SKILL_BY_ID.get(id)?.description||"A learnable Tensura ability.";
 form.label(`${desc}\n\nSTATUS: ${owned?"UNLOCKED":retired?"EVOLVED / RETIRED":"LOCKED"}\nMASTERY: ${mastery} uses\nCOST: ${node.cost} Skill Points  •  ${node.ep} EP\nREQUIRES: ${req}`);
 if(owned&&get(p,DP.equipped,"")===id)form.button("UNEQUIP THIS SKILL",()=>{try{form.close();}catch{}set(p,DP.equipped,"");say(p,`${skillName(id)} unequipped. Select another learned skill to equip it.`);});
 else if(owned)form.button("EQUIP THIS SKILL",()=>{try{form.close();}catch{}set(p,DP.equipped,id);say(p,`${skillName(id)} equipped. Use Skill Horn normally to activate it.`);},skillIcon(id));
 else if(retired)form.label("This evolution stage has been permanently replaced. It cannot be learned or equipped again.");else form.button("UNLOCK SKILL",()=>{try{form.close();}catch{}if(!node.req.every(x=>hasSkill(p,x))){say(p,`Locked: unlock ${req} first.`);return;}if(n(p,DP.skillPoints)<node.cost||n(p,DP.ep)<node.ep){say(p,`Insufficient requirements: ${node.cost} Skill Points and ${node.ep} EP needed.`);return;}set(p,DP.skillPoints,n(p,DP.skillPoints)-node.cost);if(id==="raphael"&&hasSkill(p,"great_sage"))evolveSkill(p,"great_sage","raphael");else if(id==="beelzebuth"&&hasSkill(p,"gluttony"))evolveSkill(p,"gluttony","beelzebuth");else if(id==="ciel"&&hasSkill(p,"raphael"))evolveSkill(p,"raphael","ciel");else addSkill(p,id);say(p,`§a${skillName(id)} unlocked!§r Open the node again to equip it.`);openSkillTree(p);});
 form.button("BACK TO SKILL TREE",()=>{try{form.close();}catch{}openSkillTree(p);});form.closeButton();form.show().catch(()=>{});
}
function openSkillTree(p){if(!initPlayer(p)){showRaceSelection(p);return;}const form=new CustomForm(p,"TENSURA • SKILL TREE");try{form.image("textures/gui/background/tr_menu.png","tensura");}catch{}const groups=[["ROOT • CORE",TREE.filter(x=>x.tier===0)],["ELEMENTAL ARTS",TREE.filter(x=>treeBranch(x.id)==="ELEMENTAL ARTS")],["SUPPORT & DEFENCE",TREE.filter(x=>treeBranch(x.id)==="SUPPORT & DEFENCE")],["COMBAT & BODY",TREE.filter(x=>treeBranch(x.id)==="COMBAT & BODY")],["UNIQUE & ANALYSIS",TREE.filter(x=>treeBranch(x.id)==="UNIQUE & ANALYSIS")],["ULTIMATE SKILLS",TREE.filter(x=>treeBranch(x.id)==="ULTIMATE SKILLS")],["GENERAL / SPECIAL",TREE.filter(x=>x.tier!==0&&treeBranch(x.id)==="GENERAL / SPECIAL")]];const flat=[];for(const [title,nodes] of groups)for(const node of nodes)if(!PASSIVE_SKILLS.has(node.id)&&!isMagicSkill(node.id)&&!list(p,"ts26_retired_skills").includes(node.id))flat.push({title,node});const size=20,total=Math.ceil(flat.length/size),page=Math.max(0,Math.min(total-1,n(p,"ts26_skill_page",0))),slice=flat.slice(page*size,(page+1)*size);form.header(`✦ SKILL TREE • ${page+1}/${Math.max(1,total)} ✦`);form.label(`Skill Points: ${n(p,DP.skillPoints)} • EP: ${n(p,DP.ep)} • Equipped: ${get(p,DP.equipped,"")?skillName(get(p,DP.equipped,"")):"None"}
${flat.length} active skills • Passives are managed separately • Magic arts are equipped through the Magic Horn.`);let last="";for(const entry of slice){if(entry.title!==last){last=entry.title;form.divider();form.header(last);}const node=entry.node,owned=hasSkill(p,node.id),mark=owned?"§a◆ LEARNED":"§8◇ LOCKED",master=masteryLevel(p,node.id);form.button(`${mark} ${skillName(node.id)} • ${node.cost} SP / ${node.ep} EP • M${master}`,()=>{set(p,"ts26_skill_page",page);try{form.close();}catch{}openSkillNode(p,node.id);},skillIcon(node.id));}if(page>0)form.button("← PREVIOUS SKILLS",()=>{set(p,"ts26_skill_page",page-1);try{form.close();}catch{}openSkillTree(p);});if(page+1<total)form.button("NEXT SKILLS →",()=>{set(p,"ts26_skill_page",page+1);try{form.close();}catch{}openSkillTree(p);});form.closeButton();form.show().catch(()=>{});}

function hornKey(p){return `ts26_horn_${p.selectedSlotIndex}`;}
function skillHornUse(p){
 if(!initPlayer(p)){showRaceSelection(p);return;}
 const key=hornKey(p);
 if(p.isSneaking){assignSkillToHeldHorn(p);return;}
 const assigned=get(p,key,get(p,DP.equipped,""));
 if(!assigned||isMagicSkill(assigned)){say(p,"No non-magical skill is assigned to this Skill Horn. Choose a skill or Battlewill technique first.");assignSkillToHeldHorn(p);return;}
 castSkill(p,assigned);
}
function passiveMenu(p){say(p,"Passive skills follow the original skill ownership/activation rules; the custom three-slot loadout has been removed.");}


function assignSkillToHeldHorn(p){
 const form=new CustomForm(p,"TENSURA • SKILL HORN CONFIGURATION");
 const key=hornKey(p),raw=get(p,key,get(p,DP.equipped,"")),current=isMagicSkill(raw)?"":raw;
 form.header(`HORN IN HOTBAR SLOT ${p.selectedSlotIndex+1}`);
 form.label(`This Skill Horn will activate its own assigned skill. Current: ${current?skillName(current):"None"}. Sneak-use a different horn to configure that horn independently.`);
 for(const id of list(p,DP.skills).filter(x=>!PASSIVE_SKILLS.has(x)&&!isMagicSkill(x)&&!list(p,"ts26_retired_skills").includes(x)))form.button(`${id===current?"§a◆":"§f◇"} ${skillName(id)} • M${masteryLevel(p,id)}`,()=>{try{form.close();}catch{}set(p,key,id);say(p,`This Skill Horn is now assigned to ${skillName(id)}.`);},skillIcon(id));
 form.closeButton();form.show().catch(()=>{});
}
function openSpiritPrayer(p){
 const form=new CustomForm(p,"TENSURA • SPIRIT PRAYER");
 try{form.image("textures/gui/magic/summoning_magic_button.png","tensura");}catch{}
 form.header("CALL A GREAT ELEMENTAL SPIRIT");
 form.label("Prayer seal odds: 5% Greater Spirit • 30% Medium Spirit • 60% Lesser Spirit • 5% no response. Spirits are attuned to Light, Darkness, Fire, Spatial, Wind, Earth, Water or Gravity.");
 form.button("OFFER PRAYER SEAL",()=>{try{form.close();}catch{}if(!consumeHeld(p,"tensura:spirit_prayer")){say(p,"Hold the Spirit Prayer Seal in your hand to pray.");return;}const roll=Math.random(),affinity=["elf","spirit"].includes(get(p,DP.baseRace,get(p,DP.race,"")));if(roll<(affinity?0.025:0.05)){say(p,"The prayer received no answer. The seal is spent.");return;}const rank=roll>(affinity?0.97:0.99)?"Great":roll<(affinity?0.15:0.10)?"Greater":roll<(affinity?0.50:0.40)?"Medium":"Lesser";const elements=["Light","Darkness","Fire","Spatial","Wind","Earth","Water","Gravity"];const element=elements[Math.floor(Math.random()*elements.length)];const a=list(p,DP.spiritRanks);a.push(`${rank}:${element}`);saveList(p,DP.spiritRanks,a);give(p,`tensura:${rank.toLowerCase()}_spirit_${element.toLowerCase()}`);say(p,`A ${rank} ${element} Spirit answered your prayer. Spirit contracts: ${a.length}.`);});
 form.closeButton();form.show().catch(()=>{});
}
function evolveRace(p,next,bonus=[]){
 const old=get(p,DP.race,"human");set(p,DP.race,next);set(p,DP.hp,Math.max(20,Math.ceil(n(p,DP.hp,20)*1.25)));set(p,DP.ep,n(p,DP.ep)+Math.max(500,Math.floor(n(p,DP.ep)*0.15)));
 set(p,DP.maxMp,n(p,DP.maxMp)+80);set(p,DP.mp,n(p,DP.maxMp));set(p,DP.maxAp,n(p,DP.maxAp)+30);set(p,DP.ap,n(p,DP.maxAp));set(p,DP.maxSp,n(p,DP.maxSp)+20);set(p,DP.sp,n(p,DP.maxSp));
 for(const id of bonus)addSkill(p,id);applyRaceBody(p);try{const h=p.getComponent("minecraft:health");if(h)h.setCurrentValue(h.effectiveMax);}catch{}effect(p,"regeneration",600,1);say(p,`§dRACIAL EVOLUTION!§r ${old.replaceAll("_"," ")} → ${next.replaceAll("_"," ")}. Your origin lineage is preserved.`);try{p.dimension.playSound("random.levelup",p.location);}catch{}
}
function evolutionMenu(p){
 const form=new CustomForm(p,"TENSURA • EVOLUTION");try{form.image("textures/gui/main/tdl_awakening.png","tensura");}catch{}
 const race=get(p,DP.race,"Unknown"),base=get(p,DP.baseRace,race),level=n(p,DP.level),ep=n(p,DP.ep),souls=n(p,DP.souls);
 form.header("EVOLUTION & AWAKENING");form.label(`Current form: ${race}\nOrigin lineage: ${base}\nLevel ${level} • EP ${ep.toLocaleString()} • Souls ${souls.toLocaleString()}\nDemon Lord Seed: ${get(p,"ts26_seed_awarded",false)?"Acquired":"Not yet acquired"}`);
 const paths={goblin:["hobgoblin",5,1000,["agility"]],ogre:["kijin",12,8000,["steel_strength","body_armor"]],orc:["high_orc",10,6000,["berserker"]],lizardman:["dragonewt",12,9000,["water_blade"]],dwarf:["high_dwarf",12,7000,["absorb_and_dissolve"]],elf:["high_elf",15,10000,["universal_perception"]],demon:["arch_demon",20,20000,["shadow_motion"]],spirit:["elemental_lord",20,20000,["healing","universal_perception"]],beastman:["high_beastman",12,8000,["agility"]],vampire:["noble_vampire",18,15000,["ultraspeed_regeneration"]],slime:["demon_slime",30,100000,["gluttony"]],high_orc:["orc_king",25,50000,["starved"]],kijin:["oni",25,50000,["chosen_one"]]};
 const path=paths[race];if(path){const [next,lv,need,skills]=path;form.button(`EVOLVE → ${next.toUpperCase()}  •  Lv ${lv} / ${need.toLocaleString()} EP`,()=>{try{form.close();}catch{}if(level<lv||ep<need){say(p,`Evolution requires level ${lv} and ${need.toLocaleString()} EP.`);return;}evolveRace(p,next,skills);});}
 if((base==="demon"||["orc","ogre","slime","vampire","beastman"].includes(base))&&ep>=200000&&!get(p,"ts26_seed_awarded",false))form.button("CLAIM DEMON LORD SEED",()=>{try{form.close();}catch{}set(p,"ts26_seed_awarded",true);give(p,"tensura:demon_lord_seed");say(p,"§5Demon Lord Seed acquired.§r Gather 10,000 souls and begin the Harvest Festival from the Seed.");});
 form.button("TRUE DEMON LORD • HARVEST FESTIVAL",()=>{try{form.close();}catch{}if(!get(p,"ts26_seed_awarded",false)){say(p,"You need to qualify for and claim a Demon Lord Seed first.");return;}startDemonRitual(p);});
 form.button("TRUE HERO AWAKENING",()=>{try{form.close();}catch{}const spirits=list(p,DP.spiritRanks).filter(x=>/^(Greater|Lord):/.test(x));const unique=new Set(spirits.map(x=>x.split(":")[1]));if(unique.size>=7){set(p,DP.trueHero,true);set(p,DP.maxMp,n(p,DP.maxMp)+300);set(p,DP.mp,n(p,DP.maxMp));set(p,DP.maxAp,n(p,DP.maxAp)+300);set(p,DP.ap,n(p,DP.maxAp));set(p,DP.maxSp,n(p,DP.maxSp)+300);set(p,DP.sp,n(p,DP.maxSp));set(p,DP.ep,n(p,DP.mp)+n(p,DP.ap)+n(p,DP.sp));addSkill(p,"chosen_one");say(p,"§eTRUE HERO AWAKENING!§r Seven Great Spirits recognize your will. Chosen One has been awakened.");}else say(p,`True Hero requirement: seven distinct Greater/Lord spirits. You have ${unique.size}/7.`);});
 form.button("TRUE DRAGON EVOLUTION",()=>{try{form.close();}catch{}if(level<50||ep<1000000){say(p,"True Dragon evolution requires level 50 and 1,000,000 EP. Every starting race can pursue this path.");return;}if(get(p,DP.trueDragon,false)){say(p,"You have already awakened as a True Dragon.");return;}set(p,DP.trueDragon,true);set(p,DP.race,"true_dragon");set(p,DP.hp,Math.max(120,Math.ceil(n(p,DP.hp,20)*1.8)));set(p,DP.maxMp,n(p,DP.maxMp)+1000);set(p,DP.mp,n(p,DP.maxMp));set(p,DP.maxAp,n(p,DP.maxAp)+800);set(p,DP.ap,n(p,DP.maxAp));set(p,DP.maxSp,n(p,DP.maxSp)+800);set(p,DP.sp,n(p,DP.maxSp));set(p,DP.ep,n(p,DP.mp)+n(p,DP.ap)+n(p,DP.sp));applyRaceBody(p);try{const h=p.getComponent("minecraft:health");if(h)h.setCurrentValue(h.effectiveMax);}catch{}addSkill(p,"spatial_motion");say(p,"§5TRUE DRAGON EVOLUTION!§r Your origin lineage remains recorded; your current form is True Dragon.");});
 form.closeButton();form.show().catch(()=>{});
}

function startDemonRitual(p){
 if(n(p,DP.souls)<10000){say(p,`Demon Lord Seed requires 10,000 souls. You have ${n(p,DP.souls)}.`);return;}
 if(get(p,DP.demonRitual,false)){say(p,"Your awakening ritual is already in progress.");return;}
 if(!consumeHeld(p,"tensura:demon_lord_seed")){say(p,"Hold the Demon Lord Seed in your hand.");return;}
 set(p,DP.souls,n(p,DP.souls)-10000);set(p,DP.demonRitual,3600);
 effect(p,"slowness",3600,255);effect(p,"blindness",3600,0);effect(p,"darkness",3600,0);
 say(p,"§5DEMON LORD AWAKENING RITUAL BEGUN.§r You must survive three minutes of paralysis and darkness. Do not leave the world.");
}
function useSkillTome(p,id){
 const sid=id.substring("tensura:skill_book_".length);
 if(!SKILL_BY_ID.has(sid)){say(p,"This tome's skill record is not recognized.");return;}
 if(hasSkill(p,sid)){say(p,`You already know ${skillName(sid)}.`);return;}
 if(!consumeHeld(p,id))return;
 addSkill(p,sid);say(p,`§dSkill learned: ${skillName(sid)}§r. Equip it through the Skill Horn tree or use it from the Magic Horn if it is a magic art.`);
}

function countItem(p,id){const c=inv(p);if(!c)return 0;let total=0;for(let i=0;i<c.size;i++){const it=c.getItem(i);if(it?.typeId===id)total+=it.amount;}return total;}
function takeItems(p,id,amount){const c=inv(p);if(!c||countItem(p,id)<amount)return false;let left=amount;for(let i=0;i<c.size&&left>0;i++){const it=c.getItem(i);if(it?.typeId!==id)continue;const take=Math.min(left,it.amount);left-=take;c.setItem(i,it.amount>take?new ItemStack(id,it.amount-take):undefined);}return left===0;}
function mapDiscovery(p,kind){
 const sp=world.getDefaultSpawnLocation();const targets={hell_gate:{name:"Hell Gate",x:sp.x+120,z:sp.z+120},veldora:{name:"Veldora's Cave",x:1500,z:1500},labyrinth:{name:"Spirit Labyrinth",x:2200,z:2200},tree:{name:"Great World Tree",x:1000,z:1000},demon:{name:"Demon Realm Ruins",x:3000,z:3000},spirit:{name:"Spirit Sanctuary",x:4000,z:4000},charybdis:{name:"Charybdis Cave",x:5000,z:5000},dwarf:{name:"Dwarven Village",x:6000,z:6000}};
 const t=targets[kind];if(!t)return;if(p.dimension.id!=="minecraft:overworld"){say(p,"These exploration maps are charted from the Overworld. Return there to read the map.");return;}
 set(p,"ts26_pending_landmark",kind);set(p,"ts26_active_compass",kind);if(kind==="hell_gate"){try{const hd=world.getDimension("tensura:hell");try{hd.runCommand("tickingarea add circle 0 40 0 4 ts27_0_build true");}catch{}buildCustomRealm(hd,0);}catch{}}give(p,"minecraft:compass");try{p.dimension.playSound("tensura.phase3.cave_rumble",p.location);}catch{}say(p,`§eA ${t.name} compass bearing is now active. Follow the direction beneath your status bars.§r`);const dx=t.x-p.location.x,dz=t.z-p.location.z,dist=Math.round(Math.sqrt(dx*dx+dz*dz));const bearing=((Math.atan2(dx,dz)*180/Math.PI)+360)%360;
 say(p,`§6EXPLORATION MAP: ${t.name}§r\nBearing ${Math.round(bearing)}° • approximately ${dist} blocks away. Travel there on foot. The landmark will form when you reach the site; the map does not teleport you.`);
}

function buildStructureLandmark(p,structure,x,z,label,entranceOffset=0){
 const d=world.getDimension("minecraft:overworld"),key=`ts26_structure_${label.replace(/[^a-z0-9]/gi,"_")}`;if(world.getDynamicProperty(key))return;
 const surface=findSurfaceY(d,x,z),originY=Math.max(-60,surface-entranceOffset);
 if(label==="Dwarven Village"){
  let index=0,attempts=0;const loadNext=()=>{
   if(index>=9){world.setDynamicProperty(key,true);if(p?.isValid)say(p,"Dwarven Village has been assembled from all nine Java-derived sections.");return;}
   const zi=Math.floor(index/3),xi=index%3,sx=x-75+xi*50,sz=z-75+zi*50,area=`ts27_dwarf_${zi}_${xi}`;
   try{try{d.runCommand(`tickingarea add circle ${sx+25} ${originY+20} ${sz+25} 4 ${area} true`);}catch{}const r=d.runCommand(`structure load tensura:dwarf_village/split/part_${zi}_${xi} ${sx} ${originY} ${sz}`);if(r&&typeof r.successCount==="number"&&r.successCount===0)throw new Error(`section ${zi+1}-${xi+1} rejected`);try{d.runCommand(`tickingarea remove ${area}`);}catch{}index++;attempts=0;system.runTimeout(loadNext,8);}catch(e){attempts++;if(attempts<20)system.runTimeout(loadNext,Math.min(100,10+attempts*5));else if(p?.isValid)say(p,`Dwarven Village section ${index+1}/9 failed after 20 retries: ${String(e).slice(0,120)}. Revisit the compass marker to resume.`);}
  };loadNext();return;
 }
 try{d.runCommand(`structure load ${structure} ${x-50} ${originY} ${z-50}`);world.setDynamicProperty(key,true);say(p,`${label} has been assembled from the original Java structure templates.`);}catch(e){say(p,`${label} could not be placed here: ${String(e).slice(0,140)}. Revisit the site to retry.`);}
}

function buildLabyrinthSite(p){
 const d=world.getDimension("minecraft:overworld"),cx=2200,cz=2200,y=64;if(world.getDynamicProperty("ts26_labyrinth_v3"))return;
 // Three walkable wings, central hub, boss chamber, and a continuous floor/ceiling.
 for(let x=-32;x<=32;x++)for(let z=-32;z<=32;z++){placeBlock(d,cx+x,y-1,cz+z,"minecraft:deepslate_bricks");placeBlock(d,cx+x,y+9,cz+z,"minecraft:stone_bricks");}
 const wall=(x1,z1,x2,z2,h=5,mat="minecraft:prismarine_bricks")=>{if(x1===x2){for(let z=Math.min(z1,z2);z<=Math.max(z1,z2);z++)for(let yy=0;yy<h;yy++)placeBlock(d,cx+x1,y+yy,cz+z,mat);}else{for(let x=Math.min(x1,x2);x<=Math.max(x1,x2);x++)for(let yy=0;yy<h;yy++)placeBlock(d,cx+x,y+yy,cz+z1,mat);}};
 // Outer ring and four internal districts, with intentional door gaps.
 wall(-30,-30,30,-30,7);wall(-30,30,30,30,7);wall(-30,-30,-30,30,7);wall(30,-30,30,30,7);
 wall(-20,-26,-20,26);wall(20,-26,20,26);wall(-26,-20,26,-20);wall(-26,20,26,20);
 for(const z of [-12,0,12]){wall(-18,z,-4,z);wall(4,z,18,z);}for(const x of [-12,0,12]){wall(x,-18,x,-4);wall(x,4,x,18);}
 // Pillars and lamps mark room junctions; four wings have themed floors.
 for(const [x,z,block] of [[-14,-14,"minecraft:moss_block"],[14,-14,"minecraft:blue_ice"],[-14,14,"minecraft:amethyst_block"],[14,14,"minecraft:polished_blackstone"]]){
  for(let dx=-5;dx<=5;dx++)for(let dz=-5;dz<=5;dz++)placeBlock(d,cx+x+dx,y,cz+z+dz,block);
  for(const [px,pz] of [[-4,-4],[4,-4],[-4,4],[4,4]]){for(let yy=1;yy<=4;yy++)placeBlock(d,cx+x+px,y+yy,cz+z+pz,"minecraft:prismarine_bricks");placeBlock(d,cx+x+px,y+5,cz+z+pz,"minecraft:sea_lantern");}
 }
 for(const [x,z] of [[0,-27],[0,27],[-27,0],[27,0],[0,0]]){placeBlock(d,cx+x,y+1,cz+z,"minecraft:sea_lantern");placeBlock(d,cx+x,y+2,cz+z,"minecraft:amethyst_block");}
 // central boss sanctum
 for(let x=-7;x<=7;x++)for(let z=-7;z<=7;z++)placeBlock(d,cx+x,y,cz+z,"minecraft:polished_deepslate");
 for(let a=0;a<4;a++){const ang=a*Math.PI/2,x=Math.round(Math.cos(ang)*6),z=Math.round(Math.sin(ang)*6);for(let yy=1;yy<=6;yy++)placeBlock(d,cx+x,y+yy,cz+z,"minecraft:crying_obsidian");}
 world.setDynamicProperty("ts26_labyrinth_v3",true);try{p.dimension.playSound("tensura.phase3.labyrinth_echo",p.location);}catch{}
 try{const boss=d.spawnEntity("tensura:elemental_colossus",{x:cx+0.5,y:y+1,z:cz+0.5});boss.addTag("tensura_boss");boss.nameTag="Labyrinth Guardian • Elemental Colossus";}catch{}
 say(p,"The Spirit Labyrinth has been charted: a multi-wing dungeon with four elemental halls and a central guardian sanctum. Its guardian has awakened. Explore on foot.");
}
function buildWorldTreeSite(p){buildWorldTree(p,true);}
function buildDemonRealmSite(p){
 const d=world.getDimension("minecraft:overworld"),cx=3000,cz=3000,y=70;if(world.getDynamicProperty("ts26_demon_ruins_v1"))return;
 for(let x=-22;x<=22;x++)for(let z=-22;z<=22;z++){placeBlock(d,cx+x,y-1,cz+z,"minecraft:cracked_nether_bricks");if(Math.abs(x)===22||Math.abs(z)===22)for(let h=0;h<8;h++)placeBlock(d,cx+x,y+h,cz+z,"minecraft:nether_bricks");}
 for(let a=0;a<4;a++){const x=[-12,12,-12,12][a],z=[-12,-12,12,12][a];for(let h=0;h<13;h++)placeBlock(d,cx+x,y+h,cz+z,"minecraft:polished_blackstone_bricks");placeBlock(d,cx+x,y+13,cz+z,"minecraft:soul_lantern");}
 for(let x=-5;x<=5;x++)for(let z=-5;z<=5;z++)if(Math.abs(x)===5||Math.abs(z)===5)for(let h=0;h<6;h++)placeBlock(d,cx+x,y+h,cz+z,"minecraft:nether_bricks");
 for(const [x,z] of [[-8,0],[8,0],[0,-8],[0,8]])placeBlock(d,cx+x,y,cz+z,"minecraft:magma_block");
 world.setDynamicProperty("ts26_demon_ruins_v1",true);say(p,"The Demon Realm outpost has been charted. Its broken gate and blackstone court are now waiting to be explored.");
}
function buildSpiritSanctuarySite(p){
 const d=world.getDimension("minecraft:overworld"),cx=4000,cz=4000,y=80;if(world.getDynamicProperty("ts26_spirit_sanctuary_v1"))return;
 for(let x=-18;x<=18;x++)for(let z=-18;z<=18;z++){const r=Math.sqrt(x*x+z*z);if(r<17)placeBlock(d,cx+x,y-1,cz+z,"minecraft:calcite");if(r>15&&r<18)placeBlock(d,cx+x,y,cz+z,"minecraft:sea_lantern");}
 for(let a=0;a<8;a++){const ang=a*Math.PI/4,x=Math.round(Math.cos(ang)*12),z=Math.round(Math.sin(ang)*12);for(let h=0;h<8;h++)placeBlock(d,cx+x,y+h,cz+z,"minecraft:quartz_pillar");placeBlock(d,cx+x,y+8,cz+z,"minecraft:glowstone");}
 for(const [x,z,b] of [[0,-7,"minecraft:blue_ice"],[7,0,"minecraft:amethyst_block"],[0,7,"minecraft:moss_block"],[-7,0,"minecraft:ochre_froglight"]]){for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++)placeBlock(d,cx+x+dx,y,cz+z+dz,b);}
 world.setDynamicProperty("ts26_spirit_sanctuary_v1",true);say(p,"The Spirit Sanctuary has manifested: an elemental prayer ground for contracting Lesser, Medium and Greater spirits.");
}
function cartographerTrade(ev){
 const p=ev.player,e=ev.target;if(!p||!e||!e.isValid||e.typeId!=="minecraft:villager"||!initPlayer(p))return;
 const form=new CustomForm(p,"TENSURA • CARTOGRAPHER");form.header("EXPLORATION MAPS");form.label("Cartographers exchange emeralds for hand-drawn Tensura landmark maps. Maps reveal bearings and build the landmark in the world; they never teleport you.");
 const options=[["Veldora's Cave","veldora",18],["Spirit Labyrinth","labyrinth",24],["Great World Tree","tree",16],["Demon Realm Ruins","demon",20],["Spirit Sanctuary","spirit",16],["Charybdis Cave","charybdis",28],["Dwarven Village","dwarf",24]];
 for(const [name,key,cost] of options)form.button(`${name} • ${cost} emeralds`,()=>{try{form.close();}catch{}if(!takeItems(p,"minecraft:emerald",cost)){say(p,`You need ${cost} emeralds for this map.`);return;}give(p,`tensura:${key}_exploration_map`);say(p,`${name} exploration map purchased. Use it to chart the route.`);});
 form.button("Raw Mithril • 12 emeralds",()=>{try{form.close();}catch{}if(!takeItems(p,"minecraft:emerald",12))return;give(p,"tensura:raw_mithril");say(p,"Raw Mithril purchased.");});
 form.button("Magic Ore Shard • 8 emeralds",()=>{try{form.close();}catch{}if(!takeItems(p,"minecraft:emerald",8))return;give(p,"tensura:magic_ore_shard");say(p,"Magic Ore Shard purchased.");});
 form.button("Raw Silver • 6 emeralds",()=>{try{form.close();}catch{}if(!takeItems(p,"minecraft:emerald",6))return;give(p,"tensura:raw_silver");say(p,"Raw Silver purchased.");});
 form.button("Veldora Cave Compass • 8 emeralds",()=>{try{form.close();}catch{}if(!takeItems(p,"minecraft:emerald",8))return;say(p,"A Veldora Cave compass has been purchased.");give(p,"minecraft:compass");});
 form.button("Spirit Labyrinth Compass • 10 emeralds",()=>{try{form.close();}catch{}if(!takeItems(p,"minecraft:emerald",10))return;say(p,"A Spirit Labyrinth compass has been purchased.");give(p,"minecraft:compass");});
 form.closeButton();form.show().catch(()=>{});
}

function invCount(p,id){const c=inv(p);if(!c)return 0;let n0=0;for(let i=0;i<c.size;i++){const it=c.getItem(i);if(it?.typeId===id)n0+=it.amount;}return n0;}
function invConsume(p,id,count){const c=inv(p);if(!c||invCount(p,id)<count)return false;let left=count;for(let i=0;i<c.size&&left>0;i++){const it=c.getItem(i);if(it?.typeId===id){const take=Math.min(left,it.amount);left-=take;c.setItem(i,it.amount>take?new ItemStack(id,it.amount-take):undefined);}}return left===0;}
function forgeMenu(p){const f=new CustomForm(p,"TENSURA • FORGE & ARMOURY");f.header("FORGE EQUIPMENT");f.label("Use this hammer at any location. The source reference contains weapon schematics, materials and forging recipes. Equipment gains EP and repairs itself over time.");const sets=[{name:"Majesty Elementite",mat:"tensura:majesty_elementite_ingot",items:"majesty_elementite",ep:18000},{name:"Mithril",mat:"tensura:mithril_ingot",items:"mithril",ep:5000},{name:"Dragon Scale",mat:"tensura:dragon_scale",items:"dragon_scale",ep:12000},{name:"Lizard Scale",mat:"tensura:lizard_scale",items:"lizard_scale",ep:3500},{name:"Sea King",mat:"tensura:sea_king_scale",items:"sea_king",ep:15000},{name:"Charybdis",mat:"tensura:charybdis_core",items:"charybdis",ep:22000}];for(const set0 of sets){f.divider();f.header(set0.name+" Armour");for(const part of ["helmet","chestplate","leggings","boots"]){const id=`tensura:${set0.items}_${part}`;f.button(`Forge ${set0.name} ${part} • 4 materials`,()=>{try{f.close();}catch{}if(n(p,DP.ep)<set0.ep){say(p,`Requires ${set0.ep} EP.`);return;}if(!invConsume(p,set0.mat,4)){say(p,`You need 4 ${set0.mat.replace("tensura:","").replaceAll("_"," ")}.`);return;}give(p,id);try{p.dimension.playSound("tensura.phase3.forge",p.location);}catch{}say(p,`Forged ${set0.name} ${part}.`);});}}const page=Math.max(0,n(p,"ts26_forge_page",0)),size=18,total=Math.ceil(FORGE_CATALOG.length/size),start=page*size;f.divider();f.header(`WEAPONS & EQUIPMENT SCHEMATICS • ${page+1}/${Math.max(1,total)}`);for(const rec of FORGE_CATALOG.slice(start,start+size)){f.button(`${rec.name} • ${rec.amount1} ${rec.input1.split(":").pop()}${rec.input2?` + ${rec.amount2} ${rec.input2.split(":").pop()}`:""}`,()=>{try{f.close();}catch{}if(rec.schematic&&!invConsume(p,rec.schematic,1)){say(p,`Required schematic: ${rec.schematic.split(":").pop()}.`);return;}if(!invConsume(p,rec.input1,rec.amount1)){if(rec.schematic)give(p,rec.schematic);say(p,`Missing ${rec.input1.split(":").pop()}.`);return;}if(rec.input2&&!invConsume(p,rec.input2,rec.amount2)){give(p,rec.input1,rec.amount1);if(rec.schematic)give(p,rec.schematic);say(p,`Missing ${rec.input2.split(":").pop()}.`);return;}give(p,rec.id,rec.count);try{p.dimension.playSound("tensura.phase3.forge",p.location);}catch{}say(p,`Forged ${rec.name}.`);});}if(page>0)f.button("← PREVIOUS PAGE",()=>{set(p,"ts26_forge_page",page-1);try{f.close();}catch{}forgeMenu(p);});if(page+1<total)f.button("NEXT PAGE →",()=>{set(p,"ts26_forge_page",page+1);try{f.close();}catch{}forgeMenu(p);});f.closeButton();f.show().catch(()=>{});}

function createDeathGrave(player){try{const dim=player.dimension,loc={x:Math.floor(player.location.x),y:Math.floor(player.location.y),z:Math.floor(player.location.z)};system.runTimeout(()=>{try{let pos={x:loc.x,y:loc.y,z:loc.z};for(let k=0;k<6;k++){const b=dim.getBlock(pos);if(b&&b.typeId==="minecraft:air")break;pos.y++;}const b=dim.getBlock(pos);if(!b||b.typeId!=="minecraft:air")return;b.setType("minecraft:chest");system.runTimeout(()=>{try{const chest=dim.getBlock(pos)?.getComponent("minecraft:inventory")?.container;if(!chest)return;const drops=dim.getEntities({location:loc,maxDistance:8}).filter(e=>e.typeId==="minecraft:item");let moved=0;for(const e of drops){try{const stack=e.getComponent("minecraft:item")?.itemStack;if(stack){const rem=chest.addItem(stack);if(!rem){e.remove();moved++;}}}catch{}}const marker=dim.spawnEntity("minecraft:armor_stand",{x:pos.x+0.5,y:pos.y,z:pos.z+0.5});marker.nameTag="§6Death Grave§r";marker.addTag("tensura_death_grave");say(player,`§6Your private death-grave coordinates: ${pos.x}, ${pos.y}, ${pos.z}. ${moved} nearby dropped stacks were recovered into its chest. Only you receive these coordinates.§r`);}catch{}},2);}catch{}},2);}catch{}}


function companionContractMenu(p){const defeated=list(p,"ts26_defeated_bosses");const f=new CustomForm(p,"TENSURA • COMPANION CONTRACT");f.header("CALL A DEFEATED FOE AS AN ALLY");f.label("Only bosses you have personally defeated can answer this contract. Companions follow you and do not attack you.");if(!defeated.length)f.label("No defeated bosses recorded yet.");for(const id of defeated){const cost=100+defeated.indexOf(id)*40;f.button(`${id.replaceAll("_"," ").toUpperCase()} • ${cost} MP`,()=>{try{f.close();}catch{}if(n(p,DP.mp)<cost){say(p,`You need ${cost} MP to summon this companion.`);return;}const companionId=`tensura:companion_${id}`;try{const rot=p.getRotation(),yaw=rot.y*Math.PI/180;const pos={x:p.location.x-Math.sin(yaw)*3,y:p.location.y,z:p.location.z+Math.cos(yaw)*3};const e=p.dimension.spawnEntity(companionId,pos);e.nameTag=`${id.replaceAll("_"," ")} • Ally`;e.addTag("tensura_companion");set(p,DP.mp,n(p,DP.mp)-cost);if(!consumeHeld(p,"tensura:companion_contract"))say(p,"Contract not consumed; companion remains summoned.");say(p,`${e.nameTag} answered your contract and will follow you.`);}catch{say(p,"This companion cannot be summoned in the current area.");}});}f.closeButton();f.show().catch(()=>{});}


function processingMenu(p,kind){const f=new CustomForm(p,kind==="kiln"?"TENSURA • MAGIC KILN": "TENSURA • ALCHEMY REFINING");const data=kind==="kiln"?[...KILN_CATALOG,...MIXING_CATALOG]:ALCHEMY_CATALOG;const page=Math.max(0,n(p,kind==="kiln"?"ts26_kiln_page":"ts26_alchemy_page",0)),size=18,total=Math.ceil(data.length/size);f.header(`${kind==="kiln"?"SMELTING & MATERIAL RECOVERY":"REFINING & POTION CRAFT"} • ${page+1}/${Math.max(1,total)}`);f.label(kind==="kiln"?"Convert equipment, ores and materials into Tensura metals. Secondary by-products are recovered when available.":"Refine ingredients into potions and advanced materials. All ingredients are checked before consumption.");for(const rec of data.slice(page*size,(page+1)*size)){f.button(`${rec.name} • ${rec.count||rec.outputCount||1} × ${rec.output||rec.input}`,()=>{try{f.close();}catch{}if(!invConsume(p,rec.input,rec.inputCount||1)){say(p,`Missing ${rec.input.split(":").pop()}.`);return;}if(rec.secondaryInput){if(!invConsume(p,rec.secondaryInput,rec.secondaryInputCount||1)){give(p,rec.input,rec.inputCount||1);say(p,`Missing ${rec.secondaryInput.split(":").pop()}.`);return;}}if(rec.input1&&!invConsume(p,rec.input1,1)){give(p,rec.input,rec.inputCount||1);if(rec.secondary)give(p,rec.secondary,rec.secondaryCount||1);say(p,`Missing ${rec.input1.split(":").pop()}.`);return;}if(rec.input2&&!invConsume(p,rec.input2,1)){give(p,rec.input,rec.inputCount||1);if(rec.input1)give(p,rec.input1);if(rec.secondary)give(p,rec.secondary,rec.secondaryCount||1);say(p,`Missing ${rec.input2.split(":").pop()}.`);return;}if(kind==="kiln"){give(p,rec.output,rec.outputCount||1);if(rec.secondaryOutput)give(p,rec.secondaryOutput,rec.secondaryOutputCount||1);}else give(p,rec.output,rec.outputCount||1);say(p,`${rec.name} completed.`);});}if(page>0)f.button("← PREVIOUS PAGE",()=>{set(p,kind==="kiln"?"ts26_kiln_page":"ts26_alchemy_page",page-1);try{f.close();}catch{}processingMenu(p,kind);});if(page+1<total)f.button("NEXT PAGE →",()=>{set(p,kind==="kiln"?"ts26_kiln_page":"ts26_alchemy_page",page+1);try{f.close();}catch{}processingMenu(p,kind);});f.closeButton();f.show().catch(()=>{});}


function addTitle(p,title){const a=list(p,"ts26_titles");if(!a.includes(title)){a.push(title);saveList(p,"ts26_titles",a);say(p,`§6TITLE UNLOCKED: ${title}§r`);}}

function miningStationMenu(p){
 const f=new CustomForm(p,"TENSURA • MINING STATION");
 const page=Math.max(0,n(p,"ts26_mining_page",0)),size=16,total=Math.ceil(MINING_CATALOG.length/size);
 f.header(`ORE CRUSHING & MATERIAL RECOVERY • ${page+1}/${Math.max(1,total)}`);
 f.label("Process ores and stone through the Tensura mining station. Secondary materials use their original chance and quantity ranges.");
 for(const rec of MINING_CATALOG.slice(page*size,(page+1)*size))f.button(`${rec.name} • ${rec.inputCount} × ${rec.input.split(":").pop()}`,()=>{
  try{f.close();}catch{}
  if(!invConsume(p,rec.input,rec.inputCount)){say(p,`Missing ${rec.input.split(":").pop()}.`);return;}
  let got=0;
  for(const result of rec.results||[]){if(Math.random()<=Number(result.chance??1)){const lo=Number(result.minAmount??1),hi=Number(result.maxAmount??lo),qty=Math.max(1,lo+Math.floor(Math.random()*(hi-lo+1)));const id=result.item?.id;if(id){give(p,id,qty);got+=qty;}}}
  say(p,`Mining station completed ${rec.name}. ${got} total materials recovered.`);
 });
 if(page>0)f.button("← PREVIOUS PAGE",()=>{set(p,"ts26_mining_page",page-1);try{f.close();}catch{}miningStationMenu(p);});
 if(page+1<total)f.button("NEXT PAGE →",()=>{set(p,"ts26_mining_page",page+1);try{f.close();}catch{}miningStationMenu(p);});
 f.closeButton();f.show().catch(()=>{});
}

function resetCharacterWithScroll(p){
 const form=new CustomForm(p,"TENSURA • CHARACTER RESET");form.header("REINCARNATION / CHARACTER RESET");form.label("This scroll resets race, skill ownership, level, mastery, resource pools, spirit contracts and character progression. Your inventory and equipped gear are kept.");
 form.button("CONFIRM CHARACTER RESET",()=>{try{form.close();}catch{}if(!consumeHeld(p,"tensura:character_reset_scroll")){say(p,"Hold a Character Reset Scroll to confirm.");return;}const defaults={[DP.race]:"human",[DP.baseRace]:"human",[DP.raceChosen]:false,[DP.hp]:20,[DP.mp]:0,[DP.maxMp]:0,[DP.ap]:0,[DP.maxAp]:0,[DP.sp]:0,[DP.maxSp]:0,[DP.ep]:0,[DP.jewels]:0,[DP.level]:1,[DP.xp]:0,[DP.skillPoints]:0,[DP.souls]:0,[DP.skills]:"[]",[DP.unique]:"",[DP.equipped]:"",[DP.equippedMagic]:"magic_bolt",[DP.mastery]:"{}",[DP.treeMode]:"core",[DP.treeIndex]:0,[DP.class]:"",[DP.spiritRanks]:"[]",[DP.trueHero]:false,[DP.trueDragon]:false,[DP.demonRitual]:false,[DP.cooldowns]:"{}",[DP.bossKills]:"[]",[DP.kills]:0,[DP.named]:false,[DP.disciples]:"[]",[DP.reflector]:false,[DP.spiritBodyTime]:0,["ts26_retired_skills"]:"[]",["ts26_passive_slots"]:"[]",["ts26_physical_body"]:false,["ts26_vessel_type"]:"",["ts26_demon_escaped"]:false,["ts26_spirit_escaped"]:false,["ts26_named_by"]:"",["ts26_start_unique_rerolls_used"]:0,["ts26_start_unique_rerolls"]:3};for(const [k,v] of Object.entries(defaults))set(p,k,v);set(p,"ts27_start_rerolls_granted",false);try{p.removeEffect("health_boost");const h=p.getComponent("minecraft:health");if(h)h.setCurrentValue(Math.min(20,h.effectiveMax));}catch{}removeItemById(p,"tensura:reincarnation_compass");set(p,"ts26_starter_items_given",false);say(p,"Your character has been reset. Choose a new race to begin again.");system.runTimeout(()=>showRaceSelection(p),5);});
 form.closeButton();form.show().catch(()=>{});
}
const SPIRIT_ENTITY_BY_ELEMENT={light:"spirit_light",darkness:"spirit_darkness",fire:"spirit_fire",spatial:"spirit_spatial",wind:"spirit_wind",earth:"spirit_earth",water:"spirit_water",gravity:"spirit_gravity"};
function summonElementalSpirit(p,itemId){
 const m=itemId.match(/^tensura:(lesser|medium|greater|great)_spirit_(light|darkness|fire|spatial|wind|earth|water|gravity)$/);if(!m)return false;const rank=m[1],element=m[2],costs={lesser:{mp:60,ep:1000,hp:100},medium:{mp:160,ep:5000,hp:250},greater:{mp:400,ep:20000,hp:600},great:{mp:900,ep:50000,hp:1000}},cost=costs[rank];if(n(p,DP.mp)<cost.mp||n(p,DP.ep)<cost.ep){say(p,`${rank.toUpperCase()} ${element.toUpperCase()} SPIRIT CONTRACT requires ${cost.mp} MP and ${cost.ep} EP.`);return true;}if(!consumeHeld(p,itemId))return true;const entityId=SPIRIT_ENTITY_BY_ELEMENT[element]||"elemental_colossus",yaw=(p.getRotation?.().y||0)*Math.PI/180,loc={x:p.location.x-Math.sin(yaw)*3,y:p.location.y+1,z:p.location.z+Math.cos(yaw)*3};try{const spirit=p.dimension.spawnEntity(`tensura:${entityId}`,loc);spirit.addTag("tensura_companion");spirit.addTag("tensura_spirit");spirit.addTag(`tensura_spirit_${element}`);spirit.addTag(`tensura_owner_${p.id.replace(/[^a-zA-Z0-9_]/g,"_")}`);spirit.nameTag=`${rank[0].toUpperCase()+rank.slice(1)} ${element[0].toUpperCase()+element.slice(1)} Spirit`;spirit.setDynamicProperty("ts26_spirit_rank",rank);spirit.setDynamicProperty("ts26_spirit_element",element);const h=spirit.getComponent("minecraft:health");if(h)h.setCurrentValue(Math.min(h.effectiveMax,cost.hp));const amp={lesser:0,medium:1,greater:2,great:3}[rank];spirit.addEffect("strength",120000,{amplifier:amp,showParticles:false});spirit.addEffect("resistance",120000,{amplifier:Math.max(0,amp-1),showParticles:false});if(rank==="great")spirit.addEffect("regeneration",120000,{amplifier:1,showParticles:false});set(p,DP.mp,n(p,DP.mp)-cost.mp);set(p,DP.ep,Math.max(0,n(p,DP.ep)-cost.ep));const contracts=list(p,DP.spiritRanks);contracts.push(`${rank}:${element}:summoned`);saveList(p,DP.spiritRanks,contracts);say(p,`${spirit.nameTag} has answered your contract and will follow you.`);showHud(p);}catch(e){give(p,itemId);say(p,`The ${rank} ${element} spirit could not manifest here. Your contract item was returned.`);}return true;
}
function itemUse(ev){
 const p=ev.source;if(!p||p.typeId!=="minecraft:player")return;
 const id=ev.itemStack?.typeId||"";
 if(["tensura:tensura_compass","tensura:skill_horn","tensura:magic_horn","tensura:naming_horn"].includes(id)){
  const key=`ts27_item_use_${id.replace(/[^a-z0-9]/gi,"_")}`,last=Number(get(p,key,0));
  if(system.currentTick-last<10)return;set(p,key,system.currentTick);
 }
 if(id==="tensura:reincarnation_compass"){removeItemById(p,id);say(p,"The Reincarnation Compass is no longer used. Your race choice is permanent; use Tensura Menu for your character profile.");return;}
 if(id==="tensura:menu_crystal"||id==="tensura:tensura_compass"){openTensuraMenu(p);return;}
 if(id==="tensura:landmark_compass"){landmarkCompassMenu(p);return;}
 
 if(id==="tensura:forge_hammer"){forgeMenu(p);return;}
 if(id==="tensura:mining_station"){miningStationMenu(p);return;}
 if(id==="tensura:magic_kiln"){processingMenu(p,"kiln");return;}
 if(id==="tensura:alchemy_table"){processingMenu(p,"alchemy");return;}
 if(id==="tensura:companion_contract"){companionContractMenu(p);return;}
 if(id==="tensura:charybdis_core_fusion"){if(n(p,DP.ep)<30000||n(p,DP.mp)<5000||invCount(p,"tensura:charybdis_core")<1||invCount(p,"tensura:sea_king_scale")<3){say(p,"Charybdis fusion requires 30,000 EP, 5,000 MP, one Charybdis Core and three Sea King Scales.");return;}if(!consumeHeld(p,id)||!invConsume(p,"tensura:charybdis_core",1)||!invConsume(p,"tensura:sea_king_scale",3))return;set(p,DP.mp,n(p,DP.mp)-5000);if(Math.random()<0.65){addSkill(p,"water_domination");addSkill(p,"spatial_domination");give(p,"tensura:charybdis_scalemail_chestplate");try{p.dimension.playSound("tensura.phase3.fusion",p.location);}catch{}say(p,"§bCHARYBDIS CORE FUSION SUCCESSFUL!§r The abyssal core has fused with your soul. New domination skills awakened.");}else{set(p,DP.mp,n(p,DP.mp)+2500);say(p,"§cCharybdis fusion failed. The core shattered; half the MP cost was refunded.§r");}return;}
 if(id==="tensura:spirit_fusion_seal"){const ranks=list(p,DP.spiritRanks);const elements=[...new Set(ranks.map(x=>x.split(":").slice(1).join(":").toLowerCase()))];if(elements.length<2||n(p,DP.ep)<5000||n(p,DP.mp)<1200){say(p,"Spirit fusion requires contracts with two different elemental spirits, 5,000 EP and 1,200 MP.");return;}if(!consumeHeld(p,id))return;set(p,DP.mp,n(p,DP.mp)-1200);if(Math.random()<0.72){const fused=`Fused:${elements.slice(-2).join("+")}`;set(p,"ts26_integrated_spirit",fused);addSkill(p,"elemental_domination");addSkill(p,"magic_sense");try{p.dimension.playSound("tensura.phase3.fusion",p.location);}catch{}say(p,`§bSPIRIT FUSION SUCCESSFUL!§r You fused ${elements.slice(-2).join(" and ")} into a dual-element contract.`);}else{const next=ranks.slice(0,-1);saveList(p,DP.spiritRanks,next);say(p,"§cSpirit fusion failed. The newest spirit contract dissipated.§r");}return;}
 if(id==="tensura:demon_lord_summoning_seal"){primordialSummonMenu(p);return;}
 if(id==="tensura:veldora_compass"||id==="tensura:labyrinth_compass"||id==="minecraft:compass"){const kind=id.includes("veldora")?"veldora":(id.includes("labyrinth")?"labyrinth":get(p,"ts26_active_compass","veldora"));set(p,"ts26_active_compass",kind);say(p,`§e${LANDMARKS[kind].name} compass activated. Direction and distance are displayed beneath your status bars.§r`);showHud(p);return;}
 if(id.endsWith("_exploration_map")){const kind=id.slice("tensura:".length).replace("_exploration_map","");if(consumeHeld(p,id))mapDiscovery(p,kind);return;}
 if(id==="tensura:magic_horn"){magicHornUse(p);return;}
 if(id==="tensura:naming_horn"){nameTargetWithHorn(p);return;}
 if(id==="tensura:skill_horn"){skillHornUse(p);return;}
 if(id.startsWith("tensura:skill_book_")){useSkillTome(p,id);return;}
 if(id==="tensura:character_reset_scroll"){resetCharacterWithScroll(p);return;}
 if(id.startsWith("tensura:lesser_spirit_")||id.startsWith("tensura:medium_spirit_")||id.startsWith("tensura:greater_spirit_")||id.startsWith("tensura:great_spirit_")){summonElementalSpirit(p,id);return;}
 if(id==="tensura:spirit_codex"){openSpiritPrayer(p);return;}
 if(id==="tensura:spirit_prayer"){openSpiritPrayer(p);return;}
 if(id==="tensura:demon_lord_seed"){startDemonRitual(p);return;}
 if(id==="tensura:spirit_integration"){const ranks=list(p,DP.spiritRanks);if(!ranks.length){say(p,"You need to acquire a spirit through prayer first.");return;}const selected=ranks[ranks.length-1];set(p,"ts26_integrated_spirit",selected);if(consumeHeld(p,id))say(p,`Integrated with ${selected.replace(":"," ")} Spirit. Use Magic Horn to invoke your spirit arts.`);return;}
 if(id==="tensura:elemental_essence"){
  set(p,DP.mp,Math.min(n(p,DP.maxMp),n(p,DP.mp)+40));set(p,DP.ap,Math.min(n(p,DP.maxAp),n(p,DP.ap)+20));set(p,DP.sp,Math.min(n(p,DP.maxSp),n(p,DP.sp)+20));set(p,DP.ep,n(p,DP.mp)+n(p,DP.ap)+n(p,DP.sp));say(p,"Elemental Essence nourished your magicules, aura and spirit health.");return;
 }
 if(id==="tensura:spiritual_essence"){
  set(p,DP.sp,Math.min(n(p,DP.maxSp),n(p,DP.sp)+60));set(p,DP.mp,Math.min(n(p,DP.maxMp),n(p,DP.mp)+20));set(p,DP.ep,n(p,DP.mp)+n(p,DP.ap)+n(p,DP.sp));say(p,"Spiritual Essence restored your spirit health and magicules.");return;
 }
 if(id==="tensura:dragon_essence"||id==="tensura:daemon_essence"){
  set(p,DP.mp,Math.min(n(p,DP.maxMp),n(p,DP.mp)+80));set(p,DP.sp,Math.min(n(p,DP.maxSp),n(p,DP.sp)+40));set(p,DP.ep,n(p,DP.mp)+n(p,DP.ap)+n(p,DP.sp));say(p,"The essence strengthened your spiritual reserves.");return;
 }
 if(id==="tensura:magicule_crystal"){const cur=n(p,DP.mp),mx=n(p,DP.maxMp);if(cur>=mx){say(p,"Your MP is already full.");return;}if(consumeHeld(p,id)){set(p,DP.mp,Math.min(mx,cur+80));say(p,"Magicule Crystal restored up to 80 MP.");}return;}
 if(id==="tensura:magicule_potion"){if(consumeHeld(p,id)){set(p,DP.mp,Math.min(n(p,DP.maxMp),n(p,DP.mp)+120));say(p,"Magicule Potion restored up to 120 MP.");}return;}
 if(id==="tensura:healing_potion"){if(consumeHeld(p,id)){heal(p,2);effect(p,"regeneration",240,1);p.removeEffect("poison");p.removeEffect("wither");say(p,"Healing Potion restored vitality and regeneration.");}return;}
 if(id==="tensura:spirit_potion"){if(consumeHeld(p,id)){set(p,DP.sp,Math.min(n(p,DP.maxSp),n(p,DP.sp)+100));set(p,DP.mp,Math.min(n(p,DP.maxMp),n(p,DP.mp)+40));say(p,"Spirit Potion restored 100 SP and 40 MP.");}return;}
 if(id==="tensura:battlewill_manual"||id.startsWith("tensura:battlewill_manual_")){
  const poolKey=id.startsWith("tensura:battlewill_manual_")?id.slice("tensura:battlewill_manual_".length):"";
  const sourcePool=poolKey?(BATTLEWILL_MANUAL_POOLS[poolKey]||[]):[...BATTLEWILL_SKILLS];
  const learned=sourcePool.filter(x=>SKILL_BY_ID.has(x)&&BATTLEWILL_SKILLS.has(x)&&!hasSkill(p,x));
  if(!learned.length){say(p,"You have mastered every Battlewill technique recorded in this manual.");return;}
  if(!consumeHeld(p,id))return;
  const sid=learned[Math.floor(Math.random()*learned.length)];addSkill(p,sid);
  say(p,`§6Battlewill manual studied: ${skillName(sid)} learned. This is an aura technique and consumes AP, not MP.§r`);return;
 }
 if(id==="tensura:unique_skill_reroll"){
  const used=n(p,"ts26_start_unique_rerolls_used",0),remaining=Math.max(0,3-used);
  if(remaining<=0){say(p,"Your three starting Unique Skill rerolls have been used. No further rerolls are available.");return;}
  const old=get(p,DP.unique,"");const oldIds=old.includes("+")?old.split("+").map(x=>x.trim().toLowerCase().replaceAll(" ","_")):[old].filter(Boolean);
  const pool=["predator","great_sage","gluttony","degenerate","chosen_one","survivor","starved","berserker","royal_beast","greed","guardian","healer","seeker","shadow_striker","investigator","usurper","traveler","reflector","creator","commander","falsifier","envy","pride","sloth","lust","reaper","sniper","martial_master","merciless","observer","suppressor","unyielding"];
  const candidates=pool.filter(x=>SKILL_BY_ID.has(x)&&!oldIds.includes(x));if(!candidates.length){say(p,"No eligible replacement Unique Skills remain.");return;}
  if(!consumeHeld(p,id))return;const next=candidates[Math.floor(Math.random()*candidates.length)];
  const skills=list(p,DP.skills).filter(x=>!oldIds.includes(x));skills.push(next);saveList(p,DP.skills,skills);set(p,DP.unique,next);if(oldIds.includes(get(p,DP.equipped,"")))set(p,DP.equipped,next);for(let i=0;i<9;i++)if(oldIds.includes(get(p,`ts26_horn_${i}`,"")))set(p,`ts26_horn_${i}`,next);set(p,"ts26_start_unique_rerolls_used",used+1);
  say(p,`§dStarting Unique Skill rerolled: ${skillName(next)}. ${2-used} rerolls remain.§r`);return;
 }

 if(id==="tensura:naming_scroll"){const target=getTarget(p,8);if(target&&target.typeId!=="minecraft:player"){if(!consumeHeld(p,id))return;const h=target.getComponent("minecraft:health"),cost=Math.max(25,Math.ceil((h?.effectiveMax||100)*0.8));if(n(p,DP.mp)<cost){give(p,id);say(p,`Naming this creature requires ${cost} MP. Your current MP is ${n(p,DP.mp)}.`);return;}set(p,DP.mp,n(p,DP.mp)-cost);try{target.addTag("tensura_named");target.addTag("tensura_companion");target.addTag(`tensura_owner_${p.id.replace(/[^a-zA-Z0-9_]/g,"_")}`);target.nameTag=`Named ${target.typeId.replace("tensura:","").replaceAll("_"," ")}`;const hp=target.getComponent("minecraft:health");if(hp)hp.setCurrentValue(Math.min(hp.effectiveMax*1.5,hp.currentValue+hp.effectiveMax*0.5));target.addEffect("strength",12000,{amplifier:0,showParticles:false});target.addEffect("resistance",12000,{amplifier:0,showParticles:false});}catch{}set(p,DP.ep,n(p,DP.ep)+cost);say(p,`§dNAMING SUCCESSFUL§r. ${target.nameTag} has received a name and a strengthened soul.`);return;}openNamingMenu(p);return;}
 if(id==="tensura:demon_possession_seal"){
  const race=get(p,DP.race,get(p,DP.baseRace,"human")),baseRace=get(p,DP.baseRace,race);
  if(baseRace==="spirit"&&!get(p,"ts26_spirit_escaped",false)){say(p,"As a Spirit, first find the Spirit Portal in the Great Spirit Labyrinth and cross into the Overworld.");return;}
  if(baseRace==="demon"&&!get(p,"ts26_demon_escaped",false)&&!get(p,"ts26_named_by","")){say(p,"As a Demon, first find a Hell Gate and escape to the Overworld, or receive a name from a master.");return;}
  const target=getTarget(p,6);if(!target){say(p,"Look directly at a nearby creature to bind it as your vessel.");return;}if(target.typeId==="minecraft:player"){say(p,"Player possession requires explicit consent and is not available through the vessel seal.");return;}
  if(!consumeHeld(p,id))return;const h=target.getComponent("minecraft:health"),vesselHp=Math.max(20,Math.min(400,Math.ceil(h?.effectiveMax||40)));let vesselScale=1;try{vesselScale=target.getComponent("minecraft:scale")?.value||1;}catch{}
  set(p,"ts26_physical_body",true);set(p,"ts26_vessel_type",target.typeId);set(p,DP.spiritBodyTime,12000);set(p,DP.hp,vesselHp);
  const mpMax=Math.max(40,Math.floor(vesselHp*4)),apMax=Math.max(40,Math.floor(vesselHp*3)),spMax=Math.max(40,Math.floor(vesselHp*2));set(p,DP.maxMp,mpMax);set(p,DP.mp,mpMax);set(p,DP.maxAp,apMax);set(p,DP.ap,apMax);set(p,DP.maxSp,spMax);set(p,DP.sp,spMax);set(p,DP.ep,mpMax+apMax+spMax);
  try{target.addTag("tensura_vessel");target.remove();}catch{}try{const sc=p.getComponent("minecraft:scale");if(sc)sc.value=Math.max(0.45,Math.min(2.5,vesselScale));const boost=Math.max(0,Math.ceil((vesselHp-20)/4)-1);if(vesselHp>20)p.addEffect("health_boost",999999,{amplifier:boost,showParticles:false});}catch{}
  say(p,`§dPOSSESSION COMPLETE§r. You now inhabit ${target.typeId}. Your HP, MP, AP, SP and physical scale have been recalculated from the vessel.`);showHud(p);return;
 }
}
function evolveByNaming(target,namer){
 const base=get(target,DP.baseRace,get(target,DP.race,"human"));
 const forms={slime:"named_slime",human:"named_human",goblin:"hobgoblin",ogre:"kijin",orc:"high_orc",lizardman:"dragonewt",dwarf:"high_dwarf",elf:"high_elf",demon:"arch_demon",spirit:"named_spirit",beastman:"high_beastman",vampire:"noble_vampire"};
 const evolved=forms[base]||"named_"+base;set(target,DP.race,evolved);
 set(target,DP.hp,Math.max(20,Math.ceil(n(target,DP.hp,20)*1.15)));set(target,DP.maxMp,n(target,DP.maxMp)+50);set(target,DP.mp,n(target,DP.mp)+50);set(target,DP.maxAp,n(target,DP.maxAp)+20);set(target,DP.ap,n(target,DP.ap)+20);set(target,DP.maxSp,n(target,DP.maxSp)+20);set(target,DP.sp,n(target,DP.sp)+20);set(target,DP.ep,n(target,DP.mp)+n(target,DP.ap)+n(target,DP.sp));
 const bonus={goblin:"agility",ogre:"steel_strength",orc:"berserker",lizardman:"body_armor",dwarf:"absorb_and_dissolve",elf:"universal_perception",demon:"shadow_motion",spirit:"healing",beastman:"agility",vampire:"shadow_motion",slime:"predator"}[base];
 if(bonus)addSkill(target,bonus);applyRaceBody(target);try{const h=target.getComponent("minecraft:health");if(h)h.setCurrentValue(h.effectiveMax);}catch{}effect(target,"regeneration",300,1);
 say(target,`§dNAMED EVOLUTION!§r Your race evolved into ${evolved.replaceAll("_"," ")}. You are now a disciple of ${namer.name}.`);
 say(namer,`${target.name} evolved into ${evolved.replaceAll("_"," ")} and became your named disciple.`);
}
const JAR_NAMEABLE_ENTITY_IDS=new Set([
 "minecraft:guardian","minecraft:squid","minecraft:cod","minecraft:salmon","minecraft:cat","minecraft:donkey","minecraft:horse","minecraft:llama","minecraft:mule","minecraft:parrot","minecraft:skeleton_horse","minecraft:trader_llama","minecraft:wolf","minecraft:zombie_horse","minecraft:allay","minecraft:fox","minecraft:ocelot",
 ...["aqua_frog","arch_daemon","armorsaurus","army_wasp","barghest","basilisk","beast_gnome","black_spider","blade_tiger","cattledeer","direwolf","dragon_peacock","evil_centipede","feathered_serpent","giant_ant","giant_bat","giant_bear","giant_cod","giant_salmon","goblin","greater_daemon","hell_caterpillar","hell_moth","horned_bear","horned_rabbit","hound_dog","hover_lizard","knight_spider","landfish","leech_lizard","lesser_daemon","lizardman","megalodon","one_eyed_owl","orc","pegasus","pegacorn","phantaspore","slime","metal_slime","salamander","sissie","spear_toro","tempest_serpent","winged_cat","akash","ifrit","sylphide","undine","unicorn","war_gnome","skeleton","zombie"].map(id=>`tensura:${id}`)
]);
function getNamingTarget(p,range=16,includePlayers=true,eligible=null){
 const valid=e=>e&&e.isValid&&e.id!==p.id&&e.typeId!=="minecraft:item"&&e.typeId!=="minecraft:xp_orb"&&(includePlayers||e.typeId!=="minecraft:player")&&(!eligible||eligible(e));
 try{
  const hits=p.getEntitiesFromViewDirection({maxDistance:range});
  // Do not let an unnameable foreground mob block a valid nameable mob behind it.
  for(const hit of hits){if(valid(hit.entity))return hit.entity;}
 }catch{}
 try{
  const rot=p.getRotation(),yaw=rot.y*Math.PI/180,pitch=rot.x*Math.PI/180,dir={x:-Math.sin(yaw)*Math.cos(pitch),y:-Math.sin(pitch),z:Math.cos(yaw)*Math.cos(pitch)};
  return p.dimension.getEntities({location:p.location,maxDistance:range}).filter(valid).map(e=>{
   const dx=e.location.x-p.location.x,dy=(e.location.y+0.5)-p.location.y,dz=e.location.z-p.location.z,d=Math.hypot(dx,dy,dz)||1;
   return {e,d,dot:(dx*dir.x+dy*dir.y+dz*dir.z)/d};
  }).filter(x=>x.dot>0.35).sort((a,b)=>a.d-b.d)[0]?.e;
 }catch{return undefined;}
}
async function nameTargetWithHorn(p){
 // Java NameCommand toggles IExistence.nameable. Mobile equivalent: sneak-use the Naming Horn.
 if(p.isSneaking){
  const enabled=!p.hasTag("tensura_nameable");
  try{if(enabled)p.addTag("tensura_nameable");else p.removeTag("tensura_nameable");}catch{}
  set(p,"ts26_nameable",enabled);
  say(p,`Player naming ${enabled?"enabled":"disabled"}. ${enabled?"Other players may now submit a naming offer.":"Other players can no longer name you."}`);
  return;
 }
 const target=getNamingTarget(p,16,true,e=>e.typeId==="minecraft:player"||(JAR_NAMEABLE_ENTITY_IDS.has(e.typeId)&&!!e.getComponent("minecraft:health")));
 if(!target){say(p,"No valid target. Aim at a living mob or a consenting player within 16 blocks, then use the Naming Horn.");return;}
 const isPlayer=target.typeId==="minecraft:player";
 if(isPlayer&&target.id===p.id){say(p,"You cannot name yourself.");return;}
 if(!isPlayer&&!JAR_NAMEABLE_ENTITY_IDS.has(target.typeId)){say(p,`${target.typeId} is not included in the Java can_be_named entity tag.`);return;}
 if(isPlayer&&!target.hasTag("tensura_nameable")&&!get(target,"ts26_nameable",false)){say(p,`${target.name} has not enabled naming. They must sneak-use their Naming Horn first.`);return;}
 if(target.hasTag("tensura_named")||get(target,DP.named,false)||target.hasTag("tensura_named_by_other")){say(p,"This target already has a naming bond.");return;}
 if(!isPlayer&&target.getComponent("minecraft:tameable")?.isTamed){say(p,"This creature already belongs to another owner and cannot be named again.");return;}
 const hp=target.getComponent("minecraft:health");
 if(!hp){say(p,"This target has no living health component and cannot receive a naming bond.");return;}
 const maxHp=Math.max(1,Number(hp.effectiveMax||hp.defaultValue||20));
 const curHp=Math.max(0,Number(hp.currentValue||0));
 const creative=(()=>{try{return String(p.getGameMode?.()||"").toLowerCase()==="creative";}catch{return false;}})();
 // Java PlayerConfig.Naming.lowHPToName defaults to 25 percent.
 if(!creative&&curHp>maxHp*0.25){say(p,`Weaken ${target.nameTag||target.typeId} to 25% health or lower before naming it (${Math.ceil(curHp)}/${Math.ceil(maxHp)} HP).`);return;}
 // Java canName rejects a target whose max EP is equal to or above the namer's base max EP.
 const namerMaxMp=n(p,DP.maxMp,100),namerMaxAp=n(p,DP.maxAp,100),namerMaxSp=n(p,DP.maxSp,100);
 const namerMaxEP=namerMaxMp+namerMaxAp+namerMaxSp;
 const targetMaxMp=Math.max(0,n(target,DP.maxMp,0));
 const targetMaxAp=Math.max(0,n(target,DP.maxAp,0));
 const targetMaxSp=Math.max(0,n(target,DP.maxSp,0));
 const targetMaxEP=targetMaxMp+targetMaxAp+targetMaxSp;
 if(isPlayer&&targetMaxEP>=namerMaxEP&&!creative){say(p,"The target's maximum existence energy is not lower than yours. The Java naming rules do not allow this naming bond.");return;}
 const current=target.nameTag||target.typeId.replace("tensura:","").replaceAll("_"," ");
 const form=new ModalFormData().title("TENSURA • NAMING CONTRACT")
  .textField(`Name ${current}`,"Name (1–64 characters)",String(current).slice(0,64))
  .dropdown("Naming type • original Java configuration",["LOW • SUBDUE (×0.5 gain; 0% max loss)","MEDIUM • EVOLVE (×1.5 gain; 20% max loss)","HIGH • ENDOW (×9 gain; 50% max loss)"],0);
 try{
  const result=await form.show(p);if(result.canceled)return;
  const name=String(result.formValues?.[0]??"").replace(/[§\u00a7\u0000-\u001f]/g,"").trim().slice(0,64);
  const mode=Math.max(0,Math.min(2,Number(result.formValues?.[1]??0)));
  if(!name){say(p,"A name cannot be empty.");return;}
  if(isPlayer){
   const consent=new ActionFormData().title("TENSURA • NAMING CONSENT").body(`${p.name} offers to name you ${name} using ${["LOW / SUBDUE","MEDIUM / EVOLVE","HIGH / ENDOW"][mode]}. Accept this naming bond?`).button("ACCEPT NAMING").button("DECLINE");
   const answer=await consent.show(target);if(answer.canceled||answer.selection!==0){say(p,`${target.name} declined the naming contract.`);return;}
  }
  // Decompiled Java RequestNamingMenuPacket.name(): gain = (target max aura + target max magicule) × configured multiplier.
  // PlayerConfig defaults: 0.5 / 1.5 / 9.0; maxEPGain=1,000,000; maxCost=3,000,000.
  const targetPower=(targetMaxMp+targetMaxAp)>0?(targetMaxMp+targetMaxAp):Math.max(1,maxHp*10);
  const gain=Math.min(1000000,targetPower*[0.5,1.5,9.0][mode]);
  const cost=Math.min(3000000,gain);
  const currentMp=n(p,DP.mp,namerMaxMp),currentAp=n(p,DP.ap,namerMaxAp),currentSp=n(p,DP.sp,namerMaxSp);
  // Java requires max magicule above cost and sufficient current existence energy; it spends magicule first, then aura.
  if(!creative&&(namerMaxMp<=cost||(currentMp+currentAp)<cost)){
   say(p,`Naming needs ${Math.ceil(cost)} energy. Your maximum MP must exceed the cost and your current MP + AP must cover it. Current MP: ${Math.floor(currentMp)}; AP: ${Math.floor(currentAp)}.`);return;
  }
  if(!creative){
   const spendMp=Math.min(currentMp,cost),spendAp=Math.max(0,cost-spendMp);
   set(p,DP.mp,Math.max(0,currentMp-spendMp));set(p,DP.ap,Math.max(0,currentAp-spendAp));
   set(p,DP.ep,n(p,DP.mp)+n(p,DP.ap)+currentSp);
   // Java's configured maximum-resource loss chance: LOW 0%, MEDIUM 20%, HIGH 50%.
   const lossChance=[0,20,50][mode];
   if(Math.random()*100<lossChance){
    const lossMp=Math.min(n(p,DP.maxMp),gain/2),lossAp=Math.min(n(p,DP.maxAp),Math.max(0,gain/2-lossMp));
    set(p,DP.maxMp,Math.max(1,n(p,DP.maxMp)-lossMp));set(p,DP.maxAp,Math.max(1,n(p,DP.maxAp)-lossAp));
    set(p,DP.mp,Math.min(n(p,DP.mp),n(p,DP.maxMp)));set(p,DP.ap,Math.min(n(p,DP.ap),n(p,DP.maxAp)));
    say(p,`Naming strain consumed part of your maximum reserves (Java ${lossChance}% loss chance).`);
   }
  }
  // Java namingReward raises both max magicule and max aura by half the gain, fills the target to the new caps and heals it.
  const halfGain=gain/2;
  const nextMaxMp=Math.max(targetMaxMp,Math.round(targetMaxMp+halfGain));
  const nextMaxAp=Math.max(targetMaxAp,Math.round(targetMaxAp+halfGain));
  set(target,DP.maxMp,nextMaxMp);set(target,DP.maxAp,nextMaxAp);
  set(target,DP.mp,nextMaxMp);set(target,DP.ap,nextMaxAp);
  set(target,DP.maxSp,Math.max(targetMaxSp,n(target,DP.maxSp,0)));
  set(target,DP.sp,Math.max(n(target,DP.sp,0),targetMaxSp));
  set(target,DP.ep,n(target,DP.mp)+n(target,DP.ap)+n(target,DP.sp));
  target.nameTag=name;
  target.addTag("tensura_named");target.addTag("tensura_named_by_other");target.addTag("tensura_companion");
  const ownerTag=`tensura_owner_${p.id.replace(/[^a-zA-Z0-9_]/g,"_")}`;
  try{target.addTag(ownerTag);}catch{}
  set(target,DP.named,true);set(target,"ts26_custom_name",name);set(target,"ts26_named_by",p.name);
  if(isPlayer){set(target,"ts26_nameable",false);try{target.removeTag("tensura_nameable");}catch{}}
  // Java calls INameEvolution and RaceHelper.evolveMobs for MEDIUM/HIGH. This is the Bedrock race-evolution bridge.
  if(mode>=1&&!isPlayer&&target.typeId.startsWith("tensura:")){
   const base=target.typeId.split(":").pop();
   if(["slime","goblin","ogre","orc","lizardman","demon","spirit","beastman","vampire"].includes(base)){try{evolveByNaming(target,p);}catch(e){say(p,`Naming succeeded; race evolution bridge failed safely: ${String(e)}.`);}}
  }
  if(mode===2){
   const md=masteryData(target);for(const sid of list(target,DP.skills)){const before=Number(md[sid]||0);if(before<0){const roll=Math.random()*100;md[sid]=before+(roll<50?25:roll<75?50:roll<95?75:100);}}
   set(target,DP.mastery,JSON.stringify(md));
  }
  try{hp.setCurrentValue(hp.effectiveMax);}catch{}
  try{target.removeEffect("weakness");target.removeEffect("slowness");target.removeEffect("wither");}catch{}
  say(p,`§dNAMING SUCCESSFUL§r. ${current} is now ${name}. ${["Subdue","Evolution","Endowment"][mode]} naming applied; target reserves increased by ${Math.floor(halfGain)} MP and ${Math.floor(halfGain)} AP.`);
  if(isPlayer)say(target,`You accepted the naming bond. Your new name is ${name}; your existence reserves have increased.`);
  showHud(p);
 }catch(e){say(p,`Naming failed safely: ${String(e)}. No success was reported.`);}
}

function openNamingMenu(p){
 const players=world.getPlayers().filter(x=>x.id!==p.id&&!get(x,DP.named,false)&&x.dimension.id===p.dimension.id&&dist(x.location,p.location)<12);
 const form=new CustomForm(p,"TENSURA • NAMING CONTRACT");form.header("NAME A PLAYER DISCIPLE");form.label("A named player must accept the bond. The namer must have more MP than the target. Naming costs 10% of your current MP.");
 if(!players.length)form.label("No other players are within 12 blocks.");
 for(const target of players){form.button(`Offer naming contract to ${target.name}`,()=>{try{form.close();}catch{}const cost=Math.ceil(n(p,DP.mp)*0.1);if(n(p,DP.mp)<=n(target,DP.mp)||n(p,DP.mp)<cost){say(p,"You must have more MP than the target and enough MP to pay the naming cost.");return;}const consent=new CustomForm(target,"TENSURA • NAMING OFFER");consent.header(`${p.name} offers to name you`);consent.label(`Accepting costs the namer ${cost} MP and creates a disciple bond.`);consent.button("ACCEPT NAMING",()=>{try{consent.close();}catch{}set(target,"ts26_named_by",p.name);set(target,DP.named,true);set(target,"ts26_physical_body",true);set(p,DP.disciples,JSON.stringify([...list(p,DP.disciples),target.name]));set(p,DP.mp,n(p,DP.mp)-cost);evolveByNaming(target,p);});consent.button("DECLINE",()=>{try{consent.close();}catch{}say(p,`${target.name} declined the naming contract.`);});consent.show().catch(()=>{});});}
 form.closeButton();form.show().catch(()=>{});
}

function addLootForKill(killer,dead){
 const id=dead?.typeId||"",tag=(dead?.nameTag||"").toLowerCase();
 const boss=/boss|orc_disaster|orc_lord|charybdis|elemental_colossus|ifrit|veldora|primordial/i.test(id+" "+tag)||safeTag(dead,"tensura_boss");
 const elemental=/elemental|undine|sylphide|ifrit|spirit|gnome/i.test(id+" "+tag);
 const otherworlder=/otherworlder|summoned_human|mercenary/i.test(id+" "+tag)||safeTag(dead,"tensura_otherworlder");
 const creature=/tensura:|slime|orc|ogre|goblin|lizard|direwolf|bear|spider|rabbit|monster/i.test(id);
 if(elemental&&Math.random()<0.25)give(killer,"tensura:spiritual_essence",1);
 // Rare material recovery from creatures supplements missing ore generation without flooding inventories.
 if(creature&&Math.random()<0.045)give(killer,"tensura:magic_ore_shard",1);
 if(/dwarf|armorsaurus|orc_lord|orc_disaster|golem/i.test(id+" "+tag)&&Math.random()<0.035)give(killer,"tensura:raw_mithril",1);
 if(/lizard|serpent|dragon|megalodon|charybdis/i.test(id+" "+tag)&&Math.random()<0.04)give(killer,"tensura:raw_silver",1);
 if(id.includes("sky_wyvern")||id.includes("dragon_peacock")||id.includes("veldora")){give(killer,"tensura:dragon_scale",Math.random()<0.4?3:1);}
 if(id.includes("giant_cod")||id.includes("giant_salmon")||id.includes("megalodon")){give(killer,"tensura:sea_king_scale",Math.random()<0.4?3:1);}
 if(id.includes("charybdis")){give(killer,"tensura:charybdis_core");}
 if(id.includes("lizardman")||id.includes("hover_lizard")){give(killer,"tensura:lizard_scale",1+Math.floor(Math.random()*2));}
 if(boss&&Math.random()<0.12)give(killer,"tensura:majesty_elementite_ingot");
 if((boss||/ogre|orc|greater_daemon|lesser_daemon|dojo|warrior/i.test(id+" "+tag))&&Math.random()<(boss?0.22:0.06)){give(killer,"tensura:battlewill_manual");say(killer,"§6Battlewill Manual recovered. Study it to learn an aura technique that consumes AP.§r");}
 let chance=boss?0.75:otherworlder?0.45:elemental?0.35:creature?0.08:0.025;
 if(Math.random()<chance){const pool=otherworlder?DROP_SKILLS.filter(s=>["great_sage","chosen_one","survivor","degenerate","greed","guardian","investigator","usurper","traveler","raphael"].includes(s)):boss?DROP_SKILLS.filter(s=>["gluttony","beelzebuth","raphael","uriel","michael","azathoth","absolute_severance","multilayer_barrier","black_flame"].includes(s)):elemental?DROP_SKILLS.filter(s=>["fireball","water_blade","wind_blade","lightning_spear","ice_lance","earth_spike","healing","universal_perception","spatial_motion"].includes(s)):DROP_SKILLS;
  const skill=pool[Math.floor(Math.random()*pool.length)];give(killer,`tensura:skill_book_${skill}`);say(killer,`§dSkill Tome dropped: ${skillName(skill)}§r.`);}
 if(boss){set(killer,"ts26_last_boss_defeated",id.replace("tensura:",""));const defeated=list(killer,"ts26_defeated_bosses");const defeatedId=id.replace("tensura:","");if(!defeated.includes(defeatedId)){defeated.push(defeatedId);saveList(killer,"ts26_defeated_bosses",defeated);give(killer,"tensura:companion_contract");say(killer,"§dA Demon Lord Companion Contract was acquired. You may now summon this defeated boss as an ally.§r");}set(killer,DP.souls,n(killer,DP.souls)+100);set(killer,DP.ep,n(killer,DP.ep)+1500);set(killer,DP.skillPoints,n(killer,DP.skillPoints)+5);set(killer,DP.bossKills,n(killer,DP.bossKills)+1);say(killer,"§6Boss defeated!§r +100 souls, +1500 EP, +5 Skill Points.");if(id.includes("orc_disaster")&&!get(killer,"ts26_orc_disaster_seed",false)){give(killer,"tensura:demon_lord_seed");set(killer,"ts26_orc_disaster_seed",true);say(killer,"§5The Orc Disaster yielded a Demon Lord Seed.§r");}else if(Math.random()<0.25)give(killer,"tensura:demon_lord_seed");}
 else if(otherworlder){set(killer,DP.souls,n(killer,DP.souls)+10);set(killer,DP.ep,n(killer,DP.ep)+250);}
 else if(elemental&&Math.random()<0.22){give(killer,"tensura:spirit_prayer");say(killer,"An elemental dropped a Spirit Prayer Seal.");}
 if(!boss){const soulGain=Math.max(1,Math.floor((Number(get(dead,"ts26_ep_value",50))||50)/1000));set(killer,DP.souls,n(killer,DP.souls)+soulGain);}
 set(killer,DP.kills,n(killer,DP.kills)+1);if(n(killer,DP.kills)>=50)addTitle(killer,"Monster Hunter");if(n(killer,DP.bossKills)>=5)addTitle(killer,"Boss Slayer");if(list(killer,DP.skills).length>=25)addTitle(killer,"Skill Collector");if(id.includes("veldora"))addTitle(killer,"Storm Dragon Challenger");if(id.includes("charybdis"))addTitle(killer,"Abyss Conqueror");set(killer,DP.xp,n(killer,DP.xp)+(boss?500:otherworlder?120:25));set(killer,DP.ep,n(killer,DP.ep)+(boss?0:otherworlder?120:15));
 let level=n(killer,DP.level,1),xp=n(killer,DP.xp);while(xp>=level*100){xp-=level*100;level++;set(killer,DP.level,level);set(killer,DP.skillPoints,n(killer,DP.skillPoints)+1);set(killer,DP.maxMp,n(killer,DP.maxMp)+10);set(killer,DP.mp,Math.min(n(killer,DP.maxMp),n(killer,DP.mp)+10));say(killer,`§eLevel ${level}!§r +1 Skill Point and +10 max MP.`);}set(killer,DP.xp,xp);
}
function safeTag(e,t){try{return e.hasTag(t);}catch{return false;}}
function chestReward(ev){
 const p=ev.player,b=ev.block;if(!p||!b||!initPlayer(p))return;
 if(!["minecraft:chest","minecraft:trapped_chest","minecraft:barrel"].includes(b.typeId))return;
 const key=`${p.dimension.id}:${b.location.x}:${b.location.y}:${b.location.z}`;
 let seen=[];try{seen=JSON.parse(world.getDynamicProperty("ts26_chest_rewards")||"[]");}catch{}
 if(seen.includes(key))return;
 const c=b.getComponent("minecraft:inventory")?.container;if(!c)return;
 const roll=Math.random();let reward;
 if(roll<0.04)reward="tensura:battlewill_manual";
 else if(roll<0.16){const sid=DROP_SKILLS[Math.floor(Math.random()*DROP_SKILLS.length)];reward=`tensura:skill_book_${sid}`;}
 else if(roll<0.26)reward="tensura:magicule_crystal";
 else if(roll<0.32)reward="tensura:spirit_prayer";
 else if(roll<0.35)reward="tensura:unique_skill_reroll";
 else if(roll<0.37)reward="tensura:demon_possession_seal";
 else if(roll<0.40)reward="tensura:magicule_potion";
 else if(roll<0.43)reward="tensura:healing_potion";
 else if(roll<0.42)reward="tensura:spirit_potion";
 else return;
 const rem=c.addItem(new ItemStack(reward,1));if(!rem){seen.push(key);if(seen.length>400)seen=seen.slice(-250);world.setDynamicProperty("ts26_chest_rewards",JSON.stringify(seen));say(p,`§6Tensura treasure found: ${reward.replace("tensura:","").replaceAll("_"," ")}§r.`);}
}

// First entry: the world welcome and race carousel are guaranteed to run from the spawn event and a safe retry loop.
world.afterEvents.playerSpawn.subscribe(ev=>{
 const p=ev.player;if(!p)return;
 system.runTimeout(()=>{
  if(!p.isValid)return;
  if(!get(p,DP.raceChosen,false)){
   say(p,"§l§bWELCOME TO THE TENSURA WORLD§r\nYour reincarnation begins now. Choose your race to determine your starting attributes and racial abilities.");
   try{p.onScreenDisplay.setTitle("§bTENSURA",{fadeInDuration:5,stayDuration:50,fadeOutDuration:10});}catch{}
   showRaceSelection(p);
  } else {initPlayer(p);removeItemById(p,"tensura:reincarnation_compass");showHud(p);}
 },30);
});
try{world.beforeEvents.playerInteractWithEntity.subscribe(ev=>{
 const p=ev.player,e=ev.target;if(!p?.isValid||e?.typeId!=="minecraft:villager")return;
 let variant=-1;try{variant=e.getComponent("minecraft:variant")?.value??e.getComponent("minecraft:mark_variant")?.value??-1;}catch{}
 const isCartographer=variant===5||/cartographer/i.test(e.nameTag||"");if(!isCartographer)return;
 const c=inv(p);if(!c)return;let emeralds=0;for(let i=0;i<c.size;i++){const it=c.getItem(i);if(it?.typeId==="minecraft:emerald")emeralds+=it.amount;}
 if(emeralds<8)return;ev.cancel=true;system.run(()=>{if(!p.isValid)return;if(takeItems(p,"minecraft:emerald",8)){give(p,"tensura:landmark_compass");say(p,"§eCartographer trade complete: 8 emeralds exchanged for a Tensura Landmark Compass.§r");}});
 });}catch{}

world.afterEvents.itemUse.subscribe(itemUse);
const craftingMenuTick=new Map();
world.afterEvents.playerInteractWithBlock.subscribe(ev=>{try{const p=ev.player,b=ev.block;if(!p?.isValid||b?.typeId!=="tensura:hell_portal")return;const now=system.currentTick,last=Number(get(p,"ts27_gate_cooldown",0));if(now-last<40)return;set(p,"ts27_gate_cooldown",now);if(p.dimension.id==="tensura:hell"||p.dimension.id==="tensura:great_spirit_labyrinth"||p.dimension.id==="tensura:veldora_cave"||p.dimension.id==="tensura:charybdis_cave"){
   const from=p.dimension.id;if(from==="tensura:great_spirit_labyrinth")set(p,"ts26_spirit_escaped",true);if(from==="tensura:hell")set(p,"ts26_demon_escaped",true);
   const d=world.getDimension("minecraft:overworld"),sp=world.getDefaultSpawnLocation();p.teleport({x:sp.x+8.5,y:sp.y+2,z:sp.z+8.5},{dimension:d,keepVelocity:false});say(p,from==="tensura:great_spirit_labyrinth"?"You crossed the Spirit Portal into the Overworld. Find a vessel to possess.":"The Hell Gate returned you to the Overworld.");
  }else{const d=world.getDimension("tensura:hell");p.teleport({x:0.5,y:42,z:-38.5},{dimension:d,keepVelocity:false});say(p,"The Hell Gate carried you into the Underworld.");}}catch(e){try{ev.player?.sendMessage(`§cHell Gate error: ${String(e).slice(0,120)}`);}catch{}}});

world.afterEvents.entityDie.subscribe(ev=>{
 const source=ev.damageSource?.damagingEntity,dead=ev.deadEntity;
 let killer=source;
 // Resolve projectile ownership so bow, trident and other projectile kills award normal progression.
 try{if(killer&&killer.typeId!=="minecraft:player"){const projectile=killer.getComponent("minecraft:projectile");if(projectile?.owner?.typeId==="minecraft:player")killer=projectile.owner;}}catch{}
 if(dead?.typeId==="minecraft:player"){createDeathGrave(dead);if(n(dead,DP.demonRitual)>0){set(dead,DP.souls,0);set(dead,DP.demonRitual,0);say(dead,"§cThe Harvest Festival was interrupted by death. Your stored souls were lost.");}}
 if(!killer||killer.typeId!=="minecraft:player"||!initPlayer(killer))return;
 addLootForKill(killer,dead);
});
world.afterEvents.playerInteractWithBlock.subscribe(ev=>{try{chestReward(ev);}catch{}});
world.afterEvents.playerInteractWithEntity.subscribe(ev=>{try{cartographerTrade(ev);}catch{}});
world.afterEvents.entityHurt.subscribe(ev=>{
 const victim=ev.hurtEntity,attacker=ev.damageSource?.damagingEntity;
 if(victim?.isValid&&safeTag(victim,"tensura_boss")&&attacker?.typeId!=="minecraft:player"){
  try{const h=victim.getComponent("minecraft:health");if(h)h.setCurrentValue(Math.min(h.effectiveMax,h.currentValue+Number(ev.damage||0)));}catch{}
  return;
 }
 if(attacker?.typeId==="minecraft:player"&&victim?.isValid){try{const h=victim.getComponent("minecraft:health");if(h){const cur=Math.ceil(h.currentValue),max=Math.ceil(h.effectiveMax);attacker.onScreenDisplay.setActionBar(`§c${victim.nameTag||victim.typeId} ${cur}/${max} HP§r\n${statsText(attacker)}`);}}catch{}}
 if(victim?.typeId==="minecraft:player"&&n(victim,DP.reflector)>system.currentTick&&attacker?.isValid){try{attacker.applyDamage(Math.max(1,Math.floor(ev.damage*0.65)),{cause:EntityDamageCause.magic,damagingEntity:victim});}catch{}}
});

// Persistent HUD, SP regeneration, MP costs, ritual completion and race-menu recovery.
system.runInterval(()=>{
 for(const p of world.getPlayers()){
  if(!get(p,DP.raceChosen,false)){if(!raceFormsOpen.has(p.id))showRaceSelection(p);continue;}
  initPlayer(p);
  const magicules=n(p,DP.mp);
  if(magicules>0){if(n(p,"ts26_mp_zero_since",-1)>=0){set(p,"ts26_mp_zero_since",-1);p.removeEffect("slowness");p.removeEffect("blindness");p.removeEffect("weakness");say(p,"§bMagicules restored. The depletion stun has ended.§r");}}
  else {
   let zeroSince=n(p,"ts26_mp_zero_since",-1);
   if(zeroSince<0){zeroSince=system.currentTick;set(p,"ts26_mp_zero_since",zeroSince);say(p,"§cMAGICULES DEPLETED!§r You are stunned for 30 seconds. Restore magicules or your life will be lost.");}
   const elapsed=system.currentTick-Number(zeroSince);
   if(elapsed<600){try{p.addEffect("slowness",Math.min(40,600-elapsed),{amplifier:10,showParticles:true});p.addEffect("blindness",Math.min(40,600-elapsed),{amplifier:0,showParticles:false});p.addEffect("weakness",Math.min(40,600-elapsed),{amplifier:4,showParticles:false});}catch{}}
   else {set(p,"ts26_mp_zero_since",-1);try{const health=p.getComponent("minecraft:health");if(health)health.setCurrentValue(0);else p.applyDamage(100000,{cause:EntityDamageCause.magic});}catch{try{p.applyDamage(100000,{cause:EntityDamageCause.magic});}catch{}}say(p,"§4Your magicules remained depleted for 30 seconds. Your spiritual body collapsed.§r");}
  }
  if(system.currentTick%20===0){try{const ownerTag=`tensura_owner_${p.id.replace(/[^a-zA-Z0-9_]/g,"_")}`;const owned=p.dimension.getEntities({location:p.location,maxDistance:96}).filter(e=>e.isValid&&safeTag(e,"tensura_companion")&&safeTag(e,ownerTag));for(const pet of owned){const d=dist(p.location,pet.location);if(d>12){const rot=p.getRotation(),yaw=rot.y*Math.PI/180;const pos={x:p.location.x-Math.sin(yaw)*2,y:p.location.y,z:p.location.z+Math.cos(yaw)*2};try{pet.teleport(pos,{dimension:p.dimension,keepVelocity:false});}catch{}}}const allies=p.dimension.getEntities({location:p.location,maxDistance:24}).filter(e=>e.isValid&&safeTag(e,"tensura_companion"));for(const ally of allies){if(n(ally,"ts26_companion_attack_tick",0)>system.currentTick)continue;const candidates=ally.dimension.getEntities({location:ally.location,maxDistance:10}).filter(e=>e.isValid&&e.id!==ally.id&&e.typeId!=="minecraft:player"&&e.typeId!=="minecraft:item"&&e.typeId!=="minecraft:xp_orb"&&!safeTag(e,"tensura_companion")&&!safeTag(e,"tensura_vessel")&&!safeTag(e,"tensura_boss")&&(e.typeId.startsWith("tensura:")||/minecraft:(zombie|skeleton|creeper|spider|witch|pillager|vindicator|ravager|guardian|drowned|husk|stray|phantom|slime|magma_cube|enderman|blaze|ghast|wither_skeleton|warden|silverfish|endermite)/.test(e.typeId)));const target=candidates.sort((a,b)=>dist(ally.location,a.location)-dist(ally.location,b.location))[0];if(target){try{target.applyDamage(22,{cause:EntityDamageCause.entityAttack,damagingEntity:ally});}catch{try{target.applyDamage(22);}catch{}}set(ally,"ts26_companion_attack_tick",system.currentTick+20);}}}catch{}}
  if(system.currentTick%20===0)applyRaceBody(p);
  if(system.currentTick%200===0){
   try{
    if(p.dimension.id==="tensura:hell"){
     const nearby=p.dimension.getEntities({location:p.location,maxDistance:48}).filter(e=>["tensura:greater_daemon","tensura:lesser_daemon","tensura:hell_moth","tensura:hell_caterpillar"].includes(e.typeId));
     if(nearby.length<8){const pool=["tensura:greater_daemon","tensura:lesser_daemon","tensura:hell_moth","tensura:hell_caterpillar"];const id=pool[Math.floor(Math.random()*pool.length)],a=Math.random()*Math.PI*2,r=12+Math.random()*20;try{const sx=Math.floor(p.location.x+Math.cos(a)*r),sz=Math.floor(p.location.z+Math.sin(a)*r),sy=findSurfaceY(p.dimension,sx,sz);p.dimension.spawnEntity(id,{x:sx+0.5,y:sy+0.2,z:sz+0.5});}catch{}}
    }else if(p.dimension.id==="tensura:great_spirit_labyrinth"){
     const nearby=p.dimension.getEntities({location:p.location,maxDistance:48}).filter(e=>e.typeId.startsWith("tensura:spirit_"));
     if(nearby.length<10){const pool=["tensura:spirit_light","tensura:spirit_darkness","tensura:spirit_fire","tensura:spirit_water","tensura:spirit_wind","tensura:spirit_earth","tensura:spirit_spatial","tensura:spirit_gravity"];const id=pool[Math.floor(Math.random()*pool.length)],a=Math.random()*Math.PI*2,r=10+Math.random()*22;try{p.dimension.spawnEntity(id,{x:p.location.x+Math.cos(a)*r,y:249,z:p.location.z+Math.sin(a)*r});}catch{}}
    }
   }catch{}
  }
  set(p,"ts26_max_ep",Math.max(1,Math.floor(n(p,DP.maxMp)+n(p,DP.maxAp)+n(p,DP.maxSp))));
  set(p,DP.ep,Math.max(0,Math.floor(n(p,DP.mp)+n(p,DP.ap)+n(p,DP.sp))));
  const pending=get(p,"ts26_pending_landmark","");
  if(pending&&p.dimension.id==="minecraft:overworld"){
   const sp=world.getDefaultSpawnLocation();const coords=pending==="hell_gate"?[sp.x+120,sp.z+120]:({veldora:[1500,1500],labyrinth:[2200,2200],tree:[1000,1000],demon:[3000,3000],spirit:[4000,4000],charybdis:[5000,5000],dwarf:[6000,6000]}[pending]);
   if(coords&&Math.hypot(p.location.x-coords[0],p.location.z-coords[1])<90){set(p,"ts26_pending_landmark","");if(pending==="hell_gate")say(p,"You found the Java-derived Hell Gate. Interact with the glowing portal blocks to enter the Underworld.");else if(pending==="veldora")enterCustomRealm(p,"tensura:veldora_cave","Veldora’s Cave",2);else if(pending==="labyrinth")travelSpiritLabyrinth(p);else if(pending==="tree")buildWorldTreeSite(p);else if(pending==="demon")buildDemonRealmSite(p);else if(pending==="spirit")buildSpiritSanctuarySite(p);else if(pending==="charybdis")enterCustomRealm(p,"tensura:charybdis_cave","Charybdis Cave",1);else if(pending==="dwarf")buildStructureLandmark(p,"tensura:dwarf_village/complete",6000,6000,"Dwarven Village",0);}
  }
  if(system.currentTick%40===0&&n(p,DP.sp)<n(p,DP.maxSp)&&n(p,DP.mp)>=1){set(p,DP.sp,n(p,DP.sp)+1);set(p,DP.mp,n(p,DP.mp)-1);}
  if(system.currentTick%100===0&&n(p,DP.mp)<n(p,DP.maxMp)&&n(p,"ts26_mp_zero_since",-1)<0){set(p,DP.mp,n(p,DP.mp)+1);}
  if(String(get(p,DP.baseRace,""))==="slime"){
   const lv=n(p,DP.level,1), milestones=[[5,"water_blade"],[10,"magic_sense"],[15,"universal_perception"],[20,"thought_acceleration"],[25,"gluttony"],[30,"degenerate"],[35,"raphael"],[40,"black_flame"],[45,"spatial_motion"],[50,"beelzebuth"],[55,"multilayer_barrier"],[60,"ciel"],[65,"uriel"],[70,"azathoth"],[80,"shub_niggurath"]];
   for(const [req,skill] of milestones){const flag=`ts26_slime_milestone_${skill}`;if(lv>=req&&!get(p,flag,false)){let acquired=false;if(skill==="raphael"&&hasSkill(p,"great_sage"))acquired=evolveSkill(p,"great_sage","raphael");else if(skill==="beelzebuth"&&hasSkill(p,"gluttony"))acquired=evolveSkill(p,"gluttony","beelzebuth");else if(skill==="ciel"&&hasSkill(p,"raphael"))acquired=evolveSkill(p,"raphael","ciel");else acquired=addSkill(p,skill);if(acquired){set(p,flag,true);say(p,`§bSlime evolution milestone reached: ${skillName(skill)} acquired.§r`);}}}
  }
  if(system.currentTick%20===0){
   try{const eq=p.getComponent("minecraft:equippable");if(eq){let gearEP=0;for(const slot of [EquipmentSlot.Head,EquipmentSlot.Chest,EquipmentSlot.Legs,EquipmentSlot.Feet,EquipmentSlot.Mainhand,EquipmentSlot.Offhand]){const it=eq.getEquipment(slot);if(it?.typeId?.startsWith("tensura:")){gearEP+=Number(it.getDynamicProperty("ts26_equipment_ep")||0);}}if(gearEP>=50000)effect(p,"resistance",30,2);else if(gearEP>=25000)effect(p,"resistance",30,1);else if(gearEP>=10000)effect(p,"resistance",30,0);}}catch{}
   // EP is derived from the three combat pools; the display and progression use the same value.
   set(p,"ts26_max_ep",Math.max(1,Math.floor(n(p,DP.maxMp)+n(p,DP.maxAp)+n(p,DP.maxSp))));
   set(p,DP.ep,Math.floor(n(p,DP.mp)+n(p,DP.ap)+n(p,DP.sp)));
   const equipped=list(p,DP.skills).filter(x=>PASSIVE_SKILLS.has(x));
   const title=get(p,"ts26_active_title","");if(title==="Monster Hunter"||title==="Boss Slayer")effect(p,"strength",30,0);if(title==="Storm Dragon Challenger")effect(p,"fire_resistance",30,0);if(title==="Abyss Conqueror")effect(p,"water_breathing",30,0);if(title==="Skill Collector")set(p,DP.mp,Math.min(n(p,DP.maxMp),n(p,DP.mp)+1));
   if(equipped.includes("great_sage")){set(p,DP.mp,Math.min(n(p,DP.maxMp),n(p,DP.mp)+2));set(p,DP.skillPoints,Math.max(0,n(p,DP.skillPoints)));}
   if(equipped.includes("ultraspeed_regeneration")){try{const h=p.getComponent("minecraft:health");if(h&&h.currentValue<h.effectiveMax)p.addEffect("regeneration",30,{amplifier:0,showParticles:false});}catch{}}
   if(equipped.includes("guardian"))effect(p,"resistance",30,0);
   if(equipped.includes("agility"))effect(p,"speed",30,0);
   if(equipped.includes("steel_strength"))effect(p,"strength",30,0);
   if(equipped.includes("universal_perception"))effect(p,"night_vision",240,0);
   if(equipped.includes("survivor")){if(n(p,DP.hp)<10)effect(p,"resistance",30,1);}
   if(equipped.some(x=>x.includes("poison_resistance")||x.includes("abnormal_condition_resistance")||x.includes("poison_nullification")||x.includes("abnormal_condition_nullification"))){p.removeEffect("poison");p.removeEffect("nausea");}
   if(equipped.some(x=>x.endsWith("_resistance")))effect(p,"resistance",30,0);
   if(equipped.some(x=>x.endsWith("_nullification")))effect(p,"resistance",30,2);
   if(equipped.includes("flame_attack_resistance")||equipped.includes("flame_attack_nullification")||equipped.includes("heat_nullification"))effect(p,"fire_resistance",30,0);
   if(equipped.includes("paralysis_resistance")||equipped.includes("paralysis_nullification"))p.removeEffect("slowness");
   if(equipped.includes("cold_resistance"))effect(p,"fire_resistance",30,0);
   if(equipped.includes("physical_attack_nullification"))effect(p,"resistance",30,2);else if(equipped.includes("physical_attack_resistance"))effect(p,"resistance",30,0);
   if(equipped.includes("water_breathing"))effect(p,"water_breathing",40,0);
   if(equipped.includes("infinite_regeneration"))effect(p,"regeneration",40,2);
   if(equipped.includes("self_regeneration"))effect(p,"regeneration",40,0);
   if(equipped.includes("body_armor"))effect(p,"resistance",30,0);
   if(equipped.includes("magic_sense")||equipped.includes("dragon_eye")||equipped.includes("farsight"))effect(p,"night_vision",40,0);
   if(equipped.includes("dragon_skin"))effect(p,"resistance",30,1);
   if(equipped.includes("dragon_ear")||equipped.includes("danger_sense"))effect(p,"speed",30,0);
   if(equipped.includes("hero_haki")||equipped.includes("demon_lord_haki")||equipped.includes("sacred_haki")||equipped.includes("haki"))effect(p,"strength",30,0);
   if(equipped.includes("water_breathing"))effect(p,"water_breathing",40,0);
   if(equipped.includes("cold_nullification")||equipped.includes("cold_resistance"))effect(p,"fire_resistance",30,0);
   if(equipped.includes("fire_resistance")||equipped.includes("flame_attack_nullification"))effect(p,"fire_resistance",30,0);
   if(equipped.includes("poison_nullification")||equipped.includes("poison_resistance")){p.removeEffect("poison");p.removeEffect("wither");}
   if(equipped.includes("paralysis_nullification")||equipped.includes("paralysis_resistance")){p.removeEffect("slowness");p.removeEffect("mining_fatigue");}
   if(equipped.includes("mental_resistance"))effect(p,"resistance",30,0);
   if(equipped.includes("spatial_attack_nullification")||equipped.includes("spiritual_attack_nullification")||equipped.includes("magic_nullification"))effect(p,"resistance",30,2);
  }
  if(get(p,DP.baseRace,get(p,DP.race,""))==="elf"&&p.dimension.id==="minecraft:overworld"&&!get(p,DP.named,false)&&!get(p,"ts26_physical_body",false)){
   let remaining=n(p,DP.spiritBodyTime,12000);remaining=Math.max(0,remaining-20);set(p,DP.spiritBodyTime,remaining);
   if(remaining===1200)say(p,"§cWarning: your spirit body has one minute remaining in the Overworld. Secure a vessel or a naming bond.");
   if(remaining===0){try{p.applyDamage(4,{cause:EntityDamageCause.magic});}catch{}say(p,"§cYour unanchored spirit body is collapsing in the Overworld.");}
  }else if(p.dimension.id!=="minecraft:overworld"||get(p,DP.named,false)||get(p,"ts26_physical_body",false)){set(p,DP.spiritBodyTime,12000);}
  if(system.currentTick%20===0){showHud(p);try{const target=getTarget(p,18);if(target){const h=target.getComponent("minecraft:health");if(h&&safeTag(target,"tensura_boss")){p.onScreenDisplay.setTitle(`§4${target.nameTag||target.typeId}  §c${Math.ceil(h.currentValue)}/${Math.ceil(h.effectiveMax)} HP`,{fadeInDuration:0,stayDuration:22,fadeOutDuration:0});}}}catch{}}
  if(system.currentTick%6000===0){const c=inv(p);if(c){for(let i=0;i<c.size;i++){const it=c.getItem(i);if(!it||!it.typeId.startsWith("tensura:"))continue;try{const dur=it.getComponent("minecraft:durability");if(dur&&dur.damage>0){dur.damage=Math.max(0,dur.damage-1);}
    if(it.typeId.includes("helmet")||it.typeId.includes("chestplate")||it.typeId.includes("leggings")||it.typeId.includes("boots")||it.typeId.includes("sword")||it.typeId.includes("katana")||it.typeId.includes("spear")){try{const old=Number(it.getDynamicProperty("ts26_equipment_ep")||0),ep=old+250;it.setDynamicProperty("ts26_equipment_ep",ep);const grade=ep>=100000?"S":ep>=50000?"A":ep>=25000?"B":ep>=10000?"C":"D";it.setLore([`§6Grade ${grade} §7• Equipment EP ${ep}`,"§aSelf-repair: active","§8Gains EP through continued use"]);}catch{}}
    c.setItem(i,it);}catch{}}}}
  if(n(p,DP.demonRitual)>0){const remain=Math.max(0,n(p,DP.demonRitual)-20);set(p,DP.demonRitual,remain);if(remain===0){p.removeEffect("slowness");p.removeEffect("blindness");p.removeEffect("darkness");set(p,DP.race,"majin");set(p,DP.hp,Math.max(80,Math.ceil(n(p,DP.hp,20)*1.4)));set(p,DP.maxMp,n(p,DP.maxMp)+500);set(p,DP.mp,n(p,DP.maxMp));set(p,DP.maxAp,n(p,DP.maxAp)+400);set(p,DP.ap,n(p,DP.maxAp));set(p,DP.maxSp,n(p,DP.maxSp)+400);set(p,DP.sp,n(p,DP.maxSp));set(p,DP.ep,n(p,DP.mp)+n(p,DP.ap)+n(p,DP.sp));applyRaceBody(p);try{const h=p.getComponent("minecraft:health");if(h)h.setCurrentValue(h.effectiveMax);}catch{}addSkill(p,"gluttony");addSkill(p,"multilayer_barrier");say(p,"§5DEMON LORD AWAKENING COMPLETE!§r Your race has awakened into a Majin.");try{p.dimension.playSound("random.levelup",p.location);}catch{}}}
  if(get(p,DP.race,"human")==="slime"&&system.currentTick%100===0)effect(p,"regeneration",80,0);
 }
},20);

// No chat command listeners or command-based gameplay are registered in this add-on.
