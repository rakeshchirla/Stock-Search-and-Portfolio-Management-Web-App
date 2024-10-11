import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Assignment3';
  isSearch: boolean = false;
  isNavbarOpen = false;
  tickerExists: boolean = false;
  ticker!: string;

  constructor(private router: Router, private stateService: StateService) {}

  ngOnInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isSearch = this.router.url.startsWith('/search');
      }
    });
    this.stateService.searchResults$.subscribe(
      result => {
        this.ticker = result.companyProfile.ticker;
        console.log(result.companyProfile.ticker);
        if(result.companyProfile.ticker != null){
          this.tickerExists = true;
        }
      }
    );
  }

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

}
