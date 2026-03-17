import {Component, EventEmitter, inject, Input, Output} from "@angular/core";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MapDataService} from "../../service/map-data.service";
import {SimplifyStationsPipe} from "../../pipe/simplifyStationsPipe";
import {SimplifyRoutesPipe} from "../../pipe/simplifyRoutesPipe";
import {SimplifyDepotsPipe} from "../../pipe/simplifyDepotsPipe";
import {FormatNamePipe} from "../../pipe/formatNamePipe";
import {AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent, AutoCompleteUnselectEvent} from "primeng/autocomplete";
import {DividerModule} from "primeng/divider";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {SelectItemGroup} from "primeng/api";
import {DataListEntryComponent} from "../data-list-entry/data-list-entry.component";
import {FormatColorPipe} from "../../pipe/formatColorPipe";
import {SearchData} from "../../entity/searchData";
import {ClientsService} from "../../service/clients.service";
import {DimensionService} from "../../service/dimension.service";
import {TranslocoService} from "@jsverse/transloco";
import {ConfigService} from "../../service/config.service";

const maxResults = 50;

@Component({
	selector: "app-search",
	imports: [
		FloatLabelModule,
		InputTextModule,
		AutoCompleteModule,
		DividerModule,
		FormsModule,
		FormatNamePipe,
		FormatColorPipe,
		DataListEntryComponent,
		ReactiveFormsModule,
	],
	templateUrl: "./search.component.html",
	styleUrl: "./search.component.scss",
})
export class SearchComponent {
	private readonly translocoService = inject(TranslocoService);
	private readonly dataService = inject(MapDataService);
	private readonly clientsService = inject(ClientsService);
	private readonly configService = inject(ConfigService);
	private readonly dimensionService = inject(DimensionService);
	private readonly simplifyStationsPipe = inject(SimplifyStationsPipe);
	private readonly simplifyRoutesPipe = inject(SimplifyRoutesPipe);
	private readonly simplifyDepotsPipe = inject(SimplifyDepotsPipe);

	@Output() stationClicked = new EventEmitter<string>();
	@Output() routeClicked = new EventEmitter<string>();
	@Output() clientClicked = new EventEmitter<string>();
	@Output() depotClicked = new EventEmitter<string>();
	@Output() textCleared = new EventEmitter<void>();
	@Input({required: true}) label = "";
	@Input() multiple: boolean = false;
	@Input({required: true}) parentFormGroup!: FormGroup;
	@Input({required: true}) childFormControlName = "";
	@Input({required: true}) includeStations = true;
	@Input({required: true}) includeRoutes = true;
	@Input({required: true}) includeDepots = true;
	@Input({required: true}) includeClients = true;
	@Input() selectedValues: string[] = [];
	@Input() setText!: EventEmitter<string>;

	protected data: SelectItemGroup[] = [];

	onTextChanged(event: AutoCompleteCompleteEvent) {
		this.data = [];

		if (event.query === "") {
			this.textCleared.emit();
		} else {
			const filter = (list: SearchData[]): { value: { key: string, icons: string[], color?: number, name: string, number: string, type: "station" | "route" | "client" | "depot" } }[] => {
				const matches: { value: SearchData, index: number }[] = [];
				list.forEach(({key, icons, color, name, number, type}) => {
					const index = name.toLowerCase().indexOf(event.query.toLowerCase());
					if (index >= 0) {
						matches.push({value: {key, icons, color, name, number, type}, index});
					}
				});
				const result: { value: SearchData }[] = matches.sort((match1, match2) => {
					const indexDifference = match1.index - match2.index;
					return indexDifference === 0 ? match1.value.name.localeCompare(match2.value.name) : indexDifference;
				});
				return result.slice(0, maxResults);
			};

			const searchedStations = filter(this.includeStations ? this.simplifyStationsPipe.transform(this.dataService.stations()) : []);
			const searchedRoutes = filter(this.includeRoutes ? this.simplifyRoutesPipe.transform(this.dataService.routes()) : []);
			const searchedClients = filter(this.includeClients && !this.dimensionService.isOffline() ? this.clientsService.allClients().map(client => ({key: client.id, icons: [this.configService.getAvatarUrl(client.name, client.id)], name: client.name, number: "", type: "client"})) : [], true);
			const searchedDepots = filter(this.includeDepots ? this.simplifyDepotsPipe.transform(this.dataService.depots()) : []);

			if (searchedStations.length > 0) {
				this.data.push({
					label: this.translocoService.translate("app.stations"),
					items: searchedStations,
				});
			}

			if (searchedRoutes.length > 0) {
				this.data.push({
					label: this.translocoService.translate("app.routes"),
					items: searchedRoutes,
				});
			}

			if (searchedClients.length > 0) {
				this.data.push({
					label: this.translocoService.translate("app.clients"),
					items: searchedClients,
				});
			}

			if (searchedDepots.length > 0) {
				this.data.push({
					label: this.translocoService.translate("app.depots"),
					items: searchedDepots,
				});
			}
		}
	}

	onSelect(event: AutoCompleteSelectEvent) {
		if (event?.value?.value) {
			if (this.multiple) {
				this.selectedValues.push(event.value.value.key);
			}
			switch (event.value.value.type) {
				case "station":
					this.stationClicked.emit(event.value.value.key);
					break;
				case "route":
					this.routeClicked.emit(event.value.value.key);
					break;
				case "client":
					this.clientClicked.emit(event.value.value.key);
					break;
				case "depot":
					this.depotClicked.emit(event.value.value.key);
					break;
			}
		}
	}

	onUnselect(event: AutoCompleteUnselectEvent) {
		const index = this.selectedValues.findIndex(item => item === event.value.value.key);
		if (index > -1) {
			this.selectedValues.splice(index, 1);
		}
		this.textCleared.emit();
	}

	onClear() {
		this.selectedValues.length = 0;
		this.textCleared.emit();
	}

	getName(entry: { value?: { name?: string, number?: string } }) {
		const name = entry?.value?.name;
		const number = entry?.value?.number;
		return name ? (number ? `${name.replaceAll("|", " ")} ${number.replaceAll("|", " ")}` : name.replaceAll("|", " ")) : "";
	}

	getText() {
		return "";
	}
}
