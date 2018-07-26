import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TriangleService } from '../triangle.service'

@Component({
  selector: 'floyd',
  template: 	`<p>
    <input #checkbox type="checkbox" value="even">Even?<br>
  <input #rows type="text" name="rows">
  <button (click)="onClick(rows.value, checkbox.checked)">CLICK</button>
  </p>
  <pre AngularPre [highlightColor]="color">
  {{floydString | paragraph:'¶' | replaceAll: {from:'¶', to:'¶ piped'} }} 
  </pre>
  `,
  styleUrls: ['./floyd.component.css'],
  providers: [TriangleService],
  encapsulation: ViewEncapsulation.None
})
export class FloydComponent implements OnInit {

  private floydString:string = "";
  private static startOfAlphabet = 97;
  private color: "yellow" | "red";

  constructor(private triangleService:TriangleService) { }

  ngOnInit() {
  }

  onClick(rows:number, checked:boolean){

    if(checked){
      this.floydString = this.triangleService.evenFloydTriangle(rows);
      this.color = "red";
    }else{
      this.floydString = this.triangleService.floydTriangle(rows);
      this.color = "yellow";
    }
  }
}