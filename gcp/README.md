# GCPリソース

ブログにおいて特定の処理を実行したい場合などにGCPを使用する.

## デプロイ

リポジトリルートから、各FunctionのMakefileをmiseタスク経由で実行する。

```bash
# ブログのアクセス解析通知
mise run deploy:gcp:blog

# Zennのアクセス解析通知
mise run deploy:gcp:zenn
```

事前に`gcloud`で認証と対象プロジェクトの設定を済ませ、
使用するサービスアカウントのメールアドレスを環境変数`SERVICE_ACCOUNT_EMAIL`へ設定する。
各Functionのディレクトリには、実行時の環境変数を記載した`.env.yaml`を用意する。
タスクは対応するディレクトリへ移動して`make deploy`を実行するため、
`.env.yaml`もそのディレクトリから読み込まれる。

## set gcloud

```bash
gcloud config set project $GCP_PROJECT_ID
```

## サービスアカウントの作成

```bash
gcloud iam service-accounts create my-blog-service-account --display-name="my-blog-service-account"
```

## サービスアカウントをプロジェクトに追加

```bash
gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
    --member serviceAccount:"my-blog-service-account@$GCP_PROJECT_ID.iam.gserviceaccount.com" \
    --role "roles/owner" \
    --no-user-output-enabled
```

## APIの有効化

```bash
# cloud functions
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
# google analytics
gcloud services enable analyticsdata.googleapis.com
# cloudscheduler
gcloud services enable cloudscheduler.googleapis.com
gcloud services enable eventarc.googleapis.com
```

## Google Analyticsの週間レポートをSlack通知する

Cloud FunctionsのトリガーをPub/Subで作成することで週間レポートをSlack通知する。
できれば、ついでにzennの方も通知する。
