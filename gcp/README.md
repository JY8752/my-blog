# GCPリソース

ブログにおいて特定の処理を実行したい場合などにGCPを使用する.

## set gcloud

```
gcloud config set project $GCP_PROJECT_ID
```

## サービスアカウントの作成

```
gcloud iam service-accounts create my-blog-service-account --display-name="my-blog-service-account"
```

## サービスアカウントをプロジェクトに追加

```
	gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
		--member serviceAccount:"my-blog-service-account@$GCP_PROJECT_ID.iam.gserviceaccount.com" \
		--role "roles/owner" \
		--no-user-output-enabled
```

## APIの有効化

```
  // cloud functions
	gcloud services enable cloudfunctions.googleapis.com
	gcloud services enable run.googleapis.com
	gcloud services enable artifactregistry.googleapis.com
	gcloud services enable cloudbuild.googleapis.com
  // google analytics
  gcloud services enable analyticsdata.googleapis.com
  // cloudscheduler
  gcloud services enable cloudscheduler.googleapis.com
  gcloud services enable eventarc.googleapis.com
```

## Google Analyticsの週間レポートをSlack通知する

Cloud FunctionsのトリガーをPub/Subで作成することで週間レポートをSlack通知する。
できれば、ついでにzennの方も通知する。