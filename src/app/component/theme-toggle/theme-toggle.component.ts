import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SelectButtonChangeEvent, SelectButtonModule } from "primeng/selectbutton";
import { TooltipModule } from "primeng/tooltip";
import { ThemeService } from "../../service/theme.service";

@Component({
    selector: "app-theme-toggle",
    imports: [
        SelectButtonModule,
        TooltipModule,
        FormsModule,
    ],
    templateUrl: "./theme-toggle.component.html",
    styleUrl: "./theme-toggle.component.css",
})
export class ThemeToggleComponent {
    private readonly themeService = inject(ThemeService);

    protected readonly themeOptions: { icon: string, value: "LIGHT" | "SYSTEM" | "DARK", tooltip: string }[] = [
        {
            icon: "light_mode",
            value: "LIGHT",
            tooltip: $localize`Light`,
        },
        {
            icon: "contrast",
            value: "SYSTEM",
            tooltip: $localize`System`,
        },
        {
            icon: "dark_mode",
            value: "DARK",
            tooltip: $localize`Dark`,
        },
    ];

    getTheme() {
        return this.themeService.getTheme();
    }

    setTheme(event: SelectButtonChangeEvent) {
        this.themeService.setTheme(event.value);
    }
}