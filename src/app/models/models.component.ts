import { Component, OnInit } from '@angular/core';
import { JaqpotService } from '../apis/jaqpot.service';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {

  private _jaqpotApi
  constructor(
    private jaqpotApi:JaqpotService
  ) { }

  ngOnInit(): void {
    this.jaqpotApi.getMyModels(0, 10).subscribe(res =>{
      console.log(res)
    })
  }

}
