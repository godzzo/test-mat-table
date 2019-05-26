import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatPaginator, MatSort } from '@angular/material';

import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.scss']
})
export class ServerComponent implements AfterViewInit {
	displayedColumns: string[] = ['id', 'firstName', 'lastName'];

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	data: Actor[];

	totalCount = -1;

	// http://localhost:3000/actor/find?skip=10%20&take=50

	constructor(
		private http: HttpClient
	) { }

	// Azért kell az AfterView mert akkor már a paginator inicializálva van, előtte  csak undefined!
	ngAfterViewInit() {
		console.log('sort', this.sort);

		// Ha változik a rendezés akkor az első lapora vált
		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

		// A sorrendváltás és a lap váltás eseményekre egybe iratkozik fel
		merge(this.sort.sortChange, this.paginator.page)
		.pipe(

			startWith({}), // Elindítja egy üres eseménnyel, hogy lejöjjön az első lap

			// Eldobja az összes előző eseményt és csak ezt dobja tovább!
			switchMap(() => {
				const data = this.getData();

				console.log('switchMap', data);

				return data;
			}),
			map(data => { // Az események egyesével jönnek át, itt már a szerverről lekért adat érkezik.
				console.log('map', data);

				// Jön az összes találatnak a száma is amit beállítunk a lapozó részére
				//  vmiért nem kell BehaviorSubject a lapozónak, nem tudom akkor miért és hogyan értesül róla
				this.totalCount = data.count;

				// Visszaadjuk a talált elemeket, vagyis a lapon kapott sorokat
				return data.items;
			}),
			catchError((err) => { // Elkapjuk a hibát, hogy ne okozzon gondot mint nem kezelt aszinkron hiba
				console.log(err);

				// Megfigyelhető üres lista megy vissza.
				return observableOf([]);
		})
		).subscribe( // Beállítjuk a folyam végén az adatot
			data => this.data = data
		);
	}

	// Egyszerű adatlekérés, megfigyelhető találati lista megy vissza az összes találat számával
	getData(): Observable<any> {
		const skip = this.paginator.pageIndex * this.paginator.pageSize;
		const take = this.paginator.pageSize;

		const requestUrl =
			`http://localhost:3000/actor/findAndCount?skip=${skip}&take=${take}`;

		console.log(requestUrl);

		return this.http.get<Actor[]>(requestUrl);
	}
}

// {"id":11,"firstName":"ZERO","lastName":"CAGE","lastUpdate":"2006-02-15T03:34:33.000Z"}
export interface Actor {
	id: number;
	firstName: string;
	lastName: string;
	lastUpdate: string;
}
