import { type Entity, type RawMessage, world } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';

import { formatRaw, makeRawMessage, obfuscate } from 'nacht_server_BP/src/utils/StringUtils';

import { Formatting, TAG_ITEM } from '../../const';
import { NachtServerAddonItemTypes } from '../../enums';
import { Logger } from '../../utils/logger';

/**
 * エンティティが鉱石ティアタグを付与されているかどうか判定する
 *
 * @param entity エンティティ
 * @param metal 鉱石種名
 * @returns
 */
const hasTierTag = (entity: Entity, metal: string) => entity.hasTag(TAG_ITEM + metal + '_tier');

/**
 *
 * @param description 概要
 * @param howToGet 入手方法
 * @param damage ダメージ
 * @param protection 防御力
 * @param durability 耐久力
 * @param speed 採掘速度
 * @returns
 */
const makeMetalDesc = (
  description: RawMessage | string,
  howToGet: RawMessage | string,
  damage: RawMessage | string,
  protection: RawMessage | string,
  durability: RawMessage | string,
  speed?: RawMessage | string
) =>
  makeRawMessage(
    description,
    '\n',
    formatRaw(Formatting.Bold, '入手方法'),
    '\n',
    howToGet,
    '\n',
    formatRaw(Formatting.Bold, 'ダメージ'),
    '\n',
    damage,
    '\n',
    formatRaw(Formatting.Bold, '防御力'),
    '\n',
    protection,
    '\n',
    formatRaw(Formatting.Bold, '耐久力'),
    '\n',
    durability,
    ...(speed ? ['\n', formatRaw(Formatting.Bold, '採掘速度'), '\n', speed] : [])
  );

