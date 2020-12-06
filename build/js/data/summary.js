import {array, number, string, type} from "../../web_modules/io-ts.js";
export const CovidGlobalSummaryDecoder = type({
  NewConfirmed: number,
  TotalConfirmed: number,
  NewDeaths: number,
  TotalDeaths: number,
  NewRecovered: number,
  TotalRecovered: number
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
  Date: string
});
export const CovidSummaryDecoder = type({
  Global: CovidGlobalSummaryDecoder,
  Countries: array(CovidCountrySummaryDecoder),
  Date: string
});
