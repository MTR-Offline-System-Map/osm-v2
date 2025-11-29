export const environment = {
  dataUrl: (endpoint: string, dimensionIndex: number) => `https://letsplay.minecrafttransitrailway.com/system-map/mtr/api/map/${endpoint}?dimension=${dimensionIndex}`,
  worldMapLink: (dimensionIndex: number, x: number, z: number) => `https://letsplay.minecrafttransitrailway.com/world-map/?world=minecraft_overworld&zoom=3&x=${x}&z=${z}`,
  dimensions: [],
  historicalMap: {
    enable: false,
    onlineDimensions: 3,
  },
  enableShowHiddenRoutes: true,
  enableShowAllStations: true,
};