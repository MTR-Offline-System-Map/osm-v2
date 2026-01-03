import {Component, inject} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {SelectButtonChangeEvent, SelectButtonModule} from "primeng/selectbutton";
import {TooltipModule} from "primeng/tooltip";
import {FontStyleService} from "../../service/font-style.service";
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
    selector: "app-font-style-toggle",
    imports: [
        SelectButtonModule,
        TooltipModule,
        FormsModule,
        TranslocoPipe,
    ],
    templateUrl: "./font-style-toggle.component.html",
    styleUrl: "./font-style-toggle.component.css",
})
export class FontStyleToggleComponent {
    private readonly fontStyleService = inject(FontStyleService);

    protected readonly fontStyleOptions: { class: string, value: "SANS" | "SERIF", tooltip: string }[] = [
        {
            class: "sans",
            value: "SANS",
            tooltip: "font_style.sans_serif",
        },
        {
            class: "serif",
            value: "SERIF",
            tooltip: "font_style.serif",
        },
    ];

    getFontStyle() {
        return this.fontStyleService.getFontStyle();
    }

    setFontStyle(event: SelectButtonChangeEvent) {
        this.fontStyleService.setFontStyle(event.value);
    }
}