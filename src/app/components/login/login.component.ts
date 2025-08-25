import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login services/login.service';
import { LoginMst, UserInfoPram } from '../../models/login-model/login-mst';
import { Subject, takeUntil } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StudentadmissionInfoParams } from '../../models/studentadmissionform';
import { AdmissionService } from '../../services/admission.service';
import { UrlConstants } from '../../enums/UrlConstants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  validateForm!: FormGroup;
  isSaveLoading = false;
  passwordVisible = false;
  password?: string='';
  loginInfo:any;
addroll:string ='';
userpassword:string ='';
globalDataList: any = [];
userinfolist: any = [];
bloodGroupList: any = [];

religionList: any[] = [];
occupationList: any[] = [];
genderList: any[] = [];
nationalityList: any[] = [];
divisionList: any[] = [];
districtList: any[] = [];
 organizationCode = UrlConstants.orgCOde;
  organizationName = UrlConstants.orgName;
  userCode: any = UrlConstants.userCOde;
  campusCode = UrlConstants.campusCOde;
  campusName = UrlConstants.campusName;
private localStoragekey = environment.LOCAL_STORAGE_LOGIN_SECRET_KEY;
  dataparam: LoginMst = new LoginMst();
  userinfopram: UserInfoPram = new UserInfoPram();
  private destroy$: Subject<void> = new Subject<void>();
  studentadmissionInfoParams: StudentadmissionInfoParams = new StudentadmissionInfoParams();
  studentInfodataList:any=[];
  constructor(private fb: FormBuilder,
    private loginservice :LoginService,
    private modal:NzModalService,
    private router: Router,
    private admissionService: AdmissionService,
    private cdr:ChangeDetectorRef,

  ) {

    this.loginInfo = this.getUserInfo();
    if( this.loginInfo != null){
      this.addroll=this.loginInfo.ADMISSION_ROLL;
       this.userpassword =this.loginInfo.PASSWORD;
    }
    this.password=this.userpassword;
    this.validateForm = this.fb.group({
      admissionroll: [this.addroll, [Validators.required]],
      password: ['', [Validators.required]],

    });
  }

  ngOnInit(): void {
  this.loadGlobalDataList();
  }


  getUserInfo(): any {
    const retrievedEncodedData = localStorage.getItem('logininfo');
    if (retrievedEncodedData) {
      const decodedData = decodeURIComponent(retrievedEncodedData);
      return JSON.parse (decodedData);
    }
    return null;
  }

  loadGlobalDataList() {
    this.loginservice.getGlobalDataViewList().subscribe((response: any) => {
      this.globalDataList = response.ResponseObj;
      this.bloodGroupList = this.filterByType('BLOOD');
      this.religionList = this.filterByType('RELIGION');
      this.occupationList = this.filterByType('OCCUPATION');
      this.genderList = this.filterByType('GENDER');
      this.nationalityList = this.filterByType('NATIONALITY');
      this.divisionList = this.filterByType('DIVISON');
      this.districtList = this.filterByType('DISTRICT');
      const bloodencodedData = encodeURIComponent(JSON.stringify(this.bloodGroupList));
      localStorage.setItem('bloodGroupList',bloodencodedData);

      const nationalencodedData = encodeURIComponent(JSON.stringify(this.nationalityList));
      localStorage.setItem('nationalityList',nationalencodedData);

      const religionencodedData = encodeURIComponent(JSON.stringify(this.religionList));
      localStorage.setItem('religionList',religionencodedData);

      const occupationencodedData = encodeURIComponent(JSON.stringify(this.occupationList));
      localStorage.setItem('occupationList',occupationencodedData);

      const gendernencodedData = encodeURIComponent(JSON.stringify(this.genderList));
      localStorage.setItem('genderList',gendernencodedData);

      const divisionencodedData = encodeURIComponent(JSON.stringify(this.divisionList));
      localStorage.setItem('divisionList',divisionencodedData);

      const districtencodedData = encodeURIComponent(JSON.stringify(this.districtList));
      localStorage.setItem('districtList',districtencodedData);

      this.cdr.detectChanges();
    });
  }
  filterByType(type: string): any[] {
    return this.globalDataList.filter((item: any) => item.TYPE === type);
  }




  submitForm(): void {
   if(this.validateForm.valid){
    this.isSaveLoading = true;

      this.dataparam.ORG_CODE=this.organizationCode;
      this.dataparam.CAMPUS_CODE=this.campusCode;
      this.dataparam.ADMISSION_ROLL=this.validateForm.value.admissionroll;
      this.dataparam.PASSWORD=this.validateForm.value.password;

    this.loginservice.saveLogin(this.dataparam)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response:any) => {
      if(response.StatusCode == 1){
           this.userinfopram.ORG_CODE=this.dataparam.ORG_CODE;
          this.userinfopram.CAMPUS_CODE=this.dataparam.CAMPUS_CODE;
        this.userinfopram.ADMISSION_ROLL=this.dataparam.ADMISSION_ROLL;
        this.loginservice.getAdmissionUserInfo(this.userinfopram)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: any) => {
          this.userinfolist = response.ResponseObj;
          const userinfolistcodedData = encodeURIComponent(JSON.stringify(this.userinfolist));
          localStorage.setItem(this.localStoragekey, userinfolistcodedData);
          this.loadDataGridList();

          // this.cdr.detectChanges();
        });

      }else{
        this.modal.error({
          nzTitle: 'Login Error!',
          nzContent: response.Message,
          nzOkDanger: true,
        });
        this.isSaveLoading = false;
      }
      this.cdr.detectChanges();
    });

   }else{
    Object.values(this.validateForm.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }




  }


  loadDataGridList() {
    this.studentInfodataList = [];
  this.studentadmissionInfoParams.ORG_CODE = this.userinfopram.ORG_CODE;
  this.studentadmissionInfoParams.CAMPUS_CODE = this.userinfopram.CAMPUS_CODE;
  this.studentadmissionInfoParams.ADMISSION_ROLL =  this.validateForm.value.admissionroll;
  this.admissionService
    .getStudentAdmissiondata(this.studentadmissionInfoParams)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data:any) => {
      this.studentInfodataList = data;
      localStorage.setItem('studentInfoList', JSON.stringify(this.studentInfodataList));
      this.router.navigate(['/dashboard']);
      this.isSaveLoading = false;
      this.validateForm.reset();
      this.cdr.detectChanges();
    });

  }

  // getadmissionUserInfoGrid(data:any) {

  //   this.userinfopram.ORG_CODE=data.ORG_CODE;
  //   this.userinfopram.CAMPUS_CODE=data.CAMPUS_CODE;
  //   this.userinfopram.ADMISSION_ROLL=data.ADMISSION_ROLL;
  //   this.loginservice.getAdmissionUserInfo(this.userinfopram)
  //   .pipe(takeUntil(this.destroy$))
  //   .subscribe((response: any) => {
  //     this.userinfolist = response.ResponseObj;
  //     // const userinfolistcodedData = encodeURIComponent(JSON.stringify(this.userinfolist));
  //     // localStorage.setItem(this.localStoragekey,userinfolistcodedData);
  //    this.cdr.detectChanges();
  //   });
  // }



  numberOnly(e: any) {
    var regex = new RegExp('^[0-9.]+$');
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
      return true;
    }
    e.preventDefault();
    return false;
  }




}
