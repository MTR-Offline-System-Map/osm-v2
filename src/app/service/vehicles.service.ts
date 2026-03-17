import {inject, Injectable} from "@angular/core";
import {DataServiceBase} from "./data-service-base";
import {Vehicle} from "../entity/vehicle";
import {HttpClient} from "@angular/common/http";
import {DimensionService} from "./dimension.service";
import {setIfUndefined} from "../data/utilities";
import {ConfigService} from "./config.service";

const REFRESH_INTERVAL = 86400;

@Injectable({providedIn: "root"})
export class VehiclesService extends DataServiceBase<{ data: { vehicles: Vehicle[] }}> {
    private vehicles: Record<string, {
        name: string,
        color: number,
        transportMode: "" | "TRAIN" | "BOAT" | "CABLE_CAR" | "AIRPLANE",
    }> = {};

    constructor() {
        const httpClient = inject(HttpClient);
        const dimensionService = inject(DimensionService);
        const configService = inject(ConfigService);

        super(() => httpClient.get<{ data: { vehicles: Vehicle[] } }>(configService.getDataUrl(dimensionService.getDimensionIndex(), dimensionService.getDimensionsLength(), "vehicles", {})), ({data}) => {
            this.vehicles = {};
            data.vehicles.forEach(vehicle => setIfUndefined(this.vehicles, vehicle.id, () => vehicle));
        }, REFRESH_INTERVAL, dimensionService, true, true);
        configService.refreshConfig.subscribe(() => this.fetchData(""));
    }

    getVehicle(id: string) {
        return this.vehicles[id];
    }

    getVehicleIcon(type: string) {
        switch (type) {
            case "TRAIN":
                return "directions_railway";
            case "BOAT":
                return "sailing";
            case "CABLE_CAR":
                return "airline_seat_recline_extra";
            case "AIRPLANE":
                return "flight";
        }
        return "";
    }
}