import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WatchlistService } from '../../services/watchlist.service';
import { SearchService } from '../../services/search-service.service';
import { Quote } from '../../interfaces/quote';
import { forkJoin } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { WatchlistItem } from '../../interfaces/watchlist-item';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, MatProgressSpinnerModule],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})

export class WatchlistComponent {
  watchlist: WatchlistItem[] = [];
  symbols: string[] = [];
  stockQuote!: Quote[];
  loading: boolean = true;
  faCaretUp = faCaretUp;
  faCaretDown = faCaretDown;

  constructor(private watchlistService: WatchlistService, private searchService: SearchService, private router: Router) { }

  ngOnInit(): void {
    this.loadWatchlist();
  }

  loadWatchlist() {
    this.loading = true;
    this.watchlistService.fetchWatchlist().subscribe(data => {
      this.watchlist = data;
      const observables = this.watchlist.map(watch => this.searchService.getStockQuote(watch.symbol));
      forkJoin(observables).subscribe(
        (responses: Quote[]) => {
          this.stockQuote = responses;
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching stock quotes:', error);
          this.loading = false;
        }
      );
      this.loading = false;
    });
  }


  removeFromWatchlist(symbol: string): void {
    this.watchlistService.removeFromWatchlist(symbol).subscribe({
      next: () => {
        this.watchlist = this.watchlist.filter(item => item.symbol !== symbol);
      },
      error: (error) => {
        console.error('Error removing stock from watchlist:', error);
      }
    });
  }

  navigateToDetails(ticker: string) {
    this.router.navigate(['/search', ticker]);
    console.log("Navi fun");
  }
}