import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UrlConstants } from '../enums/UrlConstants';
// import { StudentAttendenceVM } from 'src/app/models/Student/std-attendance-info-vw';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  message: string = '';
  private ngUnsubscribe = new Subject<void>();

  constructor(private httpClient: HttpClient) {

  }

  // Blood Group List
  GetBloodGroupList(organinationCode: string): Observable<any> {
    let params = new HttpParams().set('organizationCode', organinationCode)
    return this.httpClient.get(UrlConstants.getBloodGroupList,{ params: params });
  }

  // Nationality List
  GetNationalityList(organinationCode: string): Observable<any> {
    let params = new HttpParams().set('organizationCode', organinationCode)
    return this.httpClient.get(UrlConstants.getNationalityList,{ params: params });
  }

  // Birth Place List
  GetBirthPlaceList(): Observable<any> {
    return this.httpClient.get(UrlConstants.getBirthPlaceList);
  }

  // Religion List
  GetReligionList(organinationCode: string): Observable<any> {
    let params = new HttpParams().set('organizationCode', organinationCode)
    return this.httpClient.get(UrlConstants.getReligionList,{ params: params });
  }

  // Gender List
  GetGenderList(organinationCode: string): Observable<any> {
    let params = new HttpParams().set('organizationCode', organinationCode)
    return this.httpClient.get(UrlConstants.getGenderList,{ params: params });
  }
  // Teacher List


  
  // Board Or University List
  GetBoardOrUniList(organinationCode: string): Observable<any> {
    let params = new HttpParams().set('organizationCode', organinationCode)
    return this.httpClient.get(UrlConstants.getBoardOrUniList,{ params: params });
  }

  // Relation type list
  GetRelationTypeList(organinationCode: string): Observable<any> {
    let params = new HttpParams().set('organizationCode', organinationCode)
    return this.httpClient.get(UrlConstants.getRelationTypeList,{ params: params });
  }
  GetAddressInformartionList(ORG_CODE: string,CAMPUS_CODE :string): Observable<any> {
    let params = new HttpParams();
    params = params.set('ORG_CODE', ORG_CODE);
    params = params.set('CAMPUS_CODE', CAMPUS_CODE);
    return this.httpClient.get(UrlConstants.getAddressInformartionList,{ params: params });
  }

  // Occupation List
  GetOccupationList(organinationCode: string): Observable<any> {
    let params = new HttpParams().set('organizationCode', organinationCode)
    return this.httpClient.get(UrlConstants.getOccupationList,{ params: params });
  }

  // District List
  GetDistrictList(): Observable<any> {
    return this.httpClient.get(UrlConstants.getDistrictList);
  }

  // Country List
  getCountryList() {
    return this.httpClient.get(UrlConstants.getCountryList);
  }

  // Get Devision List
  getDevisionList(countryCode: string): Observable<any> {
    let params = new HttpParams().set('devision', countryCode)
    return this.httpClient.get(UrlConstants.getDivisionList,{ params: params });
  }

  getDistrictList(devisionCode: string): Observable<any> {
    let params = new HttpParams().set('district', devisionCode)
    return this.httpClient.get(UrlConstants.getDistricList,{ params: params });
  }

  getThanaList(thanaCode: string): Observable<any> {
    let params = new HttpParams().set('thana', thanaCode)
    return this.httpClient.get(UrlConstants.getThanaList,{ params: params });
  }


  getGroupSubList(organinationCode: string, campusCode:string, groupCode:string): Observable<any> {
    let params = new HttpParams();
    params = params.set('organizationCode', organinationCode);
    params = params.set('campusCode', campusCode);
    params = params.set('groupCode', groupCode);
    return this.httpClient.get(UrlConstants.getGroupSubList,{ params: params });
  }

}
