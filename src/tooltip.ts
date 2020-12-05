import { CovidCountrySummary } from './data/summary';

export interface Tooltip {
    render: () => string;
}

export class CountryTooltip implements Tooltip {
    constructor(summary: CovidCountrySummary) {
        this.summary = summary;
    }

    public render() {
        return `
            ${this.summary.Country} <br><br>
            Total cases: ${this.summary.TotalConfirmed} (+${this.summary.NewConfirmed}) <br>
            Total deaths: ${this.summary.TotalDeaths} (+${this.summary.NewDeaths}) <br>
            Total recovered: ${this.summary.TotalRecovered} (+${this.summary.NewRecovered})
        `;
    }

    private summary: CovidCountrySummary;
}

export class TooltipController {
    constructor(tooltipContainer: HTMLDivElement) {
        this.tooltipContainer = tooltipContainer;
        this.tooltipElement = this.createTooltipElement();
        tooltipContainer.appendChild(this.tooltipElement);
        tooltipContainer.addEventListener('mousemove', this.onMouseMove.bind(this));

        this.shown = false;
    }

    private createTooltipElement() {
        let elem = document.createElement('div');
        elem.classList.add('tooltip-container');
        elem.classList.add('tooltip-container-hidden');

        return elem;
    }

    public show() {
        if (this.shown)
            return;

        this.tooltipElement.classList.remove('tooltip-container-hidden');
        this.tooltipElement.classList.add('tooltip-container-shown');

        this.shown = true;
    }

    public hide() {
        if (!this.shown)
            return;

        this.tooltipElement.classList.add('tooltip-container-hidden');
        this.tooltipElement.classList.remove('tooltip-container-shown');

        this.shown = false;
    }

    public setContent(tip: Tooltip) {
        this.tooltipElement.innerHTML = tip.render();
    }

    private onMouseMove(e: MouseEvent) {
        if (!this.shown)
            return;

        const rect = this.tooltipContainer.getBoundingClientRect();
        const tooltipRect = this.tooltipElement.getBoundingClientRect();


        const x = Math.max(0, Math.min(rect.width - tooltipRect.width, (e.clientX - rect.x - (tooltipRect.width / 2))));
        const y = Math.max(0, Math.min(rect.height - tooltipRect.height, (e.clientY - rect.y - tooltipRect.height - 15)));

        this.tooltipElement.style.left = `${x}px`;
        this.tooltipElement.style.top = `${y}px`;
    }

    private tooltipContainer: HTMLDivElement;
    private tooltipElement: HTMLDivElement;
    private shown: boolean;
}

const setupTooltips = (mapContainer: HTMLDivElement) => {
    return new TooltipController(mapContainer);
};

export default setupTooltips;