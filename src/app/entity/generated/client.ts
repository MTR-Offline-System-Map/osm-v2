
export class ClientDTO {

	public readonly id: string;

	public readonly x: number;

	public readonly z: number;

	public readonly stationId: string;

	public readonly routeId: string;

	public readonly routeStationId1: string;

	public readonly routeStationId2: string;

	public constructor(id: string, x: number, z: number, stationId: string, routeId: string, routeStationId1: string, routeStationId2: string) {
		this.id = id;
		this.x = x;
		this.z = z;
		this.stationId = stationId;
		this.routeId = routeId;
		this.routeStationId1 = routeStationId1;
		this.routeStationId2 = routeStationId2;
	}
}