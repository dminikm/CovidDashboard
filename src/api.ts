import { isLeft } from "fp-ts/lib/Either";
import { CovidSummaryDecoder } from "./data/summary";

export default class APIController {
    constructor() {

    }

    private async fetch(endpoint: string) {
        const response = await fetch(`${this.url}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.json();
    }

    async summary() {
        const body = await this.fetch('summary');
        const decodeResult = CovidSummaryDecoder.decode(body);

        if (isLeft(decodeResult)) {
            // TODO: Better error handling!
            console.error(`Could not decode summary!`);
            decodeResult.left.forEach((x) => console.error(`Invalid ${x.value} at ${x.context} (${x.message || 'No other information!'})!`));
            throw '';
        }

        return decodeResult.right;
    }

    private readonly url = 'http://localhost:3002/';
}