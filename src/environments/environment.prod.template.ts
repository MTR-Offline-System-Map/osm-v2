export const environment = {
  dataUrl: (endpoint: string, dimensionIndex: number) => `https://fastly.jsdelivr.net/gh/$GH_USER/$GH_REPO@$GH_BRANCH$GH_PATH${dimensionIndex}`,
  worldMapLink: {
    enable: (dimensionIndex: number) => false,
    exec: (dimensionIndex: number, x: number, z: number) => ``,
  },
  dimensions: [],
  historicalMap: {
    enable: false,
    onlineDimensions: 3,
  },
  pathfinder: (dimensionIndex: number) => false,
  enableShowHiddenRoutes: false,
  enableShowEmptyRoutes: true,
  enableShowAllStations: false,
  enableShowDepots: false,
  enableAutoDetectBusRoutes: false,
  enableDeveloperMode: false,
};