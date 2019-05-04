export abstract class iFrameSource
{
	protected active: boolean;

	public abstract getSubscription	(): any;
	public abstract startFrames		(): void;
    public abstract stopFrames      (): void;
    public abstract getCurrentIndex (): number;
    public abstract getFrameCount   (): number;

	public isActive(): boolean
	{
		return this.active;
	}
}