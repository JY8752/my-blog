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
	functions.CloudEvent("BlogNotify", BlogNotify)
}

func BlogNotify(ctx context.Context, e event.Event) error {
	loc, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		fmt.Println(err.Error())
		return err
	}
	now := time.Now().In(loc)
	addOneDay := now.AddDate(0, 0, 1)

	debugMode := os.Getenv("DEBUG_MODE")
	isDebug := debugMode != ""

	// 次の日付が1日でなければ月末ではないので処理を終了する
	if addOneDay.Day() != 1 && !isDebug {
		fmt.Println("月末ではないので処理をskipします。")
		return nil
	}

	// 認証
	base64Credential := os.Getenv("GOOGLE_CREDENTIAL")
	jsonCredential, err := base64.StdEncoding.DecodeString(base64Credential)
	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	client, err := ga.NewService(ctx, option.WithCredentialsJSON(jsonCredential))

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	var startDate string
	switch now.Day() {
	case 28:
		startDate = "27daysAgo"
	case 29:
		startDate = "28daysAgo"
	case 30:
		startDate = "29daysAgo"
	case 31:
		startDate = "30daysAgo"
	default:
		startDate = "28daysAgo"
	}

	fmt.Println("startDate: ", startDate)

	// Google Analytics APIへのリクエスト作成
	runReportRequest := &ga.RunReportRequest{
		DateRanges: []*ga.DateRange{
			{StartDate: startDate, EndDate: "today"}, // 月間
		},
		Dimensions: []*ga.Dimension{
			{Name: "pageTitle"},
		},
		Metrics: []*ga.Metric{
			{Name: "activeUsers"},
		},
		Limit: reportCount,
	}

	// レポート取得
	propertyId := os.Getenv("BLOG_PROPERTY_ID")
	res, err := client.Properties.RunReport(fmt.Sprintf("properties/%s", propertyId), runReportRequest).Do() // XXXXXXXXX の部分に property id が入る
	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	if bytes, err := res.MarshalJSON(); err == nil {
		fmt.Println(string(bytes))
	}

	// 取得したレスポンスから必要な情報だけ抽出
	monthlyReports := make([]Report, 0, reportCount)
	for _, row := range res.Rows {
		if len(row.DimensionValues) != 1 {
			continue
		}

		if len(row.MetricValues) != 1 {
			continue
		}

		monthlyReports = append(monthlyReports, Report{row.DimensionValues[0].Value, row.MetricValues[0].Value})
	}

	// slackへの通知
	tkn := os.Getenv("SLACK_TOKEN")
	sc := slack.New(tkn)

	var sections []slack.Block

	// Header Section
	headerText := slack.NewTextBlockObject("mrkdwn", fmt.Sprintf("*MyBlog Google Analytics [%d月] 月間レポート*\n", int(now.Month())), false, false)
	headerSection := slack.NewSectionBlock(headerText, nil, nil)
	sections = append(sections, headerSection)

	// 月間レポート
	sections = append(sections, slack.NewSectionBlock(slack.NewTextBlockObject("mrkdwn", "*月間*🚀", false, false), nil, nil))
	for _, report := range monthlyReports {
		txt := slack.NewTextBlockObject("mrkdwn", fmt.Sprintf("*%s*\nアクセス数: %s", report.PageTitle, report.ActiveUsers), false, false)
		sections = append(sections, slack.NewSectionBlock(txt, nil, nil))
	}

	// slack送信
	channelId := os.Getenv("SLACK_CHANNEL_ID")
	_, _, err = sc.PostMessage(channelId, slack.MsgOptionBlocks(
		sections...,
	))

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	return nil
}
