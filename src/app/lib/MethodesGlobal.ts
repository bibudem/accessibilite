//class qui regroupes les methodes utilisés souvent
import {formatDate} from "@angular/common";
import * as XLSX from "xlsx";
import {Observable} from "rxjs";


export class MethodesGlobal  {
  conversionEncryptOutput: string | undefined;
  conversionDecryptOutput:string | undefined;

  //convertir string to int
  private router: any;
  convertNumber(value: string) {
    return parseInt(value);
  }
//prendre la valeur d'un input
  getValue(value:string){
    return value;
  }

  // Déterminer si le checkbox passé en paramètres est a Oui ou pas.
  hasValue(val: string): boolean {
    if (val =='Oui') return true;
    return false;
  }
  // Méthode appelée lorsque l'utilisateur
  checkedInput($event: any): void {
    let checked = $event.target.checked;
    $event.target.value='';
    if (checked) {
      $event.target.value='Oui';
    }
  }

  checkedResult(id:string): boolean {
    // @ts-ignore
    let checked = document.getElementById(id).checked;
    if (checked) {
     return true
    } else return false
  }

  //faire visible un element avec id
  afficher(id:string): void {
    let champ=document.getElementById(id);
    if(champ){
      champ.style.display = 'block';
    }
  }

  //faire invisible un element avec id
  nonAfficher(id:string): void {
    let champ=document.getElementById(id);
    if(champ){
      champ.style.display = 'none';
    }
  }
  //prendre la valeur de ng-select
  getValueNgSelect(val: any):any {
    //console.log("multiselect: ", val);
    return val;
  }
  //Changer l'url lors d'un clique
  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('.', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }

  //convertir format date date jj/mm/aaaa to aaaa-mm-jj
  convertDate(dateString:string){
    var splitted = dateString.split("/", 3);
    let newDate=splitted[2]+'-'+splitted[1]+'-'+splitted[0]
      return newDate;
  }

  //convertir format date date jj/mm/aaaa to aaaa-mm-jj
  convertDateObjectToString(date:any){
    let month,day,year;
        if(typeof(date)=='string'){
          if(date!=''){
            return date;
          }
        }
        if(typeof(date)=='object'){
          month=date.month;
          day=date.day;
          year=date.year;

          if(date.month<10){
            month='0'+date.month;
          }
          if(date.day<10){
            day='0'+date.day;
          }
           //format yyyy-mm-dd
          return year+'-'+month+'-'+day;
        }
        return '';
  }

  convertDateStandartToString(maDate : Date ){
    const annee = maDate.getFullYear();
    const mois = (maDate.getMonth() + 1).toString().padStart(2, '0'); // Les mois commencent à 0, donc ajoutez 1. La fonction padStart ajoute un zéro devant si le mois est inférieur à 10.
    const jour = maDate.getDate().toString().padStart(2, '0');

    return `${annee}-${mois}-${jour}`;
  }

  stringToObjectDate(datePost:string){
    let dateNew:any={};
    //console.log(datePost);
    let splitted = datePost.split("-",3);
      dateNew.year=splitted[0];
      dateNew.month=splitted[1];
      dateNew.day=splitted[2];
    return dateNew;


  }

// validation des données dans les champs
  validationDonneesForm(values: any) {
    let count = 0;
    let result = true;

    for (let [key, value] of Object.entries(values)) {
      const element = document.getElementById(key);

      if (!value) {
        // Si la valeur est vide
        if (element) {
          // Vérifier si element est défini avant d'effectuer l'affectation
          element.style.borderColor = 'red';
          if (element.tagName === 'SELECT') {
            // Si c'est un champ de type SELECT, réinitialiser la bordure avec !important
            element.style.outline = '1px solid red';
          }
        }
        count++;
      } else {
        // Pour les autres types de champs, réinitialiser la bordure
        if (element) {
          // Vérifier si element est défini avant d'effectuer l'affectation
          element.style.borderColor = '#aab2bd';
          if (element.tagName === 'SELECT') {
            // Si c'est un champ de type SELECT, réinitialiser la bordure avec !important
            element.style.outline = '1px solid #aab2bd';
          }
        }
      }
    }

    if (count > 0) {
      result = false;
    }

    return result;
  }

