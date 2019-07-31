import { iFrameSource		} from './iFrameSource';
import { Frame				} from '../data/Frame'
import { BoundingBox		} from '../data/BoundingBox'
import { WebsocketService	} from "./websocket.service";
import { Subject			} from 'rxjs';
import { map				} from 'rxjs/operators';


const URL = "ws://127.0.0.1:9300";

export interface Message {
    boundingBoxes:	Array<any>;
    data:           string;
    timeStamp:      string;
}

export class FrameSourceSocket extends iFrameSource
{
	private frameStream : Subject<Frame>;

	constructor(private wsService: WebsocketService) {
		super();

		console.log("Constructing FrameSourceSocket");

		this.frameStream = new Subject();
	}

	public startFrames(): void
	{
		this.frameStream = <Subject<Frame>>this.wsService.connect(URL).pipe(
			map(
				(response: MessageEvent): Frame => 
				{
					let data = JSON.parse(response.data);

					var newFrame = new Frame();
					newFrame.data = "data:image/png;base64," + data.data;

					newFrame.timeStamp = data.timeStamp;

					return newFrame;
				}
			)
		);

		this.active = true;
	}

	public stopFrames(): void
	{
		this.frameStream = null;
		this.active = false;
    }

    public getSubscription(): Subject<Frame> { return this.frameStream; }
}