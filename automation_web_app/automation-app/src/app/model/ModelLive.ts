import { OnInit					} from '@angular/core';
import { FrameDataService		} from '../frame-data.service'
import { iFrameSource			} from '../sources/iFrameSource';
import { FrameSourceSimulator	} from '../sources/FrameSourceSimulator';
import { Subscription           } from 'rxjs';
import { ModelMain              } from './ModelMain';
import { Frame					} from '../data/Frame';
import { BoundingBox			} from '../data/BoundingBox';
import { formatDate				} from '@angular/common';

export class ModelLive implements OnInit {
	private recordings		: Array<any>;
	private recordingIndex	: number;
	private playing			: boolean;
	private frameIndex		: number;
	private currentFrame	: any;
    private frameObserver   : Subscription;
    private paused          : boolean;

	private frameSource     : iFrameSource

	constructor(private frameDataService: FrameDataService, private modelMain: ModelMain)
    {
        this.frameSource = new FrameSourceSimulator();						//TODO
        this.frameObserver = this.frameSource.getSubscription().subscribe((frameData: any) => this.onNewFrame(frameData));

		frameDataService.get().subscribe((data: any) => this.recordings = data);

        this.recordingIndex = 0;
        this.frameIndex		= 0;
		this.playing		= false;
        this.paused         = false;

		console.log("Constructing ModelLive");
    }

	ngOnInit()
	{}

	setPlaying() {
		if (this.frameSource.isActive())	this.frameSource.stopFrames();
		else								this.frameSource.startFrames();
	}

	private onNewFrame(frameData: string): void
	{
        this.currentFrame = frameData;
		this.modelMain.onNewFrame(frameData);

		var frame	: Frame			= new Frame			();
		var box		: BoundingBox	= new BoundingBox	();

		box.x		= 0;
		box.y		= 0;
		box.height	= 0;
		box.width	= 0;

		frame.data		= frameData;
		frame.timeStamp = formatDate(Date(), 'yyyy/MM/dd', 'en');
		frame.boundingBoxes.push(box);

		this.frameDataService.addFrame(1, frame).subscribe((data: any) => console.log(data));
	}

	setRecordingIndex(index)
	{
		if (index == this.recordingIndex	) return; else
		if (index > this.recordings.length	) return; else

		this.playing		= false;
		this.frameIndex		= 0;
		this.recordingIndex = index;
	}

	public getCurrentFrameData	()          { return this.currentFrame;           }
    public getRecordings        ()          { return this.recordings;             }
    public sourceActive         (): boolean { return this.frameSource.isActive(); }
    public getSliderPercentage  (): number  { return this.frameSource.getFrameCount() == 0 ? 0 : this.frameSource.getCurrentIndex() / this.frameSource.getFrameCount(); }

	getCurrentFrameTimeStamp()
	{
		if (!this.recordings) return Date();

		return this.recordings[this.recordingIndex].frames[this.frameIndex].timeStamp;
	}

    private async startVideo() {
        this.playing = true;
        this.frameIndex = 0;

        while (this.playing)
        {
            if (this.frameIndex >= this.recordings[this.recordingIndex].frames.length - 1) this.frameIndex = 0;
            else this.frameIndex = this.frameIndex + 1;
          
			await this.delay(160);
        }
    }

    private delay(ms: number)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
