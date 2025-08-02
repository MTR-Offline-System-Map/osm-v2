import {Injectable} from "@angular/core";
import {MapDataService} from "./map-data.service";
import {SimplifyRoutesPipe} from "../pipe/simplifyRoutesPipe";
import {Route} from "../entity/route";
import {SelectableDataServiceBase} from "./selectable-data-service-base";
import {DimensionService} from "./dimension.service";
import {pushIfNotExists} from "../data/utilities";
import {MapSelectionService} from "./map-selection.service";

@Injectable({providedIn: "root"})
export class RouteVariationService extends SelectableDataServiceBase<void, Route> {
	public readonly routeStationDetails: { id: string, name: string }[] = [];

	constructor(private readonly routeKeyService: RouteKeyService, dimensionService: DimensionService) {
		super(routeId => {
			this.routeStationDetails.length = 0;
			const selectedRoutes = this.routeKeyService.getSelectedData();
			const selectedRoute = selectedRoutes ? selectedRoutes.find(route => route.id === routeId) ?? selectedRoutes[0] : undefined;
			if (selectedRoute) {
				for (let i = 0; i < selectedRoute.routePlatforms.length; i++) {
					const {station} = selectedRoute.routePlatforms[i];
					this.routeStationDetails.push({id: station.id, name: station.name});
				}
			}
			return selectedRoute;
		}, () => {
		}, () => {
		}, () => {
		}, 0, dimensionService);

		routeKeyService.selectionChanged.subscribe(() => this.select(""));
	}
}

@Injectable({providedIn: "root"})
export class RouteKeyService extends SelectableDataServiceBase<void, Route[]> {

	constructor(mapDataService: MapDataService, mapSelectionService: MapSelectionService, dimensionService: DimensionService) {
		super(routeKey => {
			mapSelectionService.selectedStationConnections.length = 0;
			mapSelectionService.selectedStations.length = 0;
			const selectedRouteVariations: Route[] = [];
			const tempStationConnections: Record<string, { stationIds: [string, string], routeColor: number }> = {};
			let mapUpdated = false;

			mapDataService.routes.forEach(route => {
				if (SimplifyRoutesPipe.getRouteKey(route) === routeKey) {
					selectedRouteVariations.push(route);

					// Update list of selected stations
					for (let i = 0; i < route.routePlatforms.length - 1; i++) {
						const stationId1 = route.routePlatforms[i].station.id;
						const stationId2 = route.routePlatforms[i + 1].station.id;
						const reverse = stationId1 > stationId2;
						const newStationId1 = reverse ? stationId2 : stationId1;
						const newStationId2 = reverse ? stationId1 : stationId2;
						tempStationConnections[`${newStationId1}_${newStationId2}`] = {stationIds: [newStationId1, newStationId2], routeColor: route.color};
						pushIfNotExists(mapSelectionService.selectedStations, stationId1);
						pushIfNotExists(mapSelectionService.selectedStations, stationId2);
					}

					// Update map visibility
					if (mapDataService.routeTypeVisibility[route.type] === "HIDDEN") {
						mapDataService.routeTypeVisibility[route.type] = "SOLID";
						mapUpdated = true;
					}
				}
			});

			if (mapUpdated) {
				mapDataService.updateData();
			}

			SimplifyRoutesPipe.sortRoutes(selectedRouteVariations);
			Object.values(tempStationConnections).forEach(stationConnection => mapSelectionService.selectedStationConnections.push(stationConnection));
			mapSelectionService.select("route");
			return selectedRouteVariations;
		}, () => mapSelectionService.reset("route"), () => {
		}, () => {
		}, 0, dimensionService);
	}
}
