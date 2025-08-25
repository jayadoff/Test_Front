import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';
import { GlobalService } from '../../services/global.service';
import { DecodeService } from '../../services/decode.service';
import { Studentadmissionform, StudentadmissionInfoParams } from '../../models/studentadmissionform';
import { AdmissionService } from '../../services/admission.service';
import { environment } from '../../../environments/environment';
import { PdfReportService } from '../../services/pdf-report.service';
import { UrlConstants } from '../../enums/UrlConstants';
// import { parse, format } from 'date-fns';

interface Subjects {
  SUBJECT_CODE: string;
  SUBJECT_NAME: string;
}
interface SubjectInfo {
  SUBJECT_CODE: string;
  // Add other properties as needed
}
@Component({
  selector: 'app-online-add-form',
  templateUrl: './online-add-form.component.html',
  styleUrl: './online-add-form.component.scss',
  providers :[
    DatePipe
  ]
})
export class OnlineAddFormComponent implements OnInit, OnDestroy {
    @ViewChild('payNowTemplate', { static: true }) payNowTemplate!: TemplateRef<any>;
      modalRef?: NzModalRef;
  organizationCode = UrlConstants.orgCOde;
  organizationName = UrlConstants.orgName;
  userCode: any = UrlConstants.userCOde;
  campusCode = UrlConstants.campusCOde;
  campusName = UrlConstants.campusName;
   className='HSC';
  checkBoxDisable = true;
  private destroy$: Subject<void> = new Subject<void>();
  validateForm: FormGroup;
  isSaveLoading=false;



  bloodGroupList: any;
  nationalityList: any;
  divisionList: any;
  religionList: any;
  genderList: any;
  boardUniList: any;
  occupationList: any;
  relationTypeList: any;
  addressInfoList: any;
  districtList: any;
  studentInfoList: any;
  // studentInfodataList:any = [];
  studentadmissionform: Studentadmissionform = new Studentadmissionform();
  studentadmissionInfoParams: StudentadmissionInfoParams = new StudentadmissionInfoParams();
  subList:any;
  studentInfo:any;
  selectedImage: string | ArrayBuffer | null = null;
  selectedAdmissionType: string | null = null; 
 // selectedImage: string | null = null;
  fileSizeError: string | null = null;
  maxSizeInBytes = 500 * 1024; // 500 KB in bytes
  isLoad=true;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
@ViewChild('form', { static: false }) form!: ElementRef;

//selectedImage: string | null = null;
logoText = 'Passport size';
loading = false;
studentInfodataList: any = {
  DD: {
    BASIC_INFO: {},
    SUBJECT_INFO: [],
    EDUCATION_INFO: []
  }
};



groupList = [
  { nzValue: '00000196', nzLabel: 'Science' },
  { nzValue: '00000198', nzLabel: 'Arts' },
  { nzValue: '00000197', nzLabel: 'Business studies' }
];


  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private modal: NzModalService,
    private datePipe: DatePipe,
    private globalService: GlobalService,
    private decodeService: DecodeService,
    private admissionService: AdmissionService,
    private pdfReportService: PdfReportService,
    private router: Router,
  ){
    this.validateForm = this.fb.group({
      STUDENT_NAME: [null, Validators.required],
      NATIONALITY_NAME: [null, Validators.required],
      GROUP_NAME: [null,Validators.required],
      DATE_OF_BIRTH:[new Date(),Validators.required],
      BIRTH_REG_NUM:[null,Validators.required],
      SMS_MOBILE_NUM: [null, Validators.required],
      GENDER_CODE: [null, Validators.required],
      MARRIED_STATUS: [null, Validators.required],
      BLOOD_GROUP_CODE: [null, Validators.required],
      RELIGION_CODE: [null, Validators.required],
      ADMISSION_DATE:[new Date(),Validators.required],
      FATHERS_NAME: [null, Validators.required],
      FATHERS_OCCUPATION: [null,Validators.required],
      FATHERS_CONTACT_NO: [null, Validators.required],
      MOTHERS_NAME: [null, Validators.required],
      MOTHERS_OCCUPATION: [null,Validators.required],
      MOTHERS_CONTACT_NO: [null,Validators.required],
      PARENTS_INCOME:[null,Validators.required],

      DISTRICT_NAME: [null,Validators.required],
      PRESENT_ADDRESS:[null,Validators.required],
      PARMANENT_ADDRESS:[null,Validators.required],
      FATHERS_NID:[null],
      MOTHERS_NID:[null],

      INS_NAME:[null,],
      PASSING_YEAR:[null,],
      BOARD_NAME:[null,],
      ROLL_NUMBER:[null,],
      REG_NO:[null,],
      RESULT:[null,],

      INS_NAME_1:[null],
      PASSING_YEAR_1:[null],
      BOARD_NAME_1:[null],
      ROLL_NUMBER_1:[null],
      REG_NO_1:[null],
      RESULT_1:[null],
     COMPULSORY_1:[null,Validators.required],
      COMPULSORY_2:[null,Validators.required],
      COMPULSORY_3:[null,Validators.required],
      OPTIONAL:[null,Validators.required],
      checkBox:[true],
      IS_CHECK:[false],
      GUARDIAN_NAME: [null,Validators.required],
      GUARDIAN_NUMBER: [null,Validators.required],
      GUARDIAN_ADDRESS:[null,Validators.required],
    
      

    });
    this.studentInfo= this.decodeService.getStudentInfo();




  }
  ngOnInit(): void {





    this.bloodGroupList= this.decodeService.getBloodGroupList();
    this.districtList= this.decodeService.getDistrictList();
    this.occupationList= this.decodeService.getOccupationList();
    this.genderList= this.decodeService.getGenderList();
    this.nationalityList= this.decodeService.getNationalityList();
    this.religionList= this.decodeService.getReligionList();
    this.divisionList= this.decodeService.getDivisionList();


  this.validateForm.controls['STUDENT_NAME'].setValue(this.studentInfo[0].USER_NAME);
  this.validateForm.controls['SMS_MOBILE_NUM'].setValue(this.studentInfo[0].MOBILE_NO);
  
  const stdData = localStorage.getItem('studentInfoList');
  console.log(localStorage.getItem('studentInfoList'));
  
    if(stdData){
      this.studentInfodataList = JSON.parse(stdData);
      
       this.loadDataGridList(this.studentInfodataList);
    }
}





