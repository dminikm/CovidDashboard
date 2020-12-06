import {isLeft} from "../web_modules/fp-ts/lib/Either.js";
import {CovidCountryCasesDecoder} from "./data/country.js";
import {CovidSummaryDecoder} from "./data/summary.js";
export class APIController {
  constructor() {
    this.url = "http://localhost:3002/";
  }
  async fetch(endpoint) {
    const response = await fetch(`${this.url}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.json();
  }
  async summary() {
    const body = await this.fetch("summary");
    const decodeResult = CovidSummaryDecoder.decode(body);
    if (isLeft(decodeResult)) {
      console.error(`Could not decode summary!`);
      decodeResult.left.forEach((x) => console.error(`Invalid ${x.value} at ${x.context} (${x.message || "No other information!"})!`));
      throw "";
    }
    return decodeResult.right;
  }
  async byCountry(code, from, to) {
    const fromStr = `${from.getFullYear().toString().padStart(4, "0")}-${(from.getMonth() + 1).toString().padStart(2, "0")}-${from.getDate().toString().padStart(2, "0")}T00:00:00Z`;
    const toStr = `${to.getFullYear().toString().padStart(4, "0")}-${(to.getMonth() + 1).toString().padStart(2, "0")}-${to.getDate().toString().padStart(2, "0")}T00:00:00Z`;
    const body = await this.fetch(`total/country/${code}?from=${fromStr}&to=${toStr}`);
    const decodeResult = CovidCountryCasesDecoder.decode(body);
    if (isLeft(decodeResult)) {
      console.error(`Could not decode summary!`);
      decodeResult.left.forEach((x) => console.error(`Invalid ${x.value} at ${x.context} (${x.message || "No other information!"})!`));
      throw "";
    }
    return decodeResult.right;
  }
}
const api = new APIController();
export default api;
