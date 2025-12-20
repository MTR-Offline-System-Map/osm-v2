import {Injectable} from "@angular/core";
import {getCookie, setCookie} from "../data/utilities";

@Injectable({providedIn: "root"})
export class FontStyleService {
    private fontStyle: "SANS" | "SERIF" = "SANS";

    constructor() {
        const fontStyle = getCookie("font_style");
        if (fontStyle === "SANS" || fontStyle === "SERIF") {
            this.fontStyle = fontStyle;
        }
    }

    public getFontStyle() {
        return this.fontStyle;
    }

    public setFontStyle(fontStyle: "SANS" | "SERIF") {
        this.fontStyle = fontStyle;
        setCookie("font_style", this.fontStyle);
    }
}