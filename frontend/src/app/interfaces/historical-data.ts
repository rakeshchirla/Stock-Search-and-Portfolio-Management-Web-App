export interface HistoricalData {
    ticker: string,
    queryCount: number,
    resultsCount: number,
    adjusted: true,
    results: HistoricalDataItem[],
    status: string,
    request_id: string,
    count: number
}

export interface HistoricalDataItem{
    v: number,
    vw: number,
    o: number,
    c: number,
    h: number,
    l: number,
    t: number,
    n: number
}