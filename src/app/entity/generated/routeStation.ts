
export class RouteStationDTO {

	public readonly id: string;

	public readonly x: number;

	public readonly y: number;

	public readonly z: number;

	public readonly name: string;

	public readonly dwellTime: number;

	public constructor(id: string, x: number, y: number, z: number, name: string, dwellTime: number) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.z = z;
		this.name = name;
		this.dwellTime = dwellTime;
	}
}