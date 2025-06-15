Since 0.2.0.

権限レベル: GameDirectors.

メッセージを送信する。

| Parameter | Required | Type           | Description            |
| --------- | :------: | -------------- | ---------------------- |
| target    |    ◯     | PlayerSelector | プレイヤーセレクタ     |
| message   |    ◯     | String         | 送信するメッセージ     |
| name      |          | String         | メッセージ送信主の名前 |

### Examples

```
/nacht:message @a 10分後にサーバメンテナンスに入ります
[playerName] 10分後にサーバメンテナンスに入ります
```

```
/nacht:message @a 10分後にサーバメンテナンスに入ります Owner
[Owner] 10分後にサーバメンテナンスに入ります
```
