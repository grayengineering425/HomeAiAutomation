import { Component, OnInit  } from '@angular/core';
import { FrameDataService } from '../frame-data.service';


@Component({
  selector:     'app-live-feed',
  templateUrl:  './live-feed.component.html',
  styleUrls:    ['./live-feed.component.css']
})

export class LiveFeedComponent implements OnInit {
  public frame: any;

  constructor(private frameDataService: FrameDataService)
  {
    console.log('constructing');
    frameDataService.getById(1).subscribe((data: any) => this.frame = data);
  }
    
  ngOnInit() {
  }


}
