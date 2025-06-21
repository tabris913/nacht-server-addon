Since 0.7.2.

権限レベル: GameDirectors.

NPC に物品を販売させるコマンド。

| Parameter        | Required | Type           | Description            |
| ---------------- | :------: | -------------- | ---------------------- |
| target           |    ◯     | EntitySelector | コマンド対象           |
| command          |    ◯     | String         | 実行するコマンド文字列 |
| successOrFailure |    ◯     | Enum           | 成否1                  |
| tag1             |    ◯     | String         | 成否1で付与するタグ    |
| successOrFailure |          | Enum           | 成否2                  |
| tag2             |          | String         | 成否2で付与するタグ    |

実行するコマンドに"%es"を含めると、targetに指定したエンティティで置換する。

### Examples

```
/nacht:addtag @initiator "say hello" success TAG_SUCCESS
```

```
/nacht:addtag @initiator "nacht:buy %es apple 1 10000" failure TAG_FAILURE success TAG_SUCCESS
```
