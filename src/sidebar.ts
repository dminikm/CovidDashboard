import api from "./api";
import { CovidCountrySummary } from "./data/summary";

export interface SidebarContent {
    render(): string;
    onMount(elem: HTMLDivElement): void;
}

export class CountrySidebarContent implements SidebarContent {
    constructor(summary: CovidCountrySummary) {
        this.summary = summary;
    }

    public async onMount(elem: HTMLDivElement) {
        this.canvas = elem.querySelector('#sidebar-canvas')! as HTMLCanvasElement;
        const ctx = this.canvas.getContext('2d')!;

        // Week
        const to = new Date();
        to.setHours(0, 0, 0, 0);

        const from = new Date(to.getTime());
        from.setDate(from.getDate() - 7);

        const result = await api.byCountry(this.summary.CountryCode, from, to);

        const labels = result.map((x) => new Date(x.Date).toLocaleString('en-us', {  weekday: 'long' }));

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

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    confirmedDataset,
                    deathDataset,
                    recoveredDataset
                ]
            }
        });

        /*const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });*/
    }

    public render() {
        return `
            <h1>${this.summary.Country}</h1>
            As of: ${new Date(this.summary.Date).toLocaleString()}

            <br><br>

            <table style="width: 80%;">
                <tbody>
                    <tr>
                        <td>Live Cases: </td>
                        <td style="text-align: right;">${this.summary.TotalConfirmed - this.summary.TotalDeaths - this.summary.TotalRecovered}</td>
                    </tr>
                    <tr>
                        <td>Total Cases: </td>
                        <td style="text-align: right;">${this.summary.TotalConfirmed}</td>

                        <td>&nbsp;&nbsp;</td>

                        <td>New: </td>
                        <td style="text-align: right;">${this.summary.NewConfirmed}</td>
                    </tr>
                    <tr>
                        <td>Total Deaths:</td>
                        <td style="text-align: right;">${this.summary.TotalDeaths}</td>

                        <td>&nbsp;&nbsp;</td>

                        <td>New: </td>
                        <td style="text-align: right;">${this.summary.NewDeaths}</td>
                    </tr>
                    <tr>
                        <td>Total recoveries:</td>
                        <td style="text-align: right;">${this.summary.TotalRecovered}</td>

                        <td>&nbsp;&nbsp;</td>

                        <td>New: </td>
                        <td style="text-align: right;">${this.summary.NewRecovered}</td>
                    </tr>
                </tbody>
            </table>

            <h1>Covid timeline</h1>
            <canvas width="400" height="300" style="width: 400px; height: 300px;" id="sidebar-canvas"></canvas>
        `;
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