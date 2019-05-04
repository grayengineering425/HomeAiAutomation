export class ModelMain
{
    private run: Array<string>;

    constructor()
    {
        this.run = new Array<string>();
    }

    public onNewFrame(frameData: string): void
    {
        if (this.run.length > 100) this.run.shift();
        this.run.push(frameData);
    }
}