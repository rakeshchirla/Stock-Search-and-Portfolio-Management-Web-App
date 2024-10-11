const express = require('express');
const axios = require('axios');
// const dotenv = require('dotenv');
// dotenv.config();

const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 8080;

const MongoClient = require('mongodb').MongoClient;

app.use(cors());
app.use(express.json());
app.use(express.static('dist/frontend/browser'));

// Finnhub API base URL
const finnhubBaseUrl = 'https://finnhub.io/api/v1';
const apiKey = "API_KEY";
const polygonApiKey = "API_KEY";

// Route for getting autocomplete suggestions
app.get('/api/autocomplete/:query', async (req, res) => {
    const query = req.params.query.toUpperCase();
    try {
        const response = await axios.get(`${finnhubBaseUrl}/search?q=${query}&token=${apiKey}`);
        const filteredResults = response.data.result.filter(result => result.type === 'Common Stock' && !result.symbol.includes('.'));
        res.json(filteredResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching autocomplete suggestions' });
    }
});

// Route for getting company profile
app.get('/api/company-profile/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    try {
        const response = await axios.get(`${finnhubBaseUrl}/stock/profile2?symbol=${symbol}&token=${apiKey}`);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching company profile' });
    }
});

// Route for getting stock quote
app.get('/api/stock-quote/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    try {
        const response = await axios.get(`${finnhubBaseUrl}/quote?symbol=${symbol}&token=${apiKey}`);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching stock quote' });
    }
});

// Route for getting company news
app.get('/api/company-news/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    const from = new Date();
    from.setDate(from.getDate() - 7);
    const fromStr = from.toISOString().split('T')[0];
    const toStr = new Date().toISOString().split('T')[0];

    try {
        const response = await axios.get(`${finnhubBaseUrl}/company-news?symbol=${symbol}&from=${fromStr}&to=${toStr}&token=${apiKey}`);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching company news' });
    }
});

// Route for getting recommendation trends
app.get('/api/recommendation-trends/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    try {
        const response = await axios.get(`${finnhubBaseUrl}/stock/recommendation?symbol=${symbol}&token=${apiKey}`);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching recommendation trends' });
    }
});

// Route for getting insider sentiment
app.get('/api/insider-sentiment/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    try {
        const response = await axios.get(`${finnhubBaseUrl}/stock/insider-sentiment?symbol=${symbol}&from=2022-01-01&token=${apiKey}`);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching insider sentiment' });
    }
});

// Route for getting company peers
app.get('/api/company-peers/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    try {
        const response = await axios.get(`${finnhubBaseUrl}/stock/peers?symbol=${symbol}&token=${apiKey}`);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching company peers' });
    }
});

// Route for getting company earnings
app.get('/api/company-earnings/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    try {
        const response = await axios.get(`${finnhubBaseUrl}/stock/earnings?symbol=${symbol}&token=${apiKey}`);
        const data = response.data.map(item => ({
            ...item,
            actual: item.actual || 0,
            estimate: item.estimate || 0,
        }));
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching company earnings' });
    }
});

// Route for getting historical data
app.get('/api/historical-data/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    try {
        const from = new Date();
        from.setFullYear(from.getFullYear() - 2);
        const to = new Date();
        
        const fromStr = from.toISOString().split('T')[0];
        const toStr = to.toISOString().split('T')[0];

        const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${fromStr}/${toStr}?adjusted=true&sort=asc&apiKey=${polygonApiKey}`);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching historical data' });
    }
});

// Route for getting day data
app.get('/api/historical-data/day/:symbol/:fromDate/:toDate', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    const fromDate = req.params.fromDate;
    const toDate = req.params.toDate;
    try {
        const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/hour/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=${polygonApiKey}`);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching historical data' });
    }
});



// MongoDB Atlas connection URI
// MONGODB_URI = your - mongodb - atlas - connection - string
const uri = "mongodb+srv://rakeshchirla19:ybGH03RPtu09MOs8@cluster0.ed3vkty.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a new MongoClient
const client = new MongoClient(uri);

