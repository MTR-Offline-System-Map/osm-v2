export class Vehicle {
    public readonly id: string;
    public readonly name: string;
    public readonly color: number;
    public readonly transportMode: "TRAIN" | "BOAT" | "CABLE_CAR" | "AIRPLANE";

    constructor(id: string, name: string, color: number, transportMode: "TRAIN" | "BOAT" | "CABLE_CAR" | "AIRPLANE") {
        this.id = id;
        this.name = name;
        this.color = color;
        this.transportMode = transportMode;
    }
}