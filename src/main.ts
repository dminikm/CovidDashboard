import { LeafletMap } from './types/leaflet';
import countries, { countryNames } from './countries';

interface MapInfo {
    element: HTMLDivElement,
    markerContainer: HTMLDivElement,

    map: LeafletMap
}

class MapMarker {
    constructor(lat: number, lng: number) {
        this.lat = lat;
        this.lng = lng;
    }

    public associateElement(elem?: HTMLDivElement) {
        this.element = elem;
    }

    public lng: number;
    public lat: number;

    public element?: HTMLDivElement;
}

class MapController {
    constructor(parent: HTMLDivElement) {
        this.element = parent.querySelector('.content-map')! as HTMLDivElement;
        this.markerContainer = parent?.querySelector('.content-marker-container')! as HTMLDivElement;

        this.map = window.L.map(this.element).setView([51.505, -0.09], 13);
        window.L.tileLayer('http://localhost:3001/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
            noWrap: true,
            maxZoom: 7,
            minZoom: 2
        }).addTo(this.map);

        this.markers = [];


        // Setup map updates
        this.map.on('move', this.updateMarkers.bind(this));
        this.map.on('zoomstart', function (this: MapController) {
            // Temporarily hide markers
            this.markers.forEach((x) => x.element!.setAttribute('style', 'display: none;'));

            // Show them again after zoom ends
            this.map.on('zoomend', this.updateMarkers.bind(this));
        }.bind(this));

        this.unTabindex(this.element);
    }

    public moveTo(x: [number, number], zoom: number) {
        this.map.setView(x, zoom);
    }

    private createMarkerElement(marker: MapMarker) {
        const elem = document.createElement('div');
        elem.classList.add('map-marker');

        // TODO: Fill inside

        return elem;
    }

    public addMarker(marker: MapMarker) {
        if (this.markers.includes(marker)) {
            return;
        }

        // Add an element for this marker
        if (!marker.element) {
            const elem = this.createMarkerElement(marker);
            marker.associateElement(elem);

            // Push to container
            this.markerContainer.appendChild(elem);

            // DEBUG: add marker to original map
            //window.L.marker(marker as any).addTo(this.map);
        }

        // Finally push to the array
        this.markers = [...this.markers, marker];
    }

    public removeMarker(marker: MapMarker) {
        this.markers = this.markers.filter((x) => x !== marker);
    }

    private updateMarkers() {
        //debugger;

        for (let marker of this.markers) {
            const point = this.map.latLngToContainerPoint(marker as any);
            const elem = marker.element!;

            elem.setAttribute('style', `left: ${point.x}px; top: ${point.y}px;`);
        }
    }

    //TODO: Is this necessary?
    private unTabindex(el: HTMLElement) {
        try {
            el.setAttribute('tabindex', '-1');
            el.childNodes.forEach((element) => {
                this.unTabindex(element as HTMLElement);
            });
        } catch {}
    }

    private element: HTMLDivElement;
    private markerContainer: HTMLDivElement;
    private map: LeafletMap;

    private markers: MapMarker[];
}

const setupMap = () => {
    const parent = document.querySelector('.content-map-container')! as HTMLDivElement;
    return new MapController(parent);
};

// TODO: Parse the data to an interface
const fetchSummary = async () => {
    const response = await fetch('http://localhost:3002/summary', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    //const body = await response.text();
    const body = await response.json();
    console.dir(body);

    return body;
};

// TODO: Everything
const setupSearch = (map: MapController) => {
    let searchInput = document.querySelector('.navbar-searchbar-container-inner > input[type="text"]') as HTMLInputElement;
    let searchSuggestionContainer = document.querySelector('.navbar-searchbar-suggestion-container') as HTMLDivElement;

    const submit = () => {
        const value = searchInput.value.trim();
        searchInput.value = '';

        var matchingCountries = Object.entries(countryNames).filter(([code, name]) => code.toLowerCase().startsWith(value.toLowerCase()) || name.toLowerCase().startsWith(value.toLowerCase()));

        if (matchingCountries.length != 0) {
            const matchingCountryCode = matchingCountries[0][0];
            const pos = countries[matchingCountryCode] || [0, 0];
            map.moveTo(pos, 6);
        }
    };

    // TODO: Suggestions
    const onChange = (e: Event) => {
        if (e instanceof KeyboardEvent && e.key === 'Enter') {
            submit();
        } else {
            const value = searchInput.value.trim();
            var matchingCountries = Object.entries(countryNames).filter(([code, name]) => code.toLowerCase().startsWith(value.toLowerCase()) || name.toLowerCase().startsWith(value.toLowerCase()));

            var newHTML = matchingCountries
                .map(([code, name]) => `<a class="navbar-searchbar-item" data-country-code=${code} tabindex="1">${name}</a>`)
                .slice(0, Math.min(matchingCountries.length, 25))
                .join('');

            searchSuggestionContainer.innerHTML = newHTML;

            // TODO: Mousedown is ugly, but fires before searchbar loses focus
            searchSuggestionContainer.childNodes.forEach((x) => x.addEventListener('mousedown', (e) => {
                // TODO: Massive hack
                searchInput.value = (x as HTMLDivElement).getAttribute('data-country-code') || '_';
                submit();
            }));
        }
    };

    searchInput.addEventListener('keyup', onChange);
    searchInput.addEventListener('focus', onChange);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            (searchSuggestionContainer.firstChild as HTMLElement).focus();
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    });
}

window.addEventListener('load', async () => {
    var map = setupMap();
    setupSearch(map);

    let summary = await fetchSummary();
    summary['Countries'].forEach((country: any) => {
        try {
            const code = country['CountryCode'];
            const position = countries[code.toUpperCase()] as [number, number];
    
            map.addMarker(new MapMarker(position[0], position[1]));
        } catch {
            console.dir(country);
        }
    });
});