Since 1.0.0.

権限レベル: GameDirectors.

プレイヤーのアイテムを個数指定で買い取る。

| Parameter    | Required | Type           | Description                            |
| ------------ | :------: | -------------- | -------------------------------------- |
| target       |    ◯     | PlayerSelector | 買取対象                               |
| item         |    ◯     | ItemType       | 買取アイテム                           |
| point        |    ◯     | Integer        | 1つあたりのポイント                    |
| itemless_msg |          | String         | アイテムを持っていない場合のメッセージ |
| after_msg    |          | String         | 買取後のメッセージ                     |

(補足)

### Examples

```
/nacht:sellindetail @initiator apple 10
```
