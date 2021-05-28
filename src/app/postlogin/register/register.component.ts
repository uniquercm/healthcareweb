import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  base64File: string = '';
  filename: string = '';
  data: any[] = [];
  header: any[] = [];
  file: any;
  arrayBuffer: any;
  worksheet: any;
  sheet: any = [];

  constructor() { }

  ngOnInit(): void {
  }

  onFileSelect(e: any): void {
    try {
      const target: DataTransfer = <DataTransfer>(e.target);
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: true });
        this.worksheet = wb;

        const wsname: string = wb.SheetNames[0];
        this.sheet = wb.SheetNames;

        if (this.sheet.length === 1) {
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
        }
      };
      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.data = this.data.filter((item): any => item.length !== 0);
        this.header.push(this.data[0]);
        this.header.push(this.data[1]);
        this.data.splice(0, 2);
        this.data.splice(- 1, 1);
      }

    } catch (error) {
      this.filename = '';
      this.base64File = '';
      console.log('no file was selected...');
    }
  }

}
