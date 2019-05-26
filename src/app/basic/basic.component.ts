import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.sass']
})
export class BasicComponent implements OnInit {
	displayedColumns: string[] = ["id", "name"];

	data: any[] = [
		{id: 1, name: "John Doe"},
		{id: 2, name: "James Clark"},
		{id: 3, name: "Frank Herbert"}
	];

	constructor() {}

	ngOnInit() {
	}
}
