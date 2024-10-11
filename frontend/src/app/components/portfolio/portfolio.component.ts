import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuySellModalComponent } from '../buy-sell-modal/buy-sell-modal.component';
import { PortfolioService } from '../../services/portfolio.service';
import { SearchService } from '../../services/search-service.service';
import { PortfolioItem } from '../../interfaces/portfolio-item';
import { Quote } from '../../interfaces/quote';
import { Wallet } from '../../interfaces/wallet';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})

export class PortfolioComponent {
  portfolio: PortfolioItem[] = [];
  wallet!: Wallet;
  stockQuote!: Quote[];
  loading: boolean = false;

  isMessage: boolean = false;
  message: string = "";
  action: string = "Sell";
  changeQuantity!: number;
  changeTotalCost!: number;

  constructor(private portfolioService: PortfolioService, private modalService: NgbModal, private searchService: SearchService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loading = true;
    this.fetchPortfolioData();
    this.fetchWallet();
  }

  fetchPortfolioData(): void {
    this.portfolioService.getAllStocks().subscribe(
      (data: any[]) => {
        this.portfolio = data;
        const observables = this.portfolio.map(pItem => this.searchService.getStockQuote(pItem.symbol));
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
      },
      (error) => {
        console.error('Error fetching portfolio data:', error);
        this.loading = false;
      }
    );
  }

  fetchWallet(): void {
    this.portfolioService.getMoney().subscribe(
      (data: Wallet) => {
        this.wallet = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching wallet data:', error);
        this.loading = false;
      }
    );
  }

  openModal(symbol: string, companyName: string, money: number, stockQuote: Quote, isBuy: boolean) {
    const modalRef = this.modalService.open(BuySellModalComponent);
    modalRef.componentInstance.symbol = symbol;
    modalRef.componentInstance.money = money;
    modalRef.componentInstance.currentPrice = stockQuote.c;
    modalRef.componentInstance.companyName = companyName;
    modalRef.componentInstance.isBuy = isBuy;
    
    modalRef.result.then((result) => {
      console.log(result.totalCost);
      const index = this.portfolio.findIndex(item => item.symbol === symbol);
      this.action = result.action;
      if (result.action === 'Buy') {
        const newItem: PortfolioItem = {
          symbol: symbol,
          companyName: companyName,
          quantity: result.quantity,
          totalPrice: result.totalCost
        };
        if(index === -1){
          this.portfolio.push(newItem);
        }
        this.portfolio[index].quantity += result.quantity;
        this.portfolio[index].totalPrice += result.totalCost;
        this.message = symbol + " bought successfully.";
        this.isMessage = true;
        setTimeout(() => this.isMessage = false, 5000);
        this.wallet.money = result.moneyLeft;
      } else if (result.action === 'Sell') {
        if (index !== -1) {
          const item = this.portfolio[index];
          item.quantity -= result.quantity;
          item.totalPrice -= result.totalCost;
          if (item.quantity === 0) {
            this.portfolio.splice(index, 1);
          }
          this.message = symbol + " sold successfully.";
          this.isMessage = true;
          setTimeout(() => this.isMessage = false, 5000);
        }
        this.wallet.money = result.moneyLeft;
      }
      this.cdr.detectChanges();
    }, (reason) => {
      console.log('Modal dismissed:', reason);
    });
  }

  navigateToDetails(ticker: string) {
    this.router.navigate(['/search', ticker]);
  }

  closeAlert(){
    this.isMessage = false;
  }
}
