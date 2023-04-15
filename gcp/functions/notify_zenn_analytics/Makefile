deploy:
	gcloud functions deploy NotifyAnalytics \
	--entry-point=Notify \
	--region=asia-northeast1 \
	--runtime=go120 \
	--memory=128Mi \
	--env-vars-file=.env.yaml \
	--allow-unauthenticated \
	--gen2 \
	--run-service-account="${SERVICE_ACCOUNT_EMAIL}" \
	--service-account="${SERVICE_ACCOUNT_EMAIL}" \
	--trigger-topic=monthly-report