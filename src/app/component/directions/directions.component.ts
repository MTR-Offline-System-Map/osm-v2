import {Component, inject, signal} from "@angular/core";
import {SearchComponent} from "../search/search.component";
import {DirectionsService} from "../../service/directions.service";
import {RouteDisplayComponent} from "../route-display/route-display.component";
import {FormatNamePipe} from "../../pipe/formatNamePipe";
import {DataListEntryComponent} from "../data-list-entry/data-list-entry.component";
import {FormatDatePipe} from "../../pipe/formatDatePipe";
import {FormatTimePipe} from "../../pipe/formatTimePipe";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {SimplifyRoutesPipe} from "../../pipe/simplifyRoutesPipe";
import {Route} from "../../entity/route";
import {MapDataService} from "../../service/map-data.service";
import {MapSelectionService} from "../../service/map-selection.service";
import {pushIfNotExists} from "../../data/utilities";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {AccordionModule} from "primeng/accordion";
import {SliderModule} from "primeng/slider";
import {InputTextModule} from "primeng/inputtext";
import {CheckboxModule} from "primeng/checkbox";
import {ButtonModule} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";
import {DividerModule} from "primeng/divider";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputNumberModule} from "primeng/inputnumber";
import {Station} from "../../entity/station";
import {ClientsService} from "../../service/clients.service";
import {FontStyleService} from "../../service/font-style.service";
import {Depot} from "../../entity/depot";
import {TranslocoPipe, TranslocoService} from "@jsverse/transloco";

@Component({
	selector: "app-directions",
	imports: [
    FloatLabelModule,
    InputNumberModule,
    ProgressSpinnerModule,
    AccordionModule,
    SliderModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    TooltipModule,
    DividerModule,
    SearchComponent,
    RouteDisplayComponent,
    FormatNamePipe,
    DataListEntryComponent,
    FormatDatePipe,
    ReactiveFormsModule,
	TranslocoPipe,
],
	templateUrl: "./directions.component.html",
	styleUrl: "./directions.component.scss",
})
export class DirectionsComponent {
	private readonly translocoService = inject(TranslocoService);
	private readonly directionsService = inject(DirectionsService);
	private readonly mapDataService = inject(MapDataService);
	private readonly clientsService = inject(ClientsService);
	private readonly mapSelectionService = inject(MapSelectionService);
	private readonly formatNamePipe = inject(FormatNamePipe);
	private readonly formatTimePipe = inject(FormatTimePipe);
	private readonly fontStyleService = inject(FontStyleService);
	protected ignoredRoutes: string[] = [];
	protected avoidStations: string[] = [];
	protected mode: "DEFAULT" | "IN_THEORY" | "REALTIME" = "DEFAULT";

	protected readonly formGroup = new FormGroup({
		startInput: new FormControl<{ key: string, value: {icons: string[], color?: number, name: string, number: string, type: "station" | "route" | "client" | "depot"} } | undefined>(undefined),
		endInput: new FormControl<{ key: string, value: {icons: string[], color?: number, name: string, number: string, type: "station" | "route" | "client" | "depot"} } | undefined>(undefined),
		maxWalkingDistance: new FormControl({value: 250, disabled: true}),
		enableWalking: new FormControl<boolean>(false),
		ignoredRoutesInput: new FormControl<string | undefined>(undefined),
		avoidStationsInput: new FormControl<string | undefined>(undefined),
		onlyLightRail: new FormControl<boolean>(false),
		noHSR: new FormControl<boolean>(false),
		noBoats: new FormControl<boolean>(false),
		includeHiddenRoutes: new FormControl<boolean>(false),
	});
	private directionsCache = signal<{
		startStation?: Station,
		endStation?: Station,
		startDepot?: Depot,
		endDepot?: Depot,
		startPlatformName?: string,
		endPlatformName?: string,
		intermediateStations: Station[],
		route?: Route,
		icon: string,
		startTime: number,
		endTime: number,
		distance: number,
	}[]>([]);
	private forceRefresh = false;

	constructor() {
		this.directionsService.directionsPanelOpened.subscribe((directionsSelection) => {
			if (directionsSelection) {
				this.onClickData(directionsSelection);
			} else {
				this.checkStatus();
			}
		});
		this.directionsService.dataProcessed.subscribe(() => {
			if (this.forceRefresh || this.canAutomaticallyRefresh()) {
				this.forceRefresh = false;
				this.refreshDirections();
			}
		});
	}

