
export class DirectionsConnectionDTO {

	public readonly routeId: string;

	public readonly startStationId: string;

	public readonly endStationId: string;

	public readonly startPlatformName: string;

	public readonly endPlatformName: string;

	public readonly startTime: number;

	public readonly endTime: number;

	public readonly walkingDistance: number;

	public constructor(routeId: string, startStationId: string, endStationId: string, startPlatformName: string, endPlatformName: string, startTime: number, endTime: number, walkingDistance: number) {
		this.routeId = routeId;
		this.startStationId = startStationId;
		this.endStationId = endStationId;
		this.startPlatformName = startPlatformName;
		this.endPlatformName = endPlatformName;
		this.startTime = startTime;
		this.endTime = endTime;
		this.walkingDistance = walkingDistance;
	}
}