import { ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatPaginator, MatSort } from '@angular/material';

import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

export abstract class BaseTableComponent<T> implements AfterViewInit {
	displayedColumns: string[] = [];

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	data: T[];

	totalCount = -1;

	entityName: string;

	http: HttpClient;

	constructor(http: HttpClient) {
		this.http = http;
	}

	// Azért kell az AfterView mert akkor már a paginator inicializálva van, előtte  csak undefined!
	ngAfterViewInit() {
		console.log('sort', this.sort);

		// Ha változik a rendezés akkor az első lapora vált
		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

		// A sorrendváltás és a lap váltás eseményekre egybe iratkozik fel
		merge(this.sort.sortChange, this.paginator.page)
		.pipe(
			// Elindítja egy üres eseménnyel, hogy lejöjjön az első lap
			startWith({}),

			// Eldobja az összes előző eseményt és csak ezt dobja tovább!
			switchMap(() => {
				const data = this.getData();

				console.log('switchMap data', data);

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
			data => {
				console.log('data', data);

				this.data = data;
			}
		);
	}

	// Egyszerű adatlekérés, megfigyelhető találati lista megy vissza az összes találat számával
	getData(): Observable<any> {
		const skip = this.paginator.pageIndex * this.paginator.pageSize;
		const take = this.paginator.pageSize;

		const requestUrl =
			`http://localhost:3000/${this.entityName}/findAndCount?` +
			`skip=${skip}&take=${take}&order=${this.sort.active}&orderDir=${this.sort.direction}`;

		console.log(requestUrl);

		return this.http.get(requestUrl);
	}
}