	onClearInput(isStartInput: boolean) {
		this.formGroup.patchValue(isStartInput ? {startInput: undefined} : {endInput: undefined});
		this.checkStatus();
	}

	usePathfinder() {
		return this.mapDataService.getDirectionsEngine() === "pathfinder";
	}

	onClickStation(stationId: string | undefined, isStartStation: boolean) {
		if (stationId) {
			this.onClickData({stationDetails: {stationId, isStartStation}});
		}
	}

	onClickClient(clientId: string | undefined, isStartClient: boolean) {
		if (clientId) {
			this.onClickData({clientDetails: {clientId, isStartClient}});
		}
	}

	onClickDepot(depotId: string | undefined, isStartDepot: boolean) {
		if (depotId) {
			this.onClickData({depotDetails: {depotId, isStartDepot}});
		}
	}

	swapStations() {
		const data = this.formGroup.getRawValue();
		this.formGroup.patchValue({startInput: data.endInput, endInput: data.startInput});
		this.checkStatus();
	}

	cannotSwap() {
		const data = this.formGroup.getRawValue();
		return !data.startInput && !data.endInput;
	}

	getDirections() {
		return this.directionsCache();
	}

	updateWalkingInput(value: boolean) {
		if (value) {
			this.formGroup.get("maxWalkingDistance")?.enable();
		} else {
			this.formGroup.get("maxWalkingDistance")?.disable();
		}
		this.checkStatus();
	}

	isValid() {
		const data = this.formGroup.getRawValue();
		return data.startInput && data.endInput && data.startInput.key !== data.endInput.key;
	}

	isLoading() {
		return this.directionsService.loading();
	}

	refreshDirections() {
		const directionsCache = [...this.directionsService.directions()];
		this.mapSelectionService.selectedStationConnections.length = 0;
		this.mapSelectionService.selectedStations.length = 0;
		this.mapSelectionService.selectedDepots.length = 0;
		let mapUpdated = false;

		directionsCache.forEach(direction => {
			if (direction.startStation && direction.endStation) {
				const stations = [direction.startStation, ...direction.intermediateStations, direction.endStation];
				for (let i = 1; i < stations.length; i++) {
					const station1 = stations[i - 1];
					const station2 = stations[i];
					const reverse = station1.id > station2.id;
					const newStationId1 = reverse ? station2.id : station1.id;
					const newStationId2 = reverse ? station1.id : station2.id;

					if (direction.route) {
						this.mapSelectionService.selectedStationConnections.push({stationIds: [newStationId1, newStationId2], routeColor: direction.route.color});
						if (this.mapDataService.routeTypeVisibility()[direction.route.type] === "HIDDEN") {
							this.mapDataService.routeTypeVisibility()[direction.route.type] = "SOLID";
							mapUpdated = true;
						}
					}

					pushIfNotExists(this.mapSelectionService.selectedStations, newStationId1);
					pushIfNotExists(this.mapSelectionService.selectedStations, newStationId2);
				}
			}
		});

		this.directionsCache.set(directionsCache);

		if (mapUpdated) {
			this.mapDataService.updateData();
		}

		this.mapSelectionService.select("directions");
	}

	cannotManuallyRefresh() {
		return this.isLoading() || this.canAutomaticallyRefresh() || !this.isValid();
	}

	pathfinderModeChange(button: boolean, value: boolean) {
		if (value) {
			if (button) {
				this.mode = "IN_THEORY";
			} else {
				this.mode = "REALTIME";
			}
		} else {
			this.mode = "DEFAULT"
		}
		this.checkStatus();
	}

	getStationName(station?: Station) {
		return station ? this.formatNamePipe.transform(station.name) : this.translocoService.translate("app.untitled");
	}

	getPlatformName(platformName?: string) {
		return platformName ? this.translocoService.translate("app.platform") + " " + this.formatNamePipe.transform(platformName) : "";
	}

	getRouteName(route: Route) {
		return `${this.formatNamePipe.transform(route.name.split("||")[0])} ${this.formatNamePipe.transform(route.number)}`;
	}

	getRouteDestination(route: Route) {
		return route.circularState === "NONE" ? this.formatNamePipe.transform(route.routePlatforms[route.routePlatforms.length - 1].station.name) : "";
	}

	getRouteColor(index: number) {
		return this.getDirections()[index]?.route?.color ?? -1;
	}

	getDuration(direction: { startTime: number, endTime: number }) {
		return this.formatTimePipe.transform(Math.round((direction.endTime - direction.startTime) / 1000), "");
	}

