import { iFrameSource	} from './iFrameSource';
import { Subject		} from 'rxjs';

export class FrameSourceSimulator extends iFrameSource
{
	private currentIndex	: number;
	private frames			: Array<string>;
	private frameStream		: Subject<string>;

	constructor() {
		super();

		console.log("Constructing FrameSourceSimulator");

		this.frames			= new Array<string>();
		this.currentIndex	= 0;
		this.active			= false;
		this.frameStream	= new Subject();

		for (var i = 0; i < 10; ++i) this.loadPromise(i);
	}

	public startFrames(): void
	{
		if (this.active == true) return;

		this.active = true;

		this.frameLoop();
	}

	public stopFrames(): void
	{
		this.active = false;
    }

    public getSubscription  (): Subject<string> { return this.frameStream;      }
    public getCurrentIndex  (): number          { return this.currentIndex;     }
    public getFrameCount    (): number          { return this.frames.length;    }

	private async loadPromise(frameNumber: number): Promise<void> {
		var filePath = '../../assets/face' + frameNumber.toString() + '.jpg';
		let blob = await this.loadSingleFrame(filePath);

		var reader = new FileReader();

		reader.onload = e => {
			this.frames.push(reader.result.toString());
		};

		var file = new File([blob], "", { type: 'file/jpg' });

		console.log('frame number: ' + frameNumber.toString() + ", size: " + file.size);
		reader.readAsDataURL(file);
	}

	private loadSingleFrame(filePath: string): Promise<Blob>
	{
		return fetch(filePath).then(function(response){
			return response.blob();
		}).then(function (blob) {
			return blob;
		});
	}

	private async frameLoop()
	{
		while (this.active)
		{
			if (this.currentIndex > this.frames.length - 2)	this.currentIndex = 0;
			else this.currentIndex++;

			await this.delay(160);
			this.frameStream.next(this.frames[this.currentIndex]);
		}
	}

	private delay(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}