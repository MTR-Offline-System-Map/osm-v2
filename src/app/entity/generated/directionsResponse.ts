import {DirectionsConnectionDTO} from "./directionsConnection";

export class DirectionsResponseDTO {

	public readonly connections: DirectionsConnectionDTO[] = [];

	public readonly totalRefreshGraphTime: number;

	public readonly totalRefreshArrivalsTime: number;

	public readonly totalPathFindingTime: number;

	public readonly longestRefreshGraphTime: number;

	public readonly longestRefreshArrivalsTime: number;

	public readonly longestPathFindingTime: number;

	public constructor(totalRefreshGraphTime: number, totalRefreshArrivalsTime: number, totalPathFindingTime: number, longestRefreshGraphTime: number, longestRefreshArrivalsTime: number, longestPathFindingTime: number) {
		this.totalRefreshGraphTime = totalRefreshGraphTime;
		this.totalRefreshArrivalsTime = totalRefreshArrivalsTime;
		this.totalPathFindingTime = totalPathFindingTime;
		this.longestRefreshGraphTime = longestRefreshGraphTime;
		this.longestRefreshArrivalsTime = longestRefreshArrivalsTime;
		this.longestPathFindingTime = longestPathFindingTime;
	}
}