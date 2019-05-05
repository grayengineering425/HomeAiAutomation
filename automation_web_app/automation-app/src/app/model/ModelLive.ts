import { FrameDataService		} from '../frame-data.service'
import { iFrameSource			} from '../sources/iFrameSource';
import { FrameSourceSimulator	} from '../sources/FrameSourceSimulator';
import { Subscription           } from 'rxjs';
import { ModelMain              } from './ModelMain';
import { Frame					} from '../data/Frame';
import { BoundingBox			} from '../data/BoundingBox';
import { formatDate				} from '@angular/common';

export class ModelLive {
	private currentFrame	: Frame;
    private frameObserver   : Subscription;             //TODO: is this actually needed, is calling get subscription enough or does it need to be cached as a subscription
	private frameSource		: iFrameSource
	private model			: ModelMain;

	constructor(frameDataService: FrameDataService)
    {
        console.log("Constructing ModelLive");

		this.model = new ModelMain(frameDataService);

        this.frameSource	= new FrameSourceSimulator();
        this.frameObserver	= this.frameSource.getSubscription().subscribe((frameData: any) => this.onNewFrame(frameData));
    }

	setPlaying() {
		if (this.frameSource.isActive())	this.frameSource.stopFrames();
		else								this.frameSource.startFrames();
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

        this.currentFrame = frame;
        this.model.addFrame(frame);
	}

	public getCurrentFrameData	    ()          { return this.currentFrame ? this.currentFrame.data : "";		}
    public sourceActive             (): boolean { return this.frameSource.isActive();							}
    public getSliderPercentage      (): number  { return this.frameSource.getFrameCount() == 0 ? 0 : this.frameSource.getCurrentIndex() / this.frameSource.getFrameCount(); }
    public getCurrentFrameTimeStamp (): string  { return this.currentFrame ? this.currentFrame.timeStamp : "";	}
}
