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
import {SimplifyRoutesPipe} from "../../pipe/simplifyRoutesPipe";
import {TooltipModule} from "primeng/tooltip";
import {TranslocoPipe} from "@jsverse/transloco";
import {ConfigService} from "../../service/config.service";

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
		TooltipModule,
        TranslocoPipe,
    ],
    templateUrl: "./depot-panel.component.html",
    styleUrl: "./depot-panel.component.scss",
})
export class DepotPanelComponent {
    private readonly configService = inject(ConfigService);
    private readonly dataService = inject(MapDataService);
    private readonly depotService = inject(DepotService);
    private readonly dimensionService = inject(DimensionService);

    @Output() routeClicked = new EventEmitter<string>();
    @Output() directionsOpened = new EventEmitter<{ depotDetails: { depotId: string, isStartDepot: boolean } }>();

    getDepot() {
        return this.depotService.selectedData();
    }

    getDepotColor() {
        const depot = this.depotService.selectedData();
        return depot === undefined ? undefined : depot.color;
    }

    getCoordinatesText() {
        const depot = this.depotService.selectedData();
        return depot === undefined ? "" : `${depot.x}, ${depot.z}`;
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
		const depot = this.depotService.selectedData();
		navigator.clipboard.writeText(depot === undefined ? "" : `${depot.x} ~ ${depot.z}`).then();
		setTimeout(() => icon.innerText = "content_copy", 1000);
	}

	focus() {
		const depot = this.depotService.selectedData();
		if (depot) {
			this.dataService.animateMap.emit({x: depot.x, z: depot.z});
		}
	}

    usePathfinder() {
        return this.dataService.getDirectionsEngine() === "pathfinder";
    }

	openDirections(isStartDepot: boolean) {
		const depot = this.depotService.selectedData();
		if (depot) {
			this.directionsOpened.emit({depotDetails: {depotId: depot.id, isStartDepot}});
		}
	}

    getEnableViewOnWorldMap() {
        return this.configService.getEnableWorldMap(this.dimensionService.getDimensionIndex(), this.dimensionService.getDimensionsLength());
    }

	viewOnWorldMap() {
		const depot = this.depotService.selectedData();
		if (depot) {
			location.assign(this.configService.getWorldMapLink(this.dimensionService.getDimensionIndex(), this.dimensionService.getDimensionsLength(), Math.round(depot.x), Math.round(depot.z)));
		}
	}

    isOffline() {
        return this.dimensionService.isOffline();
    }
}