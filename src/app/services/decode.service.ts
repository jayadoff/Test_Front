import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DecodeService {



  private localStoragekey = environment.LOCAL_STORAGE_LOGIN_SECRET_KEY;


constructor() { }


getBloodGroupList(): any {
  const retrievedEncodedData = localStorage.getItem('bloodGroupList');
  if (retrievedEncodedData) {
    const decodedData = decodeURIComponent(retrievedEncodedData);
    return JSON.parse (decodedData);

  }

  return null;
  }






getNationalityList(): any {
    const retrievedEncodedData = localStorage.getItem('nationalityList');
    if (retrievedEncodedData) {
      const decodedData = decodeURIComponent(retrievedEncodedData);
      return JSON.parse (decodedData);
    }
    return null;
  }

getOccupationList(): any {
    const retrievedEncodedData = localStorage.getItem('occupationList');
    if (retrievedEncodedData) {
      const decodedData = decodeURIComponent(retrievedEncodedData);
      return JSON.parse (decodedData);
    }
    return null;
  }
getGenderList(): any {
    const retrievedEncodedData = localStorage.getItem('genderList');
    if (retrievedEncodedData) {
      const decodedData = decodeURIComponent(retrievedEncodedData);
      return JSON.parse (decodedData);
    }
    return null;
  }
getReligionList(): any {
    const retrievedEncodedData = localStorage.getItem('religionList');
    if (retrievedEncodedData) {
      const decodedData = decodeURIComponent(retrievedEncodedData);
      return JSON.parse (decodedData);
    }
    return null;
  }
getDivisionList(): any {
    const retrievedEncodedData = localStorage.getItem('divisionList');
    if (retrievedEncodedData) {
      const decodedData = decodeURIComponent(retrievedEncodedData);
      return JSON.parse (decodedData);
    }
    return null;
  }
getDistrictList(): any {
    const retrievedEncodedData = localStorage.getItem('districtList');
    if (retrievedEncodedData) {
      const decodedData = decodeURIComponent(retrievedEncodedData);
      return JSON.parse (decodedData);
    }
    return null;
  }


getStudentInfo(): any {

  const retrievedEncodedData = localStorage.getItem(this.localStoragekey);
  if (retrievedEncodedData) {
    const decodedData = decodeURIComponent(retrievedEncodedData);
    return JSON.parse (decodedData);
  }
  return null;
  }



}
