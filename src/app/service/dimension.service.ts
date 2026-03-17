import {Injectable, signal} from "@angular/core";

@Injectable({providedIn: "root"})
export class DimensionService {
	private dimensions: string[] = [];
	private dimensionIndex = 0;
	public c324 = signal<boolean>(false);
	public isOffline = signal<boolean>(false);
	public includeMarkers = signal<boolean>(false);
	public disableAutoDetectBusRoutes = signal<boolean>(true);

	public setDimensions(dimensions: string[]) {
		this.dimensions = dimensions;
		this.clampDimensionIndex();
	}

	public setDimension(dimension: string) {
		this.dimensionIndex = this.dimensions.indexOf(dimension);
		this.clampDimensionIndex();
	}

	public getDimensions() {
		return this.dimensions;
	}

	public getDimensionsLength() {
		return this.dimensions.length;
	}

	public getDimensionIndex() {
		return this.dimensionIndex;
	}

	private clampDimensionIndex() {
		this.dimensionIndex = Math.max(0, Math.min(this.dimensionIndex, this.dimensions.length));
	}
}
