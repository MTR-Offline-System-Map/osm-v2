import {inject, Injectable} from "@angular/core";
import {getCookie, getKeyByValue, setCookie} from "../data/utilities";
import {TranslocoService} from "@jsverse/transloco";

@Injectable({providedIn: "root"})
export class LanguageService {
	private readonly translocoService = inject(TranslocoService);

	private readonly languages = {
		"en-US": "English",
		"zh-CN": "简体中文",
	};

	constructor() {
		const cookieLang = getCookie("language");
		const supportLangCodes = Object.keys(this.languages);
		if (supportLangCodes.includes(cookieLang)) {
			this.switchLanguage(cookieLang);
		} else {
			const browserLang = navigator.language;
			if (supportLangCodes.includes(browserLang)) {
				this.switchLanguage(browserLang);
			}
		}
	}

    public getSupportedLanguages() {
        return this.languages;
    }

	public getLanguage(): "en-US" | "zh-CN" {
        const lang = this.translocoService.getActiveLang();
		return lang === "en-US" || lang === "zh-CN" ? lang : "en-US";
	}

	public switchLanguage(langCode: string) {
		this.translocoService.setActiveLang(langCode);
		setCookie("language", langCode);
	}

    public getLanguageCode(lang: string) {
        return getKeyByValue(this.languages, lang);
    }

    public getLanguageName() {
        return this.languages[this.getLanguage()];
    }
}
