import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SearchResult } from '../interfaces/search-result';
import { CompanyProfile } from '../interfaces/company-profile';
import { Quote } from '../interfaces/quote';
import { NewsArticle } from '../interfaces/news-article';
import { HistoricalData } from '../interfaces/historical-data';
import { InsiderSentiment } from '../interfaces/insider-sentiment';
import { RecommendationTrend } from '../interfaces/recommendation-trend';
import { CompanyEarnings } from '../interfaces/company-earnings';

@Injectable({
  providedIn: 'root'
})

export class StateService {
  private searchResultsSubject = new Subject<SearchResult>();
  public searchResults$ = this.searchResultsSubject.asObservable();

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

  constructor() { }

  setSearchResults(result: SearchResult) {
    this.searchResult = result;
    this.searchResultsSubject.next(result);
  }

  getSearchResults(): Observable<SearchResult> {
    return this.searchResultsSubject.asObservable();
  }
}
