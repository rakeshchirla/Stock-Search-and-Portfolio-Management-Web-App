export interface InsiderSentiment {
    data: InsiderSentimentData[];
    symbol: string;
}

export interface InsiderSentimentData {
    symbol: string;
    year: number;
    month: number;
    change: number;
    mspr: number;
}

export interface AggregatedInsiderSentiment {
    totalMSPR: number;
    totalChange: number;
    positiveMSPR: number;
    positiveChange: number;
    negativeMSPR: number;
    negativeChange: number;
}