// Route for adding a stock to the watchlist
app.post('/api/watchlist', async (req, res) => {
    const { symbol, companyName } = req.body;
    try {
        await client.connect();
        const collection = client.db("HW3").collection('watchlist');
        await collection.insertOne({ symbol, companyName });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding to the watchlist' });
    }
});

// Route for removing a stock from the watchlist
app.delete('/api/watchlist/:symbol', async (req, res) => {
    const { symbol } = req.params;
    try {
        await client.connect();
        const collection = client.db("HW3").collection('watchlist');
        await collection.deleteOne({ symbol });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while removing from the watchlist' });
    }
});

// Route for getting the watchlist
app.get('/api/watchlist', async (req, res) => {
    try {
        await client.connect();
        const collection = client.db("HW3").collection('watchlist');
        const watchlist = await collection.find().toArray();
        res.json(watchlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the watchlist' });
    }
});

// Route for checking if a symbol is in the watchlist
app.get('/api/watchlist/check/:symbol', async (req, res) => {
    const { symbol } = req.params; // Symbol to check
    try {
        if (!symbol) {
            return res.status(400).json({ error: 'Symbol is required' });
        }
        await client.connect();
        const collection = client.db("HW3").collection('watchlist');
        const watchlistItem = await collection.findOne({ symbol });
        if (watchlistItem) {
            res.json({ isInWatchlist: true });
        } else {
            res.json({ isInWatchlist: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while checking the watchlist' });
    }
});

// PORTFOLIO
// Route for adding a stock to the portfolio
app.post('/api/portfolio', async (req, res) => {
    const { symbol, companyName, quantity, totalPrice } = req.body;
    try {
        await client.connect();
        const collection = client.db("HW3").collection('portfolio');
        await collection.insertOne({ symbol, companyName, quantity, totalPrice });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding to the portfolio' });
    }
});

// Route for updating a stock in the portfolio
app.put('/api/portfolio/:symbol', async (req, res) => {
    const { symbol } = req.params;
    const { quantity, totalPrice } = req.body;
    try {
        await client.connect();
        const collection = client.db("HW3").collection('portfolio');
        await collection.updateOne(
            { symbol },
            { $inc: { quantity, totalPrice } },
            { upsert: true }
        );
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the portfolio' });
    }
});

// Route for removing a stock from the portfolio
app.delete('/api/portfolio/:symbol', async (req, res) => {
    const { symbol } = req.params;
    try {
        await client.connect();
        const collection = client.db("HW3").collection('portfolio');
        await collection.deleteOne({ symbol });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while removing from the portfolio' });
    }
});

// Route for getting the portfolio
app.get('/api/portfolio', async (req, res) => {
    try {
        await client.connect();
        const collection = client.db("HW3").collection('portfolio');
        const portfolio = await collection.find().toArray();
        res.json(portfolio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the portfolio' });
    }
});

// Route for getting a stock in portfolio
app.get('/api/portfolio/stock/:symbol', async (req, res) => {
    const { symbol } = req.params; // Symbol to check
    try {
        await client.connect();
        const collection = client.db("HW3").collection('portfolio');
        const stock = await collection.findOne({ symbol });
        res.json(stock);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while checking the watchlist' });
    }
});


// Route for checking if a symbol is in the portfolio
app.get('/api/portfolio/check/:symbol', async (req, res) => {
    const { symbol } = req.params; // Symbol to check
    try {
        await client.connect();
        const collection = client.db("HW3").collection('portfolio');
        const stock = await collection.findOne({ symbol });
        if (stock) {
            res.json({ isInPortfolio: true });
        } else {
            res.json({ isInPortfolio: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while checking the watchlist' });
    }
});

//WALLET
// Route for getting money in the database
app.get('/api/wallet', async (req, res) => {
    try {
        await client.connect();
        const collection = client.db("HW3").collection('wallet');
        const money = await collection.findOne();
        res.json(money);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the money from the database' });
    }
});

// Route for updating money in the database
app.put('/api/wallet', async (req, res) => {
    const { amount } = req.body;
    try {
        await client.connect();
        const collection = client.db("HW3").collection('wallet');
        await collection.updateOne(
            {},
            { $inc: { money: amount } }
        );
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the money in the database' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
