# Nacht Server AddOn

wiki: https://github.com/tabris913/nacht-server-addon/wiki

## Version History

| Version | Date       | Remarks                                          |
| ------: | ---------- | ------------------------------------------------ |
|   0.1.0 | 2025-05-28 | 新規作成                                         |
|   0.2.0 | 2025-05-30 |                                                  |
|   0.3.0 | 2025-06-09 |                                                  |
|   0.3.1 | 2025-06-09 | マイグレーション用コマンドを追加                 |
|   0.4.0 | 2025-06-13 |                                                  |
|   0.4.1 | 2025-06-14 | パーティクル表示範囲を調整                       |
|   0.4.2 | 2025-06-15 | 送金先に送金者自身が表示されないように修正       |
|   0.4.3 | 2025-06-15 | データタグの異なるアイテムを購入できるように変更 |
|   0.5.0 | 2025-06-16 |                                                  |
|   0.6.0 | 2025-06-18 |                                                  |
|   0.6.1 | 2025-06-19 |                                                  |
|   0.6.2 | 2025-06-19 | ライブラリバージョンアップ                       |
|   0.7.0 | 2025-06-20 |                                                  |
|   0.7.1 | 2025-06-21 | sell コマンドのバグを修正                        |
|   0.7.2 | 2025-06-21 |                                                  |

### 0.7.2

Released in 2025-06-21.

#### Commands

- addtag コマンドを追加
- buy コマンドの仕様変更
- buyenchantedbook の仕様変更
- sell コマンドの仕様変更

### 0.7.1

Released in 2025-06-21.

#### Commands

- sell コマンドのパラメータバグを修正

### 0.7.0

Released in 2025-06-20.

#### Commands

- showcameramovie コマンド追加

### 0.6.2

Released in 2025-06-19.

#### Commands

- outputdata コマンド追加
- version コマンド追加

#### System

- リストアデータがある場合は、ダイナミックプロパティに設定するように変更

### 0.6.1

Released in 2025-06-19.

### 0.6.0

Released in 2025-06-18.

#### Commands

- setspawnpoint コマンド追加
- setunsafezone コマンド追加

#### System

- 街エリアには敵モブだけでなく、ペットとして購入できないその他のモブもスポーンしないように変更
- 非安全地帯を設定でき、安全地帯より優先されるように変更
- プレイヤーが死亡した際に、リスポーン先のタグに付け替えるように変更
- 拠点の旗と拠点情報の紐づけが正しくない場合に対応
-

### 0.5.0

Released in 2025-06-16.

#### Commands

- buyenchantedbook コマンド追加
- setsafezone コマンド追加

#### System

- 安全地帯には敵モブがスポーンしない

### 0.4.3

Released in 2025-06-15.

#### Commands

- buy コマンド仕様変更

### 0.4.2

Released in 2025-06-15.

#### Commands

- tp コマンド追加
- transfer コマンドバグ修正

### 0.4.1

Released in 2025-06-14.

#### Commands

- showgamerules コマンド追加

#### System

- パーティクルを表示する範囲を、自分を中心とした上下5マスに限定

### 0.4.0

Released in 2025-06-13.

#### Commands

- diceroll コマンド追加
- fixarea コマンド追加
- pray コマンド追加
- releasearea コマンド追加
- transfer コマンド追加
- withdraw コマンド追加

### 0.3.x

Released in 2025-06-09.

#### Commands

- buybase コマンド追加
- cleardp コマンド仕様変更
- fill コマンド追加
- gamerule コマンド追加
- message コマンド仕様変更
- renamedp コマンド追加
- setlocation コマンド廃止
- migrate コマンド追加 (0.3.1)

#### Entities

- 拠点の旗 (nacht:base_flag) 追加

#### Items

- 拠点の旗 (nacht:base_flag) 追加
- なはとの羽根 (nacht:nacht_feather) 仕様変更

#### System

- 拠点システム追加
- ゲームルール設定追加

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

### 0.1.0

Released in 2025-05-28.

#### Commands

- buy コマンド追加
- sell コマンド追加
- setlocation コマンド追加

#### Items

- なはとの羽根 (nacht:nacht_feather) 追加
