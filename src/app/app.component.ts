import {Component, inject, ViewChild} from "@angular/core";
import {MapComponent} from "./component/map/map.component";
import {StationPanelComponent} from "./component/station-panel/station-panel.component";
import {StationService} from "./service/station.service";
import {DrawerComponent} from "./component/drawer/drawer.component";
import {DirectionsComponent} from "./component/directions/directions.component";
import {MainPanelComponent} from "./component/main-panel/main-panel.component";
import {RouteKeyService} from "./service/route.service";
import {RoutePanelComponent} from "./component/route-panel/route-panel.component";
import {DirectionsService} from "./service/directions.service";
import {ButtonModule} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";
import {ClientService} from "./service/client.service";
import {ClientPanelComponent} from "./component/client-panel/client-panel.component";
import {DimensionService} from "./service/dimension.service";
import {DepotPanelComponent} from "./component/depot-panel/depot-panel.component";
import {DepotService} from "./service/depot.service";
import {TranslocoPipe} from "@jsverse/transloco";
import {LanguageService} from "./service/language.service";

@Component({
	selector: "app-root",
	imports: [
		MapComponent,
		ButtonModule,
		TooltipModule,
		StationPanelComponent,
		DrawerComponent,
		ClientPanelComponent,
		DirectionsComponent,
		MainPanelComponent,
		RoutePanelComponent,
		DepotPanelComponent,
		TranslocoPipe,
	],
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})
export class AppComponent {
	private readonly languageService = inject(LanguageService);
	private readonly stationService = inject(StationService);
	private readonly routeKeyService = inject(RouteKeyService);
	private readonly clientService = inject(ClientService);
	private readonly directionsService = inject(DirectionsService);
	private readonly dimensionService = inject(DimensionService);
	private readonly depotService = inject(DepotService);

	onClickMain(sideMain: DrawerComponent, sideStation: DrawerComponent, sideClient: DrawerComponent, sideDirections: DrawerComponent, sideRoute: DrawerComponent, sideDepot: DrawerComponent) {
		sideMain.open();
		sideStation.close();
		sideClient.close();
		sideDirections.close();
		sideRoute.close();
		sideDepot.close();
		this.onCloseStation();
		this.onCloseClient();
		this.onCloseDirections();
		this.onCloseRoute();
		this.onCloseDepot();
	}

	onClickStation(stationId: string, sideMain: DrawerComponent, sideStation: DrawerComponent, sideClient: DrawerComponent, sideDirections: DrawerComponent, sideRoute: DrawerComponent, sideDepot: DrawerComponent, zoomToStation: boolean) {
		this.stationService.setStation(stationId, zoomToStation);
		sideMain.close();
		sideStation.open();
		sideClient.close();
		sideDirections.close();
		sideRoute.close();
		sideDepot.close();
		this.onCloseClient();
		this.onCloseDirections();
		this.onCloseRoute();
		this.onCloseDepot();
	}

	onClickRoute(routeKey: string, sideMain: DrawerComponent, sideStation: DrawerComponent, sideClient: DrawerComponent, sideDirections: DrawerComponent, sideRoute: DrawerComponent, sideDepot: DrawerComponent) {
		this.routeKeyService.select(routeKey);
		sideMain.close();
		sideStation.close();
		sideClient.close();
		sideDirections.close();
		sideRoute.open();
		sideDepot.close();
		this.onCloseStation();
		this.onCloseClient();
		this.onCloseDirections();
		this.onCloseDepot();
	}

	onClickDepot(depotKey: string, sideMain: DrawerComponent, sideStation: DrawerComponent, sideClient: DrawerComponent, sideDirections: DrawerComponent, sideRoute: DrawerComponent, sideDepot: DrawerComponent, zoomToDepot: boolean) {
		this.depotService.setDepot(depotKey, zoomToDepot);
		sideMain.close();
		sideStation.close();
		sideClient.close();
		sideDirections.close();
		sideRoute.close();
		sideDepot.open();
		this.onCloseStation();
		this.onCloseRoute();
		this.onCloseClient();
		this.onCloseDirections();
	}

	onClickClient(clientId: string, sideMain: DrawerComponent, sideStation: DrawerComponent, sideClient: DrawerComponent, sideDirections: DrawerComponent, sideRoute: DrawerComponent, sideDepot: DrawerComponent) {
		this.clientService.setClient(clientId);
		sideMain.close();
		sideStation.close();
		sideClient.open();
		sideDirections.close();
		sideRoute.close();
		sideDepot.close();
		this.onCloseStation();
		this.onCloseRoute();
		this.onCloseDirections();
		this.onCloseDepot();
	}

	onOpenDirections(directionsSelection: { stationDetails?: { stationId: string, isStartStation: boolean }, clientDetails?: { clientId: string, isStartClient: boolean }, depotDetails?: { depotId: string, isStartDepot: boolean } } | undefined, sideMain: DrawerComponent, sideStation: DrawerComponent, sideClient: DrawerComponent, sideDirections: DrawerComponent, sideRoute: DrawerComponent, sideDepot: DrawerComponent) {
		this.directionsService.directionsPanelOpened.emit(directionsSelection);
		sideMain.close();
		sideStation.close();
		sideClient.close();
		sideDirections.open();
		sideRoute.close();
		sideDepot.close();
		this.onCloseStation();
		this.onCloseClient();
		this.onCloseRoute();
		this.onCloseDepot();
	}

	onCloseStation() {
		this.stationService.clear();
	}

	onCloseClient() {
		this.clientService.clear();
	}

	onCloseDirections() {
		this.directionsService.clear();
	}

	onCloseRoute() {
		this.routeKeyService.clear();
	}

	onCloseDepot() {
		this.depotService.clear();
	}

	isOffline() {
		return this.dimensionService.isOffline();
	}
}
