import {EventEmitter, inject, Injectable} from "@angular/core";
import {Config} from "../entity/config";
import {HttpClient} from "@angular/common/http";
import {config} from "../../environments/environment";

@Injectable({providedIn: "root"})
export class ConfigService {
    private readonly httpClient = inject(HttpClient);
    
    private readonly defaultUrlTemplate = `${document.location.origin}${document.location.pathname}mtr/api/map/\${endpoint}?dimension=\${dimensionIndex}`
    private config = new Config({"*": {"*": this.defaultUrlTemplate}}, {dimensions: [], link: {}}, [], {enable: false, onlineDimensions: 0}, "https://minotar.net/helm/${uuid}", [], [], [], [], [], []);

    public readonly refreshConfig = new EventEmitter<void>();

    constructor() {
        const observable = this.httpClient.get<Config>(`${document.location.origin}${document.location.pathname}${config}`);
        if (observable) {
            observable.subscribe({
				next: data => {
                    this.config = data;
                    this.refreshConfig.emit();
				},
				error: error => {
                    console.error(error);
				},
			});
        }
    }

    public getDimensionIndex(origin: number, length: number) {
        return this.config.historicalMap.enable ? (origin < this.config.historicalMap.onlineDimensions ? origin : length - origin + this.config.historicalMap.onlineDimensions - 1) : origin;
    }
    
    private formatUrl(url: string, placeholders: Record<string, string>) {
        let q = url;
        Object.entries(placeholders).forEach(([key, value]) => q = q.replaceAll(`\${${key}}`, value));
        return q;
    }

    private getEnable(dimensionIndex: string, dimensions: string[]) {
        if (dimensions.includes("!*") || dimensions.includes("!" + dimensionIndex)) {
            return false;
        }
        if (dimensions.includes("*") || dimensions.includes(dimensionIndex)) {
            return true;
        }
        return false;
    }
    
    public getDataUrl(dimensionIndexOrigin: number, length: number, endpoint: string, placeholders: Record<string, string>) {
        const dimensionIndex = this.getDimensionIndex(dimensionIndexOrigin, length).toString();
        const dimension = this.config.dataUrl[dimensionIndex in this.config.dataUrl ? dimensionIndex : "*"];
        return this.formatUrl(dimension[endpoint in dimension ? endpoint : "*"], {endpoint, dimensionIndex, ...placeholders});
    }

    public getEnableWorldMap(dimensionIndex: number, length: number) {
        return this.getEnable(this.getDimensionIndex(dimensionIndex, length).toString(), this.config.worldMapLink.dimensions);
    }

    public getWorldMapLink(dimensionIndexOrigin: number, length: number, x: number, z: number) {
        const dimensionIndex = this.getDimensionIndex(dimensionIndexOrigin, length).toString();
        if (this.getEnable(dimensionIndex, this.config.worldMapLink.dimensions)) {
            const links = this.config.worldMapLink.link;
            return this.formatUrl(links[dimensionIndex in links ? dimensionIndex : "*"], {dimensionIndex, x: x.toString(), z: z.toString()});
        }
        return "";
    }

    public getConfigDimensions() {
        return this.config.dimensions;
    }
    
    public getEnableHistoricalMap() {
        return this.config.historicalMap.enable;
    }

    public getAvatarUrl(name: string, uuid: string) {
        return this.formatUrl(this.config.avatarApi, {name, uuid});
    }

    public getEnablePathfinder(dimensionIndex: number, length: number) {
        return this.getEnable(this.getDimensionIndex(dimensionIndex, length).toString(), this.config.pathfinder);
    }

    public getEnableTimetable(dimensionIndex: number, length: number) {
        return this.getEnable(this.getDimensionIndex(dimensionIndex, length).toString(), this.config.timetable);
    }

    public getEnableShowHiddenRoutes(dimensionIndex: number, length: number) {
        return this.getEnable(this.getDimensionIndex(dimensionIndex, length).toString(), this.config.enableShowHiddenRoutes);
    }
    
    public getEnableShowEmptyRoutes(dimensionIndex: number, length: number) {
        return this.getEnable(this.getDimensionIndex(dimensionIndex, length).toString(), this.config.enableShowEmptyRoutes);
    }

    public getEnableShowAllStations(dimensionIndex: number, length: number) {
        return this.getEnable(this.getDimensionIndex(dimensionIndex, length).toString(), this.config.enableShowAllStations);
    }

    public getEnableShowDepots(dimensionIndex: number, length: number) {
        return this.getEnable(this.getDimensionIndex(dimensionIndex, length).toString(), this.config.enableShowDepots);
    }
}