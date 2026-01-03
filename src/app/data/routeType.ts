export class RouteType {
	constructor(public readonly icon: string, public readonly text: string) {
	}
}

export const ROUTE_TYPES: Record<string, RouteType> = {
	train_normal: new RouteType("directions_railway", "route_type.train_normal"),
	train_light_rail: new RouteType("tram", "route_type.train_light_rail"),
	train_high_speed: new RouteType("train", "route_type.train_high_speed"),
	boat_normal: new RouteType("sailing", "route_type.boat_normal"),
	boat_light_rail: new RouteType("directions_boat", "route_type.boat_light_rail"),
	boat_high_speed: new RouteType("snowmobile", "route_type.boat_high_speed"),
	cable_car_normal: new RouteType("airline_seat_recline_extra", "route_type.cable_car_normal"),
	bus_normal: new RouteType("directions_bus", "route_type.bus_normal"),
	bus_light_rail: new RouteType("local_taxi", "route_type.bus_light_rail"),
	bus_high_speed: new RouteType("airport_shuttle", "route_type.bus_high_speed"),
	airplane_normal: new RouteType("flight", "route_type.airplane_normal"),
} as const;
