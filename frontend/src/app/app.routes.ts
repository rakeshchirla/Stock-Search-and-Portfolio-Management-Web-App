import { Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

export const routes: Routes = [
    {
        path: "",
        redirectTo: 'search/home',
        pathMatch: 'full'
    },
    {
        path: "search/home",
        component: SearchBarComponent,
        pathMatch: 'full'
    },
    {
        path: "search/:param",
        component: SearchComponent,
        pathMatch: 'full'
    },
    {
        path: "watchlist",
        component: WatchlistComponent,
        pathMatch: 'full'
    },
    {
        path: "portfolio",
        component: PortfolioComponent,
        pathMatch: 'full'
    }
];
