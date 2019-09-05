import { iFrameSource			} from '../sources/iFrameSource';
import { FrameSourceSimulator	} from '../sources/FrameSourceSimulator';
import { FrameSourceSocket		} from '../sources/FrameSourceSocket';
import { WebsocketService		} from '../sources/websocket.service'
import { Frame					} from '../data/Frame';
import { BoundingBox			} from '../data/BoundingBox';

import { Injectable				} from '@angular/core';
import { Subscription           } from 'rxjs';

@Injectable()
export class ModelLive
{
	private currentFrame			: Frame;
    private frameObserver			: Subscription;             //TODO: is this actually needed, is calling get subscription enough or does it need to be cached as a subscription
	private frameSource				: iFrameSource
	private playing					: boolean;
	private run						: Array<Frame>;
	private currentFrameIndex		: number;

	constructor(wsService: WebsocketService)
    {
        console.log("Constructing ModelLive");

		this.run				= new Array<Frame>();
		this.playing			= false;
		this.currentFrameIndex	= 0;
		
		this.frameSource = new FrameSourceSocket(wsService);
		this.frameSource.startFrames();
		
		this.frameObserver	= this.frameSource.getSubscription().subscribe((frameData: any) => this.onNewFrame(frameData));
    }

	private onNewFrame(frame: Frame): void
	{
        if (this.playing) this.currentFrame = frame;
		this.addFrame(frame);
	}

	public setPlaying(): void
	{
		this.playing = !this.playing;

		if (this.playing)
		{
			this.frameObserver  = this.frameSource.getSubscription().subscribe((frameData: any) => this.onNewFrame(frameData));
		}
		else
		{
			this.frameObserver = null;
		}
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
	public getBoxes					()				: Array<BoundingBox>	{ return this.currentFrame ? this.currentFrame.boundingBoxes : new Array<BoundingBox>();						}
	public getBoxByIndex			(index: number) : BoundingBox			{ return this.currentFrame.boundingBoxes[index];																}
	public getRunLength				()				: number				{ return this.run.length;																						}
}
