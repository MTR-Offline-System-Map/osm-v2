import {Component, EventEmitter, inject, Input, Output} from "@angular/core";
import {NgOptimizedImage, NgTemplateOutlet} from "@angular/common";
import {RippleModule} from "primeng/ripple";
import {FontStyleService} from "../../service/font-style.service";

@Component({
	selector: "app-data-list-entry",
	imports: [
		RippleModule,
		NgTemplateOutlet,
		NgOptimizedImage,
	],
	templateUrl: "./data-list-entry.component.html",
	styleUrl: "./data-list-entry.component.css",
})
export class DataListEntryComponent {
	private readonly fontStyleService = inject(FontStyleService);

	@Input({required: true}) icons: string[] = [];
	@Input({required: true}) title: [string, string] = ["", ""];
	@Input({required: true}) subtitles: [string, string][] = [];
	@Input() color = "";
	@Input({required: true}) useLightColor = false;
	@Input({required: true}) clickable = true;
	@Output() entryClicked = new EventEmitter<void>();

	getFontStyle() {
		return this.fontStyleService.getFontStyle();
	}
}
