import {Component, EventEmitter, Input, Output} from "@angular/core";
import {DrawerModule} from "primeng/drawer";
import {TooltipModule} from "primeng/tooltip";
import {ButtonModule} from "primeng/button";

@Component({
	selector: "app-drawer",
	imports: [
		DrawerModule,
		ButtonModule,
		TooltipModule,
	],
	templateUrl: "./drawer.component.html",
	styleUrl: "./drawer.component.css",
})
export class DrawerComponent {
	protected drawerVisible = false;
	protected drawerPosition = "";
	protected drawerStyle = {};
	protected drawerClass = "";
	@Input({required: true}) title = "";
	@Output() closed = new EventEmitter<void>;

	constructor() {
		window.addEventListener("resize", () => this.resize());
		this.resize();
	}

	open() {
		this.drawerVisible = true;
	}

	close() {
		this.drawerVisible = false;
	}

	setScrollable(value: boolean) {
		this.drawerClass = value ? "scrollable" : "";
	}

	private resize() {
		const vertical = window.innerWidth < window.innerHeight;
		this.drawerPosition = vertical ? "bottom" : "right";
		this.drawerStyle = vertical ? {height: "48rem", maxHeight: "80%"} : {width: "24rem", maxWidth: "80%"};
	}
}
