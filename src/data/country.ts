import { array, number, string, type, TypeOf } from 'io-ts';

export const CovidCountryCaseDecoder = type({
    Country: string,
    CountryCode: string,
    Lat: string,
    Lon: string,
    Confirmed: number,
    Deaths: number,
    Recovered: number,
    Active: number,
    Date: string,
});

export const CovidCountryCasesDecoder = array(CovidCountryCaseDecoder);

export type CovidCountryCases = TypeOf<typeof CovidCountryCasesDecoder>;
export type CovidCountryCase = TypeOf<typeof CovidCountryCaseDecoder>;