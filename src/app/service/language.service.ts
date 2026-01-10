import {inject, Injectable} from "@angular/core";
import {getCookie, setCookie} from "../data/utilities";
import {TranslocoService} from "@jsverse/transloco";

@Injectable({providedIn: "root"})
export class LanguageService {
	private readonly translocoService = inject(TranslocoService);

	private readonly languages = [
		{ id: "en-US", name: "English", browserLang: [] },
		{ id: "zh-Hans", name: "简体中文", browserLang: ["zh-CN"] },
	];

	constructor() {
		const cookieLang = getCookie("language");
		const supportLangCodes = this.languages.map(lang => [lang.id, ...lang.browserLang]).flat();
		if (supportLangCodes.includes(cookieLang)) {
			this.switchLanguage(this.languages.find(lang => [lang.id, ...lang.browserLang].includes(cookieLang))!.id);
		} else {
			const browserLang = navigator.language;
			if (supportLangCodes.includes(browserLang)) {
				this.switchLanguage(this.languages.find(lang => [lang.id, ...lang.browserLang].includes(browserLang))!.id);
			}
		}
	}

    public getSupportedLanguages() {
        return this.languages.map(lang => lang.name);
    }

	public getLanguage() {
        const lang = this.translocoService.getActiveLang();
		return lang === "en-US" || lang === "zh-Hans" ? lang : "en-US";
	}

	public switchLanguage(langCode: string) {
		this.translocoService.setActiveLang(langCode);
		setCookie("language", langCode);
	}

    public getLanguageCode(name: string) {
        return this.languages.find(lang => lang.name == name)?.id;
    }

    public getLanguageName(code: string) {
        return this.languages.find(lang => lang.id == code)?.name;
    }
}
