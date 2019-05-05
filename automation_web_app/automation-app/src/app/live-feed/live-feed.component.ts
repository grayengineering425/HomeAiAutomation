import { Component, OnInit	} from '@angular/core';
import { ModelLive			} from '../model/ModelLive'
import { FrameDataService	} from '../frame-data.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector:     'app-live-feed',
  templateUrl:  './live-feed.component.html',
  styleUrls:    ['./live-feed.component.css']
})

export class LiveFeedComponent implements OnInit {
	private model: ModelLive;

	constructor(frameDataService: FrameDataService)
    {
        console.log('Constructing LiveFeedComponent');
		this.model = new ModelLive(frameDataService);
    }
      
    ngOnInit()
	{
	}

    public setPlaying(): void
	{
        this.model.setPlaying();
    }

	public getCurrentFrameData	(): string	{ return					this.model.getCurrentFrameData();		}
	public getTimeStamp			(): Date	{ return this.convertDate(	this.model.getCurrentFrameTimeStamp());	}
    public sourceActive         (): boolean { return                    this.model.sourceActive();              }

	public getSliderPosition(): string
    {
        var percentage      = this.model.getSliderPercentage();
        var pixelsFromLeft  = percentage * 648.0;                                                                                   //TODO: can we get this value from the DOM?
        var pixelString		= pixelsFromLeft.toString() + "px";

        return pixelString;
	}

	private convertDate(date): Date
	{
		var dateOut = new Date(date);
		return dateOut;
	}
}
