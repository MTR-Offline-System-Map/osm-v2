import {Component, inject, Input} from "@angular/core";
import {MapDataService} from "../../service/map-data.service";
import {setCookie} from "../../data/utilities";
import {TooltipModule} from "primeng/tooltip";
import {SelectButtonChangeEvent, SelectButtonModule} from "primeng/selectbutton";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
	selector: "app-visibility-toggle",
	imports: [
		SelectButtonModule,
		TooltipModule,
		FormsModule,
		ReactiveFormsModule,
		TranslocoPipe,
	],
	templateUrl: "./visibility-toggle.component.html",
	styleUrl: "./visibility-toggle.component.css",
})
export class VisibilityToggleComponent {
	private readonly mapDataService = inject(MapDataService);

	@Input({required: true}) routeType = "";
	protected readonly visibilityOptions: { icon: string, value: "HIDDEN" | "SOLID" | "HOLLOW" | "DASHED", tooltip: string }[] = [
		{
			icon: "visibility_off",
			value: "HIDDEN",
			tooltip: "line_style.hidden",
		},
		{
			icon: "horizontal_rule",
			value: "SOLID",
			tooltip: "line_style.solid",
		},
		{
			icon: "drag_handle",
			value: "HOLLOW",
			tooltip: "line_style.hollow",
		},
		{
			icon: "more_horiz",
			value: "DASHED",
			tooltip: "line_style.dashed",
		},
	];

	getVisibility() {
		return this.mapDataService.routeTypeVisibility[this.routeType];
	}

	setVisibility(event: SelectButtonChangeEvent) {
		this.mapDataService.routeTypeVisibility[this.routeType] = event.value;
		this.mapDataService.updateData();
		Object.entries(this.mapDataService.routeTypeVisibility).forEach(([newRouteTypeKey, visibility]) => setCookie(`visibility_${newRouteTypeKey}`, visibility));
	}
}
