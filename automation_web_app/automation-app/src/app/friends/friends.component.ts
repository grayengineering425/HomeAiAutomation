import { Component } from '@angular/core';

@Component({
  selector:		 'app-friends',
  templateUrl:   './friends.component.html',
  styleUrls:	['./friends.component.css']
})
export class FriendsComponent
{
	constructor()
	{
	}

	public addFriend(): void
	{
		console.log("Adding new friend");
	}
}