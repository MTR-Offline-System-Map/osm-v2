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
    ThemeToggleComponent
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

	protected readonly formGroup = new FormGroup({
		search: new FormControl(""),
		dimension: new FormControl(""),
		dimension1: new FormControl<"HIDDEN" | "SOLID" | "HOLLOW" | "DASHED">("HIDDEN"),
		showHiddenRoutesToggle: new FormControl(this.dataService.getShowHiddenRoutes()),
		showAllStationsToggle: new FormControl(this.dataService.getShowAllStations()),
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

	getEnableShowHiddenRoutes() {
		return environment.enableShowHiddenRoutes;
	}

	getEnableShowAllStations() {
		return environment.enableShowAllStations && this.dimensionService.includeMarkers();
	}

	getPlayersLocalize() {
		return $localize`Players`;
	}

	getShowHiddenRoutes() {
		return this.dataService.getShowHiddenRoutes();
	}

	getShowAllStations() {
		return this.dataService.getShowAllStations();
	}

	setShowHiddenRoutes(value: boolean) {
		setCookie("show_hidden_routes", value.toString());
		window.location.reload();
	}

	setShowAllStations(value: boolean) {
		setCookie("show_all_stations", value.toString());
		window.location.reload();
	}
}
