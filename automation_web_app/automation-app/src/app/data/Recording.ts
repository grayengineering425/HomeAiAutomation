import { Frame } from './Frame';

export class Recording
{
	public frames	: Array<Frame>
	public id		: number;
	public name		: string;
	public runLength: number;

	constructor()
	{
		this.frames = new Array<Frame>();
	}
}