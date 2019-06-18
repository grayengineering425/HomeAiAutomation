import { Component, OnInit	} from '@angular/core';
import { ModelLive, State	} from '../model/ModelLive'
import { WebsocketService	} from '../sources/websocket.service'

@Component({
  selector:     'app-live-feed',
  templateUrl:  './live-feed.component.html',
  styleUrls:    ['./live-feed.component.css'],
  providers:	[WebsocketService, ModelLive]
})

export class LiveFeedComponent implements OnInit {
	constructor(private model: ModelLive)
    {
        console.log('Constructing LiveFeedComponent');
    }
      
    ngOnInit()
	{
	}

    public setPlaying(): void
	{
        this.model.setPlaying();
	}

	public loadRecording(index: number): void
	{
		this.model.loadRecording(index);
	}

	public requestLive(): void
	{
		this.model.requestLive();
	}

	public getCurrentFrameData	()				: string		{ return					this.model.getCurrentFrameData();		}
	public getTimeStamp			()				: Date			{ return this.convertDate(	this.model.getCurrentFrameTimeStamp());	}
    public sourceActive         ()				: boolean		{ return                    this.model.sourceActive();              }
	public getRecordings		()				: Array<any>	{ return					this.model.getRecordings();				}
	public getFirstFrame		(index: number)	: string		{ return					this.model.getFirstFrame(index);		}
	public isReview				()				: boolean		{ return					this.model.getState() == State.Review;	}	

	public getSliderPosition(): string
    {
		//      var percentage      = this.model.getSliderPercentage();
		//      var pixelsFromLeft  = percentage * 648.0;					//TODO: can we get this value from the DOM?
		//      var pixelString		= pixelsFromLeft.toString() + "px";

		//return pixelString;

		return "0.0 px";
	}

	private convertDate(date): Date
	{
		var dateOut = new Date(date);
		return dateOut;
	}
}
