import api2 from "./api.js";
export class GlobalSidebarContent {
  constructor(summary2) {
    this.summary = summary2;
  }
  async onMount(elem) {
  }
  render() {
    return `
            <h1>Global cases</h1>
            As of: ${new Date(this.summary.Date).toLocaleString()}

            <br><br>

            <table style="width: 80%;">
                <tbody>
                    <tr>
                        <td>Live Cases: </td>
                        <td style="text-align: right;">${this.summary.Global.TotalConfirmed - (this.summary.Global.TotalDeaths + this.summary.Global.TotalRecovered)}</td>
                    </tr>
                    <tr>
                        <td>Total Cases: </td>
                        <td style="text-align: right;">${this.summary.Global.TotalConfirmed}</td>

                        <td>&nbsp;&nbsp;</td>

                        <td>New: </td>
                        <td style="text-align: right;">${this.summary.Global.NewConfirmed}</td>
                    </tr>
                    <tr>
                        <td>Total Deaths:</td>
                        <td style="text-align: right;">${this.summary.Global.TotalDeaths}</td>

                        <td>&nbsp;&nbsp;</td>

                        <td>New: </td>
                        <td style="text-align: right;">${this.summary.Global.NewDeaths}</td>
                    </tr>
                    <tr>
                        <td>Total recoveries:</td>
                        <td style="text-align: right;">${this.summary.Global.TotalRecovered}</td>

                        <td>&nbsp;&nbsp;</td>

                        <td>New: </td>
                        <td style="text-align: right;">${this.summary.Global.NewRecovered}</td>
                    </tr>
                </tbody>
            </table>
        `;
  }
}
export class CountrySidebarContent {
  constructor(summary2) {
    this.summary = summary2;
  }
  async onMount(elem) {
    this.canvas = elem.querySelector("#sidebar-canvas");
    const ctx = this.canvas.getContext("2d");
    let total = true;
    let month = false;
    let totalSelector = elem.querySelector("#sidebar-total-selector");
    let newSelector = elem.querySelector("#sidebar-new-selector");
    let weekSelector = elem.querySelector("#sidebar-week-selector");
    let monthSelector = elem.querySelector("#sidebar-month-selector");
    totalSelector.classList.add("selected");
    weekSelector.classList.add("selected");
    const chart = new Chart(ctx, {
      type: "line"
    });
    const update = () => {
      if (total) {
        this.onShowTotalChart(chart, month);
      } else {
        this.onShowNewChart(chart, month);
      }
    };
    totalSelector.addEventListener("click", () => {
      if (total)
        return;
      totalSelector.classList.add("selected");
      newSelector.classList.remove("selected");
      total = true;
      update();
    });
    newSelector.addEventListener("click", () => {
      if (!total)
        return;
      totalSelector.classList.remove("selected");
      newSelector.classList.add("selected");
      total = false;
      update();
    });
    weekSelector.addEventListener("click", () => {
      if (!month)
        return;
      weekSelector.classList.add("selected");
      monthSelector.classList.remove("selected");
      month = false;
      update();
    });
    monthSelector.addEventListener("click", () => {
      if (month)
        return;
      weekSelector.classList.remove("selected");
      monthSelector.classList.add("selected");
      month = true;
      update();
    });
    update();
  }
  render() {
    return `
            <h1>${this.summary.Country}</h1>
            As of: ${new Date(this.summary.Date).toLocaleString()}

            <br><br>

            <table style="width: 80%;">
                <tbody>
                    <tr>
                        <td>Live Cases: </td>
                        <td style="text-align: right;">${this.summary.TotalConfirmed - (this.summary.TotalDeaths + this.summary.TotalRecovered)}</td>
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
  subMonthsFromDate(date, numMonths) {
    let newDate = new Date(date.getTime());
    const month = newDate.getMonth();
    newDate.setMonth(newDate.getMonth() - numMonths);
    if (month - numMonths < 0 && date.getMonth() != month + numMonths || month - numMonths >= 0 && date.getMonth() != month - numMonths) {
      newDate.setDate(0);
    }
    return newDate;
  }
  async onShowTotalChart(chart, month) {
    const to = new Date();
    to.setHours(0, 0, 0, 0);
    const from = new Date(to.getTime());
    if (month) {
      from.setTime(this.subMonthsFromDate(from, 1).getTime());
    } else {
      from.setDate(from.getDate() - 7);
    }
    const result = await api2.byCountry(this.summary.CountryCode, from, to);
    const labels = result.map((x) => month ? new Date(x.Date).getDate() + "." + new Date(x.Date).getMonth() : new Date(x.Date).toLocaleString("en-us", {weekday: "long"}));
    const confirmedDataset = {
      label: "Confirmed",
      data: result.map((x) => x.Confirmed),
      backgroundColor: "#FFFF0030"
    };
    const deathDataset = {
      label: "Deaths",
      data: result.map((x) => x.Deaths),
      backgroundColor: "#FF000030"
    };
    const recoveredDataset = {
      label: "Recovered",
      data: result.map((x) => x.Recovered),
      backgroundColor: "#00FF0030"
    };
    const activeDatatset = {
      label: "Active",
      data: result.map((x) => x.Active),
      backgroundColor: "#0000FF30"
    };
    chart.data = {
      labels,
      datasets: [
        confirmedDataset,
        deathDataset,
        recoveredDataset,
        activeDatatset
      ]
    };
    chart.update();
  }
  async onShowNewChart(chart, month) {
    const to = new Date();
    to.setHours(0, 0, 0, 0);
    const from = new Date(to.getTime());
    if (month) {
      from.setTime(this.subMonthsFromDate(from, 1).getTime());
      from.setDate(from.getDate() - 1);
    } else {
      from.setDate(from.getDate() - 8);
    }
    const result = await api2.byCountry(this.summary.CountryCode, from, to);
    const labels = result.map((x) => month ? new Date(x.Date).getDate() + "." + new Date(x.Date).getMonth() : new Date(x.Date).toLocaleString("en-us", {weekday: "long"})).slice(1);
    const confirmedDataset = {
      label: "Confirmed",
      data: result.map((x, i, arr) => x.Confirmed - (arr[i - 1] || {Confirmed: x.Confirmed}).Confirmed).slice(1),
      backgroundColor: "#FFFF0030"
    };
    const deathDataset = {
      label: "Deaths",
      data: result.map((x, i, arr) => x.Deaths - (arr[i - 1] || {Active: x.Deaths}).Deaths).slice(1),
      backgroundColor: "#FF000030"
    };
    const recoveredDataset = {
      label: "Recovered",
      data: result.map((x, i, arr) => x.Recovered - (arr[i - 1] || {Recovered: x.Recovered}).Recovered).slice(1),
      backgroundColor: "#00FF0030"
    };
    const activeDatatset = {
      label: "Active",
      data: result.map((x, i, arr) => x.Active - (arr[i - 1] || {Active: x.Active}).Active).slice(1),
      backgroundColor: "#0000FF30"
    };
    chart.data = {
      labels,
      datasets: [
        confirmedDataset,
        deathDataset,
        recoveredDataset,
        activeDatatset
      ]
    };
    chart.update();
  }
}
export class SidebarController {
  constructor(sidebarElement) {
    this.sidebarElement = sidebarElement;
    this.toggleElement = sidebarElement.querySelector(".sidebar-opener");
    this.sidebarInner = sidebarElement.querySelector(".sidebar-content");
    this.isOpen = false;
    this.toggleElement.addEventListener("click", this.toggle.bind(this));
  }
  open() {
    if (this.isOpen)
      return;
    this.sidebarElement.classList.add("content-sidebar-container-open");
    this.sidebarElement.classList.remove("content-sidebar-container-closed");
    this.toggleElement.innerText = ">>";
    this.isOpen = true;
  }
  close() {
    if (!this.isOpen)
      return;
    this.sidebarElement.classList.add("content-sidebar-container-closed");
    this.sidebarElement.classList.remove("content-sidebar-container-open");
    this.toggleElement.innerText = "<<";
    this.isOpen = false;
  }
  toggle() {
    this.isOpen ? this.close() : this.open();
  }
  setContent(content) {
    this.sidebarInner.innerHTML = content.render();
    content.onMount(this.sidebarInner);
  }
}
const setupSidebar = (sidebar) => {
  return new SidebarController(sidebar);
};
export default setupSidebar;
