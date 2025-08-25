import { Injectable } from '@angular/core';
import { LoginMst, UserInfoPram, UserMst, UserPassInfo, Userotpcheck } from '../../models/login-model/login-mst';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UrlConstants } from '../../enums/UrlConstants';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient : HttpClient) { }

  private localStoragekey = environment.LOCAL_STORAGE_LOGIN_SECRET_KEY;

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }
  getToken(): string | null {
    return localStorage.getItem(this.localStoragekey);
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }
  saveLogin(loginMst:LoginMst){
    return this.httpClient.post(UrlConstants.saveloginmst, loginMst);
  }


  saveuserinfomst(usermst:UserMst){
    return this.httpClient.post(UrlConstants.saveuserinfo, usermst);
  }



  userOtpCheck(pram:Userotpcheck){
    return this.httpClient.post(UrlConstants.userotpcheck, pram);
  }

  getGlobalDataViewList(){
    return this.httpClient.get(UrlConstants.getGlobalDataViewList);
  }


  userPasswordSave(pram:UserPassInfo){
    return this.httpClient.post(UrlConstants.userpasssave, pram);
  }

  // admissionUserInfoGrid(pram:UserInfoPram){
  //   return this.httpClient.get(UrlConstants.admissionuserdata, pram);
  // }

  getAdmissionUserInfo(pram: UserInfoPram): Observable<any> {
    let params = new HttpParams();

    if (pram.ORG_CODE) {
      params = params.set('ORG_CODE', pram.ORG_CODE);
    }
    if (pram.CAMPUS_CODE) {
      params = params.set('CAMPUS_CODE', pram.CAMPUS_CODE);
    }
    if (pram.ADMISSION_ROLL) {
      params = params.set('ADMISSION_ROLL', pram.ADMISSION_ROLL);
    }
    return this.httpClient.get(UrlConstants.admissionuserdata, { params: params });
  }


  // getLeaveType(orgBranchParams:UserInfoPram): Observable<any> {
  //   let params = new HttpParams();
  //   params = params.set('ORG_ID', orgBranchParams.ORG_CODE);
  //   params = params.set('BRANCH_ID', orgBranchParams.CAMPUS_CODE);
  //   params = params.set('BRANCH_ID', orgBranchParams.ADMISSION_ROLL);
  //   return this.httpClient.get(UrlConstants.admissionuserdata, { params: params });
  // }


//   getHolidayTypeList(datapram:UserInfoPram): Observable<any> {
//     let params = new HttpParams();
//     params = params.set('ORG_CODE', datapram.ORG_CODE);
//     params = params.set('CAMPUS_CODE', datapram.CAMPUS_CODE);
//     params = params.set('ADMISSION_ROLL', datapram.ADMISSION_ROLL);
//     return this.httpClient.get(UrlConstants.admissionuserdata, { params: params });


// }



}
