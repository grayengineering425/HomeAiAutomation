import { BrowserModule          } from '@angular/platform-browser';
import { NgModule               } from '@angular/core';
import { HttpClientModule       } from '@angular/common/http';

import { AppComponent           } from './app.component';
import { LiveFeedComponent      } from './live-feed/live-feed.component';
import { FrameDataService       } from './frame-data.service';
import { WorkerService          } from './worker.service' 
import { ModelMain              } from './model/ModelMain'

@NgModule({
  declarations: [
    AppComponent,
    LiveFeedComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
        FrameDataService
    ,   WorkerService
    ,   ModelMain
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
