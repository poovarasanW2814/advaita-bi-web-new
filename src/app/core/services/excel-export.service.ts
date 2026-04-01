import { Injectable } from '@angular/core';
// import * as saveAs from 'file-saver';
import * as XLSX from 'xlsx';


@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor() { }


   exportAsExcelFile(jsonData: any[], excelFileName: string): void {
    //debugger;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    excelFileName = excelFileName ? excelFileName  : 'export'
    XLSX.writeFile(workbook, excelFileName + '.xlsx');
  }

  exportAsExcelFileForChart(jsonData: any[], excelFileName: string): void {
  // Extract and remove helper flag (__percentCols)
  const percentCols = new Set<string>();
  jsonData.forEach(row => {
    if (row.__percentCols) {
      row.__percentCols.forEach((col: string) => percentCols.add(col));
      delete row.__percentCols; // cleanup
    }
  });

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);

  // Apply % formatting to the right columns
  Object.keys(worksheet).forEach((cell) => {
    const col = cell.replace(/[0-9]/g, ''); // extract column letter
    const row = cell.replace(/[^0-9]/g, ''); // row number
    if (row === '1') return; // skip header

    const headerCell = worksheet[col + '1'];
    if (headerCell && percentCols.has(headerCell.v)) {
      worksheet[cell].t = 'n';    // numeric
      worksheet[cell].z = '0%';   // format as %
    }
  });

  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  XLSX.writeFile(workbook, (excelFileName || 'export') + '.xlsx');
}
  
}