onModelChange(key: string, value: any): void {


  const keys = key.split('.');
  let currentLevel = this.studentInfodataList;

  keys.forEach((k, i) => {
    if (i === keys.length - 1) {
      currentLevel[k] = value;
    } else {
      if (!currentLevel[k]) {
        currentLevel[k] = {};
      }
      currentLevel = currentLevel[k];
    }
  });

  localStorage.setItem('studentInfoList', JSON.stringify(this.studentInfodataList));

let data =this.validateForm.value.GROUP_NAME;


  if (value === '00000196' || value === '00000197' || value === '00000198') {
 
    this.getSubList(data);
 }

  
this.cdr.detectChanges();
 
}





updateSubjectInfo(index: number, subjectCode: string, isComp: string): void {
  const subjectName = this.subList.find((item: any) => item.SUBJECT_CODE === subjectCode)?.SUBJECT_NAME || '';

  if (!this.studentInfodataList.DD.SUBJECT_INFO) {
    this.studentInfodataList.DD.SUBJECT_INFO = [];
  }
  if (this.studentInfodataList.DD.SUBJECT_INFO.length <= index) {
    this.studentInfodataList.DD.SUBJECT_INFO.push({ SUBJECT_CODE: '', IS_COMP: '', SUBJECT_NAME: '' });
  }
  this.studentInfodataList.DD.SUBJECT_INFO[index] = {
    SUBJECT_CODE: subjectCode,
    IS_COMP: isComp,
    SUBJECT_NAME: subjectName
  };
  localStorage.setItem('studentInfoList', JSON.stringify(this.studentInfodataList));
  this.cdr.detectChanges();
}



