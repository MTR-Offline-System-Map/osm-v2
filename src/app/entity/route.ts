import {Station} from "./station";
import {RouteDTO} from "./generated/route";
import {RouteStationDTO} from "./generated/routeStation";
import {Depot} from "./depot";

export class Route {
	public readonly id: string;
	public readonly name: string;
	public readonly color: number;
	public readonly number: string;
	public readonly type: string;
	public readonly circularState: "NONE" | "CLOCKWISE" | "ANTICLOCKWISE";
	public readonly hidden: boolean;
	public readonly depots: Depot[] = [];
	public readonly routePlatforms: RoutePlatform[] = [];

	constructor(routeDTO: RouteDTO, type: string) {
		this.id = routeDTO.id;
		this.name = routeDTO.name;
		this.color = routeDTO.color;
		this.number = routeDTO.number;
		this.type = type;
		this.circularState = routeDTO.circularState;
		this.hidden = routeDTO.hidden;
		this.depots = routeDTO.depots.map(depot => new Depot(undefined, depot));
	}
}

export class RoutePlatform {
	public readonly station: Station;
	public readonly x: number;
	public readonly y: number;
	public readonly z: number;
	public readonly name: string;
	public readonly dwellTime: number;
	public readonly duration: number;

	constructor(
		routeStationDTO: RouteStationDTO,
		station: Station,
		duration: number,
	) {
		this.station = station;
		this.x = routeStationDTO.x;
		this.y = routeStationDTO.y;
		this.z = routeStationDTO.z;
		this.name = routeStationDTO.name;
		this.dwellTime = routeStationDTO.dwellTime;
		this.duration = duration;
	}
}
