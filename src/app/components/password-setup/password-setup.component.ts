import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoginService } from '../../services/login services/login.service';
import { UserPassInfo } from '../../models/login-model/login-mst';
import { Subject, takeUntil } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-setup',
  templateUrl: './password-setup.component.html',
  styleUrl: './password-setup.component.scss'
})
export class PasswordSetupComponent {


  passwordVisible = false;
  conpasswordVisible = false;
  password?: string;
  conpassword?: string;

  userInfo:any

  isSaveLoading = false;

  dataparam: UserPassInfo = new UserPassInfo();
  private destroy$: Subject<void> = new Subject<void>();
  validateForm!: FormGroup;
  constructor(private fb: FormBuilder,
    private message: NzMessageService,
    private loginservice :LoginService,
    private modal:NzModalService,
    private router: Router,
    private cdr:ChangeDetectorRef,
  ) {


    this.userInfo = this.getUserInfo();
  }





  getUserInfo(): any {
    const retrievedEncodedData = localStorage.getItem('userinfo');
    if (retrievedEncodedData) {
      const decodedData = decodeURIComponent(retrievedEncodedData);
      return JSON.parse (decodedData);
    }
    return null;
  }






  submitForm(): void {



let pass=this.validateForm.value.password;
let conpass=this.validateForm.value.conpassword;
if(pass==conpass){
this.isSaveLoading = true;
  this.dataparam.ORG_CODE= this.userInfo.ORG_CODE
  this.dataparam.CAMPUS_CODE= this.userInfo.CAMPUS_CODE
  this.dataparam.ADMISSION_ROLL=this.userInfo.ADMISSION_ROLL
  this.dataparam.PASSWORD=this.validateForm.value.conpassword;


  this.loginservice.userPasswordSave(this.dataparam)
  .pipe(takeUntil(this.destroy$))
  .subscribe((response:any) => {
    if(response.StatusCode == 1){
      const encodedData = encodeURIComponent(JSON.stringify(this.dataparam));
      localStorage.setItem('logininfo', encodedData);
      this.router.navigate(['/login']);
      this.validateForm.reset();
      this.isSaveLoading = false;
      this.cdr.detectChanges();


    }else{
      this.modal.error({
        nzContent: response.Message,
        nzOkDanger: true,
      });
    }
    this.isSaveLoading = false;
    this.cdr.detectChanges();
  });




}else{

  this.message.warning('Not Match Password And Confirmpassword', {
    nzDuration: 3000
  });

}

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }



  ngOnInit(): void {
    this.validateForm = this.fb.group({
      password: [null, [Validators.required]],
      conpassword: [null, [Validators.required]],

      remember: [true]
    });
  }


}
