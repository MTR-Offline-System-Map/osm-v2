import {Component, inject, Input} from "@angular/core";
import {SplitNamePipe} from "../../pipe/splitNamePipe";
import {FormatColorPipe} from "../../pipe/formatColorPipe";
import { FontStyleService } from "../../service/font-style.service";

@Component({
	selector: "app-title",
	imports: [
		SplitNamePipe,
		FormatColorPipe,
	],
	templateUrl: "./title.component.html",
	styleUrl: "./title.component.css",
})
export class TitleComponent {
	private readonly fontStyleService = inject(FontStyleService);

	@Input({required: true}) name = "";
	@Input({required: true}) color?: number;

	getFontStyle() {
		return this.fontStyleService.getFontStyle();
	}
}
