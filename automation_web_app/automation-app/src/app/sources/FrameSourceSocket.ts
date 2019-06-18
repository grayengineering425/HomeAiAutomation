import { iFrameSource		} from './iFrameSource';
import { WebsocketService	} from "./websocket.service";
import { Subject			} from 'rxjs';
import { map				} from 'rxjs/operators';


const URL = "ws://127.0.0.1:9300";

export interface Message {
	message: string;
}

export class FrameSourceSocket extends iFrameSource
{
	private frameStream : Subject<string>;

	constructor(private wsService: WebsocketService) {
		super();

		console.log("Constructing FrameSourceSocket");

		this.frameStream = new Subject();
	}

	public startFrames(): void
	{
		this.frameStream = <Subject<string>>this.wsService.connect(URL).pipe(
			map(
				(response: MessageEvent): string => {
					let data = JSON.parse(response.data);
					return "data:image/jpg;base64," + data.message;
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

    public getSubscription(): Subject<string> { return this.frameStream; }
}