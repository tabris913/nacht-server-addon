# Nacht Server AddOn

## Latest Version

### 0.1.0

Released in 2025-05-28.

#### Commands

- buy コマンド追加
- sell コマンド追加
- setlocation コマンド追加

#### Items

- なはとの羽根 (nacht:nacht_feather) 追加

## Documentation

### Commands

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

#### nacht:setlocation

Since 0.1.0.
権限レベル: GameDirectors

座標を記録するコマンド。

| Parameter | Required | Type     | Description |
| --------- | :------: | -------- | ----------- |
| name      |    ◯     | String   | 地点名      |
| location  |    ◯     | Location | 座標        |

### Items

#### nacht:nacht_feather

Since 0.1.0.

使用すると、nacht:location_Erste に保存された座標の地点にてレポートする。

## Version History

| version | date       | description |
| ------: | ---------- | ----------- |
|   0.1.0 | 2025-05-28 | 新規作成    |
