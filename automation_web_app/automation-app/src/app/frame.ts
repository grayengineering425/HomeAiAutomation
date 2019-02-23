export class Frame
{
  id:         number;
  date_time:  string;
  frame_data: string;

  constructor(i, d, f)
  {
    this.id          = i;
    this.date_time   = d;
    this.frame_data  = f;
  }
}
