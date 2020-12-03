import countries, { countryNames } from "./countries";
import { MapController } from "./map";

class SearchController {
    constructor(input: HTMLInputElement, suggestionContainer: HTMLDivElement, map: MapController) {
        this.inputElement = input;
        this.suggestionContainer = suggestionContainer;
        this.map = map;

        this.inputElement.addEventListener('input', this.onValueChange.bind(this));
        this.inputElement.addEventListener('keypress', this.onKeyPress.bind(this));
        this.inputElement.addEventListener('keydown', this.onKeyDown.bind(this));

        this.inputElement.addEventListener('focus', () => {
            this.rerenderSuggestions();
        });

        this.inputElement.addEventListener('blur', (e) => {
            console.log('Focuse received by: ');
            console.log(e.relatedTarget);
        });
    }

    private onKeyDown(e: KeyboardEvent) {
        if (e.key === 'Tab') {
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();

            (this.suggestionContainer.firstChild as HTMLElement | null)?.focus();
            console.log('Giving focus to: ');
            console.log(this.suggestionContainer.firstChild);
        }
    }

    private onKeyPress(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            this.submit();
        }
    }

    private submit() {
        const value = this.inputElement.value.trim();
        this.inputElement.value = '';

        var matchingCountries = Object.entries(countryNames).filter(([code, name]) => code.toLowerCase().startsWith(value.toLowerCase()) || name.toLowerCase().startsWith(value.toLowerCase()));

        if (matchingCountries.length != 0) {
            const matchingCountryCode = matchingCountries[0][0];
            const pos = countries[matchingCountryCode] || [0, 0];
            this.map.moveTo(pos, 6);
        }

        (document.activeElement as HTMLElement | null)?.blur();
    }

    private onValueChange() {
        this.rerenderSuggestions();
    }

    private rerenderSuggestions() {
        const value = this.inputElement.value.trim();
        var matchingCountries = Object.entries(countryNames).filter(([code, name]) => code.toLowerCase().startsWith(value.toLowerCase()) || name.toLowerCase().startsWith(value.toLowerCase()));

        var newHTML = matchingCountries
            .map(([code, name]) => `<a class="navbar-searchbar-item" data-country-code=${code} href="javascript:;" tabindex="0">${name}</a>`)
            .slice(0, Math.min(matchingCountries.length, 25))
            .join('');

        this.suggestionContainer.innerHTML = newHTML;
        const nodes = this.suggestionContainer.childNodes as any as HTMLElement[];

        nodes.forEach((x) => x.addEventListener('click', () => {
            // TODO: Massive hack
            this.inputElement.value = (x as HTMLDivElement).getAttribute('data-country-code') || '_';
            this.submit();
        }));

        nodes.forEach((x) => x.addEventListener('keypress', (e) => {
            if (e.key == 'Enter') {
                // TODO: Massive hack
                this.inputElement.value = (x as HTMLDivElement).getAttribute('data-country-code') || '_';
                this.submit();
            }
        }));
    }

    private inputElement: HTMLInputElement;
    private suggestionContainer: HTMLDivElement;
    private map: MapController;
}

// TODO: Everything
const setupSearch = (map: MapController) => {
    let searchInput = document.querySelector('.navbar-searchbar-container-inner > input[type="text"]') as HTMLInputElement;
    let searchSuggestionContainer = document.querySelector('.navbar-searchbar-suggestion-container') as HTMLDivElement;

    return new SearchController(searchInput, searchSuggestionContainer, map);
}

export default setupSearch;