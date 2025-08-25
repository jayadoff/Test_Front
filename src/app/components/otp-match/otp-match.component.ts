import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login services/login.service';
import { Subject, Subscription, take, takeUntil, timer } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserMst, Userotpcheck } from '../../models/login-model/login-mst';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-otp-match',
  templateUrl: './otp-match.component.html',
  styleUrl: './otp-match.component.scss',
})
export class OtpMatchComponent {
  countDown: Subscription | undefined;
  counter = 180;
  resendcounter = this.counter;
  tick = 1000;
  v_load!: number;
  validateForm!: FormGroup;
  v_mobile?: string;
  isSaveLoading = false;
  resendbtnvisible = false;
  otpTimer = false;
  recdataparam: any;
  userInfo: any;

  datak: any = localStorage.getItem('loadstatus');
  dataparam: Userotpcheck = new Userotpcheck();
  userdataparam: UserMst = new UserMst();
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loginservice: LoginService,
    private modal: NzModalService,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef
  ) {
    this.userInfo = this.getUserInfo();
    if (this.userInfo) {
      this.v_mobile = this.userInfo.MOBILE;
    }
  }

  getUserInfo(): any {
    const retrievedEncodedData = localStorage.getItem('userinfo');
    if (retrievedEncodedData) {
      const decodedData = decodeURIComponent(retrievedEncodedData);
      return JSON.parse(decodedData);
    }
    return null;
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      otp: [null, [Validators.required]],

      remember: [true],
    });

    // this.timer()
    if (this.datak == '1') {
      this.otpTimer = true;
      this.timer();
      localStorage.setItem('loadstatus', '2');
    } else {
      this.otpTimer = false;
      this.resendbtnvisible = true;
    }
  }



  timer() {
    this.countDown = timer(0, this.tick)
      .pipe(take(this.counter))
      .subscribe(() => {
        --this.counter;
  
        if (this.counter === 0) {
          this.otpTimer = false;
          this.resendbtnvisible = true;
          this.countDown!.unsubscribe();
          this.cdr.detectChanges();
        }
  
        this.cdr.detectChanges();
      });
  
    this.cdr.detectChanges();
  }
  
  // Function to start/restart the timer
  startTimer(initialCount: number, tick: number) {
    this.counter = initialCount;
    this.tick = tick;
    this.otpTimer = true;
    this.resendbtnvisible = false;
  
    if (this.countDown) {
      this.countDown.unsubscribe();
    }
  
    this.timer();
  }








  submitForm(): void {
    if (this.validateForm.valid) {
      this.isSaveLoading = true;
      this.dataparam.MOBILE = this.v_mobile;
      this.dataparam.OTP = this.validateForm.value.otp;
      this.dataparam.ADMISSION_ROLL = this.userInfo.ADMISSION_ROLL;

      this.loginservice
        .userOtpCheck(this.dataparam)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: any) => {
          if (response.StatusCode == 1) {
            this.router.navigate(['/password']);
            this.isSaveLoading = false;
            this.validateForm.reset();
          } else {
            this.modal.error({
              nzTitle: `${this.v_mobile}`,
              nzContent: response.Message,
              nzOkDanger: true,
            });
            this.isSaveLoading = false;
          }
          this.cdr.detectChanges();
        });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }


  
  resendOtp() {
    if (this.userInfo) {
     
     
      this.resendbtnvisible = false;
      this.otpTimer = true;                     
      this.userdataparam.ORG_CODE = this.userInfo.ORG_CODE;
      this.userdataparam.CAMPUS_CODE = this.userInfo.CAMPUS_CODE;
      this.userdataparam.MOBILE = this.userInfo.MOBILE;
      this.userdataparam.ADMISSION_ROLL = this.userInfo.ADMISSION_ROLL;
      this.userdataparam.USER_NAME = this.userInfo.USER_NAME;
      this.loginservice
        .saveuserinfomst(this.userdataparam)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: any) => {
          if (response.StatusCode == 1) {
            this.resendbtnvisible = false;
            this.otpTimer = true;
            this.counter=this.resendcounter;
             this.startTimer(this.counter, this.tick);          
           
            this.message.success('OTP Successfully resend. Please check your mobile number.', {
              nzDuration: 1000,
            });
            this.isSaveLoading = false;
            this.validateForm.reset();
            this.cdr.detectChanges();
          } else {
            this.modal.error({
              nzTitle: `${this.userdataparam.MOBILE}`,
              nzContent: response.Message,
              nzOkDanger: true,
            });
            this.isSaveLoading = false;
          }
          this.cdr.detectChanges();
        });

    }
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

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return (
      ('00' + minutes).slice(-2) +
      ':' +
      ('00' + Math.floor(value - minutes * 60)).slice(-2)
    );
  }
}
