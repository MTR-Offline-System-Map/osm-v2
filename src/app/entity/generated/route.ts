import {RouteStationDTO} from "./routeStation";

export class RouteDTO {

	public readonly id: string;

	public readonly name: string;

	public readonly color: number;

	public readonly number: string;

	public readonly type: string;

	public readonly circularState: "NONE" | "CLOCKWISE" | "ANTICLOCKWISE";

	public readonly hidden: boolean;

	public readonly stations: RouteStationDTO[] = [];

	public readonly durations: number[] = [];

	public readonly depots: string[] = [];

	public constructor(id: string, name: string, color: number, number: string, type: string, circularState: "NONE" | "CLOCKWISE" | "ANTICLOCKWISE", hidden: boolean) {
		this.id = id;
		this.name = name;
		this.color = color;
		this.number = number;
		this.type = type;
		this.circularState = circularState;
		this.hidden = hidden;
	}
}