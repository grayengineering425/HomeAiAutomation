import { BrowserModule				} from '@angular/platform-browser';
import { NgModule					} from '@angular/core';
import { HttpClientModule			} from '@angular/common/http';
import { DragDropModule				} from '@angular/cdk/drag-drop';

import { AppComponent				} from './app.component';
import { LiveFeedComponent			} from './live-feed/live-feed.component';
import { FrameDataService			} from './frame-data.service';
import { WorkerService				} from './worker.service';
import { PictorialIndexComponent	} from './pictorial-index/pictorial-index.component';
import { ReviewPlayerComponent		} from './reviewplayer/reviewplayer.component';
import { FriendsComponent			} from './friends/friends.component' 

@NgModule({
  declarations: [
	AppComponent,
	LiveFeedComponent,
	PictorialIndexComponent,
	ReviewPlayerComponent,
	FriendsComponent
  ],
  imports: [
    BrowserModule,
	HttpClientModule,
	DragDropModule
  ],
  providers: [
        FrameDataService
    ,   WorkerService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