loadDataGridList(studentInfodataList: any) {
  const basicInfo = studentInfodataList?.DD?.BASIC_INFO;
  console.log('basicInfo',basicInfo);
  
  const educationinfo = studentInfodataList?.DD?.EDUCATION_INFO;
  const subjectinfo: SubjectInfo[] = studentInfodataList?.DD?.SUBJECT_INFO || [];

  // Ensure subjectinfo is an array and filter out any null or undefined items
  const subjectInfoList = subjectinfo
    .filter(item => item && item.SUBJECT_CODE)
    .sort((a: SubjectInfo, b: SubjectInfo) => a.SUBJECT_CODE.localeCompare(b.SUBJECT_CODE));

  this.dataLoad(basicInfo, educationinfo, subjectInfoList);
  // this.cdr.detectChanges();
}




updateEducationInfo(index: number, key: string, value: string): void {

  // Check if EDUCATION_INFO is null or undefined, and initialize it if necessary
  if (!this.studentInfodataList.DD.EDUCATION_INFO) {
    this.studentInfodataList.DD.EDUCATION_INFO = [];
  }

 
  if (this.studentInfodataList.DD.EDUCATION_INFO.length <= index) {
    // Check the selectedAdmissionType to decide between JSC or HSC
    const examName = this.selectedAdmissionType === '1' 
      ? (index === 0 ? 'SSC' : 'JSC') // If '1', set "SSC" and "JSC"
      : (index === 0 ? 'SSC' : 'HSC'); // If '2', set "SSC" and "HSC"
  
    // Push new education info with the selected exam name
    this.studentInfodataList.DD.EDUCATION_INFO.push({
      EXAM_NAME: examName,
      INSTITUTE: '',
      PASSING_YEAR: '',
      BOARD: '',
      ROLL_NO: '',
      REG_NO: '',
      RESULT: ''
    });
  }
  
  this.studentInfodataList.DD.EDUCATION_INFO[index][key] = value;
  localStorage.setItem('studentInfoList', JSON.stringify(this.studentInfodataList));
}


base64ToFile(base64String: any, filename: string) {
  const [metadata, data] = base64String.split(',');
  const binary = atob(data);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
  }
  const uint8Array = new Uint8Array(array);
  const blob = new Blob([uint8Array], { type: 'image/png' });
  const file = new File([blob], filename, { type: 'image/png' });
  return file;
}



