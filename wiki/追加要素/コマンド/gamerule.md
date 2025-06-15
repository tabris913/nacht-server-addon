Since 0.3.0.

権限レベル: Admin.

独自ゲームルールの設定を行う。

| Parameter | Required | Type   | Description    |
| --------- | :------: | ------ | -------------- |
| ruleName  |    ◯     | Enum   | ゲームルール名 |
| value     |    ◯     | String | 設定値         |

※ 文字列以外の設定値の場合、クオーテーションで囲まないとエラーになる

### Examples

```
/nacht:gamerule autoRemoveFortuneEnchant false
```

```
/nacht:gamerule autoRemoveFortuneEnchantInterval "10"
```
