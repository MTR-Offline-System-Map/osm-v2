
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

	public readonly startTime: number;

	public constructor(startTime: number) {
		this.startTime = startTime;
	}
}