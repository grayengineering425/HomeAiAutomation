import { Frame					} from '../data/Frame';
import { BoundingBox			} from '../data/BoundingBox';
import { Recording				} from '../data/Recording';

import { Injectable				} from '@angular/core';

@Injectable()
export class ModelReview
{
	private currentFrame			: Frame;
	private playing					: boolean;
	private run						: Array<Frame>;
	private currentRecording		: Recording;
	private currentFrameIndex		: number;
	private showBoxes				: boolean;

	private observers				: Array<any>;

	constructor()
    {
		console.log("Constructing ModelReview");

		this.run				= new Array<Frame>();
		this.playing			= false;
		this.showBoxes			= true;
		this.currentRecording	= null;
		this.currentFrameIndex	= 0;
		this.observers			= new Array<any>();
    }

	public setPlaying(): void
	{
		this.playing = !this.playing;

		if (this.playing)	this.startFrameLoop();
		else				this.stopFrameLoop ();
	}

	private async startFrameLoop()
	{
		if (!this.currentRecording) return;

		while(this.playing)
		{
			this.currentFrameIndex++;
			if (this.currentFrameIndex >= this.currentRecording.frames.length) this.currentFrameIndex = 0;

			this.currentFrame = this.currentRecording.frames[this.currentFrameIndex];

			for (var i = 0; i < this.observers.length; ++i) this.observers[i].updateIndex(this.currentFrameIndex);

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

	private delay(ms: number)
	{
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	public register(o: any): void
	{
		if (!o) return;

		this.observers.push(o);
	}
	
	//GETTERS
	public getCurrentFrameData	    ()				: string				{ return this.currentFrame ? this.currentFrame.data : "";								}
	public getCurrentFrameTimeStamp	()				: string				{ return this.currentFrame ? this.currentFrame.timeStamp : "";							}
	public getShowBoxes				()				: boolean 				{ return this.showBoxes;																}
	public getBoxes					()				: Array<BoundingBox>	{ return this.currentFrame ? this.currentFrame.boundingBoxes : new Array<BoundingBox>();}
	public getBoxByIndex			(index: number)	: BoundingBox			{ return this.currentFrame.boundingBoxes[index];										}
	public getRunLength				()				: number				{ return this.currentRecording.frames.length;											}
	public isPlaying				()				: boolean				{ return this.playing;																	}

	//SETTERS

	public setCurrentFrame(index: number): void
	{
		if (!this.currentRecording || index < 0 || index > this.currentRecording.frames.length) return;

		if (this.playing) this.setPlaying();

		this.currentFrameIndex	= index;
		this.currentFrame		= this.currentRecording.frames[index];
	}
}
