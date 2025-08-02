
export class StationDTO {

	public readonly id: string;

	public readonly name: string;

	public readonly color: number;

	public readonly zone1: number;

	public readonly zone2: number;

	public readonly zone3: number;

	public readonly connections: string[] = [];

	public constructor(id: string, name: string, color: number, zone1: number, zone2: number, zone3: number) {
		this.id = id;
		this.name = name;
		this.color = color;
		this.zone1 = zone1;
		this.zone2 = zone2;
		this.zone3 = zone3;
	}
}