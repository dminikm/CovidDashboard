import { array, number, string, type, TypeOf } from 'io-ts';

export const CovidGlobalSummaryDecoder = type({
    NewConfirmed: number,
    TotalConfirmed: number,
    NewDeaths: number,
    TotalDeaths: number,
    NewRecovered: number,
    TotalRecovered: number,
});

export const CovidCountrySummaryDecoder = type({
    Country: string,
    CountryCode: string,
    Slug: string,
    NewConfirmed: number,
    TotalConfirmed: number,
    NewDeaths: number,
    TotalDeaths: number,
    NewRecovered: number,
    TotalRecovered: number,
    Date: string,
});

export const CovidSummaryDecoder = type({
    Global: CovidGlobalSummaryDecoder,
    Countries: array(CovidCountrySummaryDecoder),
    Date: string,
});

export type CovidCountrySummary = TypeOf<typeof CovidCountrySummaryDecoder>;
export type CovidGlobalSummary = TypeOf<typeof CovidGlobalSummaryDecoder>;
export type CovidSummary = TypeOf<typeof CovidSummaryDecoder>;