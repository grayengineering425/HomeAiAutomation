import { BackgroundIndex  } from './background-index.worker';
import { WorkerMessage    } from './shared/worker-message.model';

export class AppWorkers {
  workerCtx : any;
  inLoop    : boolean;

  constructor(workerCtx: any)
  {
    this.workerCtx  = workerCtx;
    this.inLoop     = false;
  }

  workerBroker($event: MessageEvent): void
  {
    const { topic, data } = $event.data as WorkerMessage;
    const workerMessage = new WorkerMessage(topic, data);

    if      (topic == "startIndexLoop") this.returnWorkResults(BackgroundIndex.doWork(workerMessage));
    else if (topic == "endIndexLoop"  ) this.inLoop = false;
  }

  private delay(ms: number)
  {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async returnWorkResults(message: WorkerMessage)
  {
    this.inLoop = true;
    var index = 0;

    while (this.inLoop)
    {
      if (index > 5) index = 0;

      console.log('here');
      const modMessage = new WorkerMessage(message.topic, { start: index });

      this.workerCtx.postMessage(modMessage);
      index = index + 1;

      await this.delay(2000);
    }
  }
}
