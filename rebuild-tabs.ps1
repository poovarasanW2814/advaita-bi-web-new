$f = "d:\syntheta-bi\advaita-bi-web\src\app\dashboardpanelModule\panel-properties\property-table\property-table.component.html"
$lines = [System.IO.File]::ReadAllLines($f)

# Keep lines 1-302 (0-indexed 0-301) = nav + panes 0, 1, 2
$part1 = $lines[0..301]

# Dialog part: lines 1318-1473 (0-indexed 1317-1472) + line 1475 (0-indexed 1474)
# Skip line 1474 (0-indexed 1473) = orphan '</div>' from old e-sample-resize-container
$part3 = $lines[1317..1472] + $lines[1474]

# New panes 3-6 + close pt-tab-content
$part2 = @'

    <!-- 3 · Condition -->
    <div class="pt-tab-pane" [class.pt-tab-active]="activeTab === 3">
        <div id="ChartCondition" class="tab-pane active">
            <div class="col-md-12" id="modalBody" style="margin-right:1px;margin-top: 5px;">
                <form action="" [formGroup]="generalForm">

                    <div class="row">
                        <div class="col-md-4 form-group border">
                            <label for="orderBy" class="labelFeild">Order By</label>
                            <ejs-multiselect formControlName="orderBy"
                                [dataSource]="selectedTableFieldName" class="multiSelectField"
                                mode="CheckBox"></ejs-multiselect>
                        </div>
                        <div class="col-md-4 form-group border">
                            <label for="orderByType" class="labelFeild">OrderBy Type</label>
                            <select name="" formControlName="orderByType" id="" class="form-control selectInputFeild">
                                <option value="">--Select--</option>
                                <option value="ASC">ASC</option>
                                <option value="DESC">DESC</option>
                            </select>
                        </div>
                        <div class="col-md-4 form-group border">
                            <label for="groupBy" class="labelFeild">Group By</label>
                            <ejs-multiselect class="multiSelectField" formControlName="groupBy"
                                [dataSource]="selectedTableFieldName" mode="CheckBox"></ejs-multiselect>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-9 border">
                            <fieldset>
                                <legend>Conditions:</legend>
                                <div class="row">
                                    <div class="cleardiv pull-right">
                                        <button type="button" (click)="onClearConditions()"
                                            class="e-btn e-btn-purple" id="chartbtnCleardimCondition">Clear</button>
                                    </div>
                                </div>
                                <div class="">
                                    <textarea name="conditions" cols="40" rows="6" class="form-control"
                                        id="pop_chart_condition" formControlName="conditions"
                                        [(ngModel)]="conditionValue"
                                        (click)="updateCursorPositionCondition($event)"
                                        (input)="updateCursorPositionCondition($event)"></textarea>
                                </div>
                                <div class="actionbuttons">
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addText($event)" value="+">+</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addText($event)" value="-">-</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addText($event)" value="*">*</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addText($event)" value="/">/</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addText($event)" value="==">==</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addText($event)" value="<">&lt;</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addText($event)" value="<=">&lt;=</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addText($event)" value="!=">!=</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addText($event)" value=">=">&gt;=</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addText($event)" value=">">&gt;</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addText($event)" value="and">and</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addText($event)" value="or">or</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addText($event)" value="not">not</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addText($event)" value="(">(</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addText($event)" value=")">)</button>
                                </div>
                            </fieldset>
                        </div>
                        <div class="col-md-3 border">
                            <fieldset>
                                <legend>Select Table:</legend>
                                <input type="text" class="form-control tableInputTitle" formControlName="tableName">
                                <div class="headerstylepopup">
                                    <h6 class="popuph5style" style="margin-bottom:5px">Selected Table Field Names</h6>
                                </div>
                                <div class="tabldiv">
                                    <div class="Tablelist" style="height:108px">
                                        <ul class="list-group">
                                            <li class="list-group-items" (click)="addToConditionTextarea(name)"
                                                style="padding:3px 2px 2px 5px"
                                                *ngFor="let name of selectedTableFieldName">{{name}}</li>
                                        </ul>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    </div>

    <!-- 4 · Raw Query -->
    <div class="pt-tab-pane" [class.pt-tab-active]="activeTab === 4">
        <div id="ChartExpression" class="tab-pane active">
            <div class="border" id="modalBody" style="margin-right:1px;margin-top:5px;">
                <form action="" [formGroup]="generalForm">
                    <input type="hidden" name="" value="">
                    <div class="border row">
                        <div class="col-md-9 border">
                            <fieldset>
                                <legend>Raw Query:</legend>
                                <div class="cleardiv pull-right">
                                    <button type="button" (click)="onCopyRawQuery()"
                                        class="e-btn e-btn-purple" id="chartbtnCopyRawQuery">Copy</button>
                                    &nbsp;
                                    <span *ngIf="copyMessage" style="position:absolute;top:10px;left:50%;transform:translateX(-50%);background:#323232;color:#fff;padding:6px 12px;border-radius:6px;font-size:13px;">{{ copyMessage }}</span>
                                    <button type="button" (click)="onClearRawQuery()"
                                        class="e-btn e-btn-purple" id="chartbtnCleardimCondition">Clear</button>
                                </div>
                                <div class="">
                                    <textarea name="conditions" cols="40" rows="8" class="form-control"
                                        id="pop_chart_expression" formControlName="rawQuery"
                                        [(ngModel)]="rawQueryValue"
                                        (click)="updateCursorPosition($event)"
                                        (input)="updateCursorPosition($event)"></textarea>
                                </div>
                                <div class="actionbuttons">
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addRawQueryText($event)" value="+">+</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addRawQueryText($event)" value="-">-</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addRawQueryText($event)" value="*">*</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addRawQueryText($event)" value="/">/</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addRawQueryText($event)" value="==">==</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addRawQueryText($event)" value="<">&lt;</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addRawQueryText($event)" value="<=">&lt;=</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addRawQueryText($event)" value="!=">!=</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addRawQueryText($event)" value=">=">&gt;=</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addRawQueryText($event)" value=">">&gt;</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addRawQueryText($event)" value="and">and</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addRawQueryText($event)" value="or">or</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addRawQueryText($event)" value="not">not</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addRawQueryText($event)" value="(">(</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addRawQueryText($event)" value=")">)</button>
                                    <button type="button" class="e-btn e-btn-purple oper" (click)="addRawQueryText($event)" value="{apply_filters}">Apply_Filters</button>
                                </div>
                            </fieldset>
                        </div>
                        <div class="col-md-3 border">
                            <fieldset>
                                <legend>Select Table:</legend>
                                <input type="text" class="form-control tableInputTitle" formControlName="tableName">
                                <div class="headerstylepopup">
                                    <h6 class="popuph5style">Selected Table Field Names</h6>
                                </div>
                                <div class="tabldiv">
                                    <div class="Tablelist" style="height:145px">
                                        <ul class="list-group">
                                            <li class="list-group-items" (click)="addToTextarea(name)"
                                                style="padding:3px 2px 2px 6px"
                                                *ngFor="let name of selectedTableFieldName">{{name}}</li>
                                        </ul>
                                    </div>
                                </div>
                            </fieldset>
                            <div style="text-align:right;margin-top:10px">
                                <button class="e-btn e-btn-purple" (click)="addToTextarea('ADD')" type="button">ADD</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- 5 · Conditional Formatting -->
    <div class="pt-tab-pane" [class.pt-tab-active]="activeTab === 5">
        <form action="" [formGroup]="generalForm">
            <div formGroupName="formattingCondition">
                <div class="row">
                    <div class="col-md-3 form-group">
                        <label for="fieldName" class="labelFeild">Value FieldName</label>
                        <ejs-dropdownlist [dataSource]='selectedTableFieldName' [allowFiltering]="true"
                            formControlName="measureField" class="tableNameDropdown"></ejs-dropdownlist>
                    </div>
                    <div class="col-md-3 form-group">
                        <label for="fieldName" class="labelFeild">Condition</label>
                        <select name="" id="" class="form-control selectInputFeild"
                            formControlName="conditionFormat"
                            (change)="onSelectCondtionFormatValue($event)">
                            <option value="">Select</option>
                            <option value="<">LessThan</option>
                            <option value="Between">Between</option>
                            <option value="<=">LessThanOrEqualTo</option>
                            <option value=">">GreaterThan</option>
                            <option value=">=">GreaterThanOrEqualTo</option>
                            <option value="=">Equals</option>
                            <option value="!=">NotEquals</option>
                            <option value="contains">Contains</option>
                            <option value="notContains">Not Contains</option>
                            <option value="None">None</option>
                        </select>
                    </div>
                    <div class="col-md-3 form-group">
                        <label for="fieldName" class="labelFeild">Enter Value</label>
                        <input type="text" formControlName="value1" class="form-control inputFeild">
                    </div>
                    <div class="col-md-3 form-group" *ngIf="selectedConditionType === 'Between'">
                        <label for="fieldName" class="labelFeild">Enter Max Value</label>
                        <input type="text" formControlName="value2" class="form-control inputFeild">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3 form-group">
                        <label for="fieldName" class="labelFeild">Reference FieldName</label>
                        <ejs-dropdownlist [dataSource]='selectedTableFieldName' [allowFiltering]="true"
                            formControlName="referenceField"
                            (change)="onSecondDropdownChange(fieldNameDropdown.value)"
                            #fieldNameDropdown class="tableNameDropdown"></ejs-dropdownlist>
                    </div>
                    <div class="col-md-3 form-group">
                        <label for="fontSize" class="labelFeild">Font Size</label>
                        <input type="number" formControlName="fontSize" class="form-control inputFeild">
                    </div>
                    <div class="col-md-3 form-group">
                        <div class="row">
                            <div class="col-md-6">
                                <label for="fontColor" class="labelFeild" style="display:block">Font Color</label>
                                <input ejs-colorpicker id='color-picker' #colorpicker formControlName="Fontcolor" type="color">
                            </div>
                            <div class="col-md-6">
                                <label for="backgroundColor" class="labelFeild" style="display:block">Background Color</label>
                                <input ejs-colorpicker id='color-picker2' #colorpicker1 formControlName="BackgroundColor" type="color">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 form-group">
                        <label for="backgroundColor" class="labelFeild" style="display:block">Calculated Value</label>
                        <select formControlName="calculatedValue" class="form-control selectInputFeild">
                            <option value="">Select</option>
                            <option value="Sum">Grand Total</option>
                            <option value="Average">Average Count</option>
                        </select>
                    </div>
                </div>
                <div style="text-align:right;margin-bottom:10px">
                    <button ejs-button type="button" *ngIf="showConditionAddBtn"
                        (click)="onAddConditionFormat()" class="e-btn e-btn-purple">Add</button>
                    <button ejs-button type="button" *ngIf="updateConditonBtn"
                        (click)="onUpdateConditonObj()" class="e-btn e-btn-purple">Update</button>
                </div>
            </div>
        </form>
        <div>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Sr No</th>
                        <th>Field Name</th>
                        <th>Reference FieldName</th>
                        <th>Calculated Value</th>
                        <th>Condition</th>
                        <th>Start Value</th>
                        <th>End Value</th>
                        <th>Background Color</th>
                        <th>Font Color</th>
                        <th>Font Size</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let item of conditionalFormatSettingsArray; let i=index">
                        <td>{{ i + 1}}</td>
                        <td>{{item.measure}}</td>
                        <td>{{item.referenceField}}</td>
                        <td>{{item.calculatedValue}}</td>
                        <td>{{item.conditions}}</td>
                        <td>{{item.value1}}</td>
                        <td>{{item.value2}}</td>
                        <td>{{item.style.backgroundColor}}</td>
                        <td>{{item.style.color}}</td>
                        <td>{{item.style.fontSize}}</td>
                        <td style="cursor:pointer">
                            <i class="bi bi-trash" (click)="onDeleteConditionObj(i)"></i>
                            <i class="bi bi-pencil-square" style="margin-left:5px"
                                (click)="onEditConditionObj(item, i)"></i>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- 6 · Header Formatting -->
    <div class="pt-tab-pane" [class.pt-tab-active]="activeTab === 6">
        <div class="gridForm">
            <form action="" [formGroup]="generalForm">
                <div formGroupName="headerConditonalFormatting">
                    <div class="row">
                        <div class="form-group col-md-4">
                            <label class="labelFeild">Field Name</label>
                            <ng-container *ngIf="showAddHeaderConditionBtn">
                                <ejs-multiselect [dataSource]='selectedTableFieldName' showSelectAll='true'
                                    #fieldNameDropdown mode="CheckBox" [popupHeight]='"250px"'
                                    formControlName="fieldName" [popupWidth]="'280px'"
                                    popupHeight='200px'></ejs-multiselect>
                            </ng-container>
                            <ng-container *ngIf="showUpdateHeaderConditionBtn">
                                <input type="text" formControlName="fieldName" class="form-control inputFeild">
                            </ng-container>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="labelFeild" style="display:block">Background Color</label>
                            <input type="color" formControlName="backgroundColor" ejs-colorpicker id='color-picker3' #colorpicker3>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="labelFeild" style="display:block">Text Color</label>
                            <input type="color" formControlName="color" ejs-colorpicker id='color-picker4' #colorpicker4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-md-4">
                            <label class="labelFeild">Font Size</label>
                            <input type="number" formControlName="fontSize" class="form-control inputFeild">
                        </div>
                        <div class="form-group col-md-4">
                            <label class="labelFeild">Font Style</label>
                            <select formControlName="fontStyle" class="form-control selectInputFeild">
                                <option value="">Select</option>
                                <option value="normal">Normal</option>
                                <option value="italic">Italic</option>
                                <option value="bold">Bold</option>
                            </select>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="labelFeild">Font Weight</label>
                            <select formControlName="fontWeight" class="form-control selectInputFeild">
                                <option value="">Select</option>
                                <option value="100">100</option>
                                <option value="200">200</option>
                                <option value="300">300</option>
                                <option value="400">400 (Normal)</option>
                                <option value="500">500</option>
                                <option value="600">600</option>
                                <option value="700">700 (Bold)</option>
                                <option value="800">800</option>
                                <option value="900">900</option>
                            </select>
                        </div>
                    </div>
                    <div style="text-align:right;margin-bottom:10px">
                        <button ejs-button type="button" *ngIf="showAddHeaderConditionBtn"
                            (click)="addHeaderConditionFormatting()" class="e-btn e-btn-purple">Add</button>
                        <button ejs-button type="button" *ngIf="showUpdateHeaderConditionBtn"
                            (click)="onUpdateHeaderConditonalFormatting()" class="e-btn e-btn-purple">Update</button>
                    </div>
                </div>
            </form>
            <div style="margin:20px 0 5px">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Field Name</th>
                            <th>Background</th>
                            <th>Text Color</th>
                            <th>Font Size</th>
                            <th>Font Style</th>
                            <th>Font Weight</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let field of headerFeildDetailsArray; let i = index">
                            <td>{{ field.fieldName }}</td>
                            <td>{{ field.backgroundColor }}</td>
                            <td>{{ field.color }}</td>
                            <td>{{ field.fontSize }}</td>
                            <td>{{ field.fontStyle }}</td>
                            <td>{{ field.fontWeight }}</td>
                            <td style="cursor:pointer">
                                <i class="bi bi-trash" (click)="onDelete(i)"></i>
                                <i class="bi bi-pencil-square" style="margin-left:5px"
                                    (click)="onEdit(i, field)"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

  </div><!-- end .pt-tab-content -->
'@

# Split the new panes string into individual lines
$part2 = $part2 -split "`r?`n"

# Combine all parts
$final = $part1 + $part2 + $part3

# Write back
[System.IO.File]::WriteAllLines($f, $final, [System.Text.Encoding]::UTF8)
Write-Host "Done. Total lines: $($final.Count)"
