import { Injectable } from '@angular/core';
import { IJaqpotClient, JaqpotClientFactory } from '@euclia/jaqpot-client'
import { Model, Models, Prediction } from '@euclia/jaqpot-client/dist/models/jaqpot.models';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Config } from '../config/config';
import { from, Observable } from 'rxjs'
 

@Injectable({
  providedIn: 'root'
})
export class JaqpotService {

  private _jaqpotClient:IJaqpotClient;

  constructor(
    public oidcSecurityService: OidcSecurityService
  ) { 
    this._jaqpotClient = new JaqpotClientFactory(Config.NanoPotApi).getClient()
  }

  public getOrgsModels(org:string, min:Number, max:Number):Observable<Models>{
    let token = this.oidcSecurityService.getToken()
    return from(this._jaqpotClient.getOrgsModels(org, min, max, token))
  }

  public getMyModels(min:Number, max:Number):Observable<Models>{
    let token = this.oidcSecurityService.getToken()
    return from(this._jaqpotClient.getMyModels(token, min, max))
  }

  public getModelById(id:string):Observable<Model>{
    let token = this.oidcSecurityService.getToken()
    return from(this._jaqpotClient.getModelById(id, token))
  }

  public predict(modelid:string, input:{ [key: string]: any; }[]):Observable<Prediction>{
    let token = this.oidcSecurityService.getToken()
    return from(this._jaqpotClient.predict(modelid, input, token))
  }

}
