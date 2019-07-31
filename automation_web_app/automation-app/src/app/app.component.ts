import { Component } from '@angular/core';

@Component({
  selector    : 'app-root'            ,
  templateUrl : './app.component.html',
  styleUrls   : ['./app.component.css']
})
export class AppComponent {
	private sidebarExpanded: boolean;

	constructor()
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
}
