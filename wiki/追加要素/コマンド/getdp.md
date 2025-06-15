Since 0.2.0.

権限レベル: Admin

グローバル変数を取得する。

| Parameter | Required | Type   | Description                     |
| --------- | :------: | ------ | ------------------------------- |
| filter    |          | String | キーのフィルタ文字列 (部分一致) |

### Examples

```
/nacht:getdp
ダイナミックプロパティ一覧 (フィルター: なし)
xxxxx: true
yyyyy: 1
```

```
/nacht:getdp x
ダイナミックプロパティ一覧 (フィルター: x)
xxxxx: true
```
