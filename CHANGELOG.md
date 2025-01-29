# Change Log

## Add

- feat: 記事削除機能 #3
- feat: ログアウト機能 #2

## Change

## Fix

- Bug: 初回起動した際に各 DB のテーブルが作成されていないため、実行すると Internal Error（500）が返る #1
- Bug: トークンの期限切れの際にエラーが発生して、キャッシュを削除しないと操作不可になる #7
