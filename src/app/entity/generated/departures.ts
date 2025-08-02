import {DeparturesByRouteDTO} from "./departuresByRoute";

export class DeparturesDTO {

	public readonly cachedResponseTime: number;

	public readonly departures: DeparturesByRouteDTO[] = [];

	public constructor(cachedResponseTime: number) {
		this.cachedResponseTime = cachedResponseTime;
	}
}