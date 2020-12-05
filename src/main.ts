import countries from './countries';
import setupMap, { MapMarker } from './map';
import setupSearch from './search';
import APIController from './api';
import setupSidebar, { CountrySidebarContent } from './sidebar';
import setupTooltips, { CountryTooltip } from './tooltip';
import api from './api';

window.addEventListener('load', async () => {
    // Get elements
    const sidebarContainer = document.querySelector('#content-sidebar-container')! as HTMLDivElement;
    const mapContainer = document.querySelector('.content-map-container')! as HTMLDivElement;
    const mapElement = mapContainer.querySelector('.content-map')! as HTMLDivElement;
    const markerContainer = mapContainer.querySelector('.content-marker-container')! as HTMLDivElement;

    // Setup app
    let tooltip = setupTooltips(markerContainer);
    let map = setupMap(tooltip, mapElement, markerContainer);
    let sidebar = setupSidebar(sidebarContainer);
    setupSearch(map);

    let summary = await api.summary();

    let minCases = Math.min(...summary.Countries.map((x) => x.TotalConfirmed));
    let maxCases = Math.max(...summary.Countries.map((x) => x.TotalConfirmed));

    summary.Countries.forEach((country) => {
        try {
            const code = country.CountryCode;
            const position = countries[code.toUpperCase()] as [number, number];
    
            const markerRadius = (country.TotalConfirmed - minCases) / (maxCases - minCases) * 50;

            const marker = new MapMarker(position[0], position[1], markerRadius)
                .addClickListener(() => {
                    sidebar.setContent(new CountrySidebarContent(country));
                    sidebar.open();
                })
                .addTooltip(new CountryTooltip(country));

            map.addMarker(marker);
        } catch {
            console.dir(country);
        }
    })
});