import { FrameDataService		} from '../frame-data.service'
import { iFrameSource			} from '../sources/iFrameSource';
import { FrameSourceSimulator	} from '../sources/FrameSourceSimulator';
import { FrameSourceSocket		} from '../sources/FrameSourceSocket';
import { WebsocketService		} from '../sources/websocket.service'
import { Frame					} from '../data/Frame';
import { BoundingBox			} from '../data/BoundingBox';
import { Recording				} from '../data/Recording';

import { formatDate				} from '@angular/common';
import { Injectable				} from '@angular/core';
import { Subscription           } from 'rxjs';

export enum State
{
		Live
	,	Review
}

@Injectable()
export class ModelLive {
	private currentFrame			: Frame;
    private frameObserver			: Subscription;             //TODO: is this actually needed, is calling get subscription enough or does it need to be cached as a subscription
	private frameSource				: iFrameSource
	private playing					: boolean;
	private state					: State;
	private run						: Array<Frame>;
	private recordings				: Array<any>;
	private currentRecordingIndex	: number;
	private currentFrameIndex		: number;

	constructor(private frameDataService: FrameDataService, wsService: WebsocketService)
    {
        console.log("Constructing ModelLive");

		this.run			= new Array<Frame>	();
		this.state			= State.Live;
		this.playing		= true;
		
		this.frameSource	= new FrameSourceSocket(wsService);
		this.frameSource.startFrames();
		
		this.frameObserver	= this.frameSource.getSubscription().subscribe((frameData: any) => this.onNewFrame(frameData));

		this.frameDataService.getRecordings().subscribe((data: any) => this.recordings = data);
    }

	private onNewFrame(frameData: string): void
	{
		var frame	: Frame			= new Frame			();
		var box		: BoundingBox	= new BoundingBox	();

		box.x		= 0;
		box.y		= 0;
		box.height	= 0;
		box.width	= 0;

		frame.data		= frameData;
		frame.timeStamp = formatDate(Date(), 'yyyy/MM/dd', 'en');
		frame.boundingBoxes.push(box);

        if (this.playing && this.state == State.Live) this.currentFrame = frame;

		this.addFrame(frame);
	}

	public loadRecording(index: number): void
	{
		if (index >= this.recordings.length || index < 0) return;

		this.currentRecordingIndex = index;

		this.setState(State.Review);
	}

	public requestLive(): void
	{
		this.currentFrame = null;
		this.setState(State.Live);
	}

	private addFrame(frame: Frame): void
    {
        if (this.run.length > 100) this.run.shift();
        this.run.push(frame);

		//saving of frames should be not be done here
		//if (this.isRecording) this.frameDataService.addFrame(1, frame).subscribe((data: any) => this.handleFrameAddResponse(data));
	}

	private handleFrameAddResponse(data: any): void
	{
	}

	private getFirstFrameString(index: number): string
	{
		if (this.recordings.length <= index || index < 0) return "";
		if (this.recordings[index].frames.length == 0	) return "";

		return this.recordings[index].frames[0].data;
	}

	private setState(state: State): void
	{
		if (state == State.Live)
		{
			this.playing = true;
		}
		if (state == State.Review)
		{
			this.currentFrameIndex	= 0;
			this.playing			= false;
			this.currentFrame		= this.recordings[this.currentRecordingIndex].frames[this.currentFrameIndex];
		}

		this.state = state;
	}

	private async startRecording()
	{
		while (this.playing && this.state == State.Review)
		{
			if (this.currentFrameIndex + 1 >= this.recordings[this.currentRecordingIndex].frames.length) this.currentFrameIndex = 0;
			else this.currentFrameIndex++;

			this.currentFrame = this.recordings[this.currentRecordingIndex].frames[this.currentFrameIndex];
			await this.delay(160);
		}
	}

	private delay(ms: number)
	{
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	
	//GETTERS
	public getCurrentFrameData	    ()				: string		{ return this.currentFrame ? this.currentFrame.data : "";		}
    public sourceActive             ()				: boolean		{ return this.frameSource.isActive();							}
	public getCurrentFrameTimeStamp	()				: string		{ return this.currentFrame ? this.currentFrame.timeStamp : "";	}
	public getRecordings			()				: Array<any>	{ return this.recordings;										}
	public getFirstFrame			(index: number)	: string		{ return this.getFirstFrameString(index);						}
	public getState					()				: State			{ return this.state;											}

    //public getSliderPercentage      (): number  { return this.frameSource.getFrameCount() == 0 ? 0 : this.frameSource.getCurrentIndex() / this.frameSource.getFrameCount(); }


	//SETTERS
	public setPlaying(): void { this.playing = !this.playing; if (this.state == State.Review && this.playing) this.startRecording(); }
}
