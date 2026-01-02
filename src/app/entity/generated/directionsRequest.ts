
export class DirectionsRequestDTO {

	public startPositionX?: number;

	public startPositionY?: number;

	public startPositionZ?: number;

	public startStationName?: string;

	public startClientId?: string;

	public endPositionX?: number;

	public endPositionY?: number;

	public endPositionZ?: number;

	public endStationName?: string;

	public endClientId?: string;

	public startStationId?: string;

	public endStationId?: string;

	public enableWalkingWild?: boolean;

	public maxWalkingDistance?: number;

	public ignoredLines?: string[];

	public avoidStations?: string[];

	public onlyLRT?: boolean;

	public noHSR?: boolean;

	public noBoats?: boolean;

	public inTheory?: boolean;

	public readonly startTime: number;

	public constructor(startTime: number) {
		this.startTime = startTime;
	}
}