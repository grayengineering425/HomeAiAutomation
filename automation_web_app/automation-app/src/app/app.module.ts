import { BrowserModule        } from '@angular/platform-browser';
import { NgModule             } from '@angular/core';
import { NgStyle, DatePipe    } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule     } from '@angular/common/http';

import { AppComponent         } from './app.component';
import { LiveFeedComponent    } from './live-feed/live-feed.component';
import { FrameDataService     } from './frame-data.service';

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
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
