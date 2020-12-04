import { LeafletMap } from './types/leaflet';
import countries, { countryNames } from './countries';
import { CovidSummaryDecoder, CovidSummary } from './data/summary';
import { isRight } from 'fp-ts/Either';
import { isLeft } from 'fp-ts/lib/These';
import setupMap, { MapController, MapMarker } from './map';
import setupSearch from './search';
import { array } from 'io-ts';
import APIController from './api';
import setupSidebar from './sidebar';

window.addEventListener('load', async () => {
    // Setup app
    let map = setupMap(document.querySelector('.content-map-container')! as HTMLDivElement);
    let sidebar = setupSidebar(document.querySelector('#content-sidebar-container')! as HTMLDivElement);
    setupSearch(map);

    const api = new APIController();
    let summary = await api.summary();

    let minCases = Math.min(...summary!.Countries.map((x) => x.TotalConfirmed));
    let maxCases = Math.max(...summary!.Countries.map((x) => x.TotalConfirmed));

    summary.Countries.forEach((country) => {
        try {
            const code = country.CountryCode;
            const position = countries[code.toUpperCase()] as [number, number];
    
            map.addMarker(new MapMarker(
                position[0],
                position[1],
                (country.TotalConfirmed - minCases) / (maxCases - minCases) * 50
            ).addClickListener(() => {
                // TODO: Add sidebar controller
                // For now, we just toggle it
                sidebar.open();
            }));
        } catch {
            console.dir(country);
        }
    })
});