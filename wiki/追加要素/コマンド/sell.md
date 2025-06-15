Since 0.1.0.

権限レベル: GameDirectors.

NPCの物品を買取させるコマンド。

| Parameter    | Required | Type     | Description                            |
| ------------ | :------: | -------- | -------------------------------------- |
| item         |    ◯     | ItemType | 売却するアイテムの種類                 |
| amount       |    ◯     | Integer  | 売却するアイテムの数量                 |
| point        |    ◯     | Integer  | アイテムの売却金額                     |
| itemless_msg |          | String   | アイテムが不足している場合のメッセージ |
| after_msg    |          | String   | アイテム売却後のメッセージ             |

### Examples

```
/nacht:sell apple 10 100
```

```
/nacht:sell stone 64 1 そんなにアイテムないようだぞ？ ありがとな!
```
