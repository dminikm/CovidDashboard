export class MapMarker {
  constructor(lat, lng, radius = 20) {
    this.lat = lat;
    this.lng = lng;
    this.radius = radius;
  }
  associateElement(elem) {
    this.element = elem;
    return this;
  }
  addTooltip(tip) {
    this.tooltip = tip;
    return this;
  }
  addClickListener(fn) {
    this.onClick = fn;
    return this;
  }
  bindListeners(tooltip2) {
    this.element?.addEventListener("click", (this.onClick || (() => {
    })).bind(this));
    this.element?.addEventListener("mouseover", () => {
      tooltip2.setContent(this.tooltip);
      tooltip2.show();
    });
    this.element?.addEventListener("mouseout", tooltip2.hide.bind(tooltip2));
    return this;
  }
}
export class MapController {
  constructor(tooltip2, mapElement, markerContainer) {
    this.element = mapElement;
    this.markerContainer = markerContainer;
    const url = "http://localhost:3001/{z}/{x}/{y}.png";
    this.map = window.L.map(this.element).setView([50.05, 15.25], 6);
    window.L.tileLayer(url, {
      attribution: 'Map data \xA9 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors&nbsp;&nbsp;&nbsp',
      noWrap: true,
      maxZoom: 7,
      minZoom: 2
    }).addTo(this.map);
    this.map.removeControl(this.map.zoomControl);
    this.markers = [];
    this.map.on("move", this.updateMarkers.bind(this));
    this.map.on("zoomstart", () => {
      this.markers.forEach((x) => x.element.style.display = "none");
    });
    this.map.on("zoomend", () => {
      this.markers.forEach((x) => x.element.style.display = "flex");
      this.updateMarkers();
    });
    this.tooltip = tooltip2;
  }
  moveTo(x, zoom) {
    this.map.setView(x, zoom);
  }
  createMarkerElement(marker) {
    const elem = document.createElement("div");
    elem.classList.add("map-marker");
    return elem;
  }
  addMarker(marker) {
    if (this.markers.includes(marker)) {
      return;
    }
    if (!marker.element) {
      const elem = this.createMarkerElement(marker);
      marker.associateElement(elem).bindListeners(this.tooltip);
      this.markerContainer.appendChild(elem);
    }
    this.markers = [...this.markers, marker];
    this.updateMarkers();
  }
  removeMarker(marker) {
    this.markers = this.markers.filter((x) => x !== marker);
  }
  updateMarkers() {
    for (let marker of this.markers) {
      const point = this.map.latLngToContainerPoint(marker);
      const elem = marker.element;
      elem.style.left = `${point.x}px`;
      elem.style.top = `${point.y}px`;
      elem.style.width = `${marker.radius * 2 + (this.getZoom() - 4) * 20 + 2}px`;
      elem.style.height = `${marker.radius * 2 + (this.getZoom() - 4) * 20 + 2}px`;
    }
  }
  getZoom() {
    return this.map.getZoom();
  }
  getMarker(position) {
    return this.markers.reduce(([distance, marker], current) => {
      const dist = Math.sqrt(Math.pow(position[0] - current.lat, 2) + Math.pow(position[1] - current.lng, 2));
      if (dist < distance) {
        return [dist, current];
      }
      return [distance, marker];
    }, [Infinity, this.markers[0]])[1];
  }
}
const setupMap = (tooltip2, mapElement, markerContainer) => {
  return new MapController(tooltip2, mapElement, markerContainer);
};
export default setupMap;
