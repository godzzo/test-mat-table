import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatTableModule, MatSortModule, MatPaginatorModule, MatProgressSpinnerModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BasicComponent } from './basic/basic.component';
import { ServerComponent } from './server/server.component';
import { InheritComponent } from './inherit/inherit.component';
import { TestGitAPIComponent } from './test-gitapi/test-gitapi.component';

@NgModule({
  declarations: [
    AppComponent,
	BasicComponent,
	InheritComponent,
    ServerComponent,
    TestGitAPIComponent
  ],
  imports: [
	BrowserModule,
	BrowserAnimationsModule,
	MatSortModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatTableModule,
	HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
