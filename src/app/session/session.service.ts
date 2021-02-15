import { Injectable } from '@angular/core';
import { MatCardTitleGroup } from '@angular/material/card';
import { Model } from '@euclia/jaqpot-client/dist/models/jaqpot.models';
import { Pdb } from '@euclia/descriptors/dist/models/pdbtojson';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private model = new Subject<Model>();

  private pdb = new Subject<Pdb>();

  constructor() { }


  public getModel(){
    return this.model.asObservable()
  }

  public setModel(model:Model){
    this.model.next(model)
  }

  public getPdb(){
    return this.pdb.asObservable()
  }

  public setPdb(pdb:Pdb){
    this.pdb.next(pdb)
  }

}
