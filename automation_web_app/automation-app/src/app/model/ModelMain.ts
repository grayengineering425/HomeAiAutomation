import { FrameDataService   } from '../frame-data.service'
import { Frame              } from '../data/Frame' 

export class ModelMain
{
    private run				: Array<Frame>;
	private recordings		: Array<any>;

	constructor(private frameDataService: FrameDataService)
	{
		this.run = new Array<Frame>();

        this.frameDataService.get().subscribe((data: any) => this.recordings = data);
    }

    public addFrame(frame: Frame): void
    {
        if (this.run.length > 100) this.run.shift();
        this.run.push(frame);

		this.frameDataService.addFrame(1, frame).subscribe((data: any) => this.handleFrameAddResponse(data));
	}

	private handleFrameAddResponse(data: any): void
	{

	}
}