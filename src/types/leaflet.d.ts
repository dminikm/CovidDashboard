export {};

// We get leaflet from the cdn, no npm here
// Custom declarations, not at all complete

interface LInterface {
    map: (el: HTMLElement) => LeafletMap;
    map: (id: string) => LeafletMap;

    tileLayer: (url: string, options?: LeafletTileLayerOptions) => LeafletTileLayer;

    latLng: (a: [number, number]) => LatLng;
    latLng: (lat: number, lng: number) => LatLng;


    latLngBounds: (a: [[number, number], [number, number]]) => LatLngBounds;
    latLngBounds: (a: LatLng, b: LatLng) => LatLngBounds;

    marker: (x: [number, number]) => LeafletMarker;
    marker: (x: LatLng) => LeafletMarker;
}

type LatLngArr = [];
type LatLngBoundsArr = [LatLngArr, LatLngArr];

export interface LatLng {
    lat: number,
    lng: number
}

export interface LatLngBounds {
    _northEast: LatLng,
    _southWest: LatLng,

    getEast: () => number,
    getWest: () => number,
    getSouth: () => number,
    getNorth: () => number,
}

export interface LeafletPoint {
    x: number,
    y: number
}

interface LeafletControl {

}

export interface LeafletMap {
    setView: (pos: [number, number], number, options?: any) => LeafletMap;

    getBounds(): LatLngBounds;
    getSize(): LeafletPoint;
    getZoom(): number;

    latLngToContainerPoint: (latLng: [number, number]) => LeafletPoint;
    latLngToContainerPoint: (latLng: LatLng) => LeafletPoint;

    on: (evt: string, fn: (e: any) => void) => void;

    removeControl(control: LeafletControl);
    zoomControl: LeafletControl;
}

interface LeafletTileLayer {
    addTo: (map: LeafletMap) => LeafletMap;
}

interface LeafletMarker {
    addTo: (map: LeafletMap) => LeafletMarker;
}

interface LeafletTileLayerOptions {
    attribution?: string,
    maxZoom?: number,
    minZoom?: number,
    id?: string,
    tileSize?: number,
    zoomOffset?: number,
    accessToken?: string,
    noWrap?: boolean
}

// Add to global variables
declare global {
    interface Window {
        L: LInterface
    }
}