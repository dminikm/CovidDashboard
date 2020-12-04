import { LeafletMap } from "./types/leaflet";

export interface MapInfo {
    element: HTMLDivElement,
    markerContainer: HTMLDivElement,

    map: LeafletMap
}

export class MapMarker {
    constructor(lat: number, lng: number, radius: number = 20) {
        this.lat = lat;
        this.lng = lng;

        this.radius = radius;
    }

    public associateElement(elem?: HTMLDivElement) {
        this.element = elem;
        return this;
    }

    public addClickListener(fn: (e: MouseEvent) => void) {
        this.onClick = fn;

        return this;
    }

    public bindListener() {
        this.element?.addEventListener('click', (this.onClick || (() => {})).bind(this));
        return this;
    }

    public lng: number;
    public lat: number;
    public radius: number;

    public element?: HTMLDivElement;
    public onClick?: (e: MouseEvent) => void;
}

export class MapController {
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
        this.map.on('zoomstart', () => {
            // Temporarily hide markers
            this.markers.forEach((x) => x.element!.style.display = 'none');
        });
        this.map.on('zoomend', () => {
            this.markers.forEach((x) => x.element!.style.display = 'flex');
        });
        
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
            marker
                .associateElement(elem)
                .bindListener();

            // Push to container
            this.markerContainer.appendChild(elem);

            // DEBUG: add marker to original map
            //window.L.marker(marker as any).addTo(this.map);
        }

        // Finally push to the array
        this.markers = [...this.markers, marker];

        this.updateMarkers();
    }

    public removeMarker(marker: MapMarker) {
        this.markers = this.markers.filter((x) => x !== marker);
    }

    private updateMarkers() {
        for (let marker of this.markers) {
            const point = this.map.latLngToContainerPoint(marker as any);
            const elem = marker.element!;

            elem.style.left =  `${point.x}px`;
            elem.style.top = `${point.y}px`;

            elem.style.width = `${(marker.radius * 2) + ((this.getZoom() - 4) * 20) + 2}px`;
            elem.style.height = `${(marker.radius * 2) + ((this.getZoom() - 4) * 20) + 2}px`;
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

    public getZoom() {
        return this.map.getZoom();
    }

    private element: HTMLDivElement;
    private markerContainer: HTMLDivElement;
    private map: LeafletMap;

    private markers: MapMarker[];
}

const setupMap = (parent: HTMLDivElement) => {
    return new MapController(parent);
};

export default setupMap;