import {inject, Injectable} from "@angular/core";
import {getCookie, setCookie} from "../data/utilities";
import {MapDataService} from "./map-data.service";

@Injectable({providedIn: "root"})
export class ThemeService {
	private readonly mapDataService = inject(MapDataService);

	private darkTheme: "LIGHT" | "SYSTEM" | "DARK" = "SYSTEM";

	constructor() {
		const darkTheme = getCookie("dark_theme");
		if (darkTheme === "LIGHT" || darkTheme === "SYSTEM" || darkTheme === "DARK") {
			this.darkTheme = darkTheme;
		}
		this.setElementTag();
	}

	public getTheme() {
		return this.darkTheme;
	}

	public setTheme(isDarkTheme: "LIGHT" | "SYSTEM" | "DARK") {
		this.darkTheme = isDarkTheme;
		this.setElementTag();
		setTimeout(() => this.mapDataService.drawMap.emit(), 0);
	}

	private getSystemTheme() {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? "DARK" : "LIGHT";
	}

	public isDarkTheme() {
		return this.darkTheme === "DARK" || (this.darkTheme === "SYSTEM" && this.getSystemTheme() === "DARK");
	}

	private setElementTag() {
		setCookie("dark_theme", this.darkTheme);

		const element = document.querySelector("html");
		if (element) {
			element.classList.add(this.isDarkTheme() ? "dark-theme" : "light-theme");
			element.classList.remove(this.isDarkTheme() ? "light-theme" : "dark-theme");
		}
	}
}
