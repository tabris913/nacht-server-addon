import { world } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';

import { Formatting, TAG_ITEM } from '../../const';
import { NachtServerAddonItemTypes } from '../../enums';
import { Logger } from '../../utils/logger';

export default () =>
  world.afterEvents.itemUse.subscribe((event) => {
    try {
      if (event.itemStack.typeId === NachtServerAddonItemTypes.GuideBookOres) {
        const hasSilverTier = event.source.hasTag(TAG_ITEM + 'silver_tier');
        const VARS = {
          HolyWater: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.HolyWater)
            ? '聖水'
            : `${Formatting.Obfuscated}HolyWater${Formatting.Reset}`,
          Aether: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.Aether)
            ? 'エーテル'
            : `${Formatting.Obfuscated}Aether${Formatting.Reset}`,
          CondensedAether: event.source.hasComponent(TAG_ITEM + NachtServerAddonItemTypes.CondensedAether)
            ? '濃縮されたエーテル'
            : `${Formatting.Obfuscated}CondensedAether${Formatting.Reset}`,
          PoorElixir: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.PoorElixir)
            ? '粗悪なエリクサー'
            : `${Formatting.Obfuscated}PoorElixir${Formatting.Reset}`,
          Elixir: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.Elixir)
            ? 'エリクサー'
            : `${Formatting.Obfuscated}Elixir${Formatting.Reset}`,
          UnrefinedLapisPhilosophorum: event.source.hasTag(
            TAG_ITEM + NachtServerAddonItemTypes.UnrefinedLapisPhilosophorum
          )
            ? '未熟な賢者の石'
            : `${Formatting.Obfuscated}UnrefinedLapisPhilosophorum${Formatting.Reset}`,
          LapisPhilosophorum: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.LapisPhilosophorum)
            ? '賢者の石'
            : `${Formatting.Obfuscated}LapisPhilosophorum${Formatting.Reset}`,
          InvertiaCore: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.InvertiaCore)
            ? '反転の核'
            : `${Formatting.Obfuscated}InvertiaCore${Formatting.Reset}`,
          AntiWitherCore: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.AntiWitherCore)
            ? 'アンチウィザーコア'
            : `${Formatting.Obfuscated}AntiWitherCore${Formatting.Reset}`,
          AntiEnderCore: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.AntiEnderCore)
            ? 'アンチエンダーコア'
            : `${Formatting.Obfuscated}AntiEnderCore${Formatting.Reset}`,
          Stella: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.Stellavita)
            ? '星'
            : `${Formatting.Obfuscated}Stella${Formatting.Reset}`,
          Stellavita: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.Stellavita)
            ? '星命石'
            : `${Formatting.Obfuscated}Stellavita${Formatting.Reset}`,
          StellavitaRing: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.Stellavita)
            ? '星命石リング'
            : `${Formatting.Obfuscated}StellavitaRing${Formatting.Reset}`,
          Alchemist: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.UnrefinedLapisPhilosophorum)
            ? '錬金術師'
            : `${Formatting.Obfuscated}Alchemist${Formatting.Reset}`,
          Invertia: event.source.hasTag(TAG_ITEM + NachtServerAddonItemTypes.InvertiaCore)
            ? '反転'
            : `${Formatting.Obfuscated}Invertia${Formatting.Reset}`,
          Silver: event.source.hasTag(TAG_ITEM + 'silver_tier')
            ? '銀'
            : `${Formatting.Obfuscated}Silver${Formatting.Reset}`,
          HolySilver: event.source.hasTag(TAG_ITEM + 'holy_silver_tier')
            ? '霊銀'
            : `${Formatting.Obfuscated}HolySilver${Formatting.Reset}`,
          _: event.source.hasTag(TAG_ITEM + '') ? '' : `${Formatting.Obfuscated}${Formatting.Reset}`,
        } as const;

        const form = new ActionFormData();
        form.title('追加鉱石ガイドブック');
        form.body(
          'ワールドに新しい鉱物が16種追加されました。それに伴って武具やツールも追加されました。\n※バージョン1.1.2現在、プレリリース機能となります。ガイドの通りの機能が働かない場合があります。デザインも仮のものです。気力があれば更新します。'
        );
        form.divider();
        form.button(`${Formatting.Color.WHITE}${VARS.Silver}`, 'textures/items/metal/silver/silver_ingot');
        form.button(`${Formatting.Color.RED}熾紅鋼`, 'textures/items/metal/blazered_steel/blazered_steel');
        form.button(`${Formatting.Color.DARK_BLUE}虚晶石`, 'textures/items/metal/hollow_crystal/hollow_crystal');
        form.button(`${Formatting.Color.MATERIAL_GOLD}ノクタリウム`, 'textures/items/metal/nocturium/nocturium_ingot');
        form.button(`${Formatting.Color.YELLOW}ルミナリウム`, 'textures/items/metal/luminarium/luminarium_ingot');
        form.button(
          `${Formatting.Color.MATERIAL_COPPER}テラマグナイト`,
          'textures/items/metal/terramagnite/terramagnite_ingot'
        );
        form.button(`${Formatting.Color.YELLOW}エレクトラム`, 'textures/items/metal/electrum/electrum_ingot');
        form.button(`${Formatting.Color.MATERIAL_REDSTONE}マグノス`, 'textures/items/metal/magnos/magnos_ingot');
        form.button(`${Formatting.Color.BLUE}エイドリウム`, 'textures/items/metal/aedrium/aedrium_ingot');
        form.button(
          `${Formatting.Color.WHITE}ヒヒイロカネ`,
          'textures/items/metal/scarlet_orichalcum/scarlet_orichalcum_ingot'
        );
        form.button(`${Formatting.Color.AQUA}星鉄`, 'textures/items/metal/star_iron/star_iron_ingot');
        form.button(`${Formatting.Color.GOLD}オリハルコン`, 'textures/items/metal/orichalcum/orichalcum_ingot');
        form.button(`${Formatting.Color.DARK_RED}マグラディス`, 'textures/items/metal/magradis/magradis_ingot');
        form.button(`${Formatting.Color.DARK_GREEN}ネクシアイト`, 'textures/items/metal/nexiatite/nexiatite_ingot');
        form.button(`${Formatting.Color.GREEN}ソリスタイト`, 'textures/items/metal/solistite/solistite_ingot');
        form.button(
          `${Formatting.Color.DARK_PURPLE}アダマンタイト`,
          'textures/items/metal/adamantium/adamantium_ingot'
        );
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
                `${VARS.Silver}鉱石、深層岩${VARS.Silver}鉱石から採取した原石を精錬した鉱物。鉱石は鉄以上のツールでのみ採掘することができる。耐久力は金とほぼ同等だが、ダイヤモンド並の強力な力を発揮する。`
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
              form2.header('霊銀');
              form2.label(
                `銀を${VARS.HolyWater}で清めることにより、鉄の倍近くの耐久力とネザライト以上の力を引き出すことに成功した。特にアンデッド系に絶大な力を発揮する。`
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
              form2.header('熾紅鋼');
              form2.label(
                'ネザーにある熾紅鋼石から採取したかけらを凝縮したもの。鋼石は銀以上のツールでのみ採掘することができる。鉄と同等の力と耐久力を持つ。ネザーのエネルギーを吸収するためネザーに滞在している時間が長いほど強力になるが、一度異なるディメンションに移動するとエネルギーが発散してしまう。'
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
              form2.header('虚晶石');
              form2.label(
                'エンドにある虚晶石から採取したかけらを凝縮したもの。晶石は銀以上のツールでのみ採掘することができる。鉄と同等の力と耐久力を持つ。エンドのエネルギーを吸収するためエンドに滞在している時間が長いほど強力になるが、一度異なるディメンションに移動するとエネルギーが発散してしまう。'
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
              form2.header('ノクタリウム');
              form2.label(
                'ノクタリウム鉱石、深層岩ノクタリウム鉱石から採取した原石を精錬した鉱物。鉱石を採掘するためには霊銀がもつ霊力以上の力が必要。ダイヤモンドと同等の力と耐久力を持つ。闇を吸収して力に変える、夜間は強大な力を発揮する。'
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
              form2.header('ルミナリウム');
              form2.label(
                'ルミナリウム鉱石、深層岩ルミナリウム鉱石から採取した原石を精錬した鉱物。鉱石を採掘するためには霊銀がもつ霊力以上の力が必要。ダイヤモンドと同等の力と耐久力を持つ。光を吸収して力に変えるため、昼間は強大な力を発揮する。'
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
              form2.header('テラマグナイト');
              form2.label(
                'テラマグナイト鉱石、深層岩テラマグナイト鉱石から採取した原石を精錬した鉱物。鉱石を採掘するためには霊銀がもつ霊力以上の力が必要。ダイヤモンドと同等の力と耐久力を持つ。重力に反発するため地底深い場所にいるほど強力になる。'
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
              form2.header('エレクトラム');
              form2.label(
                '金と銀の合金。エレクトラム鉱石、深層岩エレクトラム鉱石から採取した原石を精錬しても得られる。ネザライト以上の力と耐久力を持つがエンチャントすることはできない。鉱石は霊銀以上のツールでのみ採掘することができる。'
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
              form2.header('マグノス');
              form2.label(
                'ネザーにあるマグノス鉱石から採取した欠片を凝縮した鉱物。鉱石はエレクトラム以上のツールでのみ採掘することができる。ネザライトと同等の力と耐久力を持つ。炎の力を帯びており、攻撃する際は炎をまとい、身にまとった本人を炎や熱から守る。'
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
              form2.header('エイドリウム');
              form2.label(
                'エンドにあるエイドリウム鉱石から採取した欠片を凝縮した鉱物。鉱石はエレクトラム以上のツールでのみ採掘することができる。ネザライトと同等の力と耐久力を持つ。重力を無効化する力を持ち、攻撃した相手の重力を無効化し、身にまとった本人の落下耐性を高める。'
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
              form2.header('ヒヒイロカネ');
              form2.label(
                '日出る国で見つかった伝説の鉱物。ヒヒイロカネ鉱石、深層岩ヒヒイロカネ鉱石から採取した原石を精錬した鉱物。エレクトラム以上の力と耐久力を持つがエンチャントすることはできない。鉱石はエレクトラム以上のツールでのみ採掘することができる。'
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
              form2.header('星鉄');
              form2.label(
                `${VARS.LapisPhilosophorum}を触媒にして鉄に霊力と星の力を宿すことで、霊銀以上の力と耐久力を持たせることに成功した。エンチャントすることでヒヒイロカネを超える力を得ることも可能。`
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
              form2.header('オリハルコン');
              form2.label(
                '深層岩オリハルコン鉱石から採取した原石を精錬した鉱物。鉱石は星鉄以上のツールでのみ採掘することができる。星鉄以上の力と耐久力を持つがエンチャントすることはできない。'
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
              form2.header('マグラディス');
              form2.label(
                'ネザーにある崩滅の塊から採取できる破片を凝縮した鉱物で、インゴットの精製にはウィザーエネルギーと逆の性質のちからが必要。ネザライト以上の力と耐久力を持つ。ウィザースケルトンからの攻撃を無効化する。ウィザーからの攻撃は強力すぎるため無効化はできないが、軽減することはできる。'
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
              form2.header('ネクシアイト');
              form2.label(
                'エンドにある断界の塊から採取できる破片を凝縮した鉱物で、インゴットの精製にはエンダーエネルギーと逆の性質のちからが必要。ネザライト以上の力と耐久力を持つ。エンダーマンおよびエンダーマイトからの攻撃を無効化する。エンダードラゴンからの攻撃は強力すぎるため無効化はできないが、軽減することはできる。'
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
              form2.header('ソリスタイト');
              form2.label(
                'マグラディスとネクシアイトの合金。ネザライト以上の力と耐久力を持つ。ウォーデンの持つエネルギーと逆の性質を持ち、ウォーデンからの攻撃を軽減する。'
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
              form2.header('アダマンタイト');
              form2.label(
                '最硬の鉱物。深層岩アダマンタイト鉱石から採取した原石を精錬した鉱物。鉱石はオリハルコンのツールでのみ採掘することができる。オリハルコン以上の力と耐久力を持つがエンチャントすることはできない。'
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
              form2.label(`空の輝き。常に輝き続けるもの。${VARS.HolySilver}でモブを倒すと一定確率でドロップする。`);

              form2.button(VARS.CondensedAether, 'textures/items/condensed_aether');
              form2.label(`凝縮された${VARS.Aether}。`);

              form2.button(VARS.PoorElixir, 'textures/items/poor_elixir');
              form2.label(
                `粗悪な${VARS.Elixir}。だが${VARS.HolyWater}に輝きを込めているため、普遍的なポーションに劣らない効果を持っている。`
              );

              form2.button(VARS.Elixir, 'textures/items/elixir');
              form2.label(
                `天使の力をさらに強めた最強のポーション。道具としても使用できるが、${VARS.Stella}の力と相性が良く、より強い力を得るためにも用いられる。`
              );

              form2.button(VARS.UnrefinedLapisPhilosophorum, 'textures/items/unrefined_lapis_philosophorum');
              form2.label(`${VARS.LapisPhilosophorum}の種。${VARS.HolySilver}でモブを倒すと一定確率でドロップする。`);

              form2.button(VARS.LapisPhilosophorum, 'textures/items/lapis_philosophorum');
              form2.label(
                `すべての${VARS.Alchemist}が追い求める幻の石。手にするためにはあらゆるディメンションの結晶が必要になる。`
              );

              form2.button(VARS.InvertiaCore, 'textures/items/invertia_core');
              form2.label(
                `アイテムの力を${VARS.Invertia}させる。${VARS.HolySilver}で強力なモブを倒すと一定確率でドロップする。`
              );

              form2.button(VARS.AntiWitherCore, 'textures/items/anti_wither_core');
              form2.label(`ウィザーの力を${VARS.Invertia}させた結晶。`);

              form2.button(VARS.AntiEnderCore, 'textures/items/anti_ender_core');
              form2.label(`エンドの力を${VARS.Invertia}させた結晶。`);

              form2.button(VARS.Stellavita, 'textures/items/stellavita');
              form2.label(`${VARS.Stella}の力を宿した石。${VARS.HolySilver}でモブを倒すと一定確率でドロップする。`);

              form2.button(VARS.StellavitaRing, 'textures/items/stellavita_ring');
              form2.label(
                `${VARS.Stellavita}を${VARS.HolySilver}で指輪にしたもので、霊力により${VARS.Stella}の力が強まった。${VARS.Stellavita}と${VARS.Elixir}、銀のインゴットでクラフトする。`
              );
          }
          form2.show(event.source as any);
        });
      }
    } catch (error) {
      Logger.error(error);
    }
  });
