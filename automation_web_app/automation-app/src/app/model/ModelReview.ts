	//private recordingIndex: number;
	//private playing: boolean;
	//private frameIndex: number;
 //   private paused: boolean;

    //setRecordingIndex(index)
    //   {
    //    if (index == this.recordingIndex) return; else
    //        if (index > this.recordings.length) return; else

    //            this.playing = false;
    //    this.frameIndex = 0;
    //    this.recordingIndex = index;
    //}

    //private async startVideo() {
    //this.playing = true;
    //this.frameIndex = 0;

    //while (this.playing) {
    //    if (this.frameIndex >= this.recordings[this.recordingIndex].frames.length - 1) this.frameIndex = 0;
    //    else this.frameIndex = this.frameIndex + 1;

    //    await this.delay(160);
    //}



    //private delay(ms: number)
    //{
    //return new Promise(resolve => setTimeout(resolve, ms));
    //}



    //getCurrentFrameTimeStamp()
    //{
    //    if (!this.recordings) return Date();

    //    return this.recordings[this.recordingIndex].frames[this.frameIndex].timeStamp;
    //}