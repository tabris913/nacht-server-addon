Since 0.2.0.

権限レベル: Admin.

ダイナミックプロパティを設定する。

| Parameter              | Required | Type   | Description    |
| ---------------------- | :------: | ------ | -------------- |
| id                     |    ◯     | String | 識別子         |
| CustomCommandParamType |    ◯     | Enum   | パラメータ種別 |
| value                  |    ◯     | String | 登録する値     |

### Examples

```
/nacht:setdp xxxxx Integer "100"
```

## setdpblock

| Parameter | Required | Type      | Description      |
| --------- | :------: | --------- | ---------------- |
| id        |    ◯     | String    | 識別子           |
| value     |    ◯     | BlockType | 登録するブロック |

### Examples

```
/nacht:setdpblock xxxxx stone
```

## setdpentity

| Parameter | Required | Type           | Description          |
| --------- | :------: | -------------- | -------------------- |
| id        |    ◯     | String         | 識別子               |
| value     |    ◯     | EntitySelector | 登録するエンティティ |

### Examples

```
/nacht:setdpblock xxxxx @e[type=npc]
```

## setdpitem

| Parameter | Required | Type     | Description      |
| --------- | :------: | -------- | ---------------- |
| id        |    ◯     | String   | 識別子           |
| value     |    ◯     | ItemType | 登録するアイテム |

### Examples

```
/nacht:setdpitem xxxxx apple
```

## setdplocation

| Parameter | Required | Type     | Description  |
| --------- | :------: | -------- | ------------ |
| id        |    ◯     | String   | 識別子       |
| value     |    ◯     | Location | 登録する座標 |

### Examples

```
/nacht:setdplocation xxxxx -10 63 0
```

## setdpplayer

| Parameter | Required | Type           | Description        |
| --------- | :------: | -------------- | ------------------ |
| id        |    ◯     | String         | 識別子             |
| value     |    ◯     | PlayerSelector | 登録するプレイヤー |

### Examples

```
/nacht:setdpplayer xxxxx @a
```
