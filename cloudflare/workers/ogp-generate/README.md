# OGP画像生成

Cloudflare Workersを使用してOGP画像を動的に生成する。

## init

```bash
wrangler init ogp-generate -y
```

```bash
npm i @resvg/resvg-wasm hono react satori yoga-wasm-web
```

## satori

```bash
# 手元にwasmファイルを持ってくる
curl -L 'https://unpkg.com/yoga-wasm-web/dist/yoga.wasm' -o src/vender/yoga.wasm
```

## resvg

```bash
# 手元にwasmファイルを持ってくる
curl -L 'https://unpkg.com/@resvg/resvg-wasm/index_bg.wasm' -o src/vender/resvg.wasm
```
