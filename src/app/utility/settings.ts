import {LineMaterial} from "three/examples/jsm/lines/LineMaterial.js";

export const SETTINGS = {
	scale: 1,
	maxText: 16,
	maxBlobs: 128,
	maxVertices: 99999,
};

export const CONNECTIONS = {
	lineMaterialStationConnectionThin: new LineMaterial({color: 0xFFFFFF, linewidth: 4 * SETTINGS.scale * devicePixelRatio, vertexColors: true}),
	lineMaterialStationConnectionThick: new LineMaterial({color: 0xFFFFFF, linewidth: 8 * SETTINGS.scale * devicePixelRatio, vertexColors: true}),
	lineMaterialNormal: new LineMaterial({color: 0xFFFFFF, linewidth: 6 * SETTINGS.scale * devicePixelRatio, vertexColors: true}),
	lineMaterialNormalDashed: new LineMaterial({color: 0xFFFFFF, linewidth: 6 * SETTINGS.scale * devicePixelRatio, vertexColors: true, dashed: true}),
	lineMaterialThin: new LineMaterial({color: 0xFFFFFF, linewidth: 3 * SETTINGS.scale * devicePixelRatio, vertexColors: true}),
	lineMaterialThinDashed: new LineMaterial({color: 0xFFFFFF, linewidth: 3 * SETTINGS.scale * devicePixelRatio, vertexColors: true, dashed: true}),
};


export function refreshMapScale(scale: number) {
	SETTINGS.scale = scale;
	CONNECTIONS.lineMaterialStationConnectionThin = new LineMaterial({color: 0xFFFFFF, linewidth: 4 * scale * devicePixelRatio, vertexColors: true});
	CONNECTIONS.lineMaterialStationConnectionThick = new LineMaterial({color: 0xFFFFFF, linewidth: 8 * scale * devicePixelRatio, vertexColors: true});
	CONNECTIONS.lineMaterialNormal = new LineMaterial({color: 0xFFFFFF, linewidth: 6 * scale * devicePixelRatio, vertexColors: true});
	CONNECTIONS.lineMaterialNormalDashed = new LineMaterial({color: 0xFFFFFF, linewidth: 6 * scale * devicePixelRatio, vertexColors: true, dashed: true});
	CONNECTIONS.lineMaterialThin = new LineMaterial({color: 0xFFFFFF, linewidth: 3 * scale * devicePixelRatio, vertexColors: true});
	CONNECTIONS.lineMaterialThinDashed = new LineMaterial({color: 0xFFFFFF, linewidth: 3 * scale * devicePixelRatio, vertexColors: true, dashed: true});
}
