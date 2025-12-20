import {Component, EventEmitter, inject, Output} from "@angular/core";
import {MapDataService} from "../../service/map-data.service";
import {DimensionService} from "../../service/dimension.service";
import {DepotService} from "../../service/depot.service";
import {TitleComponent} from "../title/title.component";
import {DividerModule} from "primeng/divider";
import {Checkbox} from "primeng/checkbox";
import {FormatNamePipe} from "../../pipe/formatNamePipe";
import {FormatColorPipe} from "../../pipe/formatColorPipe";
import {DataListEntryComponent} from "../data-list-entry/data-list-entry.component";
import {ButtonModule} from "primeng/button";
import {environment} from "../../../environments/environment";
import {SimplifyRoutesPipe} from "../../pipe/simplifyRoutesPipe";

@Component({
    selector: "app-depot-panel",
    imports: [
		ButtonModule,
        TitleComponent,
        DividerModule,
        Checkbox,
        FormatNamePipe,
        FormatColorPipe,
        DataListEntryComponent,
    ],
    templateUrl: "./depot-panel.component.html",
    styleUrl: "./depot-panel.component.css",
})
export class DepotPanelComponent {
    private readonly dataService = inject(MapDataService);
    private readonly depotService = inject(DepotService);
    private readonly dimensionService = inject(DimensionService);

    @Output() routeClicked = new EventEmitter<string>();

    getDepot() {
        return this.depotService.getSelectedData();
    }

    getCoordinatesText() {
        const depot = this.depotService.getSelectedData();
        return depot === undefined ? "" : `${depot.x}, ${depot.z})`;
    }

    getRoutes() {
        return this.depotService.routesAtDepot;
    }

    getRouteKey(route: { color: number, name: string, number: string }) {
        return SimplifyRoutesPipe.getRouteKey(route);
    }

	mapRouteVariations(variations: string[]): [string, string][] {
		return variations.map(variation => [variation, ""]);
	}
    
    copyLocation(icon: HTMLDivElement) {
		icon.innerText = "check";
		const depot = this.depotService.getSelectedData();
		navigator.clipboard.writeText(depot === undefined ? "" : `${depot.x} 0 ${depot.z}`).then();
		setTimeout(() => icon.innerText = "content_copy", 1000);
	}

	focus() {
		const depot = this.depotService.getSelectedData();
		if (depot) {
			this.dataService.animateMap.emit({x: depot.x, z: depot.z});
		}
	}

    getEnableViewOnWorldMap() {
        return environment.worldMapLink.enable(this.dimensionService.getDimensionIndex());
    }

	viewOnWorldMap() {
		const depot = this.depotService.getSelectedData();
		if (depot) {
			location.assign(environment.worldMapLink.exec(this.dimensionService.getDimensionIndex(), Math.round(depot.x), Math.round(depot.z)));
		}
	}

    getBetterScroll() {
        return this.dataService.getBetterScroll();
    }
}