  obligatoireChamp(value:string){
    if(value==''){
      return false
    }
    return true
  }
  //valide la valeur si non null d'un cahmp
  isValueChamp(value:string, id:string):boolean{
      // @ts-ignore
      let input = document.getElementById(id);
      // @ts-ignore
      if (value == '') {
        // @ts-ignore
        input.style.setProperty('border', '1px solid red');
        return false
      }
      // @ts-ignore
      input.style.setProperty('border', '1px solid #aab2bd');
      //console.log(input);

    return true;
  }
//mask pour l'annees
  mask = {
    "annee":{
      guide: true,
      showMask: true,
      mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
    }

  };

  //exporter les données en format xlsx
  async ExportTOExcel(nomTableau:string, nomFile:string)
  {

    setTimeout(async function () {
      let dateNow=new Date().getUTCDate();
      /* table id is passed over here */
      let element = document.getElementById(nomTableau);
      const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, nomTableau+dateNow);

      /* save to file */
      XLSX.writeFile(wb, nomFile);
    }, 3000);

    //console.log(this.dataSource);

  }
  //cacher le menu pour non-admin
  ifAdminFunction(): boolean{
    let ifAdmin=localStorage.getItem('role');
    if (ifAdmin==='Admin') { return true }
    else return false
  }

  //Ajouter la valeur pour l'input
  addValueInput(val:string,idInput:string){
    let id_log=document.getElementById(idInput)
    if(id_log)
    { // @ts-ignore
      id_log.value=val
    }
  }

  //creation de la date yyyy-mm-dd H:M:S
  dateCreator(){
    let dateStart = new Date().toLocaleDateString()+' '+new Date().getHours().toLocaleString()+':'+new Date().getUTCMinutes()+':'+new Date().getUTCSeconds()
    //let dateStart =new Date().getFullYear()+'-'+ new Date().getMonth()+'-'+new Date().getDay()+' '+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds();
    return dateStart;
  }
  //creation de la date yyyy-mm-dd H:M:S
  dateSimple(){
    let dateStart = new Date().toLocaleDateString();
    //let dateStart =new Date().getFullYear()+'-'+ new Date().getMonth()+'-'+new Date().getDay()+' '+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds();
    return dateStart;
  }
  //creation de la date yyyy-mm-dd H:M:S
  dateStandart(){
    let dateStart = new Date().toLocaleDateString();
    return dateStart;
  }

  //si vide retourne '-'
  returnCharIfNull(val:string){
    if(!val)
       val='-';
    return val.toString()
  }

  //si vide retourne '-'
  viderInput(id:string){
    if(id)
      // @ts-ignore
      document.getElementById(id).value='';
  }
  //fonction utilise pour ajouté une pause dans les operations
  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }

  returnValueInputId(id:string){
    // @ts-ignore
    let value=document.getElementById(id).value;
    if(value!='')
      return value.toString()
    else return ''
  }
  //prendre les valeurs d'un miltiselect
  multiValeurCreator(val:any){
    let result=''
    if(val){
      for(let v of val){
        result+=v+','
      }
    }
    return result
  }

  //creation du select d'année a partir de 2019
  anneeOptions(){
    let arrayAnnee:any = [];
    let anneeNow=new Date().getFullYear();
    let i=0;
    while(i <=(anneeNow-1950)){
      arrayAnnee[i]=anneeNow-i;
      i++;
    }
    return arrayAnnee;
  }
  generateRandomString(length:number){
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  generateRandomNumber(length:number){
    let result = '';
    const characters =
      '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  //chercher la liste des fournisseurs
  async creerTableauFournisseurs(listeFournissuers:any,service:any){
    try {
      //creer la liste des plateforme
      let fournissuers$: Observable<any>;
        fournissuers$ = await service.fetchAllFournissuers();

        fournissuers$.toPromise().then(res => {
          for (let i in res) {
            listeFournissuers[i]={
              "id":res[i].idFournisseur,
              "nom":res[i].nom
            }
          }
        });


    } catch(err) {
      console.error(`Error : ${err.Message}`);
    }
  }
  //chercher la liste des fournisseurs
  async optionsDynamiques(liste:any,service:any){
    try {
      //creer la liste des plateforme
      let options$: Observable<any>;
      options$ = await service;

      options$.toPromise().then(res => {
        for (let i in res) {
          liste[i]={
            "id":res[i].id_collection,
            "nom":res[i].nom
          }
        }
      });


    } catch(err) {
      console.error(`Error : ${err.Message}`);
    }
  }

}
