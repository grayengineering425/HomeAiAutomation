import { Injectable			} from '@angular/core';

import { FrameDataService	} from '../frame-data.service';
import { Friend				} from '../data/Friend'
import { Face				} from '../data/Face'

@Injectable()
export class ModelFriends
{
	private friends: Array<Friend>;

	constructor(private frameDataService: FrameDataService)
    {
        console.log("Constructing ModelFriends");

		this.friends = new Array<Friend>();

		this.frameDataService.getFriends().subscribe((data: any) => { this.handleGetFriendsResponse(data) });
	}

	public requestSaveFriend(friendData: string)
	{
		var jsonObj = { 
							data:			friendData
						,	name:			"none"
						,	relationship:	"none"};

		var jsonStr = JSON.stringify(jsonObj);

		this.frameDataService.postFriend(jsonObj).subscribe((data: any) => { this.handlePostFriendResponse(data) });
	}

	private handleGetFriendsResponse(json: any): void
	{
		console.log(json);

		for (var i=0; i<json.friends.length; ++i)
		{
			var jsonFriend = json.friends[i];

			var data	 = jsonFriend.face.data;
			var encoding = new Array<number>();
			
			for (var j=0; j<jsonFriend.face.encoding.length; ++j) encoding.push(jsonFriend.face.encoding[j]);
			
			var id			 = jsonFriend.id;
			var name		 = jsonFriend.name;
			var relationship = jsonFriend.relationship;

			var friend = new Friend(id, name, relationship, data, encoding);
			
			this.friends.push(friend);
		}
		
		console.log(this.friends);
	}

	private handlePostFriendResponse(data): void
	{
		if (data.success) console.log("Successfully posted");
	}

	public getNumFriends(): number
	{
		return this.friends.length;
	}

	public getFriendData(index: number): string
	{
		if (index >= this.friends.length || index < 0) return "";

		return this.friends[index].face.data;
	}
}
