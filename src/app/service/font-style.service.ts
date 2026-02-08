import {Injectable, signal} from "@angular/core";
import {getCookie, setCookie} from "../data/utilities";

@Injectable({providedIn: "root"})
export class FontStyleService {
    public readonly fontStyle = signal<"SANS" | "SERIF">("SANS");

    constructor() {
        const fontStyle = getCookie("font_style");
        if (fontStyle === "SANS" || fontStyle === "SERIF") {
            this.fontStyle.set(fontStyle);
        }
    }

    public setFontStyle(fontStyle: "SANS" | "SERIF") {
        this.fontStyle.set(fontStyle);
        setCookie("font_style", this.fontStyle());
    }
}