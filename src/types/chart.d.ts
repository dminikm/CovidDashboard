interface ChartDataset {
    label?: string,
    data?: any[],
    backgroundColor?: string[] | string,
    borderColor?: string[],
    borderWidth?: number,
}

interface ChartData {
    labels?: string[],
    datasets?: ChartDataset[],
}

interface ChartAxisTickScaleOptions {
    beginAtZero?: boolean
}

interface ChartAxisScaleOptions {
    ticks?: ChartAxisTickScaleOptions
}

interface ChartScaleOptions {
    xAxes?: ChartAxisScaleOptions[],
    yAxes?: ChartAxisScaleOptions[]
}

interface ChartOptions {
    scales?: ChartScaleOptions
}

interface ChartParams {
    type: string
    data?: ChartData,
    options?: ChartOptions,
}

declare class Chart {
    constructor(ctx: CanvasRenderingContext2D, params?: ChartParams);
    public update(config?: any): void;

    public data: ChartData

}

declare global {
    interface Window {
        Chart: Chart
    }
}