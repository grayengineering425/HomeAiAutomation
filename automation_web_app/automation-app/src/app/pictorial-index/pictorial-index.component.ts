import { Component, AfterViewChecked, ViewChild, ElementRef	} from '@angular/core';
import { ModelPictorialIndex								} from '../model/ModelPictorialIndex'
import { Recording											} from '../data/Recording'
import { ReviewPlayerComponent								} from '../reviewplayer/reviewplayer.component';

@Component({
  selector:		'app-pictorial-index',
  templateUrl:  './pictorial-index.component.html',
  styleUrls:	['./pictorial-index.component.css'],
  providers:	[ModelPictorialIndex]
})
export class PictorialIndexComponent implements AfterViewChecked
{
	@ViewChild(ReviewPlayerComponent)	videoPlayer: ReviewPlayerComponent;
	@ViewChild('nameInput')				nameInput	: ElementRef;

	private maskShowing		: boolean;
	private currentRow		: number;
	private currentColumn	: number;
	private dialogShowing	: boolean;

	constructor(private model: ModelPictorialIndex)
	{
		this.maskShowing	= false;
		this.dialogShowing	= false;
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

	public deleteRecording(row: number, column: number): void
	{
		this.model.deleteRecording(row, column);
	}

	public startEditRecording(row: number, column: number): void
	{
		this.dialogShowing	= true;
		this.currentRow		= row;
		this.currentColumn	= column;
	}

	public stopEditRecording(): void
	{
		this.dialogShowing	= false;
		this.currentRow		= -1;
		this.currentColumn	= -1;
	}

	public updateRecordingName(): void
	{
		this.model.updateRecordingName(this.currentRow, this.currentColumn, this.nameInput.nativeElement.value);
	}

	public getRunLength			(row: number, column: number)	: number					{ return this.model.getRunLength(row, column);		}
	public getRunName			(row: number, column: number)	: string					{ return this.model.getRunName(row, column);		}
	public getRecordingPreviews	()								: Array<Array<Recording>>	{ return this.model.getRecordingPreviews();			}
	public getFirstFrameData	(row: number, column: number)	: string					{ return this.model.getFirstFrameData(row, column);	}
	public isMaskShowing		()								: boolean					{ return this.maskShowing;							}
	public isDialogShowing		()								: boolean					{ return this.dialogShowing;						}
}
