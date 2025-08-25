import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserMst } from '../../models/login-model/login-mst';
import { LoginService } from '../../services/login services/login.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';
import { UrlConstants } from '../../enums/UrlConstants';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {

 organizationCode = UrlConstants.orgCOde;
  organizationName = UrlConstants.orgName;
  userCode: any = UrlConstants.userCOde;
  campusCode = UrlConstants.campusCOde;
  campusName = UrlConstants.campusName;

  private destroy$: Subject<void> = new Subject<void>();
  dataparam: UserMst = new UserMst();
  isSaveLoading = false;
  validateForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router,
    private loginservice :LoginService,
    private modal:NzModalService,
    private cdr:ChangeDetectorRef,
  ) {






  }







  submitForm(): void {
    if(this.validateForm.valid){
      this.isSaveLoading = true;
 this.dataparam.ORG_CODE=this.organizationCode;
 this.dataparam.CAMPUS_CODE=this.campusCode;
 this.dataparam.ADMISSION_ROLL=this.validateForm.value.admissionRoll;
 this.dataparam.MOBILE=this.validateForm.value.mobile;
 this.dataparam.USER_NAME=this.validateForm.value.userName;
     this.loginservice.saveuserinfomst(this.dataparam)
     .pipe(takeUntil(this.destroy$))
     .subscribe((response:any) => {
       if(response.StatusCode == 1){
        //  this.modal.success({
        //    nzTitle: `${this.dataparam.MOBILE}`,
        //    nzContent: response.Message,
        //    nzOkDanger: true,
        //  });
         const encodedData = encodeURIComponent(JSON.stringify(this.dataparam));
         this.router.navigate(['/otp'],
       //   { queryParams: { data: encodedData } }
       );
        localStorage.setItem('loadstatus', '1');
        localStorage.setItem('userinfo', encodedData);
         this.isSaveLoading = false;
        // this.validateForm.reset();


       }else{
         this.modal.error({
           nzTitle:'Duplicate!',
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



  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      admissionRoll: [null, [Validators.required]],
      mobile: [null, [Validators.required]],
      remember: [true]
    });
  }




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
