Since 0.4.2.

権限レベル: GameDirectors.

プレイヤーを転移させる。  
`DimensionTypes`を指定しない場合は、プレイヤーが現在いるディメンション内で転移させる。

| Parameter      | Required | Type           | Description            |
| -------------- | :------: | -------------- | ---------------------- |
| target         |    ◯     | PlayerSelector | 転移させるプレイヤー   |
| location       |    ◯     | Location       | 転移先の座標           |
| DimensionTypes |          | Enum           | 転移先のディメンション |

### Examples

```
/nacht:tp @a 0 0 0
```

```
/nacht:tp @a[c=1] 0 0 0 nether
```
