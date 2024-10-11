import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { StockDetailsComponent } from '../stock-details/stock-details.component';
import { SearchService } from '../../services/search-service.service';
import { SummaryTabComponent } from '../summary-tab/summary-tab.component';
import { TopNewsTabComponent } from '../top-news-tab/top-news-tab.component';
import { ChartsTabComponent } from '../charts-tab/charts-tab.component';
import { InsightsTabComponent } from '../insights-tab/insights-tab.component';
import { CompanyProfile } from '../../interfaces/company-profile';
import { NewsArticle } from '../../interfaces/news-article';
import { Quote } from '../../interfaces/quote';
import { RecommendationTrend } from '../../interfaces/recommendation-trend';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { HistoricalData } from '../../interfaces/historical-data';
import { InsiderSentiment } from '../../interfaces/insider-sentiment';
import { SearchResult } from '../../interfaces/search-result';
import { CompanyEarnings } from '../../interfaces/company-earnings';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, StockDetailsComponent, MatTabsModule, SummaryTabComponent, TopNewsTabComponent, ChartsTabComponent, InsightsTabComponent, MatProgressSpinnerModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent {
  @Input() param!: any;

  companyProfile!: CompanyProfile;
  stockQuote!: Quote;
  companyPeers!: string[];
  companyNews: NewsArticle[] = [];
  historicalData!: HistoricalData;
  dayData!: HistoricalData;
  insiderSentiment!: InsiderSentiment;
  recommendationTrends!: RecommendationTrend[];
  companyEarnings!: CompanyEarnings[];
  
  isLoading: boolean = false;
  isError: boolean = false;
  isEmpty: boolean = false;
  
  searchResult: SearchResult = {
    companyProfile : {} as CompanyProfile,
    stockQuote: {} as Quote,
    companyPeers: [] as string[],
    companyNews: [] as NewsArticle[],
    historicalData: {} as HistoricalData,
    dayData: {} as HistoricalData,
    insiderSentiment: {} as InsiderSentiment,
    recommendationTrends: [] as RecommendationTrend[],
    companyEarnings: {} as CompanyEarnings[]
  };
  
  constructor(private router: Router, private searchService: SearchService, private stateService: StateService ,private cdr: ChangeDetectorRef) { }
  
  ngOnInit(): void {
    this.load();
  }
  
  ngOnChanges(changes: SimpleChanges): void{
    if (changes['param'] && changes['param'].previousValue !== undefined && changes['param'].currentValue != changes['param'].previousValue) {
      this.load();
    }
    if(this.stockQuote && this.isMarketOpen(this.stockQuote)){
      setInterval(this.callStockQuoteDayData, 15000);
      this.cdr.detectChanges();
    }
  }

  load() {
    this.searchResult = this.stateService.searchResult;
    this.isLoading = true;
    this.searchService.getCompanyProfile(this.param).subscribe(
      (response) => {
        this.companyProfile = response;
        if (response.ticker != this.param) {
          this.isError = true;
          this.isLoading = false;
          setTimeout(() => this.router.navigate(['/search/home']), 5000);
          return;
        }
      },
      (error) => {
        console.error('Error searching:', error);
        this.isError = true;
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/search/home']), 5000);
        return;
      }
    );
    
    if(!this.isError && this.searchResult && this.param === this.searchResult.companyProfile.ticker){
      this.stockQuote = this.searchResult.stockQuote;
      this.companyNews = this.searchResult.companyNews;
      this.insiderSentiment = this.searchResult.insiderSentiment;
      this.companyPeers = this.searchResult.companyPeers;
      this.companyEarnings = this.searchResult.companyEarnings;
      this.recommendationTrends = this.searchResult.recommendationTrends;
      this.historicalData = this.searchResult.historicalData;
      this.dayData = this.searchResult.dayData;

      this.isLoading = false;
    }else{
    const observables = {
      stockQuote: this.searchService.getStockQuote(this.param),
      companyNews: this.searchService.getCompanyNews(this.param),
      insiderSentiment: this.searchService.getInsiderSentiment(this.param),
      companyPeers: this.searchService.getCompanyPeers(this.param),
      companyEarnings: this.searchService.getCompanyEarnings(this.param),
      recommendationTrends: this.searchService.getRecommendationTrends(this.param),
      historicalData: this.searchService.getHistoricalData(this.param),
    }
    forkJoin(observables).subscribe(
      (results) => {
        this.stockQuote = results.stockQuote;
        if(this.stockQuote.t){
            let toDate = new Date().getTime();
          if(this.isMarketOpen(this.stockQuote)){
            toDate =  new Date().getTime();
          }else{
              toDate = this.stockQuote.t*1000;
            }
          let toDateFormatted = new Date(toDate).toISOString().split('T')[0];
          let fromDate = new Date(toDate - (24 * 60 * 60 * 1000));
          let fromDateFormatted = new Date(fromDate).toISOString().split('T')[0];
          // Call day Data
          this.searchService.getDayData(this.param, fromDateFormatted, toDateFormatted).subscribe(
            (response) => {
              this.dayData = response;
              this.searchResult.dayData = response;
              // this.isLoading = false;
            },
            (error) => {
              console.error('Error fetching day data trends:', error);
              // this.isLoading = false;
              // this.isError = true;
              // setTimeout(() => this.router.navigate(['/search/home']), 5000); 
            }
          );
        }
        this.companyNews = results.companyNews.filter(article => article && article.image && article.headline && article.source);
        this.insiderSentiment = results.insiderSentiment;
        this.companyPeers = results.companyPeers;
        this.companyEarnings = results.companyEarnings;
        this.recommendationTrends = results.recommendationTrends;
        this.historicalData = results.historicalData;
        
        this.searchResult.companyProfile = this.companyProfile;
        this.searchResult.stockQuote = results.stockQuote ;
        this.searchResult.companyNews = results.companyNews.filter(article => article && article.image && article.headline && article.source);
        this.searchResult.insiderSentiment = results.insiderSentiment;
        this.searchResult.companyPeers = results.companyPeers;
        this.searchResult.companyEarnings = results.companyEarnings;
        this.searchResult.recommendationTrends = results.recommendationTrends;
        this.searchResult.historicalData = results.historicalData;
        
        this.stateService.setSearchResults(this.searchResult);

        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading data:', error);
        this.isError = true;
        this.isLoading = false;
        // setTimeout(() => this.router.navigate(['/search/home']), 5000);
      }
    );
    }
  }

  // load(){
  //   this.isLoading = true;
  //   this.searchService.getCompanyProfile(this.param).subscribe(
  //     (response) => {
  //       this.companyProfile = response;
  //       if (response.ticker != this.param) {
  //         this.isError = true;
  //         this.isLoading = false;
  //         setTimeout(() => this.router.navigate(['/search/home']), 5000);
  //         return;
  //       }
  //     },
  //     (error) => {
  //       console.error('Error searching:', error);
  //       this.isError = true;
  //       this.isLoading = false;
  //       setTimeout(() => this.router.navigate(['/search/home']), 5000);
  //       return;
  //     }
  //   );
  //   if(!this.isError){
  //     this.searchService.getStockQuote(this.param).subscribe(
  //       (response) => {
  //         this.stockQuote = response;
  //         if(this.stockQuote.t){
  //           let toDate = new Date().getTime();
  //           if(this.isMarketOpen(this.stockQuote)){
  //             toDate =  new Date().getTime();
  //           }else{
  //             toDate = this.stockQuote.t*1000;
  //           }
  //           let toDateFormatted = new Date(toDate).toISOString().split('T')[0];
  //           let fromDate = new Date(toDate - (24 * 60 * 60 * 1000));
  //           let fromDateFormatted = new Date(fromDate).toISOString().split('T')[0];
  //           // Call day Data
  //           this.searchService.getDayData(this.param, fromDateFormatted, toDateFormatted).subscribe(
  //             (response) => {
  //               this.dayData = response;
  //               this.isLoading = false;
  //             },
  //             (error) => {
  //               console.error('Error fetching day data trends:', error);
  //               this.isLoading = false;
  //               this.isError = true;
  //               setTimeout(() => this.router.navigate(['/search/home']), 5000); 
  //             }
  //           );
  //         }
  //       },
  //       (error) => {
  //         console.error('Error fetching stock quote:', error);
  //       }
  //     );

  //   // Call to get company news
  //   this.searchService.getCompanyNews(this.param).subscribe(
  //     (response) => {
  //       this.companyNews =  response.filter(article => 
  //       article && article.image && article.headline && article.source);
  //     },
  //     (error) => {
  //       console.error('Error fetching company news:', error);
  //     }
  //   );
    
  //   // Call to get insider sentiment
  //   this.searchService.getInsiderSentiment(this.param).subscribe(
  //     (response) => {
  //       this.insiderSentiment = response;
  //     },
  //     (error) => {
  //       console.error('Error fetching insider sentiment:', error);
  //     }
  //     );
      
  //     // Call to get company peers
  //     this.searchService.getCompanyPeers(this.param).subscribe(
  //       (response) => {
  //         this.companyPeers = response;
  //       },
  //       (error) => {
  //         console.error('Error fetching company peers:', error);
  //       }
  //       );
        
  //       // Call to get company earnings
  //       this.searchService.getCompanyEarnings(this.param).subscribe(
  //         (response) => {
  //       this.companyEarnings = response;
  //     },
  //     (error) => {
  //       console.error('Error fetching company earnings:', error);
  //     }
  //   );
    
  //   // Call to get recommendation trends
  //   this.searchService.getRecommendationTrends(this.param).subscribe(
  //     (response) => {
  //       this.recommendationTrends = response;
  //     },
  //     (error) => {
  //       console.error('Error fetching recommendation trends:', error);
  //     }
  //   );
    
  //   // Call to get historical data
  //   this.searchService.getHistoricalData(this.param).subscribe(
  //     (response) => {
  //       this.historicalData =  response;
  //     },
  //     (error) => {
  //       console.error('Error fetching historical data:', error);
  //     }
  //   );
  //   }
  // }

  callStockQuoteDayData(): void{
    this.searchService.getStockQuote(this.companyProfile.ticker).subscribe(
      (response) => {
        this.stockQuote = response;
      },
      (error) => {
        console.error('Error fetching stock quote:', error);
      }
    );
  }

  isMarketOpen(stockQuote: any): boolean {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - stockQuote.t*1000;
    const minutesDifference = timeDifference / 60000;
    return minutesDifference < 5;
  }
      
}
