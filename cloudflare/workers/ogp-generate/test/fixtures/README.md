# OGPテスト用フォント

`noto-sans-jp-test.ttf`は、Google Fontsから取得したNoto Sans JP（weight 100）の
テスト用サブセット。`Hello ぱんだのITブログ`の文字を含む。

- [取得元のGoogle Fonts API](https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100&text=Hello+%E3%81%B1%E3%82%93%E3%81%A0%E3%81%AEIT%E3%83%96%E3%83%AD%E3%82%B0)
- [フォントのソース](https://github.com/google/fonts/tree/main/ofl/notosansjp)
- ライセンス: SIL Open Font License 1.1（同梱の`OFL.txt`）

結合テストはこのファイルとテスト内の固定SVGで外部リクエストに応答する。
実際の画像生成を検証しながら、フォント・絵文字の配信サービスへの通信を不要にする。
