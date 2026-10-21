# GoogleAnalyticsの月間レポートをSlackで飛ばす(blog)

## Google Analytics Data API(G4)

```bash
go get -u google.golang.org/api/analyticsdata/v1beta
go get -u google.golang.org/api/option
```

## slack-go

```bash
go get -u github.com/slack-go/slack
```

## Pub/Sub

```bash
gcloud pubsub topics create monthly-blog-report
```

## Cloud Scheduler

```bash
gcloud scheduler jobs create pubsub monthly-blog-report \
--schedule="0 0 28-31 * *" \
--topic=monthly-blog-report \
--message-body="{}" \
--time-zone=Asia/Tokyo \
--location=asia-northeast1
```

## deploy

リポジトリルートから実行する。必要な設定は[GCP README](../../README.md#デプロイ)を参照する。

```bash
mise run deploy:gcp:blog
```
