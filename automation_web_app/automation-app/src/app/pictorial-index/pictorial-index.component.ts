import { Component, AfterViewChecked, ViewChild		} from '@angular/core';
import { ModelPictorialIndex						} from '../model/ModelPictorialIndex'
import { Recording									} from '../data/Recording'
import { LiveFeedComponent							} from '../live-feed/live-feed.component'

@Component({
  selector:		'app-pictorial-index',
  templateUrl:  './pictorial-index.component.html',
  styleUrls:	['./pictorial-index.component.css'],
  providers:	[ModelPictorialIndex]
})
export class PictorialIndexComponent implements AfterViewChecked
{
	@ViewChild(LiveFeedComponent) videoPlayer: LiveFeedComponent;

	private maskShowing		: boolean;
	private currentRow		: number;
	private currentColumn	: number;

	constructor(private model: ModelPictorialIndex)
	{
		this.maskShowing	= false;
		this.currentRow		= -1;
		this.currentColumn	= -1;
	}

	ngAfterViewChecked()
	{
		if (this.maskShowing && !this.model.isActiveRecording() && this.videoPlayer)
		{
			this.model.loadRecording(this.currentRow, this.currentColumn, this.videoPlayer);
		}
		else
		{
			//TODO: need to update the logic for starting and stopping the video of the player...
			//this.videoPlayer.setPlaying(false);
		}
	}

	public exitActiveRecording(): void
	{
		this.currentRow		= -1;
		this.currentColumn	= -1;
		this.maskShowing	= false;

		this.model.exitActiveRecording();
	}

	public loadRecording(row: number, column: number): void	
	{
		this.currentRow		= row;
		this.currentColumn	= column;
		this.maskShowing	= true;
	}

	public getRunLength			(row: number, column: number)	: number					{ return this.model.getRunLength(row, column);		}
	public getRunName			(row: number, column: number)	: string					{ return this.model.getRunName(row, column);		}
	public getRecordingPreviews	()								: Array<Array<Recording>>	{ return this.model.getRecordingPreviews();			}
	public getFirstFrameData	(row: number, column: number)	: string					{ return this.model.getFirstFrameData(row, column);	}
	public isMaskShowing		()								: boolean					{ return this.maskShowing;							}
}
