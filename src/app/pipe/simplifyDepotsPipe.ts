import {Pipe, PipeTransform} from "@angular/core";
import {SearchData} from "../entity/searchData";
import {Depot} from "../entity/depot";

@Pipe({
	name: "simplifyDepots",
	pure: true,
	standalone: true,
})
export class SimplifyDepotsPipe implements PipeTransform {

	transform(depots: Depot[]): SearchData[] {
		return depots.map(depot => ({key: depot.id, icons: depot.getIcons(), color: depot.color, name: depot.name, number: "", type: "depot"}));
	}
}
