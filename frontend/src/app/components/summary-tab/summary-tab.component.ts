import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Quote } from '../../interfaces/quote';
import { CompanyProfile } from '../../interfaces/company-profile';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as Highcharts from 'highcharts/highstock';
import { HistoricalData } from '../../interfaces/historical-data';
import { HighchartsChartModule } from 'highcharts-angular';


@Component({
  selector: 'app-summary-tab',
  standalone: true,
  imports: [CommonModule, RouterModule, HighchartsChartModule, MatProgressSpinnerModule],
  templateUrl: './summary-tab.component.html',
  styleUrl: './summary-tab.component.css'
})

export class SummaryTabComponent {
  @Input() stockDetails!: CompanyProfile;
  @Input() stockQuote!: Quote;
  @Input() companyPeers!: string[];
  @Input() hourlyStockPriceData: any[] = [];
  @Input() dayData!: HistoricalData;

  constructor(private router: Router) {}

  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor: string = 'stockChart';
  chartOptions!: any;
  priceData: any;

  isLoading: boolean = false;
  isMarketOpen: boolean = true;

  ngOnInit(): void {
    this.priceData = this.dayData.results.map(data => [data.t, data.c]);
    this.renderChart();
  }

  navigateToPeer(peer: string): void {
    this.router.navigate(['/search', peer]);
  }

  renderChart(): void{
    this.chartOptions = {
      chart: {
        backgroundColor: '#f5f5f5'
      },
      title: {
        text: `${this.dayData.ticker} Hourly Price Variation`,
        style: {
          color: '#767676',
        },
      },
      navigator: {
        enabled: false,
      },
      rangeSelector: {
        enabled: false,
      },
      xAxis: {
        type: 'datetime',
        endOnTick: false,
        startOnTick: false,
        dateTimeLabelFormats: {
          minute: '%H:%M',
        },
      },
      yAxis: {
        opposite: true,
        labels: {
          align: 'left',
          x: -15,
          y: 0,
        },
      },
      plotOptions: {
        spline: {
          color: this.stockQuote.dp < 0 ? '#FF0000' : '#00FF00',
          tooltip: {
            valueDecimals: 2,
          },
        },
      },
      series: [
        {
          type: 'spline',
          data: this.priceData,
          name: `${this.dayData.ticker} Stock Price`,
          tooltip: {
            valueDecimals: 2,
          },
          pointPlacement: 'on',
        }
      ]
    };
  }

}
