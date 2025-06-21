Since 0.5.0.

権限レベル: GameDirectors.

NPC にエンチャントの本を販売させるコマンド。

| Parameter    | Required | Type           | Description        |
| ------------ | :------: | -------------- | ------------------ |
| target       |    ◯     | PlayerSelector | 販売対象           |
| EnchantTypes |    ◯     | Enum           | エンチャント種類   |
| level        |    ◯     | Integer        | エンチャントレベル |
| quantity     |    ◯     | Integer        | 数量               |
| point        |    ◯     | Integer        | ポイント           |

### Examples

```
/nacht:buyenchantedbook @p protection 3 1 10000
```
