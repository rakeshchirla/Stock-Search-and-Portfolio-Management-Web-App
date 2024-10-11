# Stock Search and Portfolio Management Web Application

## Overview

This comprehensive stock market web application, built with Angular, provides users with real-time stock data, watchlist functionality, and portfolio management. It leverages modern web technologies to deliver a responsive and interactive experience for stock market enthusiasts.

## Features

### Stock Search
- Autocomplete suggestions for stock symbols
- Detailed company profiles upon selection

### Stock Details
- Real-time stock quotes with price, change, and market status
- Company information including logo, description, and key statistics
- Interactive price charts with multiple timeframes
- Latest news articles related to the stock
- Financial metrics and analyst recommendations

### Watchlist
- Add/remove stocks to a personal watchlist
- Real-time updates for watchlist items
- Persistent storage using MongoDB Atlas

### Portfolio
- Simulated trading with $25,000 starting balance
- Buy and sell stocks at real-time prices
- Track profits, losses, and overall portfolio performance
- Transaction history and current holdings view

### Responsive Design
- Seamless experience across desktop, tablet, and mobile devices
- Adaptive layout using Bootstrap grid system

## Technical Stack

- **Frontend**: Angular 15 or above
- **Backend**: Node.js 18 with Express.js
- **Database**: MongoDB Atlas
- **UI Framework**: Bootstrap 5.3.2
- **Additional Libraries**:
  - ng-bootstrap 14.0.0
  - Highcharts 10.3.3
  - Angular Material for autocomplete and other UI components
- **APIs**:
  - Finnhub API for real-time stock data
  - Polygon.io API for historical data and company information

## Setup and Installation

1. **Clone the repository**
git clone https://github.com/rakeshchirla/Stock-Search-and-Portfolio-Management-Web-App

cd stock-market-app

3. **Install dependencies**
npm install

4. **Environment Configuration**
Create a `.env` file in the root directory:

FINNHUB_API_KEY=your_finnhub_api_key

POLYGON_API_KEY=your_polygon_api_key

MONGODB_URI=your_mongodb_connection_string

PORT=3000

5. **Start the development server**
ng serve

For the backend:
node server.js

5. **Access the application**
Open your browser and navigate to `http://localhost:4200`

## Project Structure
stock-market-app/

│

├── src/

│   ├── app/

│   │   ├── components/

│   │   │   ├── stock-search/

│   │   │   │   ├── stock-search.component.ts

│   │   │   │   ├── stock-search.component.html

│   │   │   │   └── stock-search.component.css

│   │   │   ├── stock-details/

│   │   │   │   ├── stock-details.component.ts

│   │   │   │   ├── stock-details.component.html

│   │   │   │   └── stock-details.component.css

│   │   │   ├── watchlist/

│   │   │   │   ├── watchlist.component.ts

│   │   │   │   ├── watchlist.component.html

│   │   │   │   └── watchlist.component.css

│   │   │   └── portfolio/

│   │   │       ├── portfolio.component.ts

│   │   │       ├── portfolio.component.html

│   │   │       └── portfolio.component.css

│   │   ├── services/

│   │   │   ├── stock.service.ts

│   │   │   ├── watchlist.service.ts

│   │   │   └── portfolio.service.ts

│   │   ├── models/

│   │   │   ├── stock.model.ts

│   │   │   ├── watchlist-item.model.ts

│   │   │   └── portfolio-item.model.ts

│   │   ├── pipes/

│   │   │   └── stock-change.pipe.ts

│   │   ├── app.component.ts

│   │   ├── app.component.html

│   │   ├── app.component.css

│   │   └── app.module.ts

│   ├── assets/

│   │   ├── images/

│   │   └── icons/

│   ├── environments/

│   │   ├── environment.ts

│   │   └── environment.prod.ts

│   ├── index.html

│   ├── main.ts

│   └── styles.css

├── server/

│   ├── routes/

│   │   ├── stock.routes.js

│   │   ├── watchlist.routes.js

│   │   └── portfolio.routes.js

│   ├── models/

│   │   ├── user.model.js

│   │   ├── watchlist.model.js

│   │   └── portfolio.model.js

│   ├── controllers/

│   │   ├── stock.controller.js

│   │   ├── watchlist.controller.js

│   │   └── portfolio.controller.js

│   ├── middleware/

│   │   └── auth.middleware.js

│   ├── config/

│   │   └── database.config.js

│   ├── utils/

│   │   └── api.utils.js

│   └── server.js

├── angular.json

├── tsconfig.json

├── package.json

├── README.md


## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

For any additional information or support, please open an issue in the GitHub repository.
