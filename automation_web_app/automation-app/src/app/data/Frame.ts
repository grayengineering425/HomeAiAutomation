import { BoundingBox } from './BoundingBox';

export class Frame
{
	public boundingBoxes: Array<BoundingBox>
	public data			: string;
	public timeStamp	: string;
	public id			: number;

	constructor()
	{
		this.boundingBoxes = new Array<BoundingBox>();
	}
}