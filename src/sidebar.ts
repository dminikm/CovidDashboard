import api from "./api";
import { CovidCountrySummary, CovidSummary } from "./data/summary";

export interface SidebarContent {
    render(): string;
    onMount(elem: HTMLDivElement): void;
}

export class GlobalSidebarContent implements SidebarContent {
    constructor(summary: CovidSummary) {
        this.summary = summary;
    }

    public async onMount(elem: HTMLDivElement) {
        
    }

    public render() {
        return `
            <h1>Global cases</h1>
            As of: ${new Date(this.summary.Date).toLocaleString()}

            <br><br>

            <table style="width: 80%;">
                <tbody>
                    <tr>
                        <td>Active cases: </td>
                        <td style="text-align: right;">${this.summary.Global.TotalConfirmed - (this.summary.Global.TotalDeaths + this.summary.Global.TotalRecovered)}</td>
                    </tr>
                    <tr>
                        <td>Total cases: </td>
                        <td style="text-align: right;">${this.summary.Global.TotalConfirmed}</td>

                        <td>&nbsp;&nbsp;</td>

                        <td>New: </td>
                        <td style="text-align: right;">${this.summary.Global.NewConfirmed}</td>
                    </tr>
                    <tr>
                        <td>Total deaths:</td>
                        <td style="text-align: right;">${this.summary.Global.TotalDeaths}</td>

                        <td>&nbsp;&nbsp;</td>

                        <td>New: </td>
                        <td style="text-align: right;">${this.summary.Global.NewDeaths}</td>
                    </tr>
                    <tr>
                        <td>Total recovered:</td>
                        <td style="text-align: right;">${this.summary.Global.TotalRecovered}</td>

                        <td>&nbsp;&nbsp;</td>

                        <td>New: </td>
                        <td style="text-align: right;">${this.summary.Global.NewRecovered}</td>
                    </tr>
                </tbody>
            </table>
        `;
    }

    private summary: CovidSummary;
}

export class CountrySidebarContent implements SidebarContent {
    constructor(summary: CovidCountrySummary) {
        this.summary = summary;
    }

    public async onMount(elem: HTMLDivElement) {
        this.canvas = elem.querySelector('#sidebar-canvas')! as HTMLCanvasElement;
        const ctx = this.canvas.getContext('2d')!;  

        let total = true;
        let month = false;

        let totalSelector = elem.querySelector('#sidebar-total-selector') as HTMLAnchorElement;
        let newSelector = elem.querySelector('#sidebar-new-selector') as HTMLAnchorElement;
        let weekSelector = elem.querySelector('#sidebar-week-selector') as HTMLAnchorElement;
        let monthSelector = elem.querySelector('#sidebar-month-selector') as HTMLAnchorElement;

        totalSelector.classList.add('selected');
        weekSelector.classList.add('selected');

        const chart = new Chart(ctx, {
            type: 'line',
        });

        const update = () => {
            if (total) {
                this.onShowTotalChart(chart, month);
            } else {
                this.onShowNewChart(chart, month);
            }
        };

        totalSelector.addEventListener('click', () => {
            if (total)
                return;

            totalSelector.classList.add('selected');
            newSelector.classList.remove('selected');

            total = true;

            update();
        });

        newSelector.addEventListener('click', () => {
            if (!total)
                return;

            totalSelector.classList.remove('selected');
            newSelector.classList.add('selected');

            total = false;

            update();
        });

        weekSelector.addEventListener('click', () => {
            if (!month)
                return;

            weekSelector.classList.add('selected');
            monthSelector.classList.remove('selected');

            month = false;

            update();
        });

        monthSelector.addEventListener('click', () => {
            if (month)
                return;

            weekSelector.classList.remove('selected');
            monthSelector.classList.add('selected');

            month = true;

            update();
        });

        update();
    }

    public render() {
        return `
            <h1>${this.summary.Country}</h1>
            As of: ${new Date(this.summary.Date).toLocaleString()}

            <br><br>

            <table style="width: 80%;">
                <tbody>
                    <tr>
                        <td>Active cases: </td>
                        <td style="text-align: right;">${this.summary.TotalConfirmed - (this.summary.TotalDeaths + this.summary.TotalRecovered)}</td>
                    </tr>
                    <tr>
                        <td>Total cases: </td>
                        <td style="text-align: right;">${this.summary.TotalConfirmed}</td>

                        <td>&nbsp;&nbsp;</td>

                        <td>New: </td>
                        <td style="text-align: right;">${this.summary.NewConfirmed}</td>
                    </tr>
                    <tr>
                        <td>Total deaths:</td>
                        <td style="text-align: right;">${this.summary.TotalDeaths}</td>

                        <td>&nbsp;&nbsp;</td>

                        <td>New: </td>
                        <td style="text-align: right;">${this.summary.NewDeaths}</td>
                    </tr>
                    <tr>
                        <td>Total recovered:</td>
                        <td style="text-align: right;">${this.summary.TotalRecovered}</td>

                        <td>&nbsp;&nbsp;</td>

                        <td>New: </td>
                        <td style="text-align: right;">${this.summary.NewRecovered}</td>
                    </tr>
                </tbody>
            </table>

            <h1>Case timeline</h1>

            <div>
                <a href="#" id="sidebar-total-selector">Total</a> &nbsp;
                <a href="#" id="sidebar-new-selector">New</a> &nbsp;
                | &nbsp;
                <a href="#" id="sidebar-week-selector">Week</a> &nbsp;
                <a href="#" id="sidebar-month-selector">Month</a>
            </div> <br>

            <canvas width="400" height="300" style="width: 400px; height: 300px;" id="sidebar-canvas"></canvas>
        `;
    }

