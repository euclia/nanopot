import { Injectable } from '@angular/core';
import { GeomDescriptorsFactory, IGeomDescriptors } from '@euclia/descriptors/dist/client';
import { Descriptors, Pdb } from '@euclia/descriptors/dist/models/pdbtojson';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { from, Observable } from 'rxjs';
import { Config } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class GeomsApiService implements IGeomsApiService{

  _geomsClient:IGeomDescriptors

  constructor(
    public oidcSecurityService: OidcSecurityService
  ) {
    this._geomsClient = new GeomDescriptorsFactory(Config.GeomApi).getClient()
   }

  getGeomDescriptors(pdb:Pdb):Promise<Descriptors>{
    let token = this.oidcSecurityService.getToken();
    return this._geomsClient.getDelaunnayDescriptorsByPDB(pdb, token)
  }

}

export interface IGeomsApiService{
  getGeomDescriptors(pdb:Pdb):Promise<Descriptors>
}
