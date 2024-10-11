import { Component, Input } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from "highcharts/highstock";
import { HistoricalData } from '../../interfaces/historical-data';
import HC_indicators from 'highcharts/indicators/indicators';
HC_indicators(Highcharts);
import HC_vba from 'highcharts/indicators/volume-by-price';
HC_vba(Highcharts);

@Component({
  selector: 'app-charts-tab',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './charts-tab.component.html',
  styleUrl: './charts-tab.component.css'
})

export class ChartsTabComponent {
  @Input() historicalData!: HistoricalData;

  chartOptions!: any;
  chartConstructor: string = 'stockChart';
  Highcharts: typeof Highcharts = Highcharts;

  ohlcData!: any;
  volumeData!: any;

  ngOnInit(){
    this.ohlcData = this.historicalData.results.map(data => [
      data.t,
      data.o,
      data.h,
      data.l,
      data.c 
    ]);
    this.volumeData = this.historicalData.results.map(data => [data.t, data.v]);
    this.generateChart();
  }

  generateChart(): void{
    this.chartOptions = {
      chart: {
        backgroundColor: '#f5f5f5'
      },
      rangeSelector: {
        selected: 2,
      },
      title: {
        text: `${this.historicalData.ticker} Historical`,
      },
      subtitle: {
        text: 'With SMA and Volume by Price technical indicators',
      },
      yAxis: [
        {
          startOnTick: false,
          endOnTick: false,
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'OHLC',
          },
          height: '60%',
          lineWidth: 2,
          resize: {
            enabled: true,
          },
        },
        {
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'Volume',
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2,
        },
      ],
      tooltip: {
        split: true,
      },

      plotOptions: {
        series: {
          dataGrouping: {
            units: [
              ['week', [1]],
              ['month', [1, 2, 3, 4, 6]],
            ],
          },
        },
      },

      series: [
        {
          type: 'candlestick',
          name: this.historicalData.ticker,
          id: this.historicalData.ticker,
          zIndex: 2,
          data: this.ohlcData,
        },
        {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: this.volumeData,
          yAxis: 1,
        },
        {
          type: 'vbp',
          linkedTo: this.historicalData.ticker,
          params: {
            volumeSeriesID: 'volume',
          },
          dataLabels: {
            enabled: false,
          },
          zoneLines: {
            enabled: false,
          },
        },
        {
          type: 'sma',
          linkedTo: this.historicalData.ticker,
          zIndex: 1,
          marker: {
            enabled: false,
          },
        },
      ]
    };
  }
}
