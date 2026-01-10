import "reflect-metadata";
import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideHttpClient} from "@angular/common/http";
import {SimplifyRoutesPipe} from "./app/pipe/simplifyRoutesPipe";
import {SimplifyStationsPipe} from "./app/pipe/simplifyStationsPipe";
import {FormatNamePipe} from "./app/pipe/formatNamePipe";
import {FormatTimePipe} from "./app/pipe/formatTimePipe";
import {SplitNamePipe} from "./app/pipe/splitNamePipe";
import {isDevMode} from "@angular/core";
import {providePrimeNG} from "primeng/config";
import {myPreset} from "./theme-preset";
import {provideTransloco} from "@jsverse/transloco";
import {TranslocoHttpLoader} from "./transloco-loader";
import {SimplifyDepotsPipe} from "./app/pipe/simplifyDepotsPipe";

bootstrapApplication(AppComponent, {
	providers: [
		provideAnimationsAsync(),
		provideHttpClient(),
		providePrimeNG({
			theme: {
				preset: myPreset,
				options: {darkModeSelector: ".dark-theme"},
			},
		}),
		provideTransloco({
			config: {
				availableLangs: ["en-US", "zh-Hans"],
				defaultLang: "en-US",
				reRenderOnLangChange: true,
				prodMode: !isDevMode(),
			},
			loader: TranslocoHttpLoader,
		}),
		SimplifyStationsPipe,
		SimplifyRoutesPipe,
		SimplifyDepotsPipe,
		SplitNamePipe,
		FormatNamePipe,
		FormatTimePipe,
	],
}).catch(error => console.error(error));
