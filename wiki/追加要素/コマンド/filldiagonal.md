Since 1.0.0.

権限レベル: GameDirector.

指定した座標から任意の高さ・方向にブロックを設置する

| Parameter         | Required | Type      | Description                                                              |
| ----------------- | :------: | --------- | ------------------------------------------------------------------------ |
| from              |    ◯     | Location  | 始点座標                                                                 |
| hight             |    ◯     | Integer   | 高さ                                                                     |
| Direction         |    ◯     | Enum      | west, east, north, south, north_west, north_east, south_west, south_east |
| VerticalDirection |    ◯     | Enum      | up, down                                                                 |
| block             |    ◯     | BlockType | 設置するブロック                                                         |
| blockStates       |          | String    | 設置するブロックの状態                                                   |

### Examples

```
/nacht:filldiagonal 0 0 0 10 north_east up stone
```
