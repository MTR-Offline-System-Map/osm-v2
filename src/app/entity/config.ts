export class Config {
    public readonly dataUrl: Record<string, Record<string, string>>;
    public readonly worldMapLink: { dimensions: string[], link: Record<string, string> };
    public readonly dimensions: string[];
    public readonly historicalMap: { enable: boolean, onlineDimensions: number };
    public readonly avatarApi: string;
    public readonly pathfinder: string[];
    public readonly timetable: string[];
    public readonly enableShowHiddenRoutes: string[];
    public readonly enableShowEmptyRoutes: string[];
    public readonly enableShowAllStations: string[];
    public readonly enableShowDepots: string[];

    constructor(
        dataUrl: Record<string, Record<string, string>>,
        worldMapLink: { dimensions: string[], link: Record<string, string> },
        dimensions: string[],
        historicalMap: { enable: boolean, onlineDimensions: number },
        avatarApi: string,
        pathfinder: string[],
        timetable: string[],
        enableShowHiddenRoutes: string[],
        enableShowEmptyRoutes: string[],
        enableShowAllStations: string[],
        enableShowDepots: string[],
    ) {
        this.dataUrl = dataUrl;
        this.worldMapLink = worldMapLink;
        this.dimensions = dimensions;
        this.historicalMap = historicalMap;
        this.avatarApi = avatarApi;
        this.pathfinder = pathfinder;
        this.timetable = timetable;
        this.enableShowHiddenRoutes = enableShowHiddenRoutes;
        this.enableShowEmptyRoutes = enableShowEmptyRoutes;
        this.enableShowAllStations = enableShowAllStations;
        this.enableShowDepots = enableShowDepots;
    }
}