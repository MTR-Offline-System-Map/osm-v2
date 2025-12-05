export const environment = {
  dataUrl: (endpoint: string, dimensionIndex: number) => dimensionIndex == 0 ? `https://letsplay.minecrafttransitrailway.com/system-map/mtr/api/map/${endpoint}?dimension=${dimensionIndex}` : `https://lps.gteh.top/datas/${dimensionIndex}`,
  worldMapLink: {
    enable: true,
    exec: (dimensionIndex: number, x: number, z: number) => `https://letsplay.minecrafttransitrailway.com/world-map/?world=minecraft_overworld&zoom=3&x=${x}&z=${z}`,
  },
  dimensions: ["official/realtime", "6/aug/2024/teufort", "4/may/2024/kdbr", "1/dec/2025", "4/jun/2025", "28/mar/2025", "3/feb/2024", "12/jan/2024", "15/nov/2023", "3/jun/2023", "centown/overworld", "centown/the_end"],
  historicalMap: {
    enable: true,
    onlineDimensions: 3,
  },
  enableShowHiddenRoutes: true,
  enableShowAllStations: true,
};