dataLoad(basicInfo:any,educationinfo:any,subjectinfo:any){

  if (basicInfo?.ImageByte) {
    let imgdata = `data:image/png;base64,${basicInfo.ImageByte}`;
    this.selectedImage = imgdata;
    const filename = 'image.png';
    const imageFile = this.base64ToFile(imgdata, filename);
    this.studentadmissionform.STUDENT_IMAGE = imageFile;
  }
  if(basicInfo){


this.validateForm.controls['NATIONALITY_NAME'].setValue(basicInfo.NATIONALITY_CODE);
this.validateForm.controls['GROUP_NAME'].setValue(basicInfo.GROUP_CODE);
if(this.validateForm.value.GROUP_NAME){
  
  this.getExistingSubList(this.validateForm.value.GROUP_NAME);
  this.cdr.detectChanges();
}
this.validateForm.controls['GENDER_CODE'].setValue(basicInfo.GENDER_CODE);






this.validateForm.controls['DATE_OF_BIRTH'].setValue(new Date());
this.validateForm.controls['BIRTH_REG_NUM'].setValue(basicInfo.BIRTH_REG_NUM);
this.validateForm.controls['ADMISSION_DATE'].setValue(new Date());
//this.validateForm.controls['ADMISSION_DATE'].setValue(basicInfo.ADMISSION_DATE);
this.validateForm.controls['MARRIED_STATUS'].setValue(basicInfo.MARITAL_STATUS);
this.validateForm.controls['BLOOD_GROUP_CODE'].setValue(basicInfo.BLOOD_GROUP_CODE);
this.validateForm.controls['RELIGION_CODE'].setValue(basicInfo.RELIGION_CODE);
this.validateForm.controls['DISTRICT_NAME'].setValue(basicInfo.BIRTH_PLACE_CODE);
this.validateForm.controls['PRESENT_ADDRESS'].setValue(basicInfo.PRESENT_ADDR);
this.validateForm.controls['PARMANENT_ADDRESS'].setValue(basicInfo.PERMANENT_ADDR);

this.validateForm.controls['FATHERS_NID'].setValue(basicInfo.FATHERS_NID);
this.validateForm.controls['MOTHERS_NID'].setValue(basicInfo.MOTHERS_NID);

this.validateForm.controls['FATHERS_NAME'].setValue(basicInfo.FATHERS_NAME);
this.validateForm.controls['FATHERS_OCCUPATION'].setValue(basicInfo.FATHER_OCCUPATION);

this.validateForm.controls['FATHERS_CONTACT_NO'].setValue(basicInfo.FATHER_CONTACT_NO);
this.validateForm.controls['MOTHERS_NAME'].setValue(basicInfo.MOTHERS_NAME);
this.validateForm.controls['MOTHERS_CONTACT_NO'].setValue(basicInfo.MOTHER_CONTACT_NO);
this.validateForm.controls['MOTHERS_OCCUPATION'].setValue(basicInfo.MOTHER_OCCUPATION);
this.validateForm.controls['PARENTS_INCOME'].setValue(basicInfo.PARENTS_MON_INCOME);
this.validateForm.controls['GUARDIAN_NAME'].setValue(basicInfo.GUARDIAN_NAME);
this.validateForm.controls['GUARDIAN_NUMBER'].setValue(basicInfo.GUARDIAN_NUMBER);
this.validateForm.controls['GUARDIAN_ADDRESS'].setValue(basicInfo.GUARDIAN_ADDRESS);
  }

if(educationinfo){
this.validateForm.controls['INS_NAME'].setValue(educationinfo[0].INSTITUTE);
this.validateForm.controls['PASSING_YEAR'].setValue(educationinfo[0].PASSING_YEAR);
this.validateForm.controls['BOARD_NAME'].setValue(educationinfo[0].BOARD);
this.validateForm.controls['ROLL_NUMBER'].setValue(educationinfo[0].ROLL_NO);
this.validateForm.controls['REG_NO'].setValue(educationinfo[0].REG_NO);
this.validateForm.controls['RESULT'].setValue(educationinfo[0].RESULT);
if(educationinfo.length>1){
  this.validateForm.controls['INS_NAME_1'].setValue(educationinfo[1].INSTITUTE);
  this.validateForm.controls['PASSING_YEAR_1'].setValue(educationinfo[1].PASSING_YEAR);
  this.validateForm.controls['BOARD_NAME_1'].setValue(educationinfo[1].BOARD);
  this.validateForm.controls['ROLL_NUMBER_1'].setValue(educationinfo[1].ROLL_NO);
  this.validateForm.controls['REG_NO_1'].setValue(educationinfo[1].REG_NO);
  this.validateForm.controls['RESULT_1'].setValue(educationinfo[1].RESULT);
}
}


// this.subList = subjectinfo;
// const optionalSubject = this.subList.find((subject: any) => subject.IS_COMP === 'N');

this.subList = subjectinfo || [];

const optionalSubject = this.subList.length > 0 ? this.subList.find((subject: any) => subject.IS_COMP === 'N') : null;

if (optionalSubject) {
  this.validateForm.controls['OPTIONAL'].setValue(optionalSubject.SUBJECT_CODE);
}


const compulsorySubjects = this.subList.filter((subject: any) => subject.IS_COMP === 'Y');
const compulsorySubjectCodes = compulsorySubjects
  .map((subject: any) => subject.SUBJECT_CODE); // Convert to numbers for comparison

this.validateForm.controls['COMPULSORY_1'].setValue(compulsorySubjectCodes[3] || '');
this.validateForm.controls['COMPULSORY_2'].setValue(compulsorySubjectCodes[4] || ''); // Changed to 1
this.validateForm.controls['COMPULSORY_3'].setValue(compulsorySubjectCodes[5] || '');
this.cdr.detectChanges();

}

