import { Component } from '@angular/core';
import { ModelMain } from './Model/ModelMain'

@Component({
	selector    : 'app-root'            ,
	templateUrl : './app.component.html',
	styleUrls: ['./app.component.css'],
	providers: [ModelMain]
})

export class AppComponent {
	private sidebarExpanded: boolean;

	constructor(private model: ModelMain)
    {
        console.log('Constructing Main App Component');

		this.sidebarExpanded = false;
    }

	public toggleSidebar(): void
	{
		if (this.sidebarExpanded)	document.getElementById("sidebar").style.width = "0px";
		else						document.getElementById("sidebar").style.width = "250px";

		console.log(document.getElementById("sidebar").style.width);

		this.sidebarExpanded = !this.sidebarExpanded;
	}

	public requestStateChange(): void
	{
		this.model.requestStateChange();
	}

	public getNavigationText(): string  { return this.model.getNavigationText	(); }
	public isLive			(): boolean { return this.model.isLive				(); }
	public isReview			(): boolean { return this.model.isReview			();	}
}
