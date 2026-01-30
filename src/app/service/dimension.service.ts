import {Injectable, signal, WritableSignal} from "@angular/core";
import {environment} from "../../environments/environment";

@Injectable({providedIn: "root"})
export class DimensionService {
	private dimensions: string[] = environment.dimensions;
	private dimensionIndex = 0;
	public c324: WritableSignal<boolean> = signal(false);
	public isOffline: WritableSignal<boolean> = signal(false);
	public includeMarkers: WritableSignal<boolean> = signal(true);

	public setDimensions(dimensions: string[]) {
		if (environment.dimensions.length == 0) {
			this.dimensions = dimensions;
		}
		this.clampDimensionIndex();
	}

	public setDimension(dimension: string) {
		this.dimensionIndex = this.dimensions.indexOf(dimension);
		this.clampDimensionIndex();
	}

	public getDimensions() {
		return this.dimensions;
	}

	public getDimensionIndex() {
		return environment.historicalMap.enable ? (this.dimensionIndex < environment.historicalMap.onlineDimensions ? this.dimensionIndex : this.dimensions.length - this.dimensionIndex + environment.historicalMap.onlineDimensions - 1) : this.dimensionIndex;
	}

	private clampDimensionIndex() {
		this.dimensionIndex = Math.max(0, Math.min(this.dimensionIndex, this.dimensions.length));
	}
}
