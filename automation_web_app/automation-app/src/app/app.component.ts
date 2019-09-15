import { Component			} from '@angular/core';
import { ModelMain, State	} from './Model/ModelMain'

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
		var currentState = this.model.getState();

		if (currentState == State.Live) this.model.requestStateChange(State.Review);
		else							this.model.requestStateChange(State.Live  );
	}

	public requestFriends(): void
	{
		this.model.requestStateChange(State.Friends);
	}

	public getNavigationText(): string  { return this.model.getNavigationText	(); }
	public isLive			(): boolean { return this.model.isLive				(); }
	public isReview			(): boolean { return this.model.isReview			();	}
	public isFriends		(): boolean { return this.model.isFriends			(); }
}
