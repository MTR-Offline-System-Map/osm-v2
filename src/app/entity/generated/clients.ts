import {ClientDTO} from "./client";

export class ClientsDTO {

	public readonly cachedResponseTime: number;

	public readonly clients: ClientDTO[] = [];

	public constructor(cachedResponseTime: number) {
		this.cachedResponseTime = cachedResponseTime;
	}
}