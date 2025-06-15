Since 0.3.0.

権限レベル: GameDirectors.

バニラコマンド fill を、対象ブロック数の制限なく実行できる。

| Parameter        | Required | Type      | Description                             |
| ---------------- | :------: | --------- | --------------------------------------- |
| from             |    ◯     | Location  |                                         |
| to               |    ◯     | Location  |                                         |
| tileName         |    ◯     | BlockType |                                         |
| tileData         |          | Integer   |                                         |
| oldBlockHandling |          | Enum      | destroy, hollow, keep, outline, replace |
| replaceTileName  |          | BlockType |                                         |
| replaceDataValue |          | Integer   |                                         |

### Examples

```
/nacht:fill 0 0 0 10 10 10 stone
```

```
/nacht:fill 0 0 0 10 10 10 air 0 replace stone
```
