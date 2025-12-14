import {DepotDTO} from "./depot";
import {RouteDTO} from "./route";
import {StationDTO} from "./station";

export class StationsAndRoutesDTO {

	public readonly stations: StationDTO[] = [];

	public readonly routes: RouteDTO[] = [];

	public readonly depots: DepotDTO[] = [];

	public readonly dimensions: string[] = [];
	
	public readonly offline: boolean = false;

	public readonly includeMarkers: boolean = false;

	public readonly disableAutoDetectBusRoutes: boolean = false;

	public constructor() {
	}
}