import { Injectable, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  DataStateChangeEventArgs,
  Sorts,
  DataResult,
} from '@syncfusion/ej2-angular-grids';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { map } from 'rxjs';

@Injectable()
export class OrdersService extends Subject<DataStateChangeEventArgs> {
//   private BASE_URL =
//     'https://services.odata.org/V4/Northwind/Northwind.svc/Orders';
    private BASE_URL =
    '';
  private readonly http = inject(HttpClient);
  constructor() {
    super();
  }

  public execute(state: any): void {
    this.getData(state).subscribe((x) => super.next(x));
  }

  public getData(
    state: DataStateChangeEventArgs
  ): Observable<DataStateChangeEventArgs> {
    const pageQuery = `$skip=${state.skip}&$top=${state.take}`;
    let sortQuery: string = '';
    let filterQuery = '';

    if ((state.sorted || []).length) {
      sortQuery =
        `&$orderby=` +
        state.sorted
          ?.map((obj: Sorts) => {
            return obj.direction === 'descending'
              ? `${obj.name} desc`
              : obj.name;
          })
          .reverse()
          .join(',');
    }

    return this.http
      .get(
        `${this.BASE_URL}?${pageQuery}${sortQuery}${filterQuery}&$count=true`
      )
      .pipe(map((response: any) => response))
      .pipe(
        map(
          (response: any) =>
            <DataResult>{
              result: response['value'],
              count: parseInt(response['@odata.count'], 10),
            }
        )
      )
      .pipe((data: any) => data);
  }
}
