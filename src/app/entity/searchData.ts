export class SearchData {
	public readonly id?: string[] = []; // Search Route ID
	public readonly key: string = "";
	public readonly icons: string[] = [];
	public readonly color?: number;
	public readonly name: string = "";
	public readonly number: string = "";
	public readonly type: "station" | "route" | "client" | "depot" = "station";
}
