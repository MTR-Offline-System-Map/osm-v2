import {inject, Injectable} from "@angular/core";
import {MapDataService} from "./map-data.service";
import {ROUTE_TYPES} from "../data/routeType";
import {DimensionService} from "./dimension.service";
import {SimplifyRoutesPipe} from "../pipe/simplifyRoutesPipe";
import {SelectableDataServiceBase} from "./selectable-data-service-base";
import {Station} from "../entity/station";

const REFRESH_INTERVAL = 3000;

@Injectable({providedIn: "root"})
export class StationService extends SelectableDataServiceBase<void, Station> {
	private readonly dataService = inject(MapDataService);

	public readonly routesAtStation: { name: string, variations: string[], number: string, color: number, typeIcon: string }[] = [];
	private hasTerminating = false;

	constructor() {
		const dimensionService = inject(DimensionService);
		
		super(stationId => this.dataService.stations.find(station => station.id === stationId), () => {
			this.routesAtStation.length = 0;
		}, () => {}, () => {
			const routes: Record<string, { key: string, name: string, number: string, color: number, textLineCount: number, typeIcon: string }> = {};
			this.hasTerminating = false;

			const newRoutes = Object.values(routes);
			SimplifyRoutesPipe.sortRoutes(newRoutes);
		}, REFRESH_INTERVAL, dimensionService);
	}

	public setStation(stationId: string, zoomToStation: boolean) {
		this.select(stationId);
		const newRoutes: Record<string, { name: string, variations: string[], number: string, color: number, typeIcon: string }> = {};
		this.dataService.routes.forEach(({name, number, color, type, routePlatforms}) => {
			if (routePlatforms.some(routePlatform => routePlatform.station.id === this.getSelectedData()?.id)) {
				const key = SimplifyRoutesPipe.getRouteKey({name, number, color});
				const variation = name.split("||")[1];
				if (key in newRoutes) {
					newRoutes[key].variations.push(variation);
				} else {
					newRoutes[key] = {name: name.split("||")[0], variations: [variation], number, color, typeIcon: ROUTE_TYPES[type].icon};
				}
			}
		});
		Object.values(newRoutes).forEach(route => {
			route.variations.sort();
			this.routesAtStation.push(route);
		});
		SimplifyRoutesPipe.sortRoutes(this.routesAtStation);

		this.hasTerminating = false;
		this.fetchData(stationId);

		const selectedStation = this.getSelectedData();
		if (selectedStation) {
			if (selectedStation.routes.every(({type}) => this.dataService.routeTypeVisibility[type] === "HIDDEN")) {
				selectedStation.routes.forEach(({type}) => this.dataService.routeTypeVisibility[type] = "SOLID");
				this.dataService.updateData();
			}
			if (zoomToStation) {
				this.dataService.animateMap.emit({x: selectedStation.x, z: selectedStation.z});
			}
		}
	}

	public getHasTerminating() {
		return this.hasTerminating;
	}
}