handleChange(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files[0]) {
    const file = input.files[0];
    if (file.size > this.maxSizeInBytes) {
      this.fileSizeError = 'The selected file exceeds the 500 KB size limit.';
      this.selectedImage = null;
    } else {
      this.fileSizeError = null;
      this.studentadmissionform.STUDENT_IMAGE = file;

      const reader = new FileReader();
      reader.onload = () => {
        let base64String = reader.result as string;
        base64String = base64String.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        this.selectedImage = `data:image/png;base64,${base64String}`;
        this.onModelChange('DD.BASIC_INFO.ImageByte',base64String);
        localStorage.setItem('studentImage', base64String);
        localStorage.setItem('studentImageName', file.name);
        localStorage.setItem('studentImageType', file.type);
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }
}

openFileInput(): void {
  this.fileInput.nativeElement.click();
}

  checkPresentAddress(value:any){
    if (value === null || value === '') {
      this.validateForm.patchValue({
        IS_CHECK: false
      });
      this.checkBoxDisable = true;
      this.validateForm.controls['PARMANENT_ADDRESS'].setValue(null);
      this.cdr.detectChanges();
    }else{
      this.checkBoxDisable = false;
      if(this.validateForm.controls['IS_CHECK'].value === true){
        this.validateForm.patchValue({
          PARMANENT_ADDRESS: this.validateForm.value.PRESENT_ADDRESS
        });
      }
      this.cdr.detectChanges();
    }
  }
  updateAddress(value: any){
    if(value.target.checked){
      this.validateForm.patchValue({
        PARMANENT_ADDRESS: this.validateForm.value.PRESENT_ADDRESS
      });
      this.cdr.detectChanges();
    }else{
      this.validateForm.controls['PARMANENT_ADDRESS'].setValue('House No/Village: , Post Office: , Post Code:');
      this.cdr.detectChanges();
    }
  }



  getSubList(value:any){
    console.log('value',value)
     if (value === '00000196' || value === '00000197' || value === '00000198') {
 
  


    
    this.validateForm.controls['COMPULSORY_1'].reset();
    this.validateForm.controls['COMPULSORY_2'].reset();
    this.validateForm.controls['COMPULSORY_3'].reset();
    this.validateForm.controls['OPTIONAL'].reset();
    if(value){
      this.subList = [];
      this.globalService.getGroupSubList(this.organizationCode,this.campusCode,value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response:any) => {
        this.subList = response.ResponseObj;
        console.log(' this.subList', this.subList);
        
       this.cdr.detectChanges();

      })
    }
    this.cdr.detectChanges();
     }

  }


  getExistingSubList(value:any){
    
    this.validateForm.controls['OPTIONAL'].reset();
    if(value){
      this.subList = [];
      this.globalService.getGroupSubList(this.organizationCode,this.campusCode,value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response:any) => {
        this.subList = response.ResponseObj;
        
       this.cdr.detectChanges();

      })
    }

  }

  checkCom1(value:any){
    if(value){
      let com2 = this.validateForm.value.COMPULSORY_2;
      let com3 = this.validateForm.value.COMPULSORY_3;
      let com4 = this.validateForm.value.OPTIONAL;
      if(value == com2 || value == com3 || value == com4){
        this.modal.error({
          nzTitle: `Warning`,
          nzContent: 'This subject already selected.Please select another subject.',
          nzOkDanger: true,
        });
        this.validateForm.controls['COMPULSORY_1'].setValue(null);
        this.cdr.detectChanges();
      }
      this.updateSubjectInfo(3, value, 'Y');
    }
  }

  checkCom2(value:any){
    if(value){
      let com1 = this.validateForm.value.COMPULSORY_1;
      let com3 = this.validateForm.value.COMPULSORY_3;
      let com4 = this.validateForm.value.OPTIONAL;
      if(value == com1 || value == com3 || value == com4){
        this.modal.error({
          nzTitle: `Warning`,
          nzContent: 'This subject already selected.Please select another subject.',
          nzOkDanger: true,
        });
        this.validateForm.controls['COMPULSORY_2'].setValue(null);
        this.cdr.detectChanges();
      }
      this.updateSubjectInfo(4, value, 'Y');
    }
  }

  checkCom3(value:any){
    if(value){
      let com2 = this.validateForm.value.COMPULSORY_2;
      let com1 = this.validateForm.value.COMPULSORY_1;
      let com4 = this.validateForm.value.OPTIONAL;
      if(value == com2 || value == com1 || value == com4){
        this.modal.error({
          nzTitle: `Warning`,
          nzContent: 'This subject already selected.Please select another subject.',
          nzOkDanger: true,
        });
        this.validateForm.controls['COMPULSORY_3'].setValue(null);
        this.cdr.detectChanges();
      }
      this.updateSubjectInfo(5, value, 'Y');
    }
  }

  checkOptional(value:any){
   
    if(value){
      let com2 = this.validateForm.value.COMPULSORY_2;
      let com3 = this.validateForm.value.COMPULSORY_3;
      let com1 = this.validateForm.value.COMPULSORY_1;
      if(value == com2 || value == com3 || value == com1){
        this.modal.error({
          nzTitle: `Warning`,
          nzContent: 'This subject already selected.Please select another subject.',
          nzOkDanger: true,
        });
        this.validateForm.controls['OPTIONAL'].setValue(null);
        this.cdr.detectChanges();
      }
      this.updateSubjectInfo(6, value, 'N');
    }
  }


