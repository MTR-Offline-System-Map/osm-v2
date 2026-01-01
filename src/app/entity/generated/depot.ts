export class DepotDTO {

    public readonly id: string;

    public readonly name: string;

    public readonly color: number;

    public readonly x: number;

    public readonly z: number;

    public readonly routes: string[];

    public constructor(id: string, name: string, color: number, x: number, z: number, routes: string[]) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.x = x;
        this.z = z;
        this.routes = routes;
    }
}