Since 0.5.0.

権限レベル: Admin.

安全地帯を設定するコマンド。

| Parameter   | Required | Type     | Description |
| ----------- | :------: | -------- | ----------- |
| AreaSetMode |    ◯     | Enum     | モード      |
| from        |          | Location | 範囲の始点  |
| to          |          | Location | 範囲の終点  |

### Examples

```
/nacht:setsafezone set 0 0 0 100 100 100
```

```
/nacht:setsafezone cancel
```
