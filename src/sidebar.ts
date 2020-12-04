export class SidebarController {
    constructor(sidebarElement: HTMLDivElement) {
        this.sidebarElement = sidebarElement;
        this.toggleElement = sidebarElement.querySelector('.sidebar-opener')! as HTMLDivElement;
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

    private sidebarElement: HTMLDivElement;
    private toggleElement: HTMLDivElement;

    private isOpen: boolean;
}

const setupSidebar = (sidebar: HTMLDivElement) => {
    return new SidebarController(sidebar);
};

export default setupSidebar;