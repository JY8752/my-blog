# GoogleAnalyticsの月間レポートをSlackで飛ばす(blog)

## Google Analytics Data API(G4)

```
go get -u google.golang.org/api/analyticsdata/v1beta
go get -u google.golang.org/api/option
```

## slack-go

```
go get -u github.com/slack-go/slack
```

## Pub/Sub

```
gcloud pubsub topics create monthly-blog-report
```

## Cloud Scheduler

```
gcloud scheduler jobs create pubsub monthly-blog-report \
--schedule="0 0 28-31 * *" \
--topic=monthly-blog-report \
--message-body="{}" \
--time-zone=Asia/Tokyo \
--location=asia-northeast1
```

## deploy

```
make deploy
```