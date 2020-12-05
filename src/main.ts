import countries from './countries';
import setupMap, { MapMarker } from './map';
import setupSearch from './search';
import setupSidebar, { CountrySidebarContent, GlobalSidebarContent, SidebarContent, SidebarController } from './sidebar';
import setupTooltips, { CountryTooltip } from './tooltip';
import api from './api';
import { CovidSummary } from './data/summary';

const setupGlobalSidebar = (mapElement: HTMLDivElement, sidebar: SidebarController, summary: CovidSummary) => {
    sidebar.setContent(new GlobalSidebarContent(summary));

    let hasStartedClick = false;
    let hasMovedMouse = false;

    mapElement.addEventListener('mousedown', () => {
        hasStartedClick = true;
        hasMovedMouse = false;
    });

    mapElement.addEventListener('mousemove', () => {
        if (!hasStartedClick)
            return;

        hasMovedMouse = true;
    })

    mapElement.addEventListener('mouseup', () => {
        hasStartedClick = false;
    })

    mapElement.addEventListener('click', () => {
        if (hasMovedMouse)
            return;

        sidebar.setContent(new GlobalSidebarContent(summary));
        sidebar.open();
    })
}

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
    setupGlobalSidebar(mapElement, sidebar, summary);

    let minCases = Math.min(...summary.Countries.map((x) => x.TotalConfirmed));
    let maxCases = Math.max(...summary.Countries.map((x) => x.TotalConfirmed));

    summary.Countries.forEach((country) => {
        try {
            const code = country.CountryCode;
            const position = countries[code.toUpperCase()] as [number, number];
    
            const markerRadius = (country.TotalConfirmed - minCases) / (maxCases - minCases) * 50;

            const marker = new MapMarker(position[0], position[1], markerRadius)
                .addClickListener((e: MouseEvent) => {
                    e.stopPropagation();

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