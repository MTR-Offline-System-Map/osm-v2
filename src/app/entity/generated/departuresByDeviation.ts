
export class DeparturesByDeviationDTO {

	public readonly deviation: number;

	public readonly departures: number[] = [];

	public constructor(deviation: number) {
		this.deviation = deviation;
	}
}