import { Component, ViewChild, Input	} from '@angular/core';
import { ModelLive						} from '../model/ModelLive'
import { WebsocketService				} from '../sources/websocket.service'
import { BoundingBox					} from '../data/BoundingBox';
import { Recording						} from '../data/Recording'

@Component({
  selector:     'app-live-feed',
  templateUrl:  './live-feed.component.html',
  styleUrls:    ['./live-feed.component.css'],
  providers:	[WebsocketService, ModelLive]
})

export class LiveFeedComponent
{
	@ViewChild	("currentFace") currentFace;
	@Input		() live: boolean;

	constructor(private model: ModelLive)
    {
        console.log('Constructing LiveFeedComponent');

		this.model.setLive(this.live);
    }

    public setPlaying(): void
	{
        this.model.setPlaying();
	}

	public requestLive(): void
	{
		this.model.setLive(true);
	}

	public requestBoxes(): void
	{
		this.model.requestBoxes();
	}

	public requestFace(index: number): void
	{
		console.log(index);
		this.model.setShowFace(true);
		
		var box				= this.model.getBoxByIndex(index)
		var currentImage	= this.model.getCurrentFrameData();

		console.log(box);

		var context = this.currentFace.nativeElement.getContext("2d");

		context.fillStyle = currentImage;
		context.fillRect(0, 0, 200, 200)
	}

	public setCurrentRecording(recording: Recording)
	{
		if (!recording) console.log("bad recording");
		console.log("setting recording");
		this.model.setCurrentRecording(recording);
	}

	public getCurrentFrameData	()				: string				{ return					this.model.getCurrentFrameData();		}
	public getTimeStamp			()				: Date					{ return this.convertDate(	this.model.getCurrentFrameTimeStamp());	}
    public sourceActive         ()				: boolean				{ return                    this.model.sourceActive();              }
	public getBoxes				()				: Array<BoundingBox>	{ return					this.model.getBoxes();					}
	public showFace				()				: boolean				{ return					this.model.showFace();					}
	public isLive				()				: boolean				{ return					this.live;								}

	private convertDate(date): Date
	{
		var dateOut = new Date(date);
		return dateOut;
	}
}
