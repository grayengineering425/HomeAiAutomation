//import { FrameDataService   } from '../frame-data.service'
//import { WebsocketService	} from '../sources/websocket.service'
//import { Frame              } from '../data/Frame' 
//import { ModelLive			} from './ModelLive'
//import { ModelReview		} from './ModelReview'

//import { Injectable			} from '@angular/core';

//export enum State
//{
//		Live
//	,	Review
//}

//@Injectable()
//export class ModelMain
//{

//	private state			: State;
//	private modelLive		: ModelLive;
//	private modelReview		: ModelReview;

//	constructor(private frameDataService: FrameDataService, wsService: WebsocketService)
//	{
//		this.run			= new Array<Frame>	();
//		this.recordings		= new Array<any>	();
//		this.state			= State.Live;
//		this.modelLive		= new ModelLive(frameDataService, wsService, this)
//		this.modelReview	= new ModelReview(this);

//		this.frameDataService.getRecordings().subscribe((data: any) => this.recordings = data);
//    }

//    public addFrame(frame: Frame): void
//    {
//        if (this.run.length > 100) this.run.shift();
//        this.run.push(frame);

//		this.frameDataService.addFrame(1, frame).subscribe((data: any) => this.handleFrameAddResponse(data));
//	}

//	private handleFrameAddResponse(data: any): void
//	{
//	}

//	public requestRecording(index): void
//	{
//		if (index >= this.recordings.length || index < 0) return;

//		this.modelReview.setCurrentRecording(this.recordings[index]);

//		this.setState(State.Review);
//	}

//	private setState(state: State): void
//	{
//		if (state == State.Live)
//		{
//			this.modelReview.deactivate();
//			this.modelLive	.activate();
//		}
		
//		else if (state == State.Review)
//		{
//			this.modelLive	.deactivate();
//			this.modelReview.activate();
//		}
//	}

//	//GETTERS
//	public getRecordings()				: Array<any>	{ return this.recordings;						}
//	public getFirstFrame(index: number)	: string		{ return this.recordings[index].frames[0].data;	}
//	public getState()					: State			{ return this.state;							}
//	public getModelLive()				: ModelLive		{ return this.modelLive;						}
//	public getModelReview()				: ModelReview	{ return this.modelReview;						}
//}