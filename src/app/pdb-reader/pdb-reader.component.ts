import { Component, OnInit } from '@angular/core';
import {GeomDescriptors, IPdbson, PdbsonImplementation} from '@euclia/descriptors'
import { Pdb } from '@euclia/descriptors';
import { IGeomDescriptors, GeomDescriptorsFactory } from '@euclia/descriptors'
import { SessionService } from '../session/session.service';


declare const ChemDoodle:any;

@Component({
  selector: 'app-pdb-reader',
  templateUrl: './pdb-reader.component.html',
  styleUrls: ['./pdb-reader.component.scss']
})
export class PdbReaderComponent implements OnInit {


  modelAvailable:boolean = false;
  _pdbReader:IPdbson
  _descClient:IGeomDescriptors

  molecule:boolean = false;

  constructor(
    private pdbson:PdbsonImplementation,
    private _sessionService:SessionService
          
  ) { 
    this._pdbReader = pdbson
    this._descClient = new GeomDescriptorsFactory("https://geomdescapi.jaqpot.org").getClient();
  }

  ngOnInit(): void {
    this._sessionService.getModel().subscribe(m=>{
      if(m){
        this.modelAvailable = true
      }
    })
  }


  pdbInputChange(ev){
    let file = ev.target.files[0];
    let fileReader = new FileReader();
    this.molecule = true
    fileReader.onload = (e) => {
      this.readPdb(fileReader.result.toString())


      // let cifdata = "data_image0↵_cell_length_a       5.87265↵_cell_length_b       6.1147↵_cell_length_c       24.9144↵_cell_angle_alpha    90↵_cell_angle_beta     90↵_cell_angle_gamma    118.699↵↵_symmetry_space_group_name_H-M    \"P 1\"↵_symmetry_int_tables_number       1↵↵loop_↵  _symmetry_equiv_pos_as_xyz↵  'x, y, z'↵↵loop_↵  _atom_site_label↵  _atom_site_occupancy↵  _atom_site_fract_x↵  _atom_site_fract_y↵  _atom_site_fract_z↵  _atom_site_thermal_displace_type↵  _atom_site_B_iso_or_equiv↵  _atom_site_type_symbol↵  Ta1      1.0000 0.00000  0.00000  0.40137  Biso   1.000  Ta↵  Hg1      1.0000 0.00000  0.50000  0.40137  Biso   1.000  Hg↵  Hg2      1.0000 0.50000  0.50000  0.40137  Biso   1.000  Hg↵  Ta2      1.0000 0.50000  0.00000  0.40137  Biso   1.000  Ta↵  Ta3      1.0000 0.64986  0.29971  0.50000  Biso   1.000  Ta↵  Hg3      1.0000 0.64986  0.79971  0.50000  Biso   1.000  Hg↵  Hg4      1.0000 0.14986  0.79971  0.50000  Biso   1.000  Hg↵  Ta4      1.0000 0.14986  0.29971  0.50000  Biso   1.000  Ta↵  Ta5      1.0000 0.27832  0.57094  0.59701  Biso   1.000  Ta↵  Hg5      1.0000 0.30057  0.10113  0.60404  Biso   1.000  Hg↵  Hg6      1.0000 0.76769  0.03539  0.60790  Biso   1.000  Hg↵  Ta6      1.0000 0.79263  0.57095  0.59701  Biso   1.000  Ta↵  O1       1.0000 0.01108  0.52214  0.64975  Biso   1.000  O↵" ;

      let file = fileReader.result.toString()
      let structure1 = ChemDoodle.readPDB(file);
      structure1.chains = []
      // console.log(structure1)
      let display3d = new ChemDoodle.TransformCanvas3D('chem_canvas', 600, 600);
    
      let newSpecs = new ChemDoodle.structures.Styles();

      // Object.keys(newSpecs).forEach(k =>{
      //   console.log(k)
      // })

      newSpecs.atoms_useJMOLColors = true
      newSpecs.set3DRepresentation('Wireframe');
      // newSpecs.set3DRepresentation('Ball and Stick');
      
      newSpecs.projectionPerspective_3D = true;
      newSpecs.atoms_displayLabels_3D = true;
      newSpecs.crystals_unitCellLineWidth = 5;
      newSpecs.shapes_color = 'black';
      newSpecs.shapes_lineWidth = 1;
      newSpecs.fog_mode_3D = 0;
      newSpecs.shadow_3D = false;
      newSpecs.atoms_useJMOLColors = true;
      newSpecs.compass_display = true;
      
      // display3d.residueSpecs = newSpecs;

      display3d.styles.altLabels = {},
      display3d.styles.stereographic = false,
      display3d.styles.tiltToRotate = true,
      display3d.styles.in = false,

      display3d.styles.x = 2
      display3d.styles.y = 2
      display3d.styles.z = 1
      display3d.styles.macro_displayAtoms = true;
      display3d.styles.macro_displayBonds = true;
      // load the molecule into the Canvas

      display3d.loadMolecule(structure1);
    }
    let f = fileReader.readAsText(file);
  }


  readPdb(pdbs:string){
    let pdb = this._pdbReader.readFromFileReader(pdbs)
    this._sessionService.setPdb(pdb)
    // this._descClient.getDelaunnayDescriptorsByPDB(pdb, '').then(r=>{
    //   console.log(r)
    // })
    // return pdb;
  }

}