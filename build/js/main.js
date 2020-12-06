import countries2 from "./countries.js";
import setupMap, {MapMarker} from "./map.js";
import setupSearch from "./search.js";
import setupSidebar, {CountrySidebarContent, GlobalSidebarContent} from "./sidebar.js";
import setupTooltips, {CountryTooltip} from "./tooltip.js";
import api2 from "./api.js";
const setupGlobalSidebar = (mapElement, sidebar2, summary2) => {
  sidebar2.setContent(new GlobalSidebarContent(summary2));
  let hasStartedClick = false;
  let hasMovedMouse = false;
  mapElement.addEventListener("mousedown", () => {
    hasStartedClick = true;
    hasMovedMouse = false;
  });
  mapElement.addEventListener("mousemove", () => {
    if (!hasStartedClick)
      return;
    hasMovedMouse = true;
  });
  mapElement.addEventListener("mouseup", () => {
    hasStartedClick = false;
  });
  mapElement.addEventListener("click", () => {
    if (hasMovedMouse)
      return;
    sidebar2.setContent(new GlobalSidebarContent(summary2));
    sidebar2.open();
  });
};
window.addEventListener("load", async () => {
  const sidebarContainer = document.querySelector("#content-sidebar-container");
  const mapContainer = document.querySelector(".content-map-container");
  const mapElement = mapContainer.querySelector(".content-map");
  const markerContainer = mapContainer.querySelector(".content-marker-container");
  let tooltip2 = setupTooltips(markerContainer);
  let map2 = setupMap(tooltip2, mapElement, markerContainer);
  let sidebar2 = setupSidebar(sidebarContainer);
  setupSearch(map2);
  let summary2 = await api2.summary();
  setupGlobalSidebar(mapElement, sidebar2, summary2);
  let minCases = Math.min(...summary2.Countries.map((x) => x.TotalConfirmed));
  let maxCases = Math.max(...summary2.Countries.map((x) => x.TotalConfirmed));
  summary2.Countries.forEach((country) => {
    try {
      const code = country.CountryCode;
      const position = countries2[code.toUpperCase()];
      const markerRadius = (country.TotalConfirmed - minCases) / (maxCases - minCases) * 50;
      const marker = new MapMarker(position[0], position[1], markerRadius).addClickListener((e) => {
        e.stopPropagation();
        sidebar2.setContent(new CountrySidebarContent(country));
        sidebar2.open();
      }).addTooltip(new CountryTooltip(country));
      map2.addMarker(marker);
    } catch {
      console.dir(country);
    }
  });
});
