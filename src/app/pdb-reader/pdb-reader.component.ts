import { Component, OnInit } from '@angular/core';
import {GeomDescriptors, IPdbson, PdbsonImplementation} from '@euclia/pdb-to-json'
import { Pdb } from '@euclia/pdb-to-json';
import { IGeomDescriptors, GeomDescriptorsFactory } from '@euclia/pdb-to-json'

@Component({
  selector: 'app-pdb-reader',
  templateUrl: './pdb-reader.component.html',
  styleUrls: ['./pdb-reader.component.scss']
})
export class PdbReaderComponent implements OnInit {

  _pdbReader:IPdbson
  _descClient:IGeomDescriptors

  constructor(
    private pdbson:PdbsonImplementation,
          
  ) { 
    this._pdbReader = pdbson
    this._descClient = new GeomDescriptorsFactory("https://geomdescapi.jaqpot.org").getClient();
  }

  ngOnInit(): void {
  }


  pdbInputChange(ev){
    let file = ev.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      // console.log(typeof fileReader.result);
      // console.log(fileReader.result);
      this.readPdb(fileReader.result.toString())
    }
    let f = fileReader.readAsText(file);
    // console.log(f)
  }


  readPdb(pdbs:string):Pdb{
    let pdb = this._pdbReader.readFromFileReader(pdbs)
    console.log(pdb)
    this._descClient.getDelaunnayDescriptorsByPDB(pdb, '').then(r=>{
      console.log("Waiting for response")
      console.log(r)
    })
    return pdb;
  }

}