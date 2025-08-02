import {Component} from "@angular/core";
import {MapComponent} from "./component/map/map.component";
import {StationPanelComponent} from "./component/station-panel/station-panel.component";
import {StationService} from "./service/station.service";
import {DrawerComponent} from "./component/drawer/drawer.component";
import {MainPanelComponent} from "./component/panel/main-panel.component";
import {RouteKeyService} from "./service/route.service";
import {RoutePanelComponent} from "./component/route-panel/route-panel.component";
import {ThemeService} from "./service/theme.service";
import {ButtonModule} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";

@Component({
	selector: "app-root",
	imports: [
		MapComponent,
		ButtonModule,
		TooltipModule,
		StationPanelComponent,
		DrawerComponent,
		MainPanelComponent,
		RoutePanelComponent,
	],
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})
export class AppComponent {

	constructor(private readonly themeService: ThemeService, private readonly stationService: StationService, private readonly routeKeyService: RouteKeyService) {
	}

	getTitle() {
		return document.title;
	}

	onClickMain(sideMain: DrawerComponent, sideStation: DrawerComponent, sideRoute: DrawerComponent) {
		sideMain.open();
		sideStation.close();
		sideRoute.close();
		this.onCloseStation();
		this.onCloseRoute();
	}

	onClickStation(stationId: string, sideMain: DrawerComponent, sideStation: DrawerComponent, sideRoute: DrawerComponent, zoomToStation: boolean) {
		this.stationService.setStation(stationId, zoomToStation);
		sideMain.close();
		sideStation.open();
		sideRoute.close();
		this.onCloseRoute();
	}

	onClickRoute(routeKey: string, sideMain: DrawerComponent, sideStation: DrawerComponent, sideRoute: DrawerComponent) {
		this.routeKeyService.select(routeKey);
		sideMain.close();
		sideStation.close();
		sideRoute.open();
		this.onCloseStation();
	}

	onCloseStation() {
		this.stationService.clear();
	}

	onCloseRoute() {
		this.routeKeyService.clear();
	}

	isDarkTheme() {
		return this.themeService.isDarkTheme();
	}
}
