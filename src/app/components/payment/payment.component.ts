import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';
import { GlobalService } from '../../services/global.service';
import { DecodeService } from '../../services/decode.service';
import { PaymentService } from '../../services/payment.service';
import { StudentadmissionInfoParams } from '../../models/studentadmissionform';
import { UrlConstants } from '../../enums/UrlConstants';
import { AdmissionService } from '../../services/admission.service';
import { PaymentRequestData } from '../../models/payment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']   // ✅ ঠিক করা
})

export class PaymentComponent implements OnInit, OnDestroy{
  private destroy$: Subject<void> = new Subject<void>();
    studentadmissionInfoParams: StudentadmissionInfoParams = new StudentadmissionInfoParams();
    organizationCode = UrlConstants.orgCOde;
    organizationName = UrlConstants.orgName;
    userCode: any = UrlConstants.userCOde;
    campusCode = UrlConstants.campusCOde;
    campusName = UrlConstants.campusName;
paymentForm!: FormGroup;
  userInfoList:any;
  studentInfoList:any;


paymentData!: PaymentRequestData;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private modal: NzModalService,
    private paymentService: PaymentService,
    private decodeService: DecodeService,
    private router: Router,
     private admissionService: AdmissionService,
  ){

  this.userInfoList= this.decodeService.getStudentInfo();
   this.paymentForm = this.fb.group({
      PAY_AMOUNT: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {

   this. loadDataList()
  }


  loadDataList() {
    this.studentInfoList = [];
  this.studentadmissionInfoParams.ORG_CODE = this.organizationCode;
  this.studentadmissionInfoParams.CAMPUS_CODE = this.campusCode;
  this.studentadmissionInfoParams.ADMISSION_ROLL =  this.userInfoList[0].ADMISSION_ROLL;
  this.admissionService
    .getStudentAdmissiondata(this.studentadmissionInfoParams)
    .pipe(takeUntil(this.destroy$))
    .subscribe((response:any) => {
      this.studentInfoList = response;
     console.log('this.studentInfoList',this.studentInfoList.DD.BASIC_INFO.STUDENT_CODE);
     
      this.cdr.detectChanges();

    });

}

  onPayNow() {
    if (this.paymentForm.valid) {
      const jsonData = {
      "OrgCode": this.organizationCode,
      "CampusCode": this.campusCode,
      "StudentCode": this.studentInfoList.DD.BASIC_INFO.STUDENT_CODE,
      "InvoiceNo": "INV-2025-0001",
      "InvoiceDate": "2025-08-11",
      "RequestTotalAmount": this.paymentForm.get('PAY_AMOUNT')?.value,
      "CustomerName":  this.studentInfoList.DD.BASIC_INFO.STUDENT_NAME,
      "CustomerContactNo":  this.studentInfoList.DD.BASIC_INFO.SMS_MOBILE_NUM,
      "CustomerAddress":  this.studentInfoList.DD.BASIC_INFO.PRESENT_ADDR,
      "Email": '',
      "ResponseUrl": "http://103.123.9.151:3033/api/payment/response",
      "AllowDuplicateInvoiceNoDate": "N",
      "CreditInformations": [
        {
          "SerialNo": 1,
          "CrAccountOrChallanNo": "0002601020864",
          "CrAmount": this.paymentForm.get('PAY_AMOUNT')?.value,
          "TranMode": "TRN",
          "Onbehalf": this.studentInfoList.DD.BASIC_INFO.STUDENT_NAME,
        }
      ]
    };

    this.paymentData = new PaymentRequestData(jsonData);
      const amount = this.paymentForm.get('PAY_AMOUNT')?.value;
      console.log('this.paymentData',this.paymentData);
      
      this.paymentService.payment(this.paymentData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response:any) => {
        if(response.db_res.Status == 1){
          if(response.sp_res.Status =='200'){
            const redirectUrl = response.sp_res.RedirectToGateway;
        // if (redirectUrl) {
        //   // window.location.href = redirectUrl;
        //    Browser.open({ url: redirectUrl,windowName: '_blank' });
        // }
         if (redirectUrl) {
          // Web এ redirect
          window.location.href = redirectUrl;
        }
        }
        }        
      });
     } else{
      Object.values(this.paymentForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
     
    }
    }

numberOnly(e: any) {
  var regex = new RegExp('^[0-9,.]');
  var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (regex.test(str)) {
    return true;
  }
  e.preventDefault();
  return false;
}





    ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
