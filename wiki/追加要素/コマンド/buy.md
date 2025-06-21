Since 0.1.0.

権限レベル: GameDirectors.

NPC に物品を販売させるコマンド。

| Parameter     | Required | Type           | Description                            |
| ------------- | :------: | -------------- | -------------------------------------- |
| target        |    ◯     | PlayerSelector | 販売対象                               |
| item          |    ◯     | ItemType       | 購入するアイテムの種類                 |
| amount        |    ◯     | Integer        | 購入するアイテムの数量                 |
| point         |    ◯     | Integer        | アイテムの購入金額                     |
| data          |          | Integer        | データタグ                             |
| pointless_msg |          | String         | ポイントが不足している場合のメッセージ |
| after_msg     |          | String         | アイテム購入後のメッセージ             |

### Examples

```
/nacht:buy @p apple 1 10
```

リンゴを1個10ポイントで販売する。

```
/nacht:buy @p potion 1 100 6
```

延長された暗視のポーションを1コ100ポイントで販売する。

```
/nacht:buy @p diamond_sword 1 1000 0 ポイントが足らん ありがとな！
```
