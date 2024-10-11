import { Component, Input } from '@angular/core';
import { InsiderSentiment } from '../../interfaces/insider-sentiment';
import { InsiderSentimentData } from '../../interfaces/insider-sentiment';
import { AggregatedInsiderSentiment } from '../../interfaces/insider-sentiment';
import { RecommendationTrend } from '../../interfaces/recommendation-trend';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-insights-tab',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule],
  templateUrl: './insights-tab.component.html',
  styleUrl: './insights-tab.component.css'
})

export class InsightsTabComponent {
  @Input() insiderSentiment!: InsiderSentiment;
  @Input() recommendationTrends: RecommendationTrend[] = [];
  @Input() companyEarnings: any[] = [];
  
  aggregatedData!: AggregatedInsiderSentiment;
  
  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor: string = 'chart';
  recommendationOptions!: any;
  earningsOptions!: any;

  ngOnInit(): void {
    this.aggregatedData = this.calculateAggregatedValues(this.insiderSentiment.data);
    this.generateChart();
  }

  private calculateAggregatedValues(data: InsiderSentimentData[]): AggregatedInsiderSentiment {
    let totalMSPR = 0;
    let totalChange = 0;
    let positiveMSPR = 0;
    let positiveChange = 0;
    let negativeMSPR = 0;
    let negativeChange = 0;

    data.forEach((item: InsiderSentimentData) => {
      totalMSPR += item.mspr;
      totalChange += item.change;
      if (item.mspr > 0) {
        positiveMSPR += item.mspr;
      } else if (item.mspr < 0) {
        negativeMSPR += item.mspr;
      }
      if (item.change > 0) {
        positiveChange += item.change;
      } else if (item.change < 0) {
        negativeChange += item.change;
      }
    });

  return { totalMSPR, totalChange, positiveMSPR, positiveChange, negativeMSPR, negativeChange };
  }

  generateChart(): void {
    this.recommendationOptions = {
      chart: {
        type: 'column',
        backgroundColor: '#f5f5f5'
      },
      title: {
        text: 'Recommendation trends',
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          year: '%Y',
          month: '%m',
        },
        categories: this.recommendationTrends.map(data => data.period)
      },
      yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
          text: '#Analysis'
        }
      },
      tooltip: {
        format: '<b>{key}</b><br/>{series.name}: {y}<br />Total: {point.stackTotal}'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
          }
        },
        
      },
      series: [
        {
        name: 'Strong Buy',
        data: this.recommendationTrends.map(data =>  data.strongBuy),
        type: 'column',
        color: '#195f32'
        },
        {
          name: 'Buy',
          data: this.recommendationTrends.map(data => data.buy),
          type: 'column',
          color: '#23af50'
        },
        {
          name: 'Hold',
          data: this.recommendationTrends.map(data => data.hold),
          type: 'column',
          color: '#af7d28'
        },
        {
          name: 'Sell',
          data: this.recommendationTrends.map(data => data.sell),
          type: 'column',
          color: '#f05050'
        },
        {
          name: 'Strong Sell',
          data: this.recommendationTrends.map(data => data.strongSell),
          type: 'column',
          color: '732828'
        }
      ]
    };
      
    this.earningsOptions = {
      title: {
        text: 'Historical EPS Surprises',
      },
      yAxis: {
        title: {
          text: 'Quarterly EPS'
        }
      },
      xAxis: {
        categories: this.companyEarnings.map(data => data.period + "<br />Surprise: " + data.surprise)
      },
      chart: {
        backgroundColor: '#f5f5f5'
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
        }
      },
      series: [
        {
        type: 'spline',
        name: 'Actual',
        data: this.companyEarnings.map(data => data.actual)
        },
        {
          type: 'spline',
          name: 'Estimate',
          data: this.companyEarnings.map(data => data.estimate)
        }
      ]
    }
    
    // {
    //   chart: {
    //     type: 'column'
    //   },
    //   title: {
    //     text: 'Recommendation Trends'
    //   },
    //   xAxis: {
    //     categories: this.RecommendationTrend.map(trend => trend.period),
    //     crosshair: true
    //   },
    //   yAxis: {
    //     min: 0,
    //     title: {
    //       text: 'Total Recommendations'
    //     }
    //   },
    //   tooltip: {
    //     headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    //     pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
    //       '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
    //     footerFormat: '</table>',
    //     shared: true,
    //     useHTML: true
    //   },
    //   plotOptions: {
    //     column: {
    //       stacking: 'normal'
    //     }
    //   },
    //   series: [
    //     {
    //       name: 'Buy',
    //       data: this.RecommendationTrend.map(trend => trend.buy)
    //     },
    //     {
    //       name: 'Hold',
    //       data: this.RecommendationTrend.map(trend => trend.hold)
    //     },
    //     {
    //       name: 'Sell',
    //       data: this.RecommendationTrend.map(trend => trend.sell)
    //     },
    //     {
    //       name: 'Strong Buy',
    //       data: this.RecommendationTrend.map(trend => trend.strongBuy)
    //     },
    //     {
    //       name: 'Strong Sell',
    //       data: this.RecommendationTrend.map(trend => trend.strongSell)
    //     }
    //   ]
    // });
  }

}
