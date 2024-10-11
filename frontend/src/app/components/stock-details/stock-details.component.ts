import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faStar as fasStar} from '@fortawesome/free-regular-svg-icons';
import { BuySellModalComponent } from '../buy-sell-modal/buy-sell-modal.component';
import { CompanyProfile } from '../../interfaces/company-profile';
import { Quote } from '../../interfaces/quote';
import { WatchlistService } from '../../services/watchlist.service';
import { PortfolioService } from '../../services/portfolio.service';
import { Wallet } from '../../interfaces/wallet';

@Component({
  selector: 'app-stock-details',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './stock-details.component.html',
  styleUrl: './stock-details.component.css'
})

export class StockDetailsComponent {
  @Input() stockDetails!: CompanyProfile;
  @Input() stockQuote!: Quote;

  faCaretUp = faCaretUp;
  faCaretDown = faCaretDown;
  currStar = fasStar;
  faStar = faStar;
  fasStar = fasStar;
  
  isStarred: boolean = false;
  isclicked: boolean = false;
  showSellButton: boolean = false;
  currentTime = new Date().getTime();
  wallet!: Wallet;
  loading: boolean = false;

  isMessage: boolean = false;
  message: string = "";
  action: string = "";
  alertColor: string = "alert-success";


  constructor(private modalService: NgbModal, private watchlistService: WatchlistService, private portfolioService: PortfolioService) {}
  
  ngOnInit(): void {
    this.loading = true;
    this.checkStock(this.stockDetails.ticker);
    this.watchlistService.checkWatchlist(this.stockDetails.ticker).subscribe(
      response => {
        this.isStarred = response.isInWatchlist;
        if(this.isStarred){
          this.currStar = faStar;
        }else{
          this.currStar = fasStar;
        }
      },
      error => {
        console.error('Error checking watchlist:', error);
      }
    );
    this.fetchWallet();
  }

  addToWatchlist(symbol: string, companyName: string): void {
    this.watchlistService.addToWatchlist(symbol, companyName).subscribe({
      next: () => {
        this.message = this.stockDetails.ticker + " added to Watchlist";
        this.action = "Buy";
        this.isMessage = true;
        setTimeout(() => this.isMessage = false, 5000);
      },
      error: (error) => {
        console.error('Failed to add to watchlist:', error);
      }
    });
  }
  
  removeFromWatchlist(symbol: string): void {
    this.watchlistService.removeFromWatchlist(symbol).subscribe({
      next: () => {
        this.message = this.stockDetails.ticker + " removed from Watchlist";
        this.action = "Sell";
        this.isMessage = true;
        setTimeout(() => this.isMessage = false, 5000);
      },
      error: (error) => {
        console.error('Failed to remove from watchlist:', error);
      }
    });
  }
  
  toggleStar(symbol: string): void {
    if (this.isStarred) {
      this.removeFromWatchlist(symbol);
      this.currStar = fasStar;
      this.isStarred = false;
    } else {
      this.addToWatchlist(symbol, this.stockDetails.name);
      this.currStar = faStar;
      this.isStarred = true;
    }
  }
  
  openModal(symbol: string, companyName: string, money: number, stockQuote: Quote, isBuy: boolean) {
    const modalRef = this.modalService.open(BuySellModalComponent);
    modalRef.componentInstance.symbol = symbol;
    modalRef.componentInstance.money = money;
    modalRef.componentInstance.currentPrice = stockQuote.c;
    modalRef.componentInstance.companyName = companyName;
    modalRef.componentInstance.isBuy = isBuy;
    
    modalRef.result.then((result) => {
      this.action = result.action;
      this.wallet.money = result.moneyLeft;
      if(this.action === 'Buy'){
        this.message = this.stockDetails.ticker + " bought successfully.";
        this.isMessage = true;
        setTimeout(() => this.isMessage = false, 5000);
      }else{
        this.message = this.stockDetails.ticker + " sold successfully.";
        this.isMessage = true;
        setTimeout(() => this.isMessage = false, 5000);
      }
    });
  }

  fetchWallet(): void {
    this.portfolioService.getMoney().subscribe(
      (data: Wallet) => {
        this.wallet = data;
      },
      (error) => {
        console.error('Error fetching wallet data:', error);
      }
    );
  }

  checkStock(symbol: string): any{
    this.portfolioService.checkStock(symbol).subscribe(
      response => {
        this.showSellButton = response.isInPortfolio;
        this.loading = false;
      },
      error => {
        console.error('Error checking watchlist:', error);
      }
    );
  }
  
  isMarketOpen(stockQuote: any): boolean {
    const timeDifference = this.currentTime - stockQuote.t*1000;
    const minutesDifference = timeDifference / 60000;
    return (minutesDifference < 5);
  }

  closeAlert(){
    this.isMessage = false;
  }

}
