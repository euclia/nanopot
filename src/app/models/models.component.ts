import { Component, OnInit } from '@angular/core';
import { Model, Models } from '@euclia/jaqpot-client/dist/models/jaqpot.models';
import { JaqpotService } from '../apis/jaqpot.service';
import { SessionService } from '../session/session.service'
 
@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {


  _models:Model[]
  _totalModels:Number

  constructor(
    private jaqpotApi:JaqpotService,
    private _sessionService:SessionService
  ) { }

  ngOnInit(): void {
    this.jaqpotApi.getOrgsModels("Everyone", 0 ,10).subscribe(res =>{
      this._models = res.models
      this._totalModels = res.total
    })

    // this.jaqpotApi.getMyModels(0 ,10).subscribe(res =>{
    //   this._models = res.models
    //   this._totalModels = res.total
    // })

  }

  useModel(model){
    this._sessionService.setModel(model)
  }

}
