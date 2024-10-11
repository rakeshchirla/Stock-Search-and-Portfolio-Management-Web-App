import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { WatchlistItem } from '../interfaces/watchlist-item';

@Injectable({
  providedIn: 'root'
})

export class WatchlistService {
  public endpoint = "http://localhost:8080/api"

  constructor(private http: HttpClient) { }

  fetchWatchlist(): Observable<WatchlistItem[]> {
    return this.http.get<WatchlistItem[]>(`${this.endpoint}/watchlist`);
  }

  addToWatchlist(symbol: string, companyName: string): Observable<any> {
    return this.http.post<any>(`${this.endpoint}/watchlist`, { symbol, companyName });
  }

  removeFromWatchlist(symbol: string): Observable<any> {
    return this.http.delete<any>(`${this.endpoint}/watchlist/${symbol}`);
  }

  checkWatchlist(symbol: string): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/watchlist/check/${symbol}`);
  }
}
