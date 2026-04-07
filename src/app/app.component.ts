import { Component, HostListener, OnInit, ViewChild, inject} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { LogaccessService } from './core/AuthServices/logaccess.service';
import { TextWrapSettingsModel, GridComponent } from '@syncfusion/ej2-angular-grids';
import { DisplayOption, IDataOptions, IDataSet, PivotView, PivotViewComponent } from '@syncfusion/ej2-angular-pivotview';
import { IAxisLabelRenderEventArgs } from '@syncfusion/ej2-angular-charts';
import { ILoadedEventArgs, ITooltipRenderEventArgs } from '@syncfusion/ej2-angular-progressbar';
import { Browser } from '@syncfusion/ej2/base';
import { GridSettings } from '@syncfusion/ej2-pivotview/src/pivotview/model/gridsettings';
import { DataSourceSettingsModel } from '@syncfusion/ej2-pivotview/src/model/datasourcesettings-model';
import { Pivot_Data, roomDataSource } from './dashboardpanelModule/panelComponents/dashbord-page-vieww/data';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [RouterOutlet]
})
export class AppComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly logaccessService = inject(LogaccessService);

    public dataSourceSettings?: DataSourceSettingsModel;
    public actualdataSourceSettings?: DataSourceSettingsModel;
    public gridSettings?: GridSettings;
    public width?: string;

    ngOnInit(): void {
        this.width = '100%';

        this.gridSettings = {
            columnWidth:  120,
            layout: 'Tabular'
        } as GridSettings;

        this.dataSourceSettings = {
            dataSource: Pivot_Data as IDataSet[],
            enableSorting: true,
            columns: [{ name: 'Year' }, { name: 'Quarter' }],
            rows: [
                { name: 'Product_Categories', caption: 'Product Categories' },
                { name: 'Products' },
                { name: 'Order_Source', caption: 'Order Source' },
            ],
            formatSettings: [{ name: 'Amount', format: 'C0' }],
            drilledMembers: [
                { name: 'Product_Categories', items: ['Accessories', 'Bikes'] },
                { name: 'Products', delimiter: '##', items: ['Accessories##Helmets'] },
            ],
            filterSettings: [
                {
                    name: 'Products',
                    type: 'Exclude',
                    items: ['Cleaners', 'Fenders'],
                },
            ],
            expandAll: false,
            values: [
                { name: 'Sold', caption: 'Units Sold' },
                { name: 'Amount', caption: 'Sold Amount' },
            ],
            filters: [],
        };

        this.actualdataSourceSettings = {
            dataSource: roomDataSource,
            enableSorting: true,
            columns: [  { name: 'Partner_Name', caption: 'Partner_Name' }],
            rows: [
                { name: 'Partner_Name', caption: 'Partner_Name' },
                { name: 'Location' },
                { name: 'created_by', caption: 'Evaluator' },
            ],
            // formatSettings: [{ name: 'Amount', format: 'C0' }],
            // drilledMembers: [
            //     { name: 'Product_Categories', items: ['Accessories', 'Bikes'] },
            //     { name: 'Products', delimiter: '##', items: ['Accessories##Helmets'] },
            // ],
            
            expandAll: false,
            values: [
                { name: 'form_id_Partner', caption: 'form_id_Partner' },
                { name: 'fatal_status', caption: 'fatal_status' },
                { name: 'form_id', caption: 'form_id' },
                { name: 'fatal_status_Partner', caption: 'fatal_status_Partner' },
            ],
            filters: [],
        };
    }
}