SaveStudentForm() {
 
   if(this.validateForm.valid){
  if (this.studentadmissionform.STUDENT_IMAGE) {
      this.modal.confirm({
        nzTitle: `Confirmation`,
        nzContent: `<b style="color: red;">Are you sure you want to save ${this.validateForm.controls["STUDENT_NAME"].value}?</b>`,
        nzOkText: 'Yes',
        nzOkType: 'primary',
        nzOkDanger: true,
        nzOnOk: () => {
              this.retrieveImage();
              
              
              this.studentadmissionform.ORG_CODE = this.organizationCode;
              this.studentadmissionform.ORG_NAME = this.organizationName;
              this.studentadmissionform.CAMPUS_NAME = this.campusName;
               this.studentadmissionform.CAMPUS_CODE = this.campusCode;
               this.studentadmissionform.CLASS_NAME = this.className;             
               this.studentadmissionform.ADMISSION_TYPE =  '1';
               this.studentadmissionform.GENDER_CODE =  this.validateForm.controls["GENDER_CODE"].value;
               this.studentadmissionform.GROUP_CODE =  this.validateForm.controls["GROUP_NAME"].value;
               this.studentadmissionform.STUDENT_NAME =  this.validateForm.controls["STUDENT_NAME"].value;
               this.studentadmissionform.SMS_MOBILE_NUM =  this.validateForm.controls["SMS_MOBILE_NUM"].value;

               let bDate = this.validateForm.controls['DATE_OF_BIRTH'].value;
               let BirthDate = this.datePipe.transform(bDate, 'dd/MM/yyyy')!;
               this.studentadmissionform.DATE_OF_BIRTH = BirthDate;

              // this.studentadmissionform.DATE_OF_BIRTH =  this.validateForm.controls["DATE_OF_BIRTH"].value;
               this.studentadmissionform.BIRTH_REG_NUM =  this.validateForm.controls["BIRTH_REG_NUM"].value;
               this.studentadmissionform.MARRIED_STATUS =  this.validateForm.controls["MARRIED_STATUS"].value;
               this.studentadmissionform.NATIONALITY_CODE =  this.validateForm.controls["NATIONALITY_NAME"].value;
               this.studentadmissionform.GENDER_CODE =  this.validateForm.controls["GENDER_CODE"].value;
               this.studentadmissionform.BLOOD_GROUP_CODE =  this.validateForm.controls["BLOOD_GROUP_CODE"].value;
               this.studentadmissionform.RELIGION_CODE =  this.validateForm.controls["RELIGION_CODE"].value;
               this.studentadmissionform.BIRTH_PLACE_CODE =  this.validateForm.controls["DISTRICT_NAME"].value;
               this.studentadmissionform.PRESENT_ADDRESS =  this.validateForm.controls["PRESENT_ADDRESS"].value;
               this.studentadmissionform.PARMANENT_ADDRESS =  this.validateForm.controls["PARMANENT_ADDRESS"].value;
               let aDate = this.validateForm.controls['ADMISSION_DATE'].value;
               let AddDate = this.datePipe.transform(aDate, 'dd/MM/yyyy')!;
               this.studentadmissionform.ADMISSION_DATE = AddDate;

               this.studentadmissionform.FATHERS_NAME =  this.validateForm.controls["FATHERS_NAME"].value;
               this.studentadmissionform.FATHER_CONTACT_NO =  this.validateForm.controls["FATHERS_CONTACT_NO"].value;
               this.studentadmissionform.MOTHERS_NAME =  this.validateForm.controls["MOTHERS_NAME"].value;
               this.studentadmissionform.MOTHER_CONTACT_NO =  this.validateForm.controls["MOTHERS_CONTACT_NO"].value;
               this.studentadmissionform.FATHER_OCCUPATION =  this.validateForm.controls["FATHERS_OCCUPATION"].value;
               this.studentadmissionform.MOTHER_OCCUPATION =  this.validateForm.controls["MOTHERS_OCCUPATION"].value;
               this.studentadmissionform.PARTENTS_INCOME =  this.validateForm.controls["PARENTS_INCOME"].value;

               this.studentadmissionform.GUARDIAN_NAME =  this.validateForm.controls["GUARDIAN_NAME"].value;
               this.studentadmissionform.GUARDIAN_NUMBER =  this.validateForm.controls["GUARDIAN_NUMBER"].value;
               this.studentadmissionform.GUARDIAN_ADDRESS =  this.validateForm.controls["GUARDIAN_ADDRESS"].value;

               this.studentadmissionform.FATHERS_NID =  this.validateForm.controls["FATHERS_NID"].value;
               this.studentadmissionform.MOTHERS_NID =  this.validateForm.controls["MOTHERS_NID"].value;

               this.studentadmissionform.BOARD_ADMISSION_ROLL =  this.studentInfo[0].ADMISSION_ROLL;
               this.studentadmissionform.EDUCATION_ID = [];
               this.studentadmissionform.EXAM_NAME = [];
               this.studentadmissionform.PASSING_YEAR = [];
               this.studentadmissionform.INSTITUTE = [];
               this.studentadmissionform.BOARD = [];
               this.studentadmissionform.ROLL_NO = [];
               this.studentadmissionform.REG_NO = [];
               this.studentadmissionform.RESULT = [];

               this.studentadmissionform.EDUCATION_ID.push(1);
               this.studentadmissionform.EXAM_NAME.push('SSC');
               this.studentadmissionform.PASSING_YEAR.push(this.validateForm.controls["PASSING_YEAR"].value);
               this.studentadmissionform.INSTITUTE.push(this.validateForm.controls["INS_NAME"].value);
               this.studentadmissionform.BOARD.push(this.validateForm.controls["BOARD_NAME"].value);
               this.studentadmissionform.ROLL_NO.push(this.validateForm.controls["ROLL_NUMBER"].value);
               this.studentadmissionform.REG_NO.push(this.validateForm.controls["REG_NO"].value);
               this.studentadmissionform.RESULT.push(this.validateForm.controls["RESULT"].value);
               this.studentadmissionform.EDUCATION_ID.push(2);
            
                
               this.studentadmissionform.EXAM_NAME.push('JSC');
               this.studentadmissionform.PASSING_YEAR.push(this.validateForm.controls["PASSING_YEAR_1"].value);
               this.studentadmissionform.INSTITUTE.push(this.validateForm.controls["INS_NAME_1"].value);
               this.studentadmissionform.BOARD.push(this.validateForm.controls["BOARD_NAME_1"].value);
               this.studentadmissionform.ROLL_NO.push(this.validateForm.controls["ROLL_NUMBER_1"].value);
               this.studentadmissionform.REG_NO.push(this.validateForm.controls["REG_NO_1"].value);
               this.studentadmissionform.RESULT.push(this.validateForm.controls["RESULT_1"].value);

   
               this.studentadmissionform.SUBJECT_CODE = [];
               this.studentadmissionform.IS_COM = [];
               this.studentadmissionform.IS_OP = [];
               this.studentadmissionform.SUBJECT_CODE.push(this.validateForm.controls["COMPULSORY_1"].value);
               this.studentadmissionform.IS_COM.push('Y');
               this.studentadmissionform.IS_OP.push('N');

               this.studentadmissionform.SUBJECT_CODE.push(this.validateForm.controls["COMPULSORY_2"].value);
               this.studentadmissionform.IS_COM.push('Y');
               this.studentadmissionform.IS_OP.push('N');

               this.studentadmissionform.SUBJECT_CODE.push(this.validateForm.controls["COMPULSORY_3"].value);
               this.studentadmissionform.IS_COM.push('Y');
               this.studentadmissionform.IS_OP.push('N');

               this.studentadmissionform.SUBJECT_CODE.push(this.validateForm.controls["OPTIONAL"].value);
               this.studentadmissionform.IS_COM.push('N');
               this.studentadmissionform.IS_OP.push('Y');
              
            







               this.studentadmissionform.USER_NAME = this.userCode;
               this.studentadmissionform.ROW_STATUS = 1;
                this.save(this.studentadmissionform);


          },
          nzCancelText: 'No',
        });
    }
   else{
    this.modal.error({
      nzTitle: `Image not selected`,
      nzContent: 'Please select an image and try again.',
      nzOkDanger: true,
    });
   }

    } else{
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
       this.modal.warning({
      nzTitle: `Warning`,
      nzContent: 'Please fillup required field and try again.',
      nzOkDanger: true,
     
    });  
    }


}

