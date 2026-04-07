import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { ChartService } from 'src/app/core/services/chart.service';

@Component({
    selector: 'app-expandable-filters',
    templateUrl: './expandable-filters.component.html',
    styleUrls: ['./expandable-filters.component.scss']
})
export class ExpandableFiltersComponent implements OnInit, OnChanges {




  private readonly fb = inject(FormBuilder);
  private readonly chartService = inject(ChartService);

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  
  }


}
