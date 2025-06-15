Since 0.4.1.

権限レベル: Admin.

設定されたゲームルールを一覧表示する。  
ルール名が指定された場合は、指定されたゲームルールの設定値のみを表示する。

| Parameter | Required | Type | Description    |
| --------- | :------: | ---- | -------------- |
| ruleName  |          | Enum | ゲームルール名 |

### Examples

```
/nacht:showgamerules
ゲームルール一覧
autoRemoveFortuneEnchant: true
autoRemoveFortuneEnchantInterval: 20
...
```

```
/nacht:showgamerules showAreaBorder
showAreaBorder: true
```