	getDistanceLabel(direction: { distance: number }) {
		const roundedDistance = Math.round(direction.distance / 100) / 10;
		return roundedDistance > 0 ? `${roundedDistance} km` : "";
	}

	getCircularIcon(route: Route) {
		return SimplifyRoutesPipe.getCircularStateIcon(route.circularState);
	}

	sameStation(direction: { startStation?: Station, endStation?: Station }) {
		return direction.startStation && direction.endStation && (direction.startStation.id === direction.endStation.id || direction.startStation.connections.some(station => station.id === direction.endStation?.id));
	}

	onClickData(directionsSelection: { stationDetails?: { stationId: string, isStartStation: boolean }, clientDetails?: { clientId: string, isStartClient: boolean }, depotDetails?: { depotId: string, isStartDepot: boolean } }) {
		const {stationDetails, clientDetails, depotDetails} = directionsSelection;

		if (stationDetails) {
			const station = stationDetails.stationId ? this.mapDataService.stations().find(station => station.id === stationDetails.stationId) : undefined;
			if (stationDetails.isStartStation) {
				this.formGroup.patchValue({startInput: station ? {key: station.id, value: {icons: station.getIcons(), color: station.color, name: station.name, number: "", type: "station"}} : undefined});
			} else {
				this.formGroup.patchValue({endInput: station ? {key: station.id, value: {icons: station.getIcons(), color: station.color, name: station.name, number: "", type: "station"}} : undefined});
			}
		} else if (clientDetails) {
			const client = this.clientsService.getClient(clientDetails.clientId);
			if (clientDetails.isStartClient) {
				this.formGroup.patchValue({startInput: client ? {key: clientDetails.clientId, value: {icons: [], name: client.name, number: "", type: "client"}} : undefined});
			} else {
				this.formGroup.patchValue({endInput: client ? {key: clientDetails.clientId, value: {icons: [], name: client.name, number: "", type: "client"}} : undefined});
			}
		} else if (depotDetails) {
			const depot = depotDetails.depotId ? this.mapDataService.depots().find(depot => depot.id === depotDetails.depotId) : undefined;
			if (depotDetails.isStartDepot) {
				this.formGroup.patchValue({startInput: depot ? {key: depot.id, value: {icons: [], name: depot.name, number: "", type: "depot"}} : undefined});
			} else {
				this.formGroup.patchValue({endInput: depot ? {key: depot.id, value: {icons: [], name: depot.name, number: "", type: "depot"}} : undefined})
			}
		}

		this.checkStatus();
	}

	checkStatus() {
		if (this.isValid()) {
			const data = this.formGroup.getRawValue();
			const startStation = data.startInput?.value?.type === "station" ? this.mapDataService.stations().find(station => station.id === data.startInput?.key) : undefined;
			const endStation = data.endInput?.value?.type === "station" ? this.mapDataService.stations().find(station => station.id === data.endInput?.key) : undefined;
			const startClientId = data.startInput?.value?.type === "client" ? data.startInput?.key : undefined;
			const endClientId = data.endInput?.value?.type === "client" ? data.endInput?.key : undefined;
			const startDepot = data.startInput?.value?.type === "depot" ? this.mapDataService.depots().find(depot => depot.id === data.startInput?.key) : undefined;
			const endDepot = data.endInput?.value?.type === "depot" ? this.mapDataService.depots().find(depot => depot.id === data.endInput?.key) : undefined;

			if ((startStation || startClientId || startDepot) && (endStation || endClientId || endDepot)) {
				this.directionsService.selectData(startStation, endStation, startClientId, endClientId, startDepot, endDepot, data.maxWalkingDistance!, data.enableWalking!, this.ignoredRoutes, this.avoidStations, data.onlyLightRail!, data.noHSR!, data.noBoats!, this.mode!, (data.includeHiddenRoutes! && this.mapDataService.showHiddenRoutes()));
				this.forceRefresh = true;
			} else {
				this.formGroup.patchValue({startInput: undefined, endInput: undefined});
				this.directionsService.clear();
			}
		} else {
			this.directionsService.clear();
		}
	}

	private canAutomaticallyRefresh() {
		const data = this.formGroup.getRawValue();
		return data.startInput && data.startInput.value.type === "client" || data.endInput && data.endInput.value.type === "client";
	}

	getShowHiddenRoutes() {
		return this.mapDataService.showHiddenRoutes();
	}

	getFontStyle() {
		return this.fontStyleService.fontStyle();
	}
}
