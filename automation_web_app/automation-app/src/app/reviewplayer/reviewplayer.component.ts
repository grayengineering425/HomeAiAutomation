import { BoundingBox										} from '../data/BoundingBox';
import { Recording											} from '../data/Recording'
import { ModelReview										} from '../model/ModelReview';

import { Component, ViewChild, AfterViewInit, ElementRef	} from '@angular/core';

@Component({
  selector:     'app-reviewplayer',
  templateUrl:  './reviewplayer.component.html',
  styleUrls:    ['../live-feed/live-feed.component.css', './reviewplayer.component.css'],
  providers:	[ModelReview]
})

export class ReviewPlayerComponent implements AfterViewInit
{
	@ViewChild('viewPort'	 ) viewPort	  : ElementRef;
	@ViewChild('slider'		 ) slider	  : ElementRef;
	@ViewChild('sliderRange' ) sliderRange: ElementRef;

	private viewPortWidth	: number;
	private viewPortHeight	: number;

	constructor(private model: ModelReview)
	{
		console.log('Constructing ReviewPlayerComponent');

		this.model.register(this);
	}

	ngAfterViewInit()
	{
		this.viewPortWidth  = this.viewPort.nativeElement.offsetWidth;
		this.viewPortHeight = this.viewPort.nativeElement.offsetHeight;
	}

    public setPlaying(): void
	{
        this.model.setPlaying();
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

		this.sliderRange.nativeElement.max = this.model.getRunLength() - 1;
	}

	public onSliderChange(): void
	{
		var frameNumber = this.slider.nativeElement.value;

		this.model.setCurrentFrame(frameNumber);
	}

	public updateIndex(index: number): void
	{
		this.sliderRange.nativeElement.value = index;
	}

	public toggleBoundingBoxes(): void
	{
		this.model.requestToggleBoxes();
	}

	public getCurrentFrameData	(): string				{ return this.model.getCurrentFrameData();									}
	public getTimeStamp			(): Date				{ return this.convertDate(this.model.getCurrentFrameTimeStamp());			}
	public getBoundingBoxes		(): Array<BoundingBox>	{ return this.showBoxes() ? this.model.getBoxes() : null;					}
	public showBoxes			(): boolean				{ return this.model.getShowBoxes();											}
	public getStateText			(): string				{ return "Review";															}
	public getBoxToggleText		(): string				{ return this.showBoxes() ? "Hide Bounding Boxes" : "Show Bounding Boxes";	}

	private convertDate(date): Date
	{
		var dateOut = new Date(date);
		return dateOut;
	}
}
