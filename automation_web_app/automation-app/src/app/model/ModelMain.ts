import { FrameDataService   } from '../frame-data.service'
import { Injectable			} from '@angular/core';

export enum State
{
		Live
	,	Review
	,	Friends
}

@Injectable()
export class ModelMain
{
	private currentState: State;

	constructor()
	{
		this.currentState = State.Friends;
	}

	public requestStateChange(state: State): void
	{
		if (this.currentState == state) return;

		this.currentState = state;
	}

	public getNavigationText(): string	{ return this.currentState == State.Live ? "Recordings" : "Live";	}
	public getState			(): State	{ return this.currentState;											}
	public isLive			(): boolean { return this.currentState == State.Live;							}
	public isReview			(): boolean { return this.currentState == State.Review;							}
	public isFriends		(): boolean { return this.currentState == State.Friends;						}
}