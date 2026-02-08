import {Component, EventEmitter, inject, Output, signal} from "@angular/core";
import {RouteKeyService, RouteVariationService} from "../../service/route.service";
import {FormatNamePipe} from "../../pipe/formatNamePipe";
import {RouteDisplayComponent} from "../route-display/route-display.component";
import {DataListEntryComponent} from "../data-list-entry/data-list-entry.component";
import {FormatTimePipe} from "../../pipe/formatTimePipe";
import {ROUTE_TYPES} from "../../data/routeType";
import {TitleComponent} from "../title/title.component";
import {SimplifyRoutesPipe} from "../../pipe/simplifyRoutesPipe";
import {TooltipModule} from "primeng/tooltip";
import {CheckboxModule} from "primeng/checkbox";
import {DividerModule} from "primeng/divider";
import {SelectModule} from "primeng/select";
import {FloatLabelModule} from "primeng/floatlabel";
import {FormsModule} from "@angular/forms";
import {DimensionService} from "../../service/dimension.service";
import {MapDataService} from "../../service/map-data.service";
import {ButtonModule} from "primeng/button";
import {Tabs, TabList, Tab, TabPanels, TabPanel} from "primeng/tabs";
import {FormatColorPipe} from "../../pipe/formatColorPipe";
import {TranslocoPipe, TranslocoService} from "@jsverse/transloco";

@Component({
	selector: "app-route-panel",
	imports: [
    ButtonModule,
    FloatLabelModule,
    SelectModule,
    CheckboxModule,
    DividerModule,
    TooltipModule,
    FormatNamePipe,
    FormatTimePipe,
    RouteDisplayComponent,
    DataListEntryComponent,
    TitleComponent,
    FormsModule,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    FormatColorPipe,
	TranslocoPipe,
],
	templateUrl: "./route-panel.component.html",
	styleUrl: "./route-panel.component.scss",
})
export class RoutePanelComponent {
	private readonly translocoService = inject(TranslocoService);
	private readonly dataService = inject(MapDataService);
	private readonly dimensionService = inject(DimensionService);
	private readonly routeVariationService = inject(RouteVariationService);
	private readonly routeKeyService = inject(RouteKeyService);
	private readonly formatTimePipe = inject(FormatTimePipe);
	private readonly formatNamePipe = inject(FormatNamePipe);

	@Output() stationClicked = new EventEmitter<string>();
	@Output() routeClicked = new EventEmitter<string>();
	@Output() directionsOpened = new EventEmitter<void>();
	@Output() depotClicked = new EventEmitter<string>();
	protected dropdownValue = signal<{ name: string; id: string; } | undefined>(undefined);

	constructor() {
		this.routeKeyService.selectionChanged.subscribe(() => {
			this.dropdownValue.set({name: Math.random().toString(), id: Math.random().toString()});
			setTimeout(() => {
				const dropdownRoutes = this.getDropdownRoutes();
				this.dropdownValue.set(dropdownRoutes ? dropdownRoutes[0] : undefined);
			}, 0);
		});
		this.routeVariationService.selectionChanged.subscribe(() => {
			setTimeout(() => {
				const dropdownRoutes = this.getDropdownRoutes();
				const route = this.routeVariationService.selectedData();
				if (dropdownRoutes && route) {
					this.dropdownValue.set(dropdownRoutes.find(routeDropdown => routeDropdown.id === route.id));
				}
			}, 0);
		})
	}

	getDropdownRoutes() {
		return this.routeKeyService.selectedData()?.map(route => ({name: route.name.split("||")[1] ?? this.translocoService.translate("app.untitled"), id: route.id}));
	}

	selectRoute(id: string) {
		this.routeVariationService.select(id);
	}

	getRouteName() {
		const route = this.routeVariationService.selectedData();
		return route ? route.name.split("||")[0] : "";
	}

	getRouteColor() {
		const route = this.routeVariationService.selectedData();
		return route ? route.color : undefined;
	}

	getRouteID() {
		const route = this.routeVariationService.selectedData();
		return route ? route.id : undefined;
	}

	getRouteIcon() {
		const route = this.routeVariationService.selectedData();
		return route ? ROUTE_TYPES[route.type].icon : undefined;
	}

	getRouteDepots() {
		const route = this.routeVariationService.selectedData();
		return route ? [...new Set(route.depots)].sort() : [];
	}

	getVehicleIcons(index: number, displayHeight: number) {
		const icon = this.getRouteIcon() ?? "";
		const maxIndex = this.routeVariationService.routeStationDetails().length - 1;
		return this.routeVariationService.routeVehicles()[index].map(vehicle => {
			const offset = vehicle.percentage * displayHeight / 2;
			return {
				icon,
				offset: index === 0 ? Math.max(0, offset) : index === maxIndex ? Math.min(offset, 0) : offset,
				tooltip: `${this.formatTimePipe.transform(Math.abs(Math.round(vehicle.deviation / 1000)), "")} ${this.translocoService.translate(SimplifyRoutesPipe.getDeviationString(true, vehicle.deviation))}`,
			};
		});
	}

	getRouteStationDetails() {
		return this.routeVariationService.routeStationDetails();
	}

	getPlatformName(platformName?: string) {
		return platformName ? this.translocoService.translate("app.platform") + " " + this.formatNamePipe.transform(platformName) : "";
	}

	isC324() {
		return this.dimensionService.c324();
	}

	getTotalDurationSeconds() {
		return this.routeVariationService.getTotalDurationSeconds();
	}

	hasDurations() {
		return this.routeVariationService.routeStationDetails()[0]?.durationSeconds;
	}

	hasDwellTimes() {
		return this.routeVariationService.routeStationDetails()[0]?.dwellTimeSeconds;
	}

	isOnline() {
		return !this.dimensionService.isOffline();
	}

	getRouteHidden() {
		const route = this.routeVariationService.selectedData();
		return route ? route.hidden : false;
	}

	getEnableRouteDepotsDetails() {
		return this.dataService.showDepots() && this.dataService.depots().length > 0;
	}

	getDeveloperMode() {
		return this.dataService.developerMode();
	}

	copyRouteID(icon: HTMLDivElement) {
		icon.innerText = "check";
		const route = this.routeVariationService.selectedData();
		navigator.clipboard.writeText(route ? route.id : "");
		setTimeout(() => icon.innerText = "content_copy", 1000);
	}

	copyRouteKey(icon: HTMLDivElement) {
		icon.innerText = "check";
		const route = this.routeVariationService.selectedData();
		navigator.clipboard.writeText(route ? SimplifyRoutesPipe.getRouteKey(route) : "");
		setTimeout(() => icon.innerText = "copy_all", 1000);
	}
}
