import {Injectable, signal, WritableSignal} from "@angular/core";
import {environment} from "../../environments/environment";

@Injectable({providedIn: "root"})
export class DimensionService {
	private dimensions: string[] = environment.dimensions;
	private dimensionIndex = 0;
	public isOffline: WritableSignal<boolean> = signal(true);

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
		return this.dimensionIndex;
	}

	private clampDimensionIndex() {
		this.dimensionIndex = Math.max(0, Math.min(this.dimensionIndex, this.dimensions.length));
	}
}
