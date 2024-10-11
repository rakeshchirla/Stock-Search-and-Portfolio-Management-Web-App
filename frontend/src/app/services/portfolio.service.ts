import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private portfolioUrl = 'http://localhost:8080/api/portfolio';
  private walletUrl = 'http://localhost:8080/api/wallet';

  constructor(private http: HttpClient) { }

  addStock(symbol: string, companyName: string, quantity: number, totalPrice: number): Observable<any> {
    return this.http.post<any>(this.portfolioUrl, { symbol, companyName, quantity, totalPrice });
  }

  updateStock(symbol: string, quantity: number, totalPrice: number): Observable<any> {
    const url = `${this.portfolioUrl}/${symbol}`;
    return this.http.put<any>(url, { quantity, totalPrice });
  }

  deleteStock(symbol: string): Observable<any> {
    const url = `${this.portfolioUrl}/${symbol}`;
    return this.http.delete<any>(url);
  }

  getAllStocks(): Observable<any[]> {
    return this.http.get<any[]>(this.portfolioUrl);
  }

  getSpecificStock(symbol: string): Observable<any> {
    const url = `${this.portfolioUrl}/stock/${symbol}`;
    return this.http.get<any>(url);
  }

  checkStock(symbol: string): Observable<any> {
    const url = `${this.portfolioUrl}/check/${symbol}`;
    return this.http.get<any>(url);
  }

  getMoney(): Observable<any> {
    return this.http.get<any>(this.walletUrl);
  }

  updateMoney(amount: number): Observable<any> {
    return this.http.put<any>(this.walletUrl, { amount });
  }
}
