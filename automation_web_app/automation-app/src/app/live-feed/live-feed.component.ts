import { Component, ViewChild, Input, AfterViewInit, ElementRef	} from '@angular/core';
import { ModelLive										} from '../model/ModelLive'
import { WebsocketService								} from '../sources/websocket.service'
import { BoundingBox									} from '../data/BoundingBox';
import { Recording										} from '../data/Recording'

@Component({
  selector:     'app-live-feed',
  templateUrl:  './live-feed.component.html',
  styleUrls:    ['./live-feed.component.css'],
  providers:	[WebsocketService, ModelLive]
})

export class LiveFeedComponent implements AfterViewInit
{
	@ViewChild('viewPort') viewPort: ElementRef;
	@Input() live: boolean;

	private viewPortWidth  : number;
	private viewPortHeight: number;

	constructor(private model: ModelLive, private elRef: ElementRef)
    {
        console.log('Constructing LiveFeedComponent');

		this.model.setLive(this.live);
	}

	ngAfterViewInit()
	{
		//var viewPort = this.elRef.nativeElement.querySelector('mainArea');
		//console.log(this.viewPort.nativeElement.offsetWidth);
		this.viewPortWidth  = this.viewPort.nativeElement.offsetWidth;
		this.viewPortHeight = this.viewPort.nativeElement.offsetHeight;
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
		this.model.requestToggleBoxes();
	}

	public getBoxWidth(index: number): string
	{
		var nativeWidth = this.model.getBoxByIndex(index).width;
		var viewPortRatio = this.viewPortWidth / 448.0;

		return (nativeWidth * viewPortRatio).toString() + "px";
	}

	public getBoxHeight(index: number): string
	{
		var nativeHeight  = this.model.getBoxByIndex(index).height * 2;
		var viewPortRatio = this.viewPortHeight / 448.0;

		return (nativeHeight * viewPortRatio).toString() + "px";
	}

	public getBoxX(index: number): string
	{
		var nativeX		  = this.model.getBoxByIndex(index).x - this.model.getBoxByIndex(index).width / 2.0;
		var viewPortRatio = this.viewPortWidth / 448.0;

		return (nativeX * viewPortRatio).toString() + "px";
	}
	public getBoxY(index: number): string
	{
		var nativeY       = this.model.getBoxByIndex(index).y - this.model.getBoxByIndex(index).height / 2.0;
		var viewPortRatio = this.viewPortHeight / 448.0;

		return (nativeY * viewPortRatio).toString() + "px";
	}

	public setCurrentRecording(recording: Recording)
	{
		if (!recording) console.log("bad recording");
		console.log("setting recording");
		this.model.setCurrentRecording(recording);
	}

	public getCurrentFrameData	(): string				{ return this.model.getCurrentFrameData();							}
	public getTimeStamp			(): Date				{ return this.convertDate(this.model.getCurrentFrameTimeStamp());	}
	public sourceActive			(): boolean				{ return this.model.sourceActive();									}
	public getBoundingBoxes		(): Array<BoundingBox>	{ return this.model.getBoxes();										}
	public isLive				(): boolean				{ return this.live;													}
	public showBoxes			(): boolean				{ return this.model.getShowBoxes();									}

	private convertDate(date): Date
	{
		var dateOut = new Date(date);
		return dateOut;
	}
}
