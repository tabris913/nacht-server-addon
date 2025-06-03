# Nacht Server AddOn

## Latest Version

### 0.2.0

Released in 2025-05-30.

#### Commands

- cleardp コマンド追加
- getdp コマンド追加
- message コマンド追加
- messageop コマンド追加
- registertptarget コマンド追加
- setdp コマンド追加

#### Items

- なはとの羽根 (nacht:nacht_feather) 仕様変更

#### System

- 異なるエリアに侵入した場合に強制テレポートする仕様を導入

## ゲーム概要

### ポイントシステム

ワールドの通貨として*ポイント*が存在する。

#### ポイントの入手方法

- エンチャントの瓶と交換する
- レベルと交換する
- アイテムを NPC に販売する
- ミニゲームの景品
- etc.

#### エンチャントの瓶

他プレイヤーとポイントをやりとりするためのアイテム。お札や硬貨の役割を果たす。

### エリア

Since 0.2.0.

現在、以下の 3 つのエリアが存在する。

- 街エリア
- 拠点エリア
- 探索エリア

#### 街エリア

(0, 0, 0)を中心とした、一辺 12801 ブロックの正方形エリア。
現在は**Erste**および**天空の庭園**のみ存在する。

#### 拠点エリア

各プレイヤーが各々の拠点を自由に建築するエリア。探検行為は原則禁止。
土地(厳密には土地を決定するアイテム)は購入制で、範囲の規模に応じて金額が変動する。

移動拠点となる地点がいくつが設けられる予定で、今後進度に応じて移動拠点の数は増える。

#### 探索エリア

自由に探索を行うエリア。仮拠点等を除き建築行為は原則禁止。

移動拠点となる地点がいくつが設けられる予定で、今後進度に応じて移動拠点の数は増える。

### 街

アイテムの売買やプレイヤーとの交流を目的とした施設がいくつか存在する。
バージョンアップに伴って今後も増えていく予定。

#### 天空の庭園

Since 0.1.0.

サーバー参加時に初期スポーンする場所。
**Erste**にいる*時空の番人*に話しかけるとテレポートして訪れることが可能。

#### Erste ＜エルステ＞

Since 0.1.0.

“はじまりの街”として、チュートリアル施設をはじめとしたさまざまな施設が存在する街。
移動アイテム「なはとの羽根」の移動先に初期登録されており、削除することはできない。
現在大きく分けて住宅区、商業区、神殿の 3 つの区画が存在する。

##### 住宅区

住宅区は土地が均等に分けられており、各プレイヤーに割り当てられる。ただし購入制 (拠点エリアの土地よりは遥かに廉価)。

##### 商業区

商業区にはポイントとエンチャントの瓶・レベルを交換するための銀行や、探索で手に入れたアイテムを売買する商店がいくつか並んでいる。

## Documentation

### コマンド

#### nacht:buy

Since 0.1.0.
権限レベル: GameDirectors

NPC から物品を購入するコマンド。

| Parameter     | Required | Type     | Description                            |
| ------------- | :------: | -------- | -------------------------------------- |
| item          |    ◯     | ItemType | 購入するアイテムの種類                 |
| amount        |    ◯     | Integer  | 購入するアイテムの数量                 |
| point         |    ◯     | Integer  | アイテムの購入金額                     |
| pointless_msg |          | String   | ポイントが不足している場合のメッセージ |
| after_msg     |          | String   | アイテム購入後のメッセージ             |

#### nacht:cleardp

Since 0.2.0.
権限レベル: Admin

指定したキーのグローバル変数を削除する。

| Parameter | Required | Type   | Description            |
| --------- | :------: | ------ | ---------------------- |
| id        |    ◯     | String | 購入するアイテムの種類 |

#### nacht:getdp

Since 0.2.0.
権限レベル: Admin

グローバル変数を取得する。

| Parameter | Required | Type   | Description                     |
| --------- | :------: | ------ | ------------------------------- |
| filter    |          | String | キーのフィルタ文字列 (部分一致) |

#### nacht:getdp

Since 0.2.0.
権限レベル: GameDirectors

メッセージを送信する。

| Parameter | Required | Type           | Description            |
| --------- | :------: | -------------- | ---------------------- |
| target    |    ◯     | EntitySelector | ターゲットセレクタ     |
| message   |    ◯     | String         | 送信するメッセージ     |
| name      |          | String         | メッセージ送信主の名前 |

#### nacht:getdp

Since 0.2.0.
権限レベル: Any

オペレーターにメッセージを送信する。

| Parameter | Required | Type   | Description        |
| --------- | :------: | ------ | ------------------ |
| message   |    ◯     | String | 送信するメッセージ |

#### nacht:registertptarget

Since 0.2.0.
権限レベル: GameDirectors

なはとの羽根(nacht:nacht_feather)に転移先を登録する。

| Parameter   | Required | Type   | Description |
| ----------- | :------: | ------ | ----------- |
| name        |    ◯     | String | 登録名      |
| displayName |    ◯     | String | 表示名      |

#### nacht:sell

Since 0.1.0.
権限レベル: GameDirectors

NPC が物品を買取するコマンド。

| Parameter    | Required | Type     | Description                            |
| ------------ | :------: | -------- | -------------------------------------- |
| item         |    ◯     | ItemType | 売却するアイテムの種類                 |
| amount       |    ◯     | Integer  | 売却するアイテムの数量                 |
| point        |    ◯     | Integer  | アイテムの売却金額                     |
| itemless_msg |          | String   | アイテムが不足している場合のメッセージ |
| after_msg    |          | String   | アイテム売却後のメッセージ             |

#### nacht:setdp

Since 0.2.0.
権限レベル: Admin

グローバル変数を設定する。

| Parameter | Required | Type   | Description |
| --------- | :------: | ------ | ----------- |
| id        |    ◯     | String | キー        |
| value     |    ◯     | String | 登録する値  |

#### nacht:setlocation

Since 0.1.0.
権限レベル: GameDirectors

座標を記録するコマンド。

| Parameter | Required | Type     | Description |
| --------- | :------: | -------- | ----------- |
| name      |    ◯     | String   | 地点名      |
| location  |    ◯     | Location | 座標        |

### アイテム

#### nacht:nacht_feather

Since 0.1.0.

使用するとダイアログが表示され、転移先候補から選択してレポートする。
またダイアログから登録済みの転移先を削除することができる。

### ゲームシステム

#### エリア間移動ブロック

現在 3 つのエリアが存在し、

## Version History

| Version | Date       | Remarks  |
| ------: | ---------- | -------- |
|   0.1.0 | 2025-05-28 | 新規作成 |
|   0.2.0 | 2025-05-30 |          |

### 0.1.0

Released in 2025-05-28.

#### Commands

- buy コマンド追加
- sell コマンド追加
- setlocation コマンド追加

#### Items

- なはとの羽根 (nacht:nacht_feather) 追加
