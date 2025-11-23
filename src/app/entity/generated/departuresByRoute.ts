import {DeparturesByDeviationDTO} from "./departuresByDeviation";

export class DeparturesByRouteDTO {

	public readonly id: string;

	public readonly departures: DeparturesByDeviationDTO[] = [];

	public constructor(id: string) {
		this.id = id;
	}
}