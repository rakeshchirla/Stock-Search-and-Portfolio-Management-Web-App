import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PortfolioService } from '../../services/portfolio.service';
import { PortfolioItem } from '../../interfaces/portfolio-item';

@Component({
  selector: 'app-buy-sell-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './buy-sell-modal.component.html',
  styleUrl: './buy-sell-modal.component.css'
})
export class BuySellModalComponent {
  @Input() symbol!: string;
  @Input() companyName!: string;
  @Input() money!: number;
  @Input() currentPrice!: number;
  @Input() isBuy!: boolean;

  portfolio!: PortfolioItem;
  quantity: number = 0;
  total: number = 0;
  isInPortfolio: boolean = false;
  loading: boolean = false;

  constructor(public activeModal: NgbActiveModal, private portfolioService: PortfolioService) { }

  ngOnInit(){
    this.loading = true;
    this.checkStock(this.symbol);
    this.fetchPortfolioData();
  }
  
  calculateTotal() {
    this.total = this.currentPrice * this.quantity;
  }

  fetchPortfolioData(): void {
    this.portfolioService.getSpecificStock(this.symbol).subscribe(
      (data: any) => {
        this.portfolio = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching portfolio data:', error);
        this.loading = false;
      }
    );
  }

  isValidTransaction(isBuy: boolean): boolean {
    if(isBuy){
      return this.quantity > 0 && this.quantity * this.currentPrice <= this.money;
    }else{
      return this.quantity > 0 && this.quantity <= this.portfolio.quantity;
    }
  }

  updateWalletBalance(amount: number) {
    this.portfolioService.updateMoney(amount).subscribe(
      () => {
        this.money += amount;
      },
      error => {
        console.error('Error updating wallet balance:', error);
      }
    );
  }

  checkStock(symbol: string): any{
    this.portfolioService.checkStock(symbol).subscribe(
      response => {
        this.isInPortfolio = response.isInPortfolio;
      },
      error => {
        console.error('Error checking watchlist:', error);
      }
    );
  }

  buy(quantity: number, total: number) {
    if(this.isInPortfolio){
      this.portfolioService.updateStock(this.symbol, quantity, total).subscribe(
        () => {
          this.updateWalletBalance(-this.total);
          // Update wallet balance
          this.money -= this.total;
          // Close the modal
          this.activeModal.close({
            action: 'Buy',
            quantity: this.quantity,
            totalCost: this.total,
            moneyLeft: this.money
          });
        },
        error => {
          console.error('Error selling stock:', error);
          // Handle error
        }
      );
    }else{
      this.portfolioService.addStock(this.symbol, this.companyName, quantity, total).subscribe(
        () => {
          // Update wallet balance
          this.updateWalletBalance(-this.total);
          this.money -= this.total;
          // Close the modal
          this.activeModal.close({
            action: 'Buy',
            quantity: this.quantity,
            totalCost: this.total,
            moneyLeft: this.money
          });
        },
        error => {
          console.error('Error buying stock:', error);
          // Handle error
        }
      );
    }
  }

  sell(quantity: number, total: number) {
    if(this.portfolio.quantity != quantity){
      this.portfolioService.updateStock(this.symbol, -quantity, -total).subscribe(
        () => {
          this.updateWalletBalance(this.total);
          this.money += this.total;
          // Close the modal
          this.activeModal.close({
            action: 'Sell',
            quantity: this.quantity,
            totalCost: this.total,
            moneyLeft: this.money
          });
        },
        error => {
          console.error('Error selling stock:', error);
        }
      );
    }else{
      this.portfolioService.deleteStock(this.symbol).subscribe(
        () => {
          this.updateWalletBalance(this.total);
          this.money += this.total;
          // Close the modal
          this.activeModal.close({
            action: 'Sell',
            quantity: this.quantity,
            totalCost: this.total,
            moneyLeft: this.money
          });
        },
        error => {
          console.error('Error selling stock:', error);
        }
      )
    }
  }
}
