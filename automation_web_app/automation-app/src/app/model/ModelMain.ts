import { FrameDataService   } from '../frame-data.service'
import { Injectable			} from '@angular/core';

export enum State
{
		Live
	,	Review
}

@Injectable()
export class ModelMain
{
	private currentState: State;

	constructor()
	{
		this.currentState = State.Review;
	}

	public requestStateChange(): void
	{
		if (this.currentState == State.Live)	this.currentState = State.Review;
		else									this.currentState = State.Live;
	}

	public getNavigationText(): string	{ return this.currentState == State.Live ? "Recordings" : "Live";	}
	public isLive			(): boolean { return this.currentState == State.Live;							}
	public isReview			(): boolean { return this.currentState == State.Review;							}
}