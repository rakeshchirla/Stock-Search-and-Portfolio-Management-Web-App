import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Autocompleteoption } from '../interfaces/autocompleteoption';
import { NewsArticle } from '../interfaces/news-article';
import { CompanyProfile } from '../interfaces/company-profile';
import { Quote } from '../interfaces/quote';
import { RecommendationTrend } from '../interfaces/recommendation-trend';
import { CompanyEarnings } from '../interfaces/company-earnings';
import { HistoricalData } from '../interfaces/historical-data';
import { InsiderSentiment } from '../interfaces/insider-sentiment';

@Injectable({
  providedIn: 'root'
})

export class SearchService {
  public endpoint = "http://localhost:8080/api"

  constructor(private http: HttpClient) { }
  
  getAutoCompleteSuggestions(query: string): Observable<Autocompleteoption[]>{
    return this.http.get<Autocompleteoption[]>(`${this.endpoint}/autocomplete/${query}`);
  }
  
  getCompanyProfile(symbol: string): Observable<CompanyProfile>{
    return this.http.get<CompanyProfile>(`${this.endpoint}/company-profile/${symbol}`);
  }

  getStockQuote(symbol: string): Observable<Quote> {
    return this.http.get<Quote>(`${this.endpoint}/stock-quote/${symbol}`);
  }
  
  getCompanyNews(symbol: string): Observable<NewsArticle[]> {
    return this.http.get<NewsArticle[]>(`${this.endpoint}/company-news/${symbol}`);
  }

  getRecommendationTrends(symbol: string): Observable<RecommendationTrend[]> {
    return this.http.get<RecommendationTrend[]>(`${this.endpoint}/recommendation-trends/${symbol}`);
  }

  getInsiderSentiment(symbol: string): Observable<InsiderSentiment> {
    return this.http.get<InsiderSentiment>(`${this.endpoint}/insider-sentiment/${symbol}`);
  }
  
  getCompanyPeers(symbol: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.endpoint}/company-peers/${symbol}`);
  }
  
  getCompanyEarnings(symbol: string): Observable<CompanyEarnings[]> {
    return this.http.get<CompanyEarnings[]>(`${this.endpoint}/company-earnings/${symbol}`);
  }

  getHistoricalData(symbol: string): Observable<HistoricalData> {
    return this.http.get<HistoricalData>(`${this.endpoint}/historical-data/${symbol}`);
  }

  getDayData(symbol: string, fromDate: string, toDate: string): Observable<HistoricalData> {
    return this.http.get<HistoricalData>(`${this.endpoint}/historical-data/day/${symbol}/${fromDate}/${toDate}`);
  }
}
