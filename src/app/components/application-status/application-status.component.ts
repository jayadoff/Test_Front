import { PdfReportService } from '../../services/pdf-report.service';
import { ReportService } from '../../services/report-serivce.service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AdmissionService } from '../../services/admission.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { GlobalService } from '../../services/global.service';
import { DecodeService } from '../../services/decode.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { StudentadmissionInfoParams } from '../../models/studentadmissionform';
import { UrlConstants } from '../../enums/UrlConstants';

@Component({
  selector: 'app-application-status',
  templateUrl: './application-status.component.html',
  styleUrl: './application-status.component.scss'
})
export class ApplicationStatusComponent implements OnInit, OnDestroy{
  private destroy$: Subject<void> = new Subject<void>();
  studentadmissionInfoParams: StudentadmissionInfoParams = new StudentadmissionInfoParams();
  organizationCode = UrlConstants.orgCOde;
  organizationName = UrlConstants.orgName;
  userCode: any = UrlConstants.userCOde;
  campusCode = UrlConstants.campusCOde;
  campusName = UrlConstants.campusName;
  className = 'Hsc_Science';
  studentInfoList:any;
  userInfoList:any;
  isTopCardShow=false;
  statusBar?:number;
  paidStatus?:string;
  isLoad = true;
  
  constructor(private pdfReportService: PdfReportService,
    private rptService : ReportService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private modal: NzModalService,
    private globalService: GlobalService,
    private decodeService: DecodeService,
    private admissionService: AdmissionService,
    private router: Router,
  ){

    this.userInfoList= this.decodeService.getStudentInfo();
  }
  ngOnInit(): void {

    this.loadDataList();
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
      this.isLoad = false;
      this.studentInfoList = response;

      if(this.studentInfoList.DD.BASIC_INFO){
        this.isTopCardShow = true;
        if(this.studentInfoList.DD.BASIC_INFO.APPOVE_STATUS>1){
          this.paidStatus = 'Paid';
        }else{
          this.paidStatus = 'Unpaid';
        }
      }else{
        this.isTopCardShow = false;
        this.statusBar = -1;
      }
      this.cdr.detectChanges();

    });

}

  applicationRpt(){
    this.pdfReportService.generateStudentReport(this.studentInfoList);
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
