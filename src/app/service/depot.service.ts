import {inject, Injectable} from "@angular/core";
import {SelectableDataServiceBase} from "./selectable-data-service-base";
import {Depot} from "../entity/depot";
import {MapDataService} from "./map-data.service";
import {DimensionService} from "./dimension.service";
import {MapSelectionService} from "./map-selection.service";
import {ROUTE_TYPES} from "../data/routeType";
import {SimplifyRoutesPipe} from "../pipe/simplifyRoutesPipe";

@Injectable({providedIn: "root"})
export class DepotService extends SelectableDataServiceBase<void, Depot> {
    private readonly dataService = inject(MapDataService);

    public readonly routesAtDepot: { name: string, variations: string[], number: string, color: number, typeIcon: string, hidden: boolean }[] = [];

    constructor() {
        const mapDataService = inject(MapDataService);
        const mapSelectionService = inject(MapSelectionService);
        const dimensionService = inject(DimensionService);

        super(depotId => {
            this.routesAtDepot.length = 0;
			mapSelectionService.selectedStationConnections.length = 0;
			mapSelectionService.selectedStations.length = 0;
			mapSelectionService.selectedDepots.length = 0;
            const selectedDepots: Depot[] = [];

            mapDataService.depots().forEach(depot => {
                if (depot.id === depotId) {
                    selectedDepots.push(depot);
                }
            })

			mapSelectionService.select("depot");

            const selectedDepot = selectedDepots ? selectedDepots.find(depot => depot.id === depotId) ?? selectedDepots[0] : undefined;
            if (selectedDepot) {
                const newRoutes: Record<string, { name: string, variations: string[], number: string, color: number, typeIcon: string, hidden: boolean }> = {};
                this.dataService.routes().forEach(({name, number, color, type, depots, hidden}) => {
                    if (depots.some(depot => depot.id === selectedDepot.id)) {
                        const key = SimplifyRoutesPipe.getRouteKey({name, number, color});
                        const variation = name.split("||")[1];
                        if (key in newRoutes) {
                            newRoutes[key].variations.push(variation);
                        } else {
                            newRoutes[key] = {name: name.split("||")[0], variations: [variation], number, color, typeIcon: ROUTE_TYPES[type].icon, hidden};
                        }
                    }
                });
                Object.values(newRoutes).forEach(route => {
                    route.variations.sort();
                    this.routesAtDepot.push(route);
                });
                SimplifyRoutesPipe.sortRoutes(this.routesAtDepot);
            }

            return selectedDepot;
        }, () => mapSelectionService.reset("depot"), () => {
        }, () => {
        }, 0, dimensionService, false, true);
    }

    setDepot(depotId: string, zoomToDepot: boolean) {
        this.select(depotId);
        const selectedDepot = this.selectedData();
		if (selectedDepot) {
			if (selectedDepot.routes.every(({type}) => this.dataService.routeTypeVisibility()[type] === "HIDDEN")) {
				selectedDepot.routes.forEach(({type}) => this.dataService.routeTypeVisibility()[type] = "SOLID");
				this.dataService.updateData();
			}
			if (zoomToDepot) {
				this.dataService.animateMap.emit({x: selectedDepot.x, z: selectedDepot.z});
			}
		}
    }
}