    private subMonthsFromDate(date: Date, numMonths: number) {
        let newDate = new Date(date.getTime());
        const month = newDate.getMonth();
        newDate.setMonth(newDate.getMonth() - numMonths);

        if (((month - numMonths < 0) && (date.getMonth() != (month + numMonths))) ||
            ((month - numMonths >= 0) && (date.getMonth() != month - numMonths))
            ) {
            newDate.setDate(0);
        }

        return newDate;
    }

    private async onShowTotalChart(chart: Chart, month: boolean) {
        const to = new Date();
        to.setHours(0, 0, 0, 0);

        const from = new Date(to.getTime());

        if (month) {
            from.setTime(this.subMonthsFromDate(from, 1).getTime());
        } else {
            from.setDate(from.getDate() - 7); 
        }

        const result = await api.byCountry(this.summary.CountryCode, from, to);
        const labels = result.map((x) => month ? new Date(x.Date).getDate() + '.' + new Date(x.Date).getMonth() : new Date(x.Date).toLocaleString('en-us', {  weekday: 'long' }));

        const confirmedDataset = {
            label: 'Confirmed',
            data: result.map((x) => x.Confirmed),
            backgroundColor: '#FFFF0030'
        };

        const deathDataset = {
            label: 'Deaths',
            data: result.map((x) => x.Deaths),
            backgroundColor: '#FF000030'
        };

        const recoveredDataset = {
            label: 'Recovered',
            data: result.map((x) => x.Recovered),
            backgroundColor: '#00FF0030'
        };

        const activeDatatset = {
            label: 'Active',
            data: result.map((x) =>x.Active),
            backgroundColor: '#0000FF30'
        }

        chart.data = {
            labels: labels,
            datasets: [
                confirmedDataset,
                deathDataset,
                recoveredDataset,
                activeDatatset
            ]
        }

        chart.update();
    }

    private async onShowNewChart(chart: Chart, month: boolean) {
        const to = new Date();
        to.setHours(0, 0, 0, 0);

        const from = new Date(to.getTime());

        if (month) {
            from.setTime(this.subMonthsFromDate(from, 1).getTime());
            from.setDate(from.getDate() - 1);
        } else {
            from.setDate(from.getDate() - 8);
        }

        const result = await api.byCountry(this.summary.CountryCode, from, to);
        const labels = result.map((x) => month ? new Date(x.Date).getDate() + '.' + new Date(x.Date).getMonth() : new Date(x.Date).toLocaleString('en-us', {  weekday: 'long' })).slice(1);

        const confirmedDataset = {
            label: 'Confirmed',
            data: result.map((x, i, arr) => x.Confirmed - ((arr[i - 1] || {Confirmed: x.Confirmed}).Confirmed)).slice(1),
            backgroundColor: '#FFFF0030'
        };

        const deathDataset = {
            label: 'Deaths',
            data: result.map((x, i, arr) => x.Deaths - ((arr[i - 1] || {Active: x.Deaths}).Deaths)).slice(1),
            backgroundColor: '#FF000030'
        };

        const recoveredDataset = {
            label: 'Recovered',
            data: result.map((x, i, arr) => x.Recovered  - ((arr[i - 1] || {Recovered: x.Recovered}).Recovered)).slice(1),
            backgroundColor: '#00FF0030'
        };

        const activeDatatset = {
            label: 'Active',
            data: result.map((x, i, arr) => x.Active - ((arr[i - 1] || {Active: x.Active}).Active)).slice(1),
            backgroundColor: '#0000FF30'
        }

        chart.data = {
            labels: labels,
            datasets: [
                confirmedDataset,
                deathDataset,
                recoveredDataset,
                activeDatatset
            ]
        }

        chart.update();
    }

    private summary: CovidCountrySummary;
    private canvas?: HTMLCanvasElement;
}

export class SidebarController {
    constructor(sidebarElement: HTMLDivElement) {
        this.sidebarElement = sidebarElement;
        this.toggleElement = sidebarElement.querySelector('.sidebar-opener')! as HTMLDivElement;
        this.sidebarInner = sidebarElement.querySelector('.sidebar-content')! as HTMLDivElement;
        this.isOpen = false;

        this.toggleElement.addEventListener('click', this.toggle.bind(this));
    }

    public open() {
        if (this.isOpen)
            return;

        this.sidebarElement.classList.add('content-sidebar-container-open');
        this.sidebarElement.classList.remove('content-sidebar-container-closed');
        this.toggleElement.innerText = '>>';

        this.isOpen = true;
    }

    public close() {
        if (!this.isOpen)
            return;

        this.sidebarElement.classList.add('content-sidebar-container-closed');
        this.sidebarElement.classList.remove('content-sidebar-container-open');
        this.toggleElement.innerText = '<<';

        this.isOpen = false;
    }

    public toggle() {
        this.isOpen ?
            this.close() :
            this.open();
    }

    public setContent(content: SidebarContent) {
        this.sidebarInner.innerHTML = content.render();
        content.onMount(this.sidebarInner);
    }

    private sidebarElement: HTMLDivElement;
    private sidebarInner: HTMLDivElement;
    private toggleElement: HTMLDivElement;

    private isOpen: boolean;
}

const setupSidebar = (sidebar: HTMLDivElement) => {
    return new SidebarController(sidebar);
};

export default setupSidebar;