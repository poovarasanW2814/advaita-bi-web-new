import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { ChartService } from 'src/app/core/services/chart.service';

@Component({
  selector: 'app-expandable-filters',
  templateUrl: './expandable-filters.component.html',
  styleUrls: ['./expandable-filters.component.scss'],
  standalone: false
})
export class ExpandableFiltersComponent implements OnInit, OnChanges {




  constructor(private fb: FormBuilder, private chartService: ChartService) {

  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  
  }


}