export default () =>
  world.afterEvents.itemUse.subscribe((event) => {
    try {
      if (event.itemStack.typeId === NachtServerAddonItemTypes.GuideBookOres) {
        const hasSilverTier = hasTierTag(event.source, 'silver');
        const hasHolySilverTier = hasTierTag(event.source, 'holy_silver');
        const hasBlazeredSteelTier = hasTierTag(event.source, 'blazered_steel');
        const hasHollowCrystalTier = hasTierTag(event.source, 'hollow_crystal');
        const hasNocturiumTier = hasTierTag(event.source, 'nocturium');
        const hasLuminariumTier = hasTierTag(event.source, 'luminarium');
        const hasTerramagniteTier = hasTierTag(event.source, 'terramagnite');
        const hasElectrumTier = hasTierTag(event.source, 'electrum');
        const hasMagnosTier = hasTierTag(event.source, 'magnos');
        const hasAedriumTier = hasTierTag(event.source, 'aedrium');
        const hasScarletOrichalcumTier = hasTierTag(event.source, 'scarlet_orichalcum');
        const hasStarIronTier = hasTierTag(event.source, 'star_iron');
        const hasOrichalcumTier = hasTierTag(event.source, 'orichalcum');
        const hasMagradisTier = hasTierTag(event.source, 'magradis');
        const hasNexiatiteTier = hasTierTag(event.source, 'nexiatite');
        const hasSolistiteTier = hasTierTag(event.source, 'solistite');
        const hasAdamantiumTier = hasTierTag(event.source, 'adamantium');
        const VARS = {
          HolyWater: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.HolyWater)
            ? { translate: 'item.nacht:holy_water.name' }
            : obfuscate('HolyWater'),
          Aether: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.Aether)
            ? { translate: 'item.nacht:aether.name' }
            : obfuscate('Aether'),
          CondensedAether: event.source.hasComponent(TAG_ITEM + NachtServerAddonItemTypes.CondensedAether)
            ? { translate: 'item.nacht:condensed_aether.name' }
            : obfuscate('CondensedAether'),
          PoorElixir: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.PoorElixir)
            ? { translate: 'item.nacht:poor_elixir.name' }
            : obfuscate('PoorElixir'),
          Elixir: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.Elixir)
            ? { translate: 'item.nacht:elixir.name' }
            : obfuscate('Elixir'),
          UnrefinedLapisPhilosophorum: event.source.hasTag(
            TAG_ITEM + NachtServerAddonItemTypes.UnrefinedLapisPhilosophorum
          )
            ? { translate: 'item.nacht:unrefined_lapis_philosophorum.name' }
            : obfuscate('UnrefinedLapisPhilosophorum'),
          LapisPhilosophorum: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.LapisPhilosophorum)
            ? { translate: 'item.nacht:lapis_philosophorum.name' }
            : obfuscate('LapisPhilosophorum'),
          InvertiaCore: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.InvertiaCore)
            ? { translate: 'item.nacht:invertia_core.name' }
            : `${Formatting.Obfuscated}InvertiaCore${Formatting.Reset}`,
          AntiWitherCore: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.AntiWitherCore)
            ? { translate: 'item.nacht:anti_wither_core.name' }
            : `${Formatting.Obfuscated}AntiWitherCore${Formatting.Reset}`,
          AntiEnderCore: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.AntiEnderCore)
            ? { translate: 'item.nacht:anti_ender_core.name' }
            : `${Formatting.Obfuscated}AntiEnderCore${Formatting.Reset}`,
          Stella: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.Stellavita)
            ? { translate: 'word.stella' }
            : `${Formatting.Obfuscated}Stella${Formatting.Reset}`,
          Stellavita: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.Stellavita)
            ? { translate: 'item.nacht:stellavita.name' }
            : `${Formatting.Obfuscated}Stellavita${Formatting.Reset}`,
          StellavitaRing: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.Stellavita)
            ? { translate: 'item.nacht:stellavita_ring.name' }
            : `${Formatting.Obfuscated}StellavitaRing${Formatting.Reset}`,
          Alchemist: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.UnrefinedLapisPhilosophorum)
            ? { translate: 'word.alchemist' }
            : `${Formatting.Obfuscated}Alchemist${Formatting.Reset}`,
          Invertia: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.InvertiaCore)
            ? { translate: 'word.invertia' }
            : `${Formatting.Obfuscated}Invertia${Formatting.Reset}`,
          Silver: hasSilverTier ? formatRaw(Formatting.Color.WHITE, { translate: 'word.silver' }) : obfuscate('Silver'),
          HolySilver: hasHolySilverTier
            ? formatRaw(Formatting.Color.WHITE, { translate: 'word.holy_silver' })
            : obfuscate('HolySilver'),
          BlazeredSteel: hasBlazeredSteelTier
            ? formatRaw(Formatting.Color.RED, { translate: 'word.blazered_steel' })
            : obfuscate('BlazeredSteel'),
          HollowCrystal: hasHollowCrystalTier
            ? formatRaw(Formatting.Color.DARK_BLUE, { translate: 'word.hollow_crystal' })
            : obfuscate('HollowCrystal'),
          Nocturium: hasNocturiumTier
            ? formatRaw(Formatting.Color.LIGHT_PURPLE, { translate: 'word.nocturium' })
            : obfuscate('Nocturium'),
          Luminarium: hasLuminariumTier
            ? formatRaw(Formatting.Color.MATERIAL_GOLD, { translate: 'word.luminarium' })
            : obfuscate('Luminarium'),
          Terramagnite: hasTerramagniteTier
            ? formatRaw(Formatting.Color.MATERIAL_COPPER, { translate: 'word.terramagnite' })
            : obfuscate('Terramagnite'),
          Electrum: hasElectrumTier
            ? formatRaw(Formatting.Color.YELLOW, { translate: 'word.electrum' })
            : obfuscate('Electrum'),
          Magnos: hasMagnosTier
            ? formatRaw(Formatting.Color.MATERIAL_REDSTONE, { translate: 'word.magnos' })
            : obfuscate('Magnos'),
          Aedrium: hasAedriumTier
            ? formatRaw(Formatting.Color.BLUE, { translate: 'word.aedrium' })
            : obfuscate('Aedrium'),
          ScarletOrichalcum: hasScarletOrichalcumTier
            ? formatRaw(Formatting.Color.MINECOIN_GOLD, { translate: 'word.scarlet_orichalcum' })
            : obfuscate('ScarletOrichalcum'),
          StarIron: hasStarIronTier
            ? formatRaw(Formatting.Color.AQUA, { translate: 'word.star_iron' })
            : obfuscate('StarIron'),
          Orichalcum: hasOrichalcumTier
            ? formatRaw(Formatting.Color.GOLD, { translate: 'word.orichalcum' })
            : obfuscate('Orichalcum'),
          Magradis: hasMagradisTier
            ? formatRaw(Formatting.Color.DARK_RED, { translate: 'word.magradis' })
            : obfuscate('Magradis'),
          Nexiatite: hasNexiatiteTier
            ? formatRaw(Formatting.Color.DARK_GREEN, { translate: 'word.nexiatite' })
            : obfuscate('Nexiatite'),
          Solistite: hasSolistiteTier
            ? formatRaw(Formatting.Color.GREEN, { translate: 'word.solistite' })
            : obfuscate('Solistite'),
          Adamantium: hasAdamantiumTier
            ? formatRaw(Formatting.Color.DARK_PURPLE, { translate: 'word.adamantium' })
            : obfuscate('Adamantium'),
          _: event.source.hasTag(TAG_ITEM + '') ? '' : obfuscate(''),
        } as const satisfies Record<string, string | RawMessage>;

        const form = new ActionFormData();
        form.title('追加鉱石ガイドブック');
        form.body(
          'ワールドに新しい鉱物が16種追加されました。それに伴って武具やツールも追加されました。\n※バージョン1.1.2現在、プレリリース機能となります。ガイドの通りの機能が働かない場合があります。デザインも仮のものです。気力があれば更新します。'
        );
        form.divider();
        form.button(VARS.Silver, 'textures/items/metal/silver/silver_ingot');
        form.button(VARS.BlazeredSteel, 'textures/items/metal/blazered_steel/blazered_steel');
        form.button(VARS.HollowCrystal, 'textures/items/metal/hollow_crystal/hollow_crystal');
        form.button(VARS.Nocturium, 'textures/items/metal/nocturium/nocturium_ingot');
        form.button(VARS.Luminarium, 'textures/items/metal/luminarium/luminarium_ingot');
        form.button(VARS.Terramagnite, 'textures/items/metal/terramagnite/terramagnite_ingot');
        form.button(VARS.Electrum, 'textures/items/metal/electrum/electrum_ingot');
        form.button(VARS.Magnos, 'textures/items/metal/magnos/magnos_ingot');
        form.button(VARS.Aedrium, 'textures/items/metal/aedrium/aedrium_ingot');
        form.button(VARS.ScarletOrichalcum, 'textures/items/metal/scarlet_orichalcum/scarlet_orichalcum_ingot');
        form.button(VARS.StarIron, 'textures/items/metal/star_iron/star_iron_ingot');
        form.button(VARS.Orichalcum, 'textures/items/metal/orichalcum/orichalcum_ingot');
        form.button(VARS.Magradis, 'textures/items/metal/magradis/magradis_ingot');
        form.button(VARS.Nexiatite, 'textures/items/metal/nexiatite/nexiatite_ingot');
        form.button(VARS.Solistite, 'textures/items/metal/solistite/solistite_ingot');
        form.button(VARS.Adamantium, 'textures/items/metal/adamantium/adamantium_ingot');
        form.button('その他の情報');
        form.show(event.source as any).then((response) => {
          if (response.canceled) {
            Logger.log(`[${event.source.nameTag}] canceled: ${response.cancelationReason}`);
            return;
          }
          const form2 = new ActionFormData();
          form2.title('追加鉱石ガイドブック');
          switch (response.selection) {
            case 0:
              form2.header(VARS.Silver);
              form2.label(
                makeMetalDesc(
                  '至って普遍的な金属だが、その聖性を高めることによって新たな鉱石探求の旅の起点となるだろう。',
                  makeRawMessage(
                    '自然産出する',
                    { translate: 'tile.nacht:silver_ore.name' },
                    '、',
                    { translate: 'tile.nacht:deepslate_silver_ore.name' },
                    'から採取した原石を精錬することでインゴットを精錬できる。鉱石は鉄以上のツールで採掘可能。'
                  ),
                  'ダイヤモンドと同等。',
                  'ダイヤモンドと同等。',
                  '非常にやわらかく、金と同等。',
                  'ダイヤモンドツールと同等。'
                )
              );
              form2.label('装備一覧 (ボタンを押すと閉じます)');
              form2.button({ translate: 'item.nacht:silver_knife.name' }, 'textures/items/tools/silver/silver_knife');
              form2.button(
                { translate: 'item.nacht:silver_pickaxe.name' },
                'textures/items/tools/silver/silver_pickaxe'
              );
              form2.button({ translate: 'item.nacht:silver_boots.name' }, 'textures/items/armor/silver/silver_boots');
              form2.button(
                { translate: 'item.nacht:silver_chestplate.name' },
                'textures/items/armor/silver/silver_chestplate'
              );
              form2.button({ translate: 'item.nacht:silver_helmet.name' }, 'textures/items/armor/silver/silver_helmet');
              form2.button(
                { translate: 'item.nacht:silver_leggings.name' },
                'textures/items/armor/silver/silver_leggings'
              );
              form2.divider();
              form2.header(VARS.HolySilver);
              form2.label(
                makeRawMessage(
                  VARS.Silver,
                  'を',
                  VARS.HolyWater,
                  'で清めることにより、鉄の倍近くの耐久力とネザライト以上の力を引き出すことに成功した。特にアンデッド系に絶大な力を発揮する。'
                )
              );
              form2.label(
                makeMetalDesc(
                  '天使の力を宿すことで、唯一の欠点だった耐久性が強化された。アンデッド系に絶大な力を発揮するようになったほかにも様々な力を得た。',
                  makeRawMessage(
                    '鉱石としては存在しないが、',
                    VARS.Silver,
                    '製の武具やツールを',
                    VARS.HolyWater,
                    'で清めることにより製造される。'
                  ),
                  'ネザライト以上。',
                  'ネザライト以上。',
                  '鉄の倍程度。',
                  'ネザライト以上。'
                )
              );
              form2.label('装備一覧 (ボタンを押すと閉じます)');
              form2.button(
                { translate: 'item.nacht:holy_silver_knife.name' },
                'textures/items/tools/holy_silver/holy_silver_knife'
              );
              form2.button(
                { translate: 'item.nacht:holy_silver_pickaxe.name' },
                'textures/items/tools/holy_silver/holy_silver_pickaxe'
              );
              form2.button(
                { translate: 'item.nacht:holy_silver_boots.name' },
                'textures/items/armor/holy_silver/holy_silver_boots'
              );
              form2.button(
                { translate: 'item.nacht:holy_silver_chestplate.name' },
                'textures/items/armor/holy_silver/holy_silver_chestplate'
              );
              form2.button(
                { translate: 'item.nacht:holy_silver_helmet.name' },
                'textures/items/armor/holy_silver/holy_silver_helmet'
              );
              form2.button(
                { translate: 'item.nacht:holy_silver_leggings.name' },
                'textures/items/armor/holy_silver/holy_silver_leggings'
              );
              break;
            case 1:
              form2.header(VARS.BlazeredSteel);
              form2.label(
                makeMetalDesc(
                  'ネザーに満ちるエネルギーを吸収して特別な力を宿した鉱物。ネザーに滞在している時間が長いほど強力になるが、一度異なるディメンションに移動するとエネルギーが発散してしまう。',
                  makeRawMessage(
                    'ネザーで自然産出される',
                    { translate: 'tile.nacht:blazered_steel_stone.name' },
                    'から採取したかけらを凝縮することでインゴットを精製できる。鋼石は',
                    VARS.Silver,
                    '以上のツールでのみ採掘することができる。'
                  ),
                  '鉄と同等。',
                  '鉄と同等。',
                  '鉄と同等。'
                )
              );
              form2.label('装備一覧 (ボタンを押すと閉じます)');
              form2.button(
                { translate: 'item.nacht:blazered_steel_sword.name' },
                'textures/items/tools/blazered_steel/blazered_steel_sword'
              );
              form2.button(
                { translate: 'item.nacht:blazered_steel_boots.name' },
                'textures/items/armor/blazered_steel/blazered_steel_boots'
              );
              form2.button(
                { translate: 'item.nacht:blazered_steel_chestplate.name' },
                'textures/items/armor/blazered_steel/blazered_steel_chestplate'
              );
              form2.button(
                { translate: 'item.nacht:blazered_steel_helmet.name' },
                'textures/items/armor/blazered_steel/blazered_steel_helmet'
              );
              form2.button(
                { translate: 'item.nacht:blazered_steel_leggings.name' },
                'textures/items/armor/blazered_steel/blazered_steel_leggings'
              );
              break;
            case 2:
              form2.header(VARS.HollowCrystal);
              form2.label(
                makeMetalDesc(
                  'エンドに満ちるエネルギーを吸収して特別な力を宿した鉱物。エンドに滞在している時間が長いほど強力になるが、一度異なるディメンションに移動するとエネルギーが発散してしまう。',
                  makeRawMessage(
                    'エンドで自然産出される',
                    { translate: 'tile.nacht:hollow_crystal_stone.name' },
                    'から採取したかけらを凝縮することでインゴットを精製できる。晶石は',
                    VARS.Silver,
                    '以上のツールでのみ採掘することができる。'
                  ),
                  '鉄と同等。',
                  '鉄と同等。',
                  '鉄と同等。'
                )
              );
              form2.label('装備一覧 (ボタンを押すと閉じます)');
              form2.button(
                { translate: 'item.nacht:hollow_crystal_sword.name' },
                'textures/items/tools/hollow_crystal/hollow_crystal_sword'
              );
              form2.button(
                { translate: 'item.nacht:hollow_crystal_boots.name' },
                'textures/items/armor/hollow_crystal/hollow_crystal_boots'
              );
              form2.button(
                { translate: 'item.nacht:hollow_crystal_chestplate.name' },
                'textures/items/armor/hollow_crystal/hollow_crystal_chestplate'
              );
              form2.button(
                { translate: 'item.nacht:hollow_crystal_helmet.name' },
                'textures/items/armor/hollow_crystal/hollow_crystal_helmet'
              );
              form2.button(
                { translate: 'item.nacht:hollow_crystal_leggings.name' },
                'textures/items/armor/hollow_crystal/hollow_crystal_leggings'
              );
              break;
            case 3:
              form2.header(VARS.Nocturium);
              form2.label(
                makeMetalDesc(
                  '月のエネルギーを溜める性質を持った金属。月との距離が近くなる夜間は強大な力を発揮する。',
                  makeRawMessage(
                    '自然産出される',
                    { translate: 'tile.nacht:nocturium_ore.name' },
                    '、',
                    { translate: 'tile.nacht:deepslate_nocturium_ore.name' },
                    'から採取した原石を精錬してインゴットを精錬できる。鉱石を採掘するためには',
                    VARS.HolySilver,
                    'がもつ霊力以上の力が必要。'
                  ),
                  'ダイヤモンドと同等。',
                  'ダイヤモンドと同等。',
                  'ダイヤモンドと同等。'
                )
              );
              form2.label('装備一覧 (ボタンを押すと閉じます)');
              form2.button(
                { translate: 'item.nacht:nocturium_sword.name' },
                'textures/items/tools/nocturium/nocturium_sword'
              );
              form2.button(
                { translate: 'item.nacht:nocturium_boots.name' },
                'textures/items/armor/nocturium/nocturium_boots'
              );
              form2.button(
                { translate: 'item.nacht:nocturium_chestplate.name' },
                'textures/items/armor/nocturium/nocturium_chestplate'
              );
              form2.button(
                { translate: 'item.nacht:nocturium_helmet.name' },
                'textures/items/armor/nocturium/nocturium_helmet'
              );
              form2.button(
                { translate: 'item.nacht:nocturium_leggings.name' },
                'textures/items/armor/nocturium/nocturium_leggings'
              );
              break;
            case 4:
              form2.header(VARS.Luminarium);
              form2.label(
                makeMetalDesc(
                  '太陽のエネルギーを溜める性質を持った金属。太陽との距離が近くなる昼間は強大な力を発揮する。',
                  makeRawMessage(
                    '自然産出される',
                    { translate: 'tile.nacht:luminarium_ore.name' },
                    '、',
                    { translate: 'tile.nacht:deepslate_luminarium_ore.name' },
                    'から採取した原石を精錬することでインゴットを精錬できる。鉱石を採掘するためには',
                    VARS.HolySilver,
                    'がもつ霊力以上の力が必要。'
                  ),
                  'ダイヤモンドと同等。',
                  'ダイヤモンドと同等。',
                  'ダイヤモンドと同等。'
                )
              );
              form2.label('装備一覧 (ボタンを押すと閉じます)');
              form2.button(
                { translate: 'item.nacht:luminarium_sword.name' },
                'textures/items/tools/luminarium/luminarium_sword'
              );
              form2.button(
                { translate: 'item.nacht:luminarium_boots.name' },
                'textures/items/armor/luminarium/luminarium_boots'
              );
              form2.button(
                { translate: 'item.nacht:luminarium_chestplate.name' },
                'textures/items/armor/luminarium/luminarium_chestplate'
              );
              form2.button(
                { translate: 'item.nacht:luminarium_helmet.name' },
                'textures/items/armor/luminarium/luminarium_helmet'
              );
              form2.button(
                { translate: 'item.nacht:luminarium_leggings.name' },
                'textures/items/armor/luminarium/luminarium_leggings'
              );
              break;
            case 5:
              form2.header(VARS.Terramagnite);
              form2.label(
                makeMetalDesc(
                  '星の核のかけらが長い年月をかけて凝縮した金属。星の核との距離が近くなる地底にいると強力になる。',
                  makeRawMessage(
                    '自然産出される',
                    { translate: 'tile.nacht:terramagnite_ore.name' },
                    '、',
                    { translate: 'tile.nacht:deepslate_terramagnite_ore.name' },
                    'から採取した原石を精錬することでインゴットを精錬できる。鉱石を採掘するためには',
                    VARS.HolySilver,
                    'がもつ霊力以上の力が必要。'
                  ),
                  'ダイヤモンドと同等。',
                  'ダイヤモンドと同等。',
                  'ダイヤモンドと同等。'
                )
              );
              form2.label('装備一覧 (ボタンを押すと閉じます)');
              form2.button(
                { translate: 'item.nacht:terramagnite_sword.name' },
                'textures/items/tools/terramagnite/terramagnite_sword'
              );
              form2.button(
                { translate: 'item.nacht:terramagnite_boots.name' },
                'textures/items/armor/terramagnite/terramagnite_boots'
              );
              form2.button(
                { translate: 'item.nacht:terramagnite_chestplate.name' },
                'textures/items/armor/terramagnite/terramagnite_chestplate'
              );
              form2.button(
                { translate: 'item.nacht:terramagnite_helmet.name' },
                'textures/items/armor/terramagnite/terramagnite_helmet'
              );
              form2.button(
                { translate: 'item.nacht:terramagnite_leggings.name' },
                'textures/items/armor/terramagnite/terramagnite_leggings'
              );
              break;
            case 6:
              form2.header(VARS.Electrum);
              form2.label(
                makeMetalDesc(
                  makeRawMessage('金と', VARS.Silver, 'の合金。エンチャントすることはできない。'),
                  makeRawMessage(
                    'インゴットは金と',
                    VARS.Silver,
                    'のインゴットからクラフト可能。自然産出された鉱石から採取した原石を精錬しても得られる。'
                  ),
                  makeRawMessage(
                    { translate: 'enchantment.damage.all' },
                    { translate: 'enchantment.level.5' },
                    'のエンチャントがついたネザライトと同等。'
                  ),
                  'ネザライトと同等以上。',
                  'ネザライト以上。',
                  makeRawMessage(
                    { translate: 'enchantment.digging' },
                    { translate: 'enchantment.level.5' },
                    'のエンチャントがついた金ツール以上。'
                  )
                )
              );
              form2.label('装備一覧 (ボタンを押すと閉じます)');
              form2.button(
                { translate: 'item.nacht:electrum_sword.name' },
                'textures/items/tools/electrum/electrum_sword'
              );
              form2.button({ translate: 'item.nacht:electrum_axe.name' }, 'textures/items/tools/electrum/electrum_axe');
              form2.button(
                { translate: 'item.nacht:electrum_pickaxe.name' },
                'textures/items/tools/electrum/electrum_pickaxe'
              );
              form2.button(
                { translate: 'item.nacht:electrum_shovel.name' },
                'textures/items/tools/electrum/electrum_shovel'
              );
              form2.button({ translate: 'item.nacht:electrum_hoe.name' }, 'textures/items/tools/electrum/electrum_hoe');
              form2.button(
                { translate: 'item.nacht:electrum_boots.name' },
                'textures/items/armor/electrum/electrum_boots'
              );
              form2.button(
                { translate: 'item.nacht:electrum_chestplate.name' },
                'textures/items/armor/electrum/electrum_chestplate'
              );
              form2.button(
                { translate: 'item.nacht:electrum_helmet.name' },
                'textures/items/armor/electrum/electrum_helmet'
              );
              form2.button(
                { translate: 'item.nacht:electrum_leggings.name' },
                'textures/items/armor/electrum/electrum_leggings'
              );
              break;
            case 7:
              form2.header(VARS.Magnos);
              form2.label(
                makeMetalDesc(
                  '別名炎心鉱とも呼ばれる、熱のエネルギーを秘めた金属。火山の神が爆発させた怒りの結晶。攻撃する際は熱による追加ダメージを与え、身にまとうと受けたダメージの一部を治癒力に変換する。',
                  makeRawMessage(
                    'ネザーにある',
                    { translate: 'tile.nacht:magnos_ore.name' },
                    'から採取した欠片を凝縮することでインゴットを精製できる。鉱石は',
                    VARS.Electrum,
                    '以上のツールでのみ採掘することができる。'
                  ),
                  'ネザライトと同等。',
                  'ネザライトと同等。',
                  'ネザライトと同等。'
                )
              );
              form2.label('装備一覧 (ボタンを押すと閉じます)');
              form2.button({ translate: 'item.nacht:magnos_sword.name' }, 'textures/items/tools/magnos/magnos_sword');
              form2.button({ translate: 'item.nacht:magnos_boots.name' }, 'textures/items/armor/magnos/magnos_boots');
              form2.button(
                { translate: 'item.nacht:magnos_chestplate.name' },
                'textures/items/armor/magnos/magnos_chestplate'
              );
              form2.button({ translate: 'item.nacht:magnos_helmet.name' }, 'textures/items/armor/magnos/magnos_helmet');
              form2.button(
                { translate: 'item.nacht:magnos_leggings.name' },
                'textures/items/armor/magnos/magnos_leggings'
              );
              break;
            case 8:
              form2.header(VARS.Aedrium);
              form2.label(
                makeMetalDesc(
                  '別名浮遊鉱とも呼ばれる重力に反発する力を持った金属で，エンドシップが浮遊するためのエネルギーとして用いられる。攻撃した相手の重力を無効化し、身にまとった本人が受けた落下ダメージの一部を治癒力に変換する。',
                  makeRawMessage(
                    'エンドにある',
                    { translate: 'tile.nacht:aedrium_ore.name' },
                    'から採取した欠片を凝縮することでインゴットを精製できる。鉱石は',
                    VARS.Electrum,
                    '以上のツールでのみ採掘することができる。'
                  ),
                  'ネザライトと同等。',
                  'ネザライトと同等。',
                  'ネザライトと同等。'
                )
              );
              form2.label('装備一覧 (ボタンを押すと閉じます)');
              form2.button(
                { translate: 'item.nacht:aedrium_sword.name' },
                'textures/items/tools/aedrium/aedrium_sword'
              );
              form2.button(
                { translate: 'item.nacht:aedrium_boots.name' },
                'textures/items/armor/aedrium/aedrium_boots'
              );
              form2.button(
                { translate: 'item.nacht:aedrium_chestplate.name' },
                'textures/items/armor/aedrium/aedrium_chestplate'
              );
              form2.button(
                { translate: 'item.nacht:aedrium_helmet.name' },
                'textures/items/armor/aedrium/aedrium_helmet'
              );
              form2.button(
                { translate: 'item.nacht:aedrium_leggings.name' },
                'textures/items/armor/aedrium/aedrium_leggings'
              );
              break;
            case 9:
              form2.header(VARS.ScarletOrichalcum);
              form2.label(
                makeMetalDesc(
                  '日出る国で初めて発見された、太陽のように緋く輝く伝説の鉱物。不老不死とも関わると云われるが、現時点で特別な力は見つかっていない。エンチャントすることはできない。',
                  makeRawMessage(
                    '自然産出される希少な',
                    { translate: 'tile.nacht:scarlet_orichalcum_ore.name' },
                    '、',
                    { translate: 'tile.nacht:deepslate_scarlet_orichalcum_ore.name' },
                    'から採取した原石を精錬することでインゴットを精錬できる。鉱石は',
                    VARS.Electrum,
                    '以上のツールでのみ採掘することができる。'
                  ),
                  makeRawMessage(VARS.Electrum, '以上。'),
                  makeRawMessage(VARS.Electrum, 'と同等以上。'),
                  makeRawMessage(VARS.Electrum, '以上。'),
                  makeRawMessage(VARS.Electrum, '以上。')
                )
              );
              form2.label('装備一覧 (ボタンを押すと閉じます)');
              form2.button(
                { translate: 'item.nacht:scarlet_orichalcum_sword.name' },
                'textures/items/tools/scarlet_orichalcum/scarlet_orichalcum_sword'
              );
              form2.button(
                { translate: 'item.nacht:scarlet_orichalcum_axe.name' },
                'textures/items/tools/scarlet_orichalcum/scarlet_orichalcum_axe'
              );
              form2.button(
                { translate: 'item.nacht:scarlet_orichalcum_pickaxe.name' },
                'textures/items/tools/scarlet_orichalcum/scarlet_orichalcum_pickaxe'
              );
              form2.button(
                { translate: 'item.nacht:scarlet_orichalcum_shovel.name' },
                'textures/items/tools/scarlet_orichalcum/scarlet_orichalcum_shovel'
              );
              form2.button(
                { translate: 'item.nacht:scarlet_orichalcum_hoe.name' },
                'textures/items/tools/scarlet_orichalcum/scarlet_orichalcum_hoe'
              );
              form2.button(
                { translate: 'item.nacht:scarlet_orichalcum_boots.name' },
                'textures/items/armor/scarlet_orichalcum/scarlet_orichalcum_boots'
              );
              form2.button(
                { translate: 'item.nacht:scarlet_orichalcum_chestplate.name' },
                'textures/items/armor/scarlet_orichalcum/scarlet_orichalcum_chestplate'
              );
              form2.button(
                { translate: 'item.nacht:scarlet_orichalcum_helmet.name' },
                'textures/items/armor/scarlet_orichalcum/scarlet_orichalcum_helmet'
              );
              form2.button(
                { translate: 'item.nacht:scarlet_orichalcum_leggings.name' },
                'textures/items/armor/scarlet_orichalcum/scarlet_orichalcum_leggings'
              );
              break;
            case 10:
              form2.header(VARS.StarIron);
              form2.label(
                makeMetalDesc(
                  '命を終えた星の核が地上に降り注いで誕生した金属。天と地を結ぶ楔と云われ、この金属を手にしたものは天に手を延ばす権利を得るという。',
                  makeRawMessage(
                    VARS.LapisPhilosophorum,
                    'を触媒にして天使の力による加護を与えることで、鉄に',
                    VARS.Stellavita,
                    'のエネルギーを宿すことに成功した。'
                  ),
                  makeRawMessage(
                    VARS.HolySilver,
                    '以上。エンチャントすることで',
                    VARS.ScarletOrichalcum,
                    '以上の力を発揮する。'
                  ),
                  makeRawMessage(VARS.ScarletOrichalcum, 'と同等。'),
                  makeRawMessage(VARS.ScarletOrichalcum, '以上。'),
                  makeRawMessage('金以上。エンチャントすることで', VARS.ScarletOrichalcum, '以上の力を発揮する。')
                )
              );
              form2.label('装備一覧 (ボタンを押すと閉じます)');
              form2.button(
                { translate: 'item.nacht:star_iron_sword.name' },
                'textures/items/tools/star_iron/star_iron_sword'
              );
              form2.button(
                { translate: 'item.nacht:star_iron_axe.name' },
                'textures/items/tools/star_iron/star_iron_axe'
              );
              form2.button(
                { translate: 'item.nacht:star_iron_pickaxe.name' },
                'textures/items/tools/star_iron/star_iron_pickaxe'
              );
              form2.button(
                { translate: 'item.nacht:star_iron_shovel.name' },
                'textures/items/tools/star_iron/star_iron_shovel'
              );
              form2.button(
                { translate: 'item.nacht:star_iron_hoe.name' },
                'textures/items/tools/star_iron/star_iron_hoe'
              );
              form2.button(
                { translate: 'item.nacht:star_iron_boots.name' },
                'textures/items/armor/star_iron/star_iron_boots'
              );
              form2.button(
                { translate: 'item.nacht:star_iron_chestplate.name' },
                'textures/items/armor/star_iron/star_iron_chestplate'
              );
              form2.button(
                { translate: 'item.nacht:star_iron_helmet.name' },
                'textures/items/armor/star_iron/star_iron_helmet'
              );
              form2.button(
                { translate: 'item.nacht:star_iron_leggings.name' },
                'textures/items/armor/star_iron/star_iron_leggings'
              );
              break;
            case 11:
              form2.header(VARS.Orichalcum);
              form2.label(
                makeMetalDesc(
                  'かつては、海に沈んだ広大な大陸で多く産出された伝説の鉱物で、その輝きは太陽を凌ぐと云われる。現在はそれ以上の特別な力は見つかっていない。エンチャントすることはできない。',
                  makeRawMessage(
                    { translate: 'tile.nacht:deepslate_orichalcum_ore.name' },
                    'から採取した原石を精錬して得られる。鉱石は',
                    VARS.StarIron,
                    '以上のツールでのみ採掘することができる。'
                  ),
                  makeRawMessage(
                    { translate: 'enchantment.damage.all' },
                    { translate: 'enchantment.level.5' },
                    'のエンチャントがついた',
                    VARS.StarIron,
                    '以上。'
                  ),
                  makeRawMessage(VARS.StarIron, 'と同等以上。'),
                  makeRawMessage(VARS.StarIron, '以上。'),
                  makeRawMessage(
                    { translate: 'enchantment.damage.all' },
                    { translate: 'enchantment.level.5' },
                    'のエンチャントがついた',
                    VARS.StarIron,
                    '以上。'
                  )
                )
              );
              form2.label('装備一覧 (ボタンを押すと閉じます)');
              form2.button(
                { translate: 'item.nacht:orichalcum_sword.name' },
                'textures/items/tools/orichalcum/orichalcum_sword'
              );
              form2.button(
                { translate: 'item.nacht:orichalcum_axe.name' },
                'textures/items/tools/orichalcum/orichalcum_axe'
              );
              form2.button(
                { translate: 'item.nacht:orichalcum_pickaxe.name' },
                'textures/items/tools/orichalcum/orichalcum_pickaxe'
              );
              form2.button(
                { translate: 'item.nacht:orichalcum_shovel.name' },
                'textures/items/tools/orichalcum/orichalcum_shovel'
              );
              form2.button(
                { translate: 'item.nacht:orichalcum_hoe.name' },
                'textures/items/tools/orichalcum/orichalcum_hoe'
              );
              form2.button(
                { translate: 'item.nacht:orichalcum_boots.name' },
                'textures/items/armor/orichalcum/orichalcum_boots'
              );
              form2.button(
                { translate: 'item.nacht:orichalcum_chestplate.name' },
                'textures/items/armor/orichalcum/orichalcum_chestplate'
              );
              form2.button(
                { translate: 'item.nacht:orichalcum_helmet.name' },
                'textures/items/armor/orichalcum/orichalcum_helmet'
              );
              form2.button(
                { translate: 'item.nacht:orichalcum_leggings.name' },
                'textures/items/armor/orichalcum/orichalcum_leggings'
              );
              break;
            case 12:
              form2.header(VARS.Magradis);
              form2.label(
                makeMetalDesc(
                  '崩壊の力を秘めておりそのままでは金属として加工することはできない。ウィザースケルトンからの攻撃を無効化する。ウィザーからの攻撃は強力すぎるため無効化はできないが、軽減することはできる。',
                  makeRawMessage(
                    'ネザーにある',
                    { translate: 'tile.nacht:ruin_lump.name' },
                    'から採取できる破片からインゴットを精製するにはウィザーエネルギーと逆の性質の力によって安定させる必要がある。'
                  ),
                  makeRawMessage(
                    VARS.StarIron,
                    '以上。エンチャントすることで',
                    VARS.Orichalcum,
                    '以上の力を発揮する。'
                  ),
                  makeRawMessage(VARS.Electrum, 'と同等。'),
                  makeRawMessage(VARS.Magnos, '以上。')
                )
              );
              form2.label('装備一覧 (ボタンを押すと閉じます)');
              form2.button(
                { translate: 'item.nacht:magradis_sword.name' },
                'textures/items/tools/magradis/magradis_sword'
              );
              form2.button(
                { translate: 'item.nacht:magradis_boots.name' },
                'textures/items/armor/magradis/magradis_boots'
              );
              form2.button(
                { translate: 'item.nacht:magradis_chestplate.name' },
                'textures/items/armor/magradis/magradis_chestplate'
              );
              form2.button(
                { translate: 'item.nacht:magradis_helmet.name' },
                'textures/items/armor/magradis/magradis_helmet'
              );
              form2.button(
                { translate: 'item.nacht:magradis_leggings.name' },
                'textures/items/armor/magradis/magradis_leggings'
              );
              break;
            case 13:
              form2.header(VARS.Nexiatite);
              form2.label(
                makeMetalDesc(
                  '世界を断つ力を秘めておりそのままでは金属として加工することはできない。ネザライト以上の力と耐久力を持つ。エンダーマンおよびエンダーマイトからの攻撃を無効化する。エンダードラゴンからの攻撃は強力すぎるため無効化はできないが、軽減することはできる。',
                  makeRawMessage(
                    'エンドにある',
                    { translate: 'tile.nacht:endrift_lump.name' },
                    'から採取できる破片からインゴットを精製するにはエンダーエネルギーと逆の性質の力によって安定させる必要がある。'
                  ),
                  makeRawMessage(
                    VARS.StarIron,
                    '以上。エンチャントすることで',
                    VARS.Orichalcum,
                    '以上の力を発揮する。'
                  ),
                  makeRawMessage(VARS.Electrum, 'と同等。'),
                  makeRawMessage(VARS.Aedrium, '以上。')
                )
              );
              form2.label('装備一覧 (ボタンを押すと閉じます)');
              form2.button(
                { translate: 'item.nacht:nexiatite_sword.name' },
                'textures/items/tools/nexiatite/nexiatite_sword'
              );
              form2.button(
                { translate: 'item.nacht:nexiatite_boots.name' },
                'textures/items/armor/nexiatite/nexiatite_boots'
              );
              form2.button(
                { translate: 'item.nacht:nexiatite_chestplate.name' },
                'textures/items/armor/nexiatite/nexiatite_chestplate'
              );
              form2.button(
                { translate: 'item.nacht:nexiatite_helmet.name' },
                'textures/items/armor/nexiatite/nexiatite_helmet'
              );
              form2.button(
                { translate: 'item.nacht:nexiatite_leggings.name' },
                'textures/items/armor/nexiatite/nexiatite_leggings'
              );
              break;
            case 14:
              form2.header(VARS.Solistite);
              form2.label(
                makeMetalDesc(
                  makeRawMessage(
                    VARS.Magradis,
                    '、',
                    VARS.Nexiatite,
                    'という異なるディメンションに由来する強大な力を持った金属から人工的につくられた合金。深淵に潜む“恐怖”の持つエネルギーと逆の性質を持つ。'
                  ),
                  '自然産出されない。',
                  makeRawMessage(
                    VARS.StarIron,
                    '以上。エンチャントすることで',
                    VARS.Orichalcum,
                    '以上の力を発揮する。'
                  ),
                  makeRawMessage(VARS.Electrum, 'と同等。'),
                  makeRawMessage(VARS.Magradis, '、', VARS.Nexiatite, 'と同等。')
                )
              );
              form2.label('装備一覧 (ボタンを押すと閉じます)');
              form2.button(
                { translate: 'item.nacht:solistite_sword.name' },
                'textures/items/tools/solistite/solistite_sword'
              );
              form2.button(
                { translate: 'item.nacht:solistite_boots.name' },
                'textures/items/armor/solistite/solistite_boots'
              );
              form2.button(
                { translate: 'item.nacht:solistite_chestplate.name' },
                'textures/items/armor/solistite/solistite_chestplate'
              );
              form2.button(
                { translate: 'item.nacht:solistite_helmet.name' },
                'textures/items/armor/solistite/solistite_helmet'
              );
              form2.button(
                { translate: 'item.nacht:solistite_leggings.name' },
                'textures/items/armor/solistite/solistite_leggings'
              );
              break;
            case 15:
              form2.header(VARS.Adamantium);
              form2.label(
                makeMetalDesc(
                  '地の奥底に沈黙する大地の心臓と呼ばれる最硬の鉱物。長い年月をかけて成長した鉱脈が、大きな地殻変動のあとに稀に発見される。現在はそれ以上の特別な力は見つかっていない。エンチャントすることはできない。',
                  makeRawMessage(
                    { translate: 'tile.nacht:deepslate_adamantium_ore.name' },
                    'から採取した原石を精錬した鉱物。鉱石は',
                    VARS.Orichalcum,
                    'のツールでのみ採掘することができる。'
                  ),
                  makeRawMessage(VARS.Orichalcum, '以上。'),
                  makeRawMessage(VARS.Orichalcum, '以上。'),
                  makeRawMessage(VARS.Orichalcum, '以上。'),
                  makeRawMessage(VARS.Orichalcum, '以上。')
                )
              );
              form2.label('装備一覧 (ボタンを押すと閉じます)');
              form2.button(
                { translate: 'item.nacht:adamantium_sword.name' },
                'textures/items/tools/adamantium/adamantium_sword'
              );
              form2.button(
                { translate: 'item.nacht:adamantium_axe.name' },
                'textures/items/tools/adamantium/adamantium_axe'
              );
              form2.button(
                { translate: 'item.nacht:adamantium_pickaxe.name' },
                'textures/items/tools/adamantium/adamantium_pickaxe'
              );
              form2.button(
                { translate: 'item.nacht:adamantium_shovel.name' },
                'textures/items/tools/adamantium/adamantium_shovel'
              );
              form2.button(
                { translate: 'item.nacht:adamantium_hoe.name' },
                'textures/items/tools/adamantium/adamantium_hoe'
              );
              form2.button(
                { translate: 'item.nacht:adamantium_boots.name' },
                'textures/items/armor/adamantium/adamantium_boots'
              );
              form2.button(
                { translate: 'item.nacht:adamantium_chestplate.name' },
                'textures/items/armor/adamantium/adamantium_chestplate'
              );
              form2.button(
                { translate: 'item.nacht:adamantium_helmet.name' },
                'textures/items/armor/adamantium/adamantium_helmet'
              );
              form2.button(
                { translate: 'item.nacht:adamantium_leggings.name' },
                'textures/items/armor/adamantium/adamantium_leggings'
              );
              break;
            case 16:
              form2.header('その他の情報');
              form2.label(
                '鉱石を強化するためには、鉱石以外のアイテムを使用することもあります。かすれた文字は見えるべきときに見えるようになります。ときどき確認してみるといいでしょう。'
              );
              form2.divider();
              form2.label('その他の追加アイテム (ボタンを押すと閉じます)');

              form2.button(VARS.HolyWater, 'textures/items/holy_water');
              form2.label(`天使の力を宿した水。`);

              form2.button(VARS.Aether, 'textures/items/aether');
              form2.label(
                makeRawMessage(
                  '空の輝き。常に輝き続けるもの。',
                  VARS.HolySilver,
                  `でモブを倒すと一定確率でドロップする。`
                )
              );

              form2.button(VARS.CondensedAether, 'textures/items/condensed_aether');
              form2.label(makeRawMessage('凝縮された', VARS.Aether, '。'));

              form2.button(VARS.PoorElixir, 'textures/items/poor_elixir');
              form2.label(
                makeRawMessage(
                  '粗悪な',
                  VARS.Elixir,
                  'だが',
                  VARS.HolyWater,
                  `に輝きを込めているため、普遍的なポーションに劣らない効果を持っている。`
                )
              );

              form2.button(VARS.Elixir, 'textures/items/elixir');
              form2.label(
                makeRawMessage(
                  '天使の力をさらに強めた最強のポーション。道具としても使用できるが、',
                  VARS.Stella,
                  `の力と相性が良く、より強い力を得るためにも用いられる。`
                )
              );

              form2.button(VARS.UnrefinedLapisPhilosophorum, 'textures/items/unrefined_lapis_philosophorum');
              form2.label(
                makeRawMessage(
                  VARS.LapisPhilosophorum,
                  'の種。',
                  VARS.HolySilver,
                  `でモブを倒すと一定確率でドロップする。`
                )
              );

              form2.button(VARS.LapisPhilosophorum, 'textures/items/lapis_philosophorum');
              form2.label(
                makeRawMessage(
                  'すべての',
                  VARS.Alchemist,
                  `が追い求める幻の石。手にするためにはあらゆるディメンションの結晶が必要になる。`
                )
              );

              form2.button(VARS.InvertiaCore, 'textures/items/invertia_core');
              form2.label(
                makeRawMessage(
                  'アイテムの力を',
                  VARS.Invertia,
                  'させる。',
                  VARS.HolySilver,
                  `で強力なモブを倒すと一定確率でドロップする。`
                )
              );

              form2.button(VARS.AntiWitherCore, 'textures/items/anti_wither_core');
              form2.label(makeRawMessage('ウィザーの力を', VARS.Invertia, `させた結晶。`));

              form2.button(VARS.AntiEnderCore, 'textures/items/anti_ender_core');
              form2.label(makeRawMessage('エンドの力を', VARS.Invertia, `させた結晶。`));

              form2.button(VARS.Stellavita, 'textures/items/stellavita');
              form2.label(
                makeRawMessage(
                  VARS.Stella,
                  'の力を宿した石。',
                  VARS.HolySilver,
                  `でモブを倒すと一定確率でドロップする。`
                )
              );

              form2.button(VARS.StellavitaRing, 'textures/items/stellavita_ring');
              form2.label(
                makeRawMessage(
                  VARS.Stellavita,
                  'を',
                  VARS.HolySilver,
                  'で指輪にしたもので、霊力により',
                  VARS.Stella,
                  'の力が強まった。',
                  VARS.Stellavita,
                  'と',
                  VARS.Elixir,
                  '、',
                  { translate: 'item.nacht:silver_ingot.name' },
                  `でクラフトする。`
                )
              );
          }
          form2.show(event.source as any);
        });
      }
    } catch (error) {
      Logger.error(error);
    }
  });
