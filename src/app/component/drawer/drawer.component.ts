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
	styleUrl: "./drawer.component.scss",
})
export class DrawerComponent {
	protected drawerVisible = false;
	protected drawerMinimized = false;
	protected drawerPosition: "bottom" | "right" = "right";
	protected drawerStyle = {};
	protected readonly drawerStyleMinimized = {width: "fit-content", height: "fit-content"};
	@Input({required: true}) title = "";
	@Output() closed = new EventEmitter<void>;

	constructor() {
		screen.orientation.addEventListener("change", () => this.resize(screen.orientation.type.startsWith("portrait")));
		this.resize(screen.orientation.type.startsWith("portrait"));
	}

	open() {
		this.drawerVisible = true;
		this.drawerMinimized = false;
	}

	close() {
		this.drawerVisible = false;
	}

	private resize(vertical: boolean) {
		this.drawerPosition = vertical ? "bottom" : "right";
		this.drawerStyle = vertical ? {height: "48rem", maxHeight: "80%"} : {width: "24rem", maxWidth: "80%"};
	}
}
