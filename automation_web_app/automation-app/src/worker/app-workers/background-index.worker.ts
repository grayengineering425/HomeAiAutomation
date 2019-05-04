import { WorkerMessage } from './shared/worker-message.model';

export class BackgroundIndex
{
  public static doWork(value: WorkerMessage): WorkerMessage
  {
    let count = value.data.start + 1;

    console.log('from worker: ' + count);

    return new WorkerMessage(value.topic, { iterations: count });
  }
}
