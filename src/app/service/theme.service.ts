import {inject, Injectable, signal} from "@angular/core";
import {getCookie, setCookie} from "../data/utilities";
import {MapDataService} from "./map-data.service";

@Injectable({providedIn: "root"})
export class ThemeService {
	private readonly mapDataService = inject(MapDataService);

	public readonly theme = signal<"LIGHT" | "SYSTEM" | "DARK">("SYSTEM");

	constructor() {
		const theme = getCookie("theme");
		if (theme === "LIGHT" || theme === "SYSTEM" || theme === "DARK") {
			this.theme.set(theme);
		}
		this.setElementTag();
	}

	public setTheme(theme: "LIGHT" | "SYSTEM" | "DARK") {
		this.theme.set(theme);
		this.setElementTag();
		setTimeout(() => this.mapDataService.drawMap.emit(), 0);
	}

	private getSystemTheme() {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? "DARK" : "LIGHT";
	}

	public isDarkTheme() {
		return this.theme() === "DARK" || (this.theme() === "SYSTEM" && this.getSystemTheme() === "DARK");
	}

	private setElementTag() {
		setCookie("theme", this.theme());

		const element = document.querySelector("html");
		if (element) {
			element.classList.add(this.isDarkTheme() ? "dark-theme" : "light-theme");
			element.classList.remove(this.isDarkTheme() ? "light-theme" : "dark-theme");
		}
	}
}
