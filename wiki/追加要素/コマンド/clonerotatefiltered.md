Since 1.0.0.

権限レベル: GameDirectors.

指定した範囲のうち特定のブロックのみを回転させて任意の場所にコピーする。

| Parameter   | Required | Type      | Description                                      |
| ----------- | :------: | --------- | ------------------------------------------------ |
| begin       |    ◯     | Location  | コピー元の始点                                   |
| end         |    ◯     | Location  | コピー元の終点                                   |
| destination |    ◯     | Location  | コピー範囲の最小座標ブロックを移動させる先の座標 |
| Rotate      |    ◯     | Enum      | 回転角度                                         |
| CloneMode   |    ◯     | Enum      | force, move, normal                              |
| tileName    |    ◯     | BlockType | 移動対象ブロック                                 |
| blockStates |          | String    | 移動対象ブロックの状態                           |

### Examples

```
/nacht:clonerotatefiltered 0 0 0 10 10 10 100 100 100 "180" normal stone
```
