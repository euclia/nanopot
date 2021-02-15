import { Component, OnInit } from '@angular/core';
import { Model, Prediction } from '@euclia/jaqpot-client/dist/models/jaqpot.models';
import { Descriptors, Pdb } from '@euclia/descriptors/dist/models/pdbtojson';
import { SessionService } from '../session/session.service';
import {IGeomsApiService, GeomsApiService} from '../apis/geoms.api.service'
import { JaqpotService } from '../apis/jaqpot.service';

@Component({
  selector: 'app-predictions',
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.scss']
})
export class PredictionsComponent implements OnInit {

  _model:Model
  _gotPdb:boolean = true
  _pdb:Pdb

  _modelAvailable:boolean = false
  calculatingDescr:boolean = false;
  calculatedDescr:boolean = false;
  calcPrediction:boolean = false;

  prediction:Prediction
  inpuFeats = []


  // _geomApi:IGeomsApiService

  _descriptors:Descriptors

  constructor(
    private _sesService:SessionService,
    private _geomApi:GeomsApiService,
    private _jaqpotApi:JaqpotService
  ) {

  }

  ngOnInit(): void {
    this._sesService.getModel().subscribe(m =>{
      if(m){
        this._modelAvailable = true
        this._jaqpotApi.getModelById(m._id).subscribe(m =>{
          this._model = m
          let dict:{ [key: string]: any; } = m.additionalInfo.independentFeatures
          this.inpuFeats = Object.values(dict)
        })
      }
    })
    this._sesService.getPdb().subscribe(pdb =>{
      if(pdb){
        this.calculatingDescr = true
        this._geomApi.getGeomDescriptors(pdb).then(res=>{
          if(res){
            this.calculatingDescr = false;
            this._descriptors = res
            let input = {}
            this.inpuFeats.forEach(fn =>{
              if(Object.keys(res).indexOf(fn)> -1){
                input[fn] = res[fn]
              }else{
                input[fn] = 0
              }
            })
            let predData = []
            predData.push(input)
            this._jaqpotApi.predict(this._model._id, predData).subscribe(res=>{
              this.prediction = res
            })   
          }
        })
      }
    })

  }


}
