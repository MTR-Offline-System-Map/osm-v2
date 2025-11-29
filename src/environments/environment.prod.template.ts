export const environment = {
  dataUrl: (endpoint: string, dimensionIndex: number) => `https://fastly.jsdelivr.net/gh/$GH_USER/$GH_REPO@$GH_BRANCH$GH_PATH`,
  worldMapLink: (dimensionIndex: number, x: number, z: number) => `https://letsplay.minecrafttransitrailway.com/world-map/?world=minecraft_overworld&zoom=3&x=${x}&z=${z}`,
  dimensions: [],
  historicalMap: {
    enable: false,
    onlineDimensions: 3,
  },
  enableShowHiddenRoutes: false,
  enableShowAllStations: false,
};