# Stock Market Web Application

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
git clone https://github.com/your-username/stock-market-app.git
cd stock-market-app

2. **Install dependencies**
npm install

3. **Environment Configuration**
Create a `.env` file in the root directory:
FINNHUB_API_KEY=your_finnhub_api_key
POLYGON_API_KEY=your_polygon_api_key
MONGODB_URI=your_mongodb_connection_string
PORT=3000

4. **Start the development server**
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
│   │   │   ├── stock-details/
│   │   │   ├── watchlist/
│   │   │   └── portfolio/
│   │   ├── services/
│   │   │   ├── stock.service.ts
│   │   │   ├── watchlist.service.ts
│   │   │   └── portfolio.service.ts
│   │   ├── models/
│   │   └── app.module.ts
│   ├── assets/
│   └── environments/
├── server/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── server.js
├── angular.json
├── package.json
└── README.md

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

For any additional information or support, please open an issue in the GitHub repository.
