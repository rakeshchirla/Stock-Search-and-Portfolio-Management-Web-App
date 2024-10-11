import { CompanyProfile } from "./company-profile";
import { Quote } from "./quote";
import { NewsArticle } from "./news-article";
import { HistoricalData } from "./historical-data";
import { InsiderSentiment } from "./insider-sentiment";
import { RecommendationTrend } from "./recommendation-trend";
import { CompanyEarnings } from "./company-earnings";

export interface SearchResult {
    companyProfile: CompanyProfile;
    stockQuote: Quote;
    companyPeers: string[];
    companyNews: NewsArticle[];
    historicalData: HistoricalData;
    dayData: HistoricalData;
    insiderSentiment: InsiderSentiment;
    recommendationTrends: RecommendationTrend[];
    companyEarnings: CompanyEarnings[];
}
