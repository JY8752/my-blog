# GoogleAnalyticsの月間レポートをSlackで飛ばす(zenn)

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
gcloud pubsub topics create monthly-report
```

## Cloud Scheduler

```bash
gcloud scheduler jobs create pubsub monthly-report \
--schedule="0 0 1 * *" \
--topic=monthly-report \
--message-body="{}" \
--time-zone=Asia/Tokyo \
--location=asia-northeast1
```

## deploy

```bash
make deploy
```
