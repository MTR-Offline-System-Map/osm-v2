import {Component, inject} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {SelectButtonChangeEvent, SelectButtonModule} from "primeng/selectbutton";
import {TooltipModule} from "primeng/tooltip";
import {ThemeService} from "../../service/theme.service";
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
    selector: "app-theme-toggle",
    imports: [
        SelectButtonModule,
        TooltipModule,
        FormsModule,
        TranslocoPipe,
    ],
    templateUrl: "./theme-toggle.component.html",
    styleUrl: "./theme-toggle.component.scss",
})
export class ThemeToggleComponent {
    private readonly themeService = inject(ThemeService);

    protected readonly themeOptions: { icon: string, value: "LIGHT" | "SYSTEM" | "DARK", tooltip: string }[] = [
        {
            icon: "light_mode",
            value: "LIGHT",
            tooltip: "theme.light",
        },
        {
            icon: "contrast",
            value: "SYSTEM",
            tooltip: "theme.system",
        },
        {
            icon: "dark_mode",
            value: "DARK",
            tooltip: "theme.dark",
        },
    ];

    getTheme() {
        return this.themeService.theme();
    }

    setTheme(event: SelectButtonChangeEvent) {
        this.themeService.setTheme(event.value);
    }
}