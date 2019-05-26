import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseTableComponent } from './base';
import { callLifecycleHooksChildrenFirst } from '@angular/core/src/view/provider';

@Component({
  selector: 'app-inherit',
  templateUrl: './inherit.component.html',
  styleUrls: ['./inherit.component.scss']
})
export class InheritComponent extends BaseTableComponent<Actor> {

	constructor(
		http: HttpClient
	) {
		super(http);

		this.displayedColumns = ['id', 'firstName', 'lastName'];
		this.entityName = 'actor';
	}
}

// {"id":11,"firstName":"ZERO","lastName":"CAGE","lastUpdate":"2006-02-15T03:34:33.000Z"}
export interface Actor {
	id: number;
	firstName: string;
	lastName: string;
	lastUpdate: string;
}
