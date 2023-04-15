package notifyanalytics

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"
	"time"

	"github.com/GoogleCloudPlatform/functions-framework-go/functions"
	"github.com/cloudevents/sdk-go/v2/event"
	"github.com/slack-go/slack"
	ga "google.golang.org/api/analyticsdata/v1beta"
	"google.golang.org/api/option"
)

const (
	reportCount = 3
)

type Report struct {
	PageTitle   string `json:"pageTitle"`
	ActiveUsers string `json:"activeUsers"`
}

func init() {
	functions.CloudEvent("Notify", Notify)
}

func Notify(ctx context.Context, e event.Event) error {
	base64Credential := os.Getenv("GOOGLE_CREDENTIAL")
	jsonCredential, err := base64.StdEncoding.DecodeString(base64Credential)
	if err != nil {
		return err
	}

	client, err := ga.NewService(ctx, option.WithCredentialsJSON(jsonCredential))

	if err != nil {
		return err
	}

	runReportRequest := &ga.RunReportRequest{
		DateRanges: []*ga.DateRange{
			{StartDate: "28daysAgo", EndDate: "today"},     // 月間
			{StartDate: "7daysAgo", EndDate: "today"},      // 1週前
			{StartDate: "14daysAgo", EndDate: "7daysAgo"},  // 2週前
			{StartDate: "21daysAgo", EndDate: "14daysAgo"}, // 3週前
		},
		Dimensions: []*ga.Dimension{
			{Name: "pageTitle"},
		},
		Metrics: []*ga.Metric{
			{Name: "activeUsers"},
		},
		Limit: reportCount,
	}

	propertyId := os.Getenv("ZENN_PROPERTY_ID")
	res, err := client.Properties.RunReport(fmt.Sprintf("properties/%s", propertyId), runReportRequest).Do() // XXXXXXXXX の部分に property id が入る
	if err != nil {
		return err
	}

	monthlyReports := make([]Report, 0, reportCount)
	oneWeekAgoReports := make([]Report, 0, reportCount)
	twoWeekAgoReports := make([]Report, 0, reportCount)
	threeWeekAgoReports := make([]Report, 0, reportCount)

	for _, row := range res.Rows {
		if len(row.DimensionValues) != 2 {
			continue
		}

		if len(row.MetricValues) != 1 {
			continue
		}

		switch row.DimensionValues[1].Value {
		case "date_range_0":
			monthlyReports = append(monthlyReports, Report{row.DimensionValues[0].Value, row.MetricValues[0].Value})
		case "date_range_1":
			oneWeekAgoReports = append(oneWeekAgoReports, Report{row.DimensionValues[0].Value, row.MetricValues[0].Value})
		case "date_range_2":
			twoWeekAgoReports = append(twoWeekAgoReports, Report{row.DimensionValues[0].Value, row.MetricValues[0].Value})
		case "date_range_3":
			threeWeekAgoReports = append(threeWeekAgoReports, Report{row.DimensionValues[0].Value, row.MetricValues[0].Value})
		}
	}

	tkn := os.Getenv("SLACK_TOKEN")
	sc := slack.New(tkn)

	var sections []slack.Block

	// Header Section
	loc, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		panic(err)
	}
	now := time.Now().In(loc)
	oneMonthAgo := now.AddDate(0, -1, 0) // 1日実行なので一ヶ月前を取得する
	lastMonth := oneMonthAgo.Month()

	headerText := slack.NewTextBlockObject("mrkdwn", fmt.Sprintf("*Zenn Google Analytics [%d月] 月間レポート*\n", int(lastMonth)), false, false)
	headerSection := slack.NewSectionBlock(headerText, nil, nil)
	sections = append(sections, headerSection)

	// 月間レポート
	sections = append(sections, slack.NewSectionBlock(slack.NewTextBlockObject("mrkdwn", "*月間*🚀", false, false), nil, nil))
	for _, report := range monthlyReports {
		txt := slack.NewTextBlockObject("mrkdwn", fmt.Sprintf("*%s*\nアクセス数: %s", report.PageTitle, report.ActiveUsers), false, false)
		sections = append(sections, slack.NewSectionBlock(txt, nil, nil))
	}

	sections = append(sections, slack.NewDividerBlock())

	// 1週前レポート
	sections = append(sections, slack.NewSectionBlock(slack.NewTextBlockObject("mrkdwn", "*1週前*👻", false, false), nil, nil))
	for _, report := range oneWeekAgoReports {
		txt := slack.NewTextBlockObject("mrkdwn", fmt.Sprintf("*%s*\nアクセス数: %s", report.PageTitle, report.ActiveUsers), false, false)
		sections = append(sections, slack.NewSectionBlock(txt, nil, nil))
	}

	sections = append(sections, slack.NewDividerBlock())

	// 2週前レポート
	sections = append(sections, slack.NewSectionBlock(slack.NewTextBlockObject("mrkdwn", "*2週前*🤖", false, false), nil, nil))
	for _, report := range twoWeekAgoReports {
		txt := slack.NewTextBlockObject("mrkdwn", fmt.Sprintf("*%s*\nアクセス数: %s", report.PageTitle, report.ActiveUsers), false, false)
		sections = append(sections, slack.NewSectionBlock(txt, nil, nil))
	}

	sections = append(sections, slack.NewDividerBlock())

	// 3週前レポート
	sections = append(sections, slack.NewSectionBlock(slack.NewTextBlockObject("mrkdwn", "*3週前*🐼", false, false), nil, nil))
	for _, report := range threeWeekAgoReports {
		txt := slack.NewTextBlockObject("mrkdwn", fmt.Sprintf("*%s*\nアクセス数: %s", report.PageTitle, report.ActiveUsers), false, false)
		sections = append(sections, slack.NewSectionBlock(txt, nil, nil))
	}

	// slack送信
	channelId := os.Getenv("SLACK_CHANNEL_ID")
	_, _, err = sc.PostMessage(channelId, slack.MsgOptionBlocks(
		sections...,
	))

	if err != nil {
		return err
	}

	return nil
}
