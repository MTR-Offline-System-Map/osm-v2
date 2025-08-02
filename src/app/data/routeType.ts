export class RouteType {
	constructor(public readonly icon: string, public readonly text: string) {
	}
}

export const ROUTE_TYPES: Record<string, RouteType> = {
	train_normal: new RouteType("directions_railway", $localize`Train`),
	train_light_rail: new RouteType("tram", $localize`Light Rail`),
	train_high_speed: new RouteType("train", $localize`High Speed`),
	boat_normal: new RouteType("sailing", $localize`Ferry`),
	boat_light_rail: new RouteType("directions_boat", $localize`Cruise`),
	boat_high_speed: new RouteType("snowmobile", $localize`Fast Ferry`),
	cable_car_normal: new RouteType("airline_seat_recline_extra", $localize`Cable Car`),
	bus_normal: new RouteType("directions_bus", $localize`Bus`),
	bus_light_rail: new RouteType("local_taxi", $localize`Minibus`),
	bus_high_speed: new RouteType("airport_shuttle", $localize`Express Bus`),
	airplane_normal: new RouteType("flight", $localize`Plane`),
} as const;
