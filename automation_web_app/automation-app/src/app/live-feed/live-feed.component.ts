import { Component, OnInit	} from '@angular/core';
import { ModelLive			} from '../model/ModelLive'
import { FrameDataService   } from '../frame-data.service';
import { ModelMain          } from '../model/ModelMain'

@Component({
  selector:     'app-live-feed',
  templateUrl:  './live-feed.component.html',
  styleUrls:    ['./live-feed.component.css']
})

export class LiveFeedComponent implements OnInit {
	private model: ModelLive;

	constructor(frameDataService: FrameDataService, modelMain: ModelMain)
	{
		this.model = new ModelLive(frameDataService, modelMain);
		console.log('Constructing LiveFeedComponent');
    }
      
    ngOnInit()
	{
	}

    public setPlaying(): void
	{
        this.model.setPlaying();
    }

    public changeRecordingIndex(index): void
    {
        this.model.setRecordingIndex(index);
	}

	public getCurrentFrameData	(): string	{ return					this.model.getCurrentFrameData();		}
	public getTimeStamp			(): Date	{ return this.convertDate(	this.model.getCurrentFrameTimeStamp());	}
	public getRecordings		(): any		{ return					this.model.getRecordings();				}
    public sourceActive         (): boolean { return                    this.model.sourceActive();              }
    public getSliderPosition(): string
    {
        var percentage      = this.model.getSliderPercentage();
        var pixelsFromLeft  = percentage * 648.0;                //TODO: can we get this value from the DOM?
        var pixelString = pixelsFromLeft.toString() + "px";

        console.log(pixelString);

        return pixelString;
    }

	private convertDate(date): Date
	{
		var dateOut = new Date(date);
		return dateOut;
	}
}
