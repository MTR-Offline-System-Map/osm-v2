import {RouteDTO} from "./route";
import {StationDTO} from "./station";

export class StationsAndRoutesDTO {

	public readonly stations: StationDTO[] = [];

	public readonly routes: RouteDTO[] = [];

	public readonly dimensions: string[] = [];

	public readonly c324: boolean = false;

	public readonly offline: boolean = false;

	public readonly includeMarkers: boolean = false;

	public constructor() {
	}
}