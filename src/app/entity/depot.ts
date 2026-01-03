import {ROUTE_TYPES} from "../data/routeType";
import {DepotDTO} from "./generated/depot";
import {Route} from "./route";

export class Depot {
    public readonly id: string;
    public readonly name: string;
    public readonly color: number;
    public readonly x: number;
    public readonly z: number;
    public readonly routes: Route[] = [];
    
    public constructor(depot?: DepotDTO, name?: string) {
        this.id = depot?.id ?? "";
        this.color = depot?.color ?? 0;
        this.name = depot?.name ?? name ?? "(Untitled)";
        this.x = depot?.x ?? 0;
        this.z = depot?.z ?? 0;
    }

    public readonly getIcons = (predicate?: (type: string) => boolean) => {
        if (!this.id) return [""];
        const icons: string[] = [];
        Object.entries(ROUTE_TYPES).forEach(([routeTypeKey, routeType]) => {
            if ((predicate === undefined || predicate(routeTypeKey)) && this.routes.some(({type}) => type === routeTypeKey)) {
                icons.push(routeType.icon);
            }
        });
        return icons;
    };
}