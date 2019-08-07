import { FrameDataService		} from '../frame-data.service'
import { Frame					} from '../data/Frame';
import { BoundingBox			} from '../data/BoundingBox';
import { Recording				} from '../data/Recording';

import { formatDate				} from '@angular/common';
import { Injectable				} from '@angular/core';

@Injectable()
export class ModelPictorialIndex {
	private recordings			 : Array<Array<Recording>>;
	private activeRecording		 : Recording;

	constructor(private frameDataService: FrameDataService)
    {
        console.log("Constructing ModelPictorialIndex");

		this.recordings			= new Array();
		this.activeRecording	= null;

		this.frameDataService.getRecordingPreviews().subscribe((data: any) => this.onRecordingPreviews(data));
    }

	private onRecordingPreviews(data: any): void
	{
		this.recordings = new Array();
		var currentRowIndex = -1;
		for (var i=0; i<data.recordings.length; ++i)
		{
			if (i % 3 == 0) 
			{
				this.recordings.push(new Array<Recording>());
				currentRowIndex++;
			}

			var recording		= new Recording();
			recording.id		= data.recordings[i].id;
			recording.name		= data.recordings[i].name;
			recording.runLength = data.recordings[i].runLength;

			if (data.recordings[i].frames.length == 0) continue;

			var frame = this.parseFrame(data.recordings[i].frames[0]);
			recording.frames.push(frame);

			this.recordings[currentRowIndex].push(recording);
		}
	}

	private parseFrame(jsonFrame: any): Frame
	{
		var frame = new Frame();

		frame.data		= "data:image/png;base64," + jsonFrame.data;
		frame.id		= jsonFrame.id;
		frame.timeStamp = jsonFrame.timeStamp;

		for (var i=0; i<jsonFrame.boundingBoxes.length; ++i)
		{
			var currentBox = jsonFrame.boundingBoxes[i];

			var box = new BoundingBox();
			box.x		= currentBox.x;
			box.y		= currentBox.y;
			box.width	= currentBox.width;
			box.height	= currentBox.height;

			frame.boundingBoxes.push(box);
		}

		return frame;
	}

	public getRunLength(row: number, column: number): number
	{
		if (row > this.recordings.length || column > this.recordings[row].length) return 0;

		return this.recordings[row][column].runLength;
	}

	public getRunName(row: number, column: number): string
	{
		if (row > this.recordings.length || column > this.recordings[row].length) return "";

		return this.recordings[row][column].name;
	}
	
	public getFirstFrameData(row: number, column: number): string
	{
		if (row > this.recordings.length || column > this.recordings[row].length) return "";

		return this.recordings[row][column].frames[0].data;
	}
	
	public loadRecording(row: number, column: number, liveFeedChild: any): void
	{
		if (row > this.recordings.length || column > this.recordings[row].length) return;

		var id = this.recordings[row][column].id;

		this.frameDataService.getRecording(id).subscribe((data: any) => { this.onFullRecording(data); liveFeedChild.setCurrentRecording(this.activeRecording); });
	}

	private onFullRecording(data): void
	{
		var recording		= new Recording();
		var jsonRecording	= data.recording;

		for (var i=0; i<jsonRecording.frames.length; ++i)
		{
			var frame = this.parseFrame(jsonRecording.frames[i]);
			recording.frames.push(frame);
		}

		this.activeRecording = recording;

		console.log(this.activeRecording)
	}

	public exitActiveRecording(): void
	{
		this.activeRecording = null;
	}

	public isActiveRecording	(): boolean					{ return this.activeRecording ? true : false;	}
	public getRecordingPreviews	(): Array<Array<Recording>>	{ return this.recordings;						}
	public getCurrentRecording	(): Recording				{ return this.activeRecording;					}
}
