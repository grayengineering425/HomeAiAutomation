export class Face
{
	public data:		string;
	public encoding:	Array<number>;

	constructor(data: string, encoding: Array<number>)
	{
		this.data		= data;
		this.encoding	= encoding;
	}
}