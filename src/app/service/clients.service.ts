import {Injectable} from "@angular/core";
import {DimensionService} from "./dimension.service";
import {DataServiceBase} from "./data-service-base";
import {MapDataService} from "./map-data.service";
import {ClientsDTO} from "../entity/generated/clients";
import {Station} from "../entity/station";
import {Route} from "../entity/route";
import {setIfUndefined} from "../data/utilities";

const REFRESH_INTERVAL = 3000;

@Injectable({providedIn: "root"})
export class ClientsService extends DataServiceBase<{ data: ClientsDTO }> {
	public readonly allClients: { id: string, name: string, rawX: number, rawZ: number }[] = [];
	public readonly allClientsNotInStationOrRoute: { id: string, name: string, rawX: number, rawZ: number }[] = [];
	private clientGroupsForStation: Record<string, {
		clients: {
			id: string,
			name: string,
		}[],
		x: number,
		z: number,
		station?: Station,
		route?: Route,
		routeStationId1: string,
		routeStationId2: string,
	}> = {};
	private clientGroupsForRoute: Record<string, {
		clients: {
			id: string,
			name: string,
		}[],
		x: number,
		z: number,
		station?: Station,
		route?: Route,
		routeStationId1: string,
		routeStationId2: string,
	}> = {};

	constructor(mapDataService: MapDataService, dimensionService: DimensionService) {
		super(() => {}, ({data}) => {
			data.clients.forEach(clientDTO => {
				const route = clientDTO.routeId ? mapDataService.routes.find(route => route.id === clientDTO.routeId) : undefined;
				const station = (!route || route.routePlatforms.some(({station}) => station.id === clientDTO.stationId)) && clientDTO.stationId ? mapDataService.stations.find(station => station.id === clientDTO.stationId) : undefined;
				if (station) {
					setIfUndefined(this.clientGroupsForStation, clientDTO.stationId, () => ({
						clients: [],
						x: station.x,
						z: station.z,
						station,
						route,
						routeStationId1: "",
						routeStationId2: "",
					}));
				} else if (route) {
					const reverse = clientDTO.routeStationId1 > clientDTO.routeStationId2;
					const newRouteStationId1 = reverse ? clientDTO.routeStationId2 : clientDTO.routeStationId1;
					const newRouteStationId2 = reverse ? clientDTO.routeStationId1 : clientDTO.routeStationId2;
					const key = ClientsService.getRouteConnectionKey(newRouteStationId1, newRouteStationId2, route.color);
					setIfUndefined(this.clientGroupsForRoute, key, () => ({
						clients: [],
						x: clientDTO.x,
						z: clientDTO.z,
						station: undefined,
						route,
						routeStationId1: newRouteStationId1,
						routeStationId2: newRouteStationId2,
					}));
				}
			});
		}, REFRESH_INTERVAL, dimensionService);
		mapDataService.dataProcessed.subscribe(() => this.fetchData(""));
	}

	public static getRouteConnectionKey(stationId1: string, stationId2: string, color: number) {
		return `${stationId1}_${stationId2}_${color}`;
	}
}
