Since 1.0.0.

権限レベル: GameDirector.

指定した座標から任意の高さ・方向・幅にブロックを設置する

| Parameter         | Required | Type      | Description                                                              |
| ----------------- | :------: | --------- | ------------------------------------------------------------------------ |
| from              |    ◯     | Location  | 始点座標                                                                 |
| hight             |    ◯     | Integer   | 高さ                                                                     |
| Direction         |    ◯     | Enum      | west, east, north, south, north_west, north_east, south_west, south_east |
| VerticalDirection |    ◯     | Enum      | up, down                                                                 |
| block             |    ◯     | BlockType | 設置するブロック                                                         |
| width             |    ◯     | Integer   | 幅                                                                       |
| ExpandMode        |          | Enum      | expand, shrink                                                           |
| blockStates       |          | String    | 設置するブロックの状態                                                   |

### Examples

```
/nacht:filldiagonalsection 0 0 0 10 north_east up stone 5
```

```
/nacht:filldiagonalsection 0 0 0 10 north_east up stone 5 expand
```
