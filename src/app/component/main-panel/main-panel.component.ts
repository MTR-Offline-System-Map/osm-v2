import {Component, EventEmitter, inject, Output} from "@angular/core";
import {MapDataService} from "../../service/map-data.service";
import {ROUTE_TYPES, RouteType} from "../../data/routeType";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DimensionService} from "../../service/dimension.service";
import {FloatLabelModule} from "primeng/floatlabel";
import {SelectModule} from "primeng/select";
import {SelectButtonModule} from "primeng/selectbutton";
import {TooltipModule} from "primeng/tooltip";
import {DividerModule} from "primeng/divider";
import {ButtonModule} from "primeng/button";
import {ToggleSwitchModule} from "primeng/toggleswitch";
import {VisibilityToggleComponent} from "../visibility-toggle/visibility-toggle.component";
import {InterchangeStyleToggleComponent} from "../interchange-style-toggle/interchange-style-toggle.component";
import {SearchComponent} from "../search/search.component";
import {AccordionModule} from "primeng/accordion";
import {ClientsService} from "../../service/clients.service";
import {DataListEntryComponent} from "../data-list-entry/data-list-entry.component";
import {environment} from "../../../environments/environment";
import {setCookie} from "../../data/utilities";
import {ThemeToggleComponent} from "../theme-toggle/theme-toggle.component";
import {FontStyleToggleComponent} from "../font-style-toggle/font-style-toggle.component";

@Component({
	selector: "app-main-panel",
	imports: [
    FloatLabelModule,
    SelectModule,
    SelectButtonModule,
    ButtonModule,
    ToggleSwitchModule,
    DividerModule,
    TooltipModule,
    AccordionModule,
    FormsModule,
    ReactiveFormsModule,
    SearchComponent,
    VisibilityToggleComponent,
    InterchangeStyleToggleComponent,
    DataListEntryComponent,
    ThemeToggleComponent,
    FontStyleToggleComponent
],
	templateUrl: "./main-panel.component.html",
	styleUrl: "./main-panel.component.css",
})
export class MainPanelComponent {
	private readonly dataService = inject(MapDataService);
	private readonly dimensionService = inject(DimensionService);
	private readonly clientsService = inject(ClientsService);

	@Output() stationClicked = new EventEmitter<string>();
	@Output() routeClicked = new EventEmitter<string>();
	@Output() clientClicked = new EventEmitter<string>();
	@Output() directionsOpened = new EventEmitter<void>();
	@Output() depotClicked = new EventEmitter<string>();

	protected readonly formGroup = new FormGroup({
		search: new FormControl(""),
		dimension: new FormControl(""),
		dimension1: new FormControl<"HIDDEN" | "SOLID" | "HOLLOW" | "DASHED">("HIDDEN"),
		showHiddenRoutesToggle: new FormControl(this.dataService.getShowHiddenRoutes()),
		showAllStationsToggle: new FormControl(this.dataService.getShowAllStations()),
		showDepots: new FormControl(this.dataService.getShowDepots()),
		betterScroll: new FormControl(this.dataService.getBetterScroll()),
		autoDetectBusRoutes: new FormControl(this.dataService.getAutoDetectBusRoutes()),
		developerMode: new FormControl(this.dataService.getDeveloperMode()),
	});
	protected readonly routeTypes: [string, RouteType][] = [];

	constructor() {
		this.dataService.dataProcessed.subscribe(() => {
			if (!this.formGroup.getRawValue().dimension) {
				this.formGroup.patchValue({dimension: this.dimensionService.getDimensions()[0]});
			}
			this.routeTypes.length = 0;
			Object.entries(ROUTE_TYPES).forEach(([routeTypeKey, routeType]) => {
				if (routeTypeKey in this.dataService.routeTypeVisibility) {
					this.routeTypes.push([routeTypeKey, routeType]);
				}
			});
		});
	}

	hasInterchanges() {
		return this.dataService.hasConnections();
	}

	isOffline() {
		return this.dimensionService.isOffline();
	}

	getDimensions() {
		return this.dimensionService.getDimensions();
	}

	setDimension() {
		const data = this.formGroup.getRawValue();
		if (data.dimension) {
			this.dataService.setDimension(data.dimension);
		}
	}

	getAllClients() {
		return this.clientsService.allClients;
	}

	clickStation(id: string) {
		this.stationClicked.emit(id);
		this.formGroup.patchValue({search: undefined});
	}

	clickRoute(id: string) {
		this.routeClicked.emit(id);
		this.formGroup.patchValue({search: undefined});
	}

	clickClient(id: string) {
		this.clientClicked.emit(id);
		this.formGroup.patchValue({search: undefined});
	}

	clickDepot(id: string) {
		this.depotClicked.emit(id);
		this.formGroup.patchValue({search: undefined});
	}

	getEnableShowHiddenRoutes() {
		return environment.enableShowHiddenRoutes && this.dataService.hasHiddenRoutes();
	}

	getEnableShowAllStations() {
		return environment.enableShowAllStations && this.dimensionService.includeMarkers();
	}

	getEnableShowDepots() {
		return environment.enableShowDepots && this.dimensionService.includeMarkers();
	}

	getEnableAutoDetectBusRoutes() {
		return environment.enableAutoDetectBusRoutes && this.dataService.hasBusRoutes();
	}

	getEnableDeveloperMode() {
		return environment.enableDeveloperMode;
	}

	getPlayersLocalize() {
		return $localize`Players`;
	}

	getDimensionLocalize() {
		return environment.historicalMap.enable ? $localize`Time or Data Source` : $localize`Dimension`
	}

	setShowHiddenRoutes(value: boolean) {
		setCookie("show_hidden_routes", value.toString());
		window.location.reload();
	}

	setShowAllStations(value: boolean) {
		setCookie("show_all_stations", value.toString());
		window.location.reload();
	}

	setShowDepots(value: boolean) {
		this.dataService.setShowDepots(value);
	}

	setBetterScroll(value: boolean) {
		this.dataService.setBetterScroll(value);
	}

	setAutoDetectBusRoutes(value: boolean) {
		setCookie("auto_detect_bus_routes", value.toString());
		window.location.reload();
	}

	setDeveloperMode(value: boolean) {
		this.dataService.setDeveloperMode(value);
	}
	
	isMobile() {
		return window.innerWidth < window.innerHeight;
	}
}
