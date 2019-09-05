import { Component			} from '@angular/core';
import { ModelLive			} from '../model/ModelLive'
import { WebsocketService	} from '../sources/websocket.service'

@Component({
  selector:     'app-live-feed',
  templateUrl:  './live-feed.component.html',
  styleUrls:    ['./live-feed.component.css'],
  providers:	[WebsocketService, ModelLive]
})

export class LiveFeedComponent
{
	constructor(private model: ModelLive)
	{
		console.log('Constructing LiveFeedComponent');
	}

    public setPlaying(): void
	{
        this.model.setPlaying();
	}

	public getCurrentFrameData	(): string				{ return this.model.getCurrentFrameData();							}
	public getTimeStamp			(): Date				{ return this.convertDate(this.model.getCurrentFrameTimeStamp());	}
	public sourceActive			(): boolean				{ return this.model.sourceActive();									}
	public getStateText			(): string				{ return "Live"														}
	public getRunLength			(): number				{ return this.model.getRunLength();									}

	private convertDate(date): Date
	{
		var dateOut = new Date(date);
		return dateOut;
	}
}
