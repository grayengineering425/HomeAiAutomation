import { iFrameSource			} from '../sources/iFrameSource';
import { FrameSourceSimulator	} from '../sources/FrameSourceSimulator';
import { FrameSourceSocket		} from '../sources/FrameSourceSocket';
import { WebsocketService		} from '../sources/websocket.service'
import { Frame					} from '../data/Frame';
import { BoundingBox			} from '../data/BoundingBox';
import { Recording				} from '../data/Recording';

import { Injectable				} from '@angular/core';
import { Subscription           } from 'rxjs';

@Injectable()
export class ModelLive {
	private currentFrame			: Frame;
    private frameObserver			: Subscription;             //TODO: is this actually needed, is calling get subscription enough or does it need to be cached as a subscription
	private frameSource				: iFrameSource
	private playing					: boolean;
	private run						: Array<Frame>;
	private currentRecording		: Recording;
	private currentFrameIndex		: number;
	private showBoxes				: boolean;
	private isShowingFace			: boolean;
	private live					: boolean;

	constructor(wsService: WebsocketService)
    {
        console.log("Constructing ModelLive");

		this.run				= new Array<Frame>();
		this.playing			= false;
		this.showBoxes			= false;
		this.isShowingFace		= false;
		this.currentRecording	= null;
		this.currentFrameIndex	= 0;
		
		this.frameSource = new FrameSourceSocket(wsService);
		this.frameSource.startFrames();
		
		this.frameObserver	= this.frameSource.getSubscription().subscribe((frameData: any) => this.onNewFrame(frameData));
    }

	private onNewFrame(frame: Frame): void
	{
        if (this.playing) this.currentFrame = frame;
		if (this.live	) this.addFrame(frame);
	}

	public setPlaying(): void
	{
		this.playing = !this.playing;

		if (this.playing)
		{
			if (this.live)	this.frameObserver  = this.frameSource.getSubscription().subscribe((frameData: any) => this.onNewFrame(frameData));
			else			this.startFrameLoop();
		}
		else
		{
			if (this.live)	this.frameObserver = null;
			else			this.stopFrameLoop();
		}
	}

	private async startFrameLoop()
	{
		if (!this.currentRecording) return;

		while(this.playing)
		{
			this.currentFrameIndex++;
			if (this.currentFrameIndex >= this.currentRecording.frames.length) this.currentFrameIndex = 0;

			this.currentFrame = this.currentRecording.frames[this.currentFrameIndex];

			await this.delay(166);
		}
	}

	private stopFrameLoop(): void
	{
		this.playing = false;
	}

	public setCurrentRecording(recording: Recording): void
	{
		this.currentFrameIndex	= 0;
		this.currentRecording	= recording;

		if (this.currentRecording && this.currentRecording.frames.length > 0) this.currentFrame = this.currentRecording.frames[this.currentFrameIndex];
	}
	
	public requestToggleBoxes(): void
	{
		this.showBoxes = !this.showBoxes;
	}

	private addFrame(frame: Frame): void
    {
        if (this.run.length > 1000) this.run.shift();
        this.run.push(frame);
	}

	private delay(ms: number)
	{
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	
	//GETTERS
	public getCurrentFrameData	    ()				: string				{ return this.currentFrame ? this.currentFrame.data : "";														}
    public sourceActive             ()				: boolean				{ return this.frameSource.isActive();																			}
	public getCurrentFrameTimeStamp	()				: string				{ return this.currentFrame ? this.currentFrame.timeStamp : "";													}
	public getShowBoxes				()				: boolean 				{ return this.showBoxes;																						}
	public getBoxes					()				: Array<BoundingBox>	{ return this.currentFrame ? this.currentFrame.boundingBoxes : new Array<BoundingBox>();	}
	public showFace					()				: boolean				{ return this.isShowingFace;																					}
	public getBoxByIndex			(index: number) : BoundingBox			{ return this.currentFrame.boundingBoxes[index];																}


	//SETTERS
	public setShowFace	(s: boolean):		void { this.isShowingFace = s;									}
	public setLive		(live: boolean):	void { this.live = live; if(this.live) this.playing = true;		}
}
