import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPdbson, PdbsonImplementation } from '@euclia/pdb-to-json/dist/pdbson';
import { OidcClientNotification, OidcSecurityService, PublicConfiguration, PublicEventsService,  EventTypes } from 'angular-auth-oidc-client';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

declare const ChemDoodle:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'nanopot';

  // molData = 'Molecule Name\n  CHEMDOOD08070920033D 0   0.00000     0.00000     0\n[Insert Comment Here]\n 14 15  0  0  0  0  0  0  0  0  1 V2000\n   -0.3318    2.0000    0.8318   O 0  0  0  1  0  0  0  0  0  0  0  0\n   -0.3318    1.0000   1.8318   C 0  0  0  1  0  0  0  0  0  0  0  0\n   -1.1980    0.5000    -1.2000   N 0  0  0  1  0  0  0  0  0  0  0  0\n    0.5342    0.5000    0.20300   C 0  0  0  1  0  0  0  0  0  0  0  0\n   -1.1980   -0.5000    1.2000   C 0  0  0  1  0  0  0  0  0  0  0  0\n   -2.0640    1.0000    1.2430   C 0  0  0  4  0  0  0  0  0  0  0  0\n    1.4804    0.8047    -0.3000   N 0  0  0  1  0  0  0  0  0  0  0  0\n    0.5342   -0.5000    -1.2340   C 0  0  0  1  0  0  0  0  0  0  0  0\n   -2.0640   -1.0000    0.2344   O 0  0  0  1  0  0  0  0  0  0  0  0\n   -0.3318   -1.0000    -0.3318   N 0  0  0  1  0  0  0  0  0  0  0  0\n    2.0640   -0.0000    0.3318  C 0  0  0  2  0  0  0  0  0  0  0  0\n    1.7910    1.7553    1.2553   C 0  0  0  4  0  0  0  0  0  0  0  0\n    1.4804   -0.8047    1.7553   N 0  0  0  1  0  0  0  0  0  0  0  0\n   -0.3318   -2.0000    0.7553   C 0  0  0  4  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0\n  3  2  1  0  0  0  0\n  4  2  1  0  0  0  0\n  3  5  1  0  0  0  0\n  3  6  1  0  0  0  0\n  7  4  1  0  0  0  0\n  4  8  2  0  0  0  0\n  9  5  2  0  0  0  0\n 10  5  1  0  0  0  0\n 10  8  1  0  0  0  0\n  7 11  1  0  0  0  0\n  7 12  1  0  0  0  0\n 13  8  1  0  0  0  0\n 13 11  2  0  0  0  0\n 10 14  1  0  0  0  0\nM  END\n> <DATE>\n07-08-2009\n';

  molData
  isAuthenticated: boolean;
  loggedIn:boolean;
  subscription:Subscription;
  isAuthorizedSubscription: Subscription;
  isAuthorized: boolean;

  configuration: PublicConfiguration;
  userDataChanged$: Observable<OidcClientNotification<any>>;
  userData$: Observable<any>;
  isAuthenticated$: Observable<boolean>;
  checkSessionChanged$: Observable<boolean>;
  checkSessionChanged: any;

  _pdbReader:IPdbson

  constructor(
    public oidcSecurityService: OidcSecurityService,
    private _router:Router,private eventService: PublicEventsService,
    private pdbson:PdbsonImplementation
  ){
    this._pdbReader = pdbson
  }

  ngOnInit(){
    this.isAuthorizedSubscription = this.oidcSecurityService.isAuthenticated$.subscribe(
      (isAuthorized: boolean) => {
        if(isAuthorized === true){
          this.isAuthenticated = true;
          // this._router.navigate(['/home'])
        }else{
          this.isAuthenticated = false;
        }
      });
      this.configuration = this.oidcSecurityService.configuration;
      this.userData$ = this.oidcSecurityService.userData$;
      this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
      this.checkSessionChanged$ = this.oidcSecurityService.checkSessionChanged$;

      this.oidcSecurityService.checkAuth().subscribe((isAuthenticated) => console.log('app authenticated', isAuthenticated));

      this.eventService
          .registerForEvents()
          .pipe(filter((notification) => notification.type === EventTypes.CheckSessionReceived))
          .subscribe((value) => console.log('CheckSessionReceived with value from app', value));




  }


  pdbInputChange(ev){
    let file = ev.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      // console.log(typeof fileReader.result);
      // console.log(fileReader.result);
      let file = fileReader.result.toString()

      this.molData = file
      // let structure1 = ChemDoodle.readPDB(file);
      let structure1 = ChemDoodle.readPDB(file);
      structure1.chains = []
      
      console.log(structure1)
      
      let display3d = new ChemDoodle.TransformCanvas3D('component15932', 400, 400);
      // set the 3D representation for ligand atoms
      // display3d.styles.set3DRepresentation('van der Waals Spheres');
      // set the 3D representation for the protein and nucleic acid atoms and set them to be displayed
      // first, create a new Styles object
      let newSpecs = new ChemDoodle.structures.Styles();
      // display these atoms in wireframe
      newSpecs.set3DRepresentation('Ball and Stick');
      // newSpecs.set3DRepresentation('Wireframe');
      // set the residueSpecs variable for the Canvas3D to bind it
      display3d.residueSpecs = newSpecs;
      // set the original styles to display the protein and nucleic acid atoms and bonds
      display3d.styles.macro_displayAtoms = true;
      display3d.styles.macro_displayBonds = true;
      // load the molecule into the Canvas
      display3d.loadMolecule(structure1);


    }
    let f = fileReader.readAsText(file);
    // console.log(f)
  }

  checkChem(){
        
    let pdbson = this._pdbReader.readFromFileReader('/Users/pantelispanka/Downloads/AgNP.pdb')
    // read the PDB data and store the returned Molecule data structure as the variable, structure
    let structure = ChemDoodle.readPDB(pdbson);
    console.log(structure)

    // let content15932 = new ChemDoodle.io.JSONInterpreter().contentFrom({"m":[{"a":[{"x":-0.7168,"i":"a0","y":-2.7465,"z":0.1135},{"x":-1.8203,"i":"a1","y":-3.3663,"z":0.6026,"l":"O"},{"x":-1.6568,"i":"a2","y":-4.7052,"z":1.0743},{"x":-2.9992,"i":"a3","y":-5.234,"z":1.5836},{"x":-0.8021,"i":"a4","y":-1.4325,"z":-0.3667},{"x":-2.0915,"i":"a5","y":-0.7162,"z":-0.3426},{"x":-2.1001,"i":"a6","y":0.6016,"z":-0.0076,"l":"N"},{"x":-3.2885,"i":"a7","y":1.307,"z":0.0266},{"x":-4.4691,"i":"a8","y":0.6381,"z":-0.2892},{"x":-5.4838,"i":"a9","y":1.5443,"z":-0.1824,"l":"N"},{"x":-6.9049,"i":"a10","y":1.282,"z":-0.4232},{"x":-3.6283,"i":"a11","y":2.6315,"z":0.3232},{"x":-4.9229,"i":"a12","y":2.771,"z":0.1998,"l":"N"},{"x":-2.6621,"i":"a13","y":3.7178,"z":0.7201},{"x":-2.1638,"i":"a14","y":4.4401,"z":-0.5332},{"x":-1.183,"i":"a15","y":5.543,"z":-0.1303},{"x":-3.1872,"i":"a16","y":-1.3764,"z":-0.6514,"l":"N"},{"x":-4.3903,"i":"a17","y":-0.7806,"z":-0.6419},{"x":-5.3976,"i":"a18","y":-1.4071,"z":-0.9305,"l":"O"},{"x":0.341,"i":"a19","y":-0.805,"z":-0.8679},{"x":1.5425,"i":"a20","y":-1.4796,"z":-0.8872},{"x":1.6225,"i":"a21","y":-2.7784,"z":-0.412},{"x":0.5017,"i":"a22","y":-3.4082,"z":0.0918},{"x":2.9834,"i":"a23","y":-0.6867,"z":-1.5196,"l":"S"},{"x":2.5275,"i":"a24","y":0.3326,"z":-2.3984,"l":"O"},{"x":3.7162,"i":"a25","y":0.0837,"z":-0.25,"l":"N"},{"x":4.7268,"i":"a26","y":-0.6035,"z":0.5684},{"x":5.9708,"i":"a27","y":0.2871,"z":0.6549},{"x":5.5827,"i":"a28","y":1.6195,"z":1.1366,"l":"N"},{"x":6.7658,"i":"a29","y":2.4503,"z":1.3973},{"x":3.3781,"i":"a30","y":1.4753,"z":0.0853},{"x":4.6713,"i":"a31","y":2.2823,"z":0.1942},{"x":3.8671,"i":"a32","y":-1.7235,"z":-1.9239,"l":"O"},{"x":-1.303,"i":"a33","y":-5.3369,"z":0.2595,"l":"H"},{"x":-0.9296,"i":"a34","y":-4.7182,"z":1.8862,"l":"H"},{"x":-2.8745,"i":"a35","y":-6.2553,"z":1.9434,"l":"H"},{"x":-3.353,"i":"a36","y":-4.6023,"z":2.3984,"l":"H"},{"x":-3.7264,"i":"a37","y":-5.221,"z":0.7718,"l":"H"},{"x":-1.2674,"i":"a38","y":1.0494,"z":0.2091,"l":"H"},{"x":-7.3783,"i":"a39","y":0.9648,"z":0.5059,"l":"H"},{"x":-7.386,"i":"a40","y":2.1909,"z":-0.7844,"l":"H"},{"x":-7.0076,"i":"a41","y":0.495,"z":-1.1704,"l":"H"},{"x":-3.165,"i":"a42","y":4.4301,"z":1.3742,"l":"H"},{"x":-1.8154,"i":"a43","y":3.2767,"z":1.246,"l":"H"},{"x":-1.6609,"i":"a44","y":3.7278,"z":-1.1873,"l":"H"},{"x":-3.0105,"i":"a45","y":4.8813,"z":-1.0592,"l":"H"},{"x":-0.3363,"i":"a46","y":5.1019,"z":0.3957,"l":"H"},{"x":-0.828,"i":"a47","y":6.0576,"z":-1.0232,"l":"H"},{"x":-1.6859,"i":"a48","y":6.2553,"z":0.5238,"l":"H"},{"x":0.2831,"i":"a49","y":0.2072,"z":-1.24,"l":"H"},{"x":2.5681,"i":"a50","y":-3.2999,"z":-0.4316,"l":"H"},{"x":0.572,"i":"a51","y":-4.4209,"z":0.4604,"l":"H"},{"x":4.3309,"i":"a52","y":-0.7778,"z":1.5689,"l":"H"},{"x":4.9887,"i":"a53","y":-1.5544,"z":0.1044,"l":"H"},{"x":6.6874,"i":"a54","y":-0.1553,"z":1.3468,"l":"H"},{"x":6.4244,"i":"a55","y":0.3751,"z":-0.3323,"l":"H"},{"x":7.3394,"i":"a56","y":2.5646,"z":0.4775,"l":"H"},{"x":6.4499,"i":"a57","y":3.4311,"z":1.7528,"l":"H"},{"x":7.386,"i":"a58","y":1.9716,"z":2.1552,"l":"H"},{"x":2.7489,"i":"a59","y":1.8981,"z":-0.6978,"l":"H"},{"x":2.8504,"i":"a60","y":1.5044,"z":1.0386,"l":"H"},{"x":4.444,"i":"a61","y":3.2873,"z":0.5496,"l":"H"},{"x":5.1469,"i":"a62","y":2.3411,"z":-0.7848,"l":"H"}],"b":[{"b":0,"e":1,"i":"b0"},{"b":1,"e":2,"i":"b1"},{"b":2,"e":3,"i":"b2"},{"b":0,"e":4,"i":"b3","o":2},{"b":4,"e":5,"i":"b4"},{"b":5,"e":6,"i":"b5"},{"b":6,"e":7,"i":"b6"},{"b":7,"e":8,"i":"b7","o":2},{"b":8,"e":9,"i":"b8"},{"b":9,"e":10,"i":"b9"},{"b":7,"e":11,"i":"b10"},{"b":11,"e":12,"i":"b11","o":2},{"b":9,"e":12,"i":"b12"},{"b":11,"e":13,"i":"b13"},{"b":13,"e":14,"i":"b14"},{"b":14,"e":15,"i":"b15"},{"b":5,"e":16,"i":"b16","o":2},{"b":16,"e":17,"i":"b17"},{"b":8,"e":17,"i":"b18"},{"b":17,"e":18,"i":"b19","o":2},{"b":4,"e":19,"i":"b20"},{"b":19,"e":20,"i":"b21","o":2},{"b":20,"e":21,"i":"b22"},{"b":21,"e":22,"i":"b23","o":2},{"b":0,"e":22,"i":"b24"},{"b":20,"e":23,"i":"b25"},{"b":23,"e":24,"i":"b26","o":2},{"b":23,"e":25,"i":"b27"},{"b":25,"e":26,"i":"b28"},{"b":26,"e":27,"i":"b29"},{"b":27,"e":28,"i":"b30"},{"b":28,"e":29,"i":"b31"},{"b":25,"e":30,"i":"b32"},{"b":30,"e":31,"i":"b33"},{"b":28,"e":31,"i":"b34"},{"b":23,"e":32,"i":"b35","o":2},{"b":2,"e":33,"i":"b36"},{"b":2,"e":34,"i":"b37"},{"b":3,"e":35,"i":"b38"},{"b":3,"e":36,"i":"b39"},{"b":3,"e":37,"i":"b40"},{"b":6,"e":38,"i":"b41"},{"b":10,"e":39,"i":"b42"},{"b":10,"e":40,"i":"b43"},{"b":10,"e":41,"i":"b44"},{"b":13,"e":42,"i":"b45"},{"b":13,"e":43,"i":"b46"},{"b":14,"e":44,"i":"b47"},{"b":14,"e":45,"i":"b48"},{"b":15,"e":46,"i":"b49"},{"b":15,"e":47,"i":"b50"},{"b":15,"e":48,"i":"b51"},{"b":19,"e":49,"i":"b52"},{"b":21,"e":50,"i":"b53"},{"b":22,"e":51,"i":"b54"},{"b":26,"e":52,"i":"b55"},{"b":26,"e":53,"i":"b56"},{"b":27,"e":54,"i":"b57"},{"b":27,"e":55,"i":"b58"},{"b":29,"e":56,"i":"b59"},{"b":29,"e":57,"i":"b60"},{"b":29,"e":58,"i":"b61"},{"b":30,"e":59,"i":"b62"},{"b":30,"e":60,"i":"b63"},{"b":31,"e":61,"i":"b64"},{"b":31,"e":62,"i":"b65"}]}]});
    // let component15932 = new ChemDoodle.TransformCanvas3D('component15932', 400, 400);
    // component15932.styles.backgroundColor = '#000000';
    // component15932.styles.atoms_color = '#C0C0C0';
    // component15932.styles.atoms_useJMOLColors = true;
    // component15932.styles.atoms_resolution_3D = 30;
    // component15932.styles.atoms_sphereDiameter_3D = 2.0;
    // component15932.styles.atoms_useVDWDiameters_3D = true;
    // component15932.styles.atoms_vdwMultiplier_3D = 0.3;
    // component15932.styles.bonds_color = '#808080';
    // component15932.styles.bonds_showBondOrders_3D = true;
    // component15932.styles.bonds_resolution_3D = 30;
    // component15932.styles.bonds_materialAmbientColor_3D = '#000000';
    // component15932.styles.shapes_color = '#FFFFFF';
    // component15932.styles.shapes_lineWidth_2D = 2.5;
    // component15932.loadContent(content15932.molecules, content15932.shapes);
    // component15932.rotationMatrix = ChemDoodle.lib.mat4.createFrom(-0.8878781455350377,-0.1520710750350469,-0.43421974485154957,0.0,0.18310063850029987,-0.9826281984747903,-0.030265157243383425,0.0,-0.42207411062755673,-0.10637768421933783,0.9002984135485771,0.0,0.0,0.0,0.0,1.0);

  }


  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff()
    // this._router.navigate(['/'])
    // console.log("loged aout")
    // this.oidcSecurityService.logoff();
  }

}
