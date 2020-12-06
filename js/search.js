import countries2, {countryNames} from "./countries.js";
class SearchController {
  constructor(input, suggestionContainer, map2) {
    this.inputElement = input;
    this.suggestionContainer = suggestionContainer;
    this.map = map2;
    this.inputElement.addEventListener("input", this.onValueChange.bind(this));
    this.inputElement.addEventListener("keypress", this.onKeyPress.bind(this));
    this.inputElement.addEventListener("keydown", this.onKeyDown.bind(this));
    this.inputElement.addEventListener("focus", () => {
      this.rerenderSuggestions();
    });
    this.inputElement.addEventListener("blur", (e) => {
      console.log("Focuse received by: ");
      console.log(e.relatedTarget);
    });
  }
  onKeyDown(e) {
    if (e.key === "Tab") {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
      this.suggestionContainer.firstChild?.focus();
      console.log("Giving focus to: ");
      console.log(this.suggestionContainer.firstChild);
    }
  }
  onKeyPress(e) {
    if (e.key === "Enter") {
      this.submit();
    }
  }
  submit() {
    const value = this.inputElement.value.trim();
    this.inputElement.value = "";
    var matchingCountries = Object.entries(countryNames).filter(([code, name]) => code.toLowerCase().startsWith(value.toLowerCase()) || name.toLowerCase().startsWith(value.toLowerCase()));
    if (matchingCountries.length != 0) {
      const matchingCountryCode = matchingCountries[0][0];
      const pos = countries2[matchingCountryCode] || [0, 0];
      this.map.moveTo(pos, 6);
      this.map.getMarker(pos).element.click();
    }
    document.activeElement?.blur();
  }
  onValueChange() {
    this.rerenderSuggestions();
  }
  rerenderSuggestions() {
    const value = this.inputElement.value.trim();
    var matchingCountries = Object.entries(countryNames).filter(([code, name]) => code.toLowerCase().startsWith(value.toLowerCase()) || name.toLowerCase().startsWith(value.toLowerCase()));
    var newHTML = matchingCountries.map(([code, name]) => `<a class="navbar-searchbar-item" data-country-code=${code} href="javascript:;" tabindex="0">${name}</a>`).slice(0, Math.min(matchingCountries.length, 25)).join("");
    this.suggestionContainer.innerHTML = newHTML;
    const nodes = this.suggestionContainer.childNodes;
    nodes.forEach((x) => x.addEventListener("click", () => {
      this.inputElement.value = x.getAttribute("data-country-code") || "_";
      this.submit();
    }));
    nodes.forEach((x) => x.addEventListener("keypress", (e) => {
      if (e.key == "Enter") {
        this.inputElement.value = x.getAttribute("data-country-code") || "_";
        this.submit();
      }
    }));
  }
}
const setupSearch = (map2) => {
  let searchInput = document.querySelector('.navbar-searchbar-container-inner > input[type="text"]');
  let searchSuggestionContainer = document.querySelector(".navbar-searchbar-suggestion-container");
  return new SearchController(searchInput, searchSuggestionContainer, map2);
};
export default setupSearch;
