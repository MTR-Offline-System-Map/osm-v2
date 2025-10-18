import {Component, EventEmitter, inject, Output} from "@angular/core";
import {StationService} from "../../service/station.service";
import {FormatNamePipe} from "../../pipe/formatNamePipe";
import {FormatColorPipe} from "../../pipe/formatColorPipe";
import {MapDataService} from "../../service/map-data.service";
import {DataListEntryComponent} from "../data-list-entry/data-list-entry.component";
import {SimplifyRoutesPipe} from "../../pipe/simplifyRoutesPipe";
import {TitleComponent} from "../title/title.component";
import {Station} from "../../entity/station";
import {TooltipModule} from "primeng/tooltip";
import {ButtonModule} from "primeng/button";
import {TabsModule} from "primeng/tabs";
import {CheckboxModule} from "primeng/checkbox";
import {DividerModule} from "primeng/divider";
import {DialogModule} from "primeng/dialog";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ChipModule} from "primeng/chip";

@Component({
	selector: "app-station-panel",
	imports: [
    ButtonModule,
    TooltipModule,
    TabsModule,
    CheckboxModule,
    ChipModule,
    DividerModule,
    ProgressSpinnerModule,
    DialogModule,
    FormatNamePipe,
    FormatColorPipe,
    DataListEntryComponent,
    TitleComponent
],
	templateUrl: "./station-panel.component.html",
	styleUrl: "./station-panel.component.css",
})
export class StationPanelComponent {
	private readonly dataService = inject(MapDataService);
	private readonly stationService = inject(StationService);

	@Output() stationClicked = new EventEmitter<string>();
	@Output() routeClicked = new EventEmitter<string>();

	getStation() {
		return this.stationService.getSelectedData();
	}

	getStationColor() {
		const station = this.stationService.getSelectedData();
		return station === undefined ? undefined : station.color;
	}

	getCoordinatesText() {
		const station = this.stationService.getSelectedData();
		return station === undefined ? "" : `${Math.round(station.x)}, ${Math.round(station.y)}, ${Math.round(station.z)}`;
	}

	getZoneText() {
		const station = this.stationService.getSelectedData();
		return station === undefined ? "" : `${station.zone1}, ${station.zone2}, ${station.zone3}`;
	}

	getConnections(): Station[] {
		const station = this.stationService.getSelectedData();
		if (station === undefined) {
			return [];
		} else {
			const stations: Station[] = [];
			this.dataService.stations.forEach(otherStation => {
				if (station.connections.some(connectingStation => connectingStation.id === otherStation.id)) {
					stations.push(otherStation);
				}
			});
			return stations;
		}
	}

	getRoutes() {
		return this.stationService.routesAtStation;
	}

	getCircularStateIcon(circularState: "NONE" | "CLOCKWISE" | "ANTICLOCKWISE") {
		return SimplifyRoutesPipe.getCircularStateIcon(circularState);
	}

	mapRouteVariations(variations: string[]): [string, string][] {
		return variations.map(variation => [variation, ""]);
	}

	isLoading() {
		return this.stationService.isLoading();
	}

	copyLocation(icon: HTMLDivElement) {
		icon.innerText = "check";
		const station = this.stationService.getSelectedData();
		navigator.clipboard.writeText(station === undefined ? "" : `${Math.round(station.x)} ${Math.round(station.y)} ${Math.round(station.z)}`).then();
		setTimeout(() => icon.innerText = "content_copy", 1000);
	}

	focus() {
		const station = this.stationService.getSelectedData();
		if (station) {
			this.dataService.animateMap.emit({x: station.x, z: station.z});
		}
	}

	getRouteKey(route: { color: number, name: string, number: string }) {
		return SimplifyRoutesPipe.getRouteKey(route);
	}
}
