import { CovidCountrySummary } from "./data/summary";

export interface SidebarContent {
    render(): string;
}

export class CountrySidebarContent implements SidebarContent {
    constructor(summary: CovidCountrySummary) {
        this.summary = summary;
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

        `;
    }

    private summary: CovidCountrySummary;
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