import { Component			} from '@angular/core';

import { ModelFriends		} from '../model/ModelFriends';

@Component({
  selector:		 'app-friends',
  templateUrl:   './friends.component.html',
  styleUrls:	['./friends.component.css'],
  providers:	[ModelFriends]
})

export class FriendsComponent
{
	private base64Friend: string;

	constructor(private model: ModelFriends)
	{
		this.base64Friend = "";
	}

	public addFriend(event: any): void
	{
		console.log("Adding new friend");

		if (event.target.files.length == 0) return;

		var file = event.target.files[0];
		if (!file) return;

		var reader = new FileReader();

		reader.onload = this.handleReaderLoaded.bind(this);

		reader.readAsBinaryString(file);
	}

	public exit(): void
	{
		this.base64Friend = "";
	}

	public saveFriend(): void
	{
		this.model.requestSaveFriend(this.base64Friend);
	}

	private handleReaderLoaded(readerEvent): void
	{
		var binaryString = readerEvent.target.result;
		this.base64Friend = btoa(binaryString);
	}

	public getFriends		():					Array<number>	{ return Array<number>(this.model.getNumFriends());						}
	public getFriendData	(index: number):	string			{ return "data:image/png;base64," + this.model.getFriendData(index);	}
	public isFriendLoaded	():					boolean			{ return this.base64Friend != "";										}
	public getNewFriendData	():					string			{ return "data:image/png;base64," + this.base64Friend;					}
}