save(data:any){
  if(data){
    this.isSaveLoading = false;
    this.admissionService
    .SavestudentFormEntry(data)
    .pipe(takeUntil(this.destroy$))
    .subscribe((response: any) => {
      if (response.StatusCode === 1 && this.studentadmissionform.ROW_STATUS===1) {
       this.modalRef = this.modal.create({
    nzTitle: 'Success',
    nzContent: this.payNowTemplate,
    nzFooter: null,      // footer hide করলাম
    nzClosable: true,    // cross icon দেখাবে (top right)
    nzMaskClosable: false // বাইরে ক্লিক করলে বন্ধ হবে না (optional)
  });
        this.loadDataList();
        // this.loadDataGridList();
      //  this.validateForm.controls['checkBox'].value;
       this.validateForm.controls['ADMISSION_DATE'].setValue(new Date());
        this.validateForm.controls['DATE_OF_BIRTH'].setValue(new Date());
        // this.selectedImage = null;
        this.isSaveLoading = false;
        // this.validateForm.reset();

        // console.log('data', this.studentInfodataList);
        // this.loadDataGridList(this.studentInfodataList);
        
        this.cdr.detectChanges();
      } else {
        this.isSaveLoading = false;
        this.modal.error({
          nzTitle: `Failed!`,
          nzContent: response.Message,
          nzOkDanger: true,
        });
        this.cdr.detectChanges();
      }
    });
    this.cdr.detectChanges();
  }
}

