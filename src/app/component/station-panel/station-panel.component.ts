import {Component, EventEmitter, inject, Output} from "@angular/core";
import {Arrival, StationService} from "../../service/station.service";
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
import {FormatTimePipe} from "../../pipe/formatTimePipe";
import {FormatDatePipe} from "../../pipe/formatDatePipe";
import {SplitNamePipe} from "../../pipe/splitNamePipe";
import {DimensionService} from "../../service/dimension.service";
import {environment} from "../../../environments/environment";
import {FontStyleService} from "../../service/font-style.service";

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
		FormatDatePipe,
		FormatTimePipe,
		SplitNamePipe,
		DataListEntryComponent,
		TitleComponent,
	],
	templateUrl: "./station-panel.component.html",
	styleUrl: "./station-panel.component.css",
})
export class StationPanelComponent {
	private readonly dataService = inject(MapDataService);
	private readonly stationService = inject(StationService);
	private readonly dimensionService = inject(DimensionService);
	private readonly fontStyleService = inject(FontStyleService);

	protected dialogData?: Arrival;
	@Output() stationClicked = new EventEmitter<string>();
	@Output() routeClicked = new EventEmitter<string>();
	@Output() directionsOpened = new EventEmitter<{ stationDetails: { stationId: string, isStartStation: boolean } }>
	@Output() depotClicked = new EventEmitter<string>();

	getStation() {
		return this.stationService.getSelectedData();
	}

	getStationColor() {
		const station = this.stationService.getSelectedData();
		return station === undefined ? undefined : station.color;
	}

	getID() {
		const station = this.stationService.getSelectedData();
		return station === undefined ? undefined : station.id;
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

	getActiveRoutes() {
		return this.stationService.arrivalsRoutes;
	}

	getArrivals() {
		return this.stationService.getArrivals();
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

	updateArrivalFilter(filterArrivalShowTerminating: boolean, toggleRouteKey?: string) {
		this.stationService.updateArrivalFilter(filterArrivalShowTerminating, toggleRouteKey);
	}

	routeFiltered(routeKey: string) {
		return this.stationService.routeFiltered(routeKey);
	}

	resetArrivalFilter() {
		this.stationService.resetArrivalFilter();
	}

	getHasTerminating() {
		return this.stationService.getHasTerminating();
	}

	isLoading() {
		return this.stationService.isLoading();
	}

	copyID(icon: HTMLDivElement) {
		icon.innerText = "check";
		const station = this.stationService.getSelectedData();
		navigator.clipboard.writeText(station === undefined ? "" : station.id);
		setTimeout(() => icon.innerText = "content_copy", 1000);
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

	openDirections(isStartStation: boolean) {
		const station = this.stationService.getSelectedData();
		if (station) {
			this.directionsOpened.emit({stationDetails: {stationId: station.id, isStartStation}});
		}
	}

	showDetails(arrival: Arrival) {
		this.dialogData = arrival;
	}

	getRouteKey(route: { color: number, name: string, number: string }) {
		return SimplifyRoutesPipe.getRouteKey(route);
	}

	getSingleStation() {
		const station = this.stationService.getSelectedData();
		if (station) {
			return station.single;
		}
		return true;
	}

	getEnableViewOnWorldMap() {
		return environment.worldMapLink.enable(this.dimensionService.getDimensionIndex());
	}

	viewOnWorldMap() {
		const station = this.stationService.getSelectedData();
		if (station) {
			location.assign(environment.worldMapLink.exec(this.dimensionService.getDimensionIndex(), Math.round(station.x), Math.round(station.z)));
		}
	}

	isOffline() {
		return this.dimensionService.isOffline();
	}

	getFontStyle() {
		return this.fontStyleService.getFontStyle();
	}

	getBetterScroll() {
		return this.dataService.getBetterScroll();
	}

	getDeveloperMode() {
		return this.dataService.getDeveloperMode();
	}

	getPlatformLocalize() {
		return $localize`Platform`;
	}

	getEvery8SecondsLocalize() {
		return $localize`Every 8 Seconds`;
	}

	getArrivedLocalize() {
		return $localize`Arrived`;
	}
}
