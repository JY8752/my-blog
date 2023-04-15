package notifyanalytics_test

import (
	"context"
	"testing"

	notifyanalytics "github.com/JY8752/my-blog/gcp/functions/notify_blog_analytics"
	"github.com/cloudevents/sdk-go/v2/event"
)

func TestNotify(t *testing.T) {
	notifyanalytics.BlogNotify(context.Background(), event.New())
}
