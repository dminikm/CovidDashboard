import {array, number, string, type} from "../../web_modules/io-ts.js";
export const CovidCountryCaseDecoder = type({
  Country: string,
  CountryCode: string,
  Lat: string,
  Lon: string,
  Confirmed: number,
  Deaths: number,
  Recovered: number,
  Active: number,
  Date: string
});
export const CovidCountryCasesDecoder = array(CovidCountryCaseDecoder);
export const CovidCountryCaseByTypeDecoder = type({
  Country: string,
  CountryCode: string,
  Lat: string,
  Lon: string,
  Cases: number,
  Type: string,
  Date: string
});
export const CovidCountryCasesByTypeDecoder = array(CovidCountryCaseByTypeDecoder);