onPayNow(){
  this.modalRef?.close(); 
  this.router.navigate(['/payment']); 
  this.cdr.detectChanges();
}
onCancel(){
  this.modalRef?.close(); 
  this.cdr.detectChanges();
}
retrieveImage(): void {
  const storedImage = localStorage.getItem('studentImage');
  const storedImageName = localStorage.getItem('studentImageName');
  const storedImageType = localStorage.getItem('studentImageType');

  if (storedImage && storedImageName && storedImageType) {
    const byteCharacters = atob(storedImage);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: storedImageType });
    const file = new File([blob], storedImageName, { type: storedImageType });
    this.studentadmissionform.STUDENT_IMAGE = file;
  }
}


loadDataList() {
  this.studentInfoList = [];
this.studentadmissionInfoParams.ORG_CODE = this.organizationCode;
this.studentadmissionInfoParams.CAMPUS_CODE = this.campusCode;
this.studentadmissionInfoParams.ADMISSION_ROLL =  this.studentInfo[0].ADMISSION_ROLL;
this.admissionService
  .getStudentAdmissiondata(this.studentadmissionInfoParams)
  .pipe(takeUntil(this.destroy$))
  .subscribe((response:any) => {
    this.isLoad = false;
    this.studentInfoList = response;
    
    this.pdfReportService.generateStudentReport(this.studentInfoList);
    this.cdr.detectChanges();

  });

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
