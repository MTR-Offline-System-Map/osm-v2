import {Component, inject, Input} from "@angular/core";
import {SplitNamePipe} from "../../pipe/splitNamePipe";
import {FormatColorPipe} from "../../pipe/formatColorPipe";
import {FontStyleService} from "../../service/font-style.service";

@Component({
	selector: "app-title",
	imports: [
		SplitNamePipe,
		FormatColorPipe,
	],
	templateUrl: "./title.component.html",
	styleUrl: "./title.component.scss",
})
export class TitleComponent {
	private readonly fontStyleService = inject(FontStyleService);
	private readonly formatColorPipe = inject(FormatColorPipe);

	@Input({required: true}) name = "";
	@Input({required: true}) color?: number;

	getFontStyle() {
		return this.fontStyleService.fontStyle();
	}

	copyColor() {
		navigator.clipboard.writeText(this.color === undefined ? "" : this.formatColorPipe.transform(this.color)).then();
	}
}
