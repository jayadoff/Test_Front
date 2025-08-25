import { Injectable } from '@angular/core';
import { UrlConstants } from '../enums/UrlConstants';
import { StudentadmissionInfoParams, Studentadmissionform } from '../models/studentadmissionform';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdmissionService {


  constructor(private httpClient : HttpClient) { }

  SavestudentFormEntry(studentInfo: Studentadmissionform) {
    const formData = new FormData();
    formData.append('STUDENT_IMAGE', studentInfo.STUDENT_IMAGE);
    // const appendFormData = (key: string, value: any) => {
    //     if (value != null) {
    //         formData.append(key, value.toString());
    //     }
    // };

    const appendFormData = (key: string, value: any) => {
        formData.append(key, value != null ? value.toString() : '');
    };

    
    // Append individual fields
   
    appendFormData('ORG_CODE', studentInfo.ORG_CODE);
    appendFormData('ORG_NAME', studentInfo.ORG_NAME);
    appendFormData('CAMPUS_CODE', studentInfo.CAMPUS_CODE);
    appendFormData('CAMPUS_NAME', studentInfo.CAMPUS_NAME);
    appendFormData('CLASS_NAME', studentInfo.CLASS_NAME);
    appendFormData('GROUP_CODE', studentInfo.GROUP_CODE);
    appendFormData('GENDER_CODE', studentInfo.GENDER_CODE);
    appendFormData('STUDENT_NAME', studentInfo.STUDENT_NAME);
    appendFormData('APPLICATION_ROLL', studentInfo.BOARD_ADMISSION_ROLL);
    appendFormData('SMS_MOBILE_NUM', studentInfo.SMS_MOBILE_NUM);
    appendFormData('DATE_OF_BIRTH', studentInfo.DATE_OF_BIRTH);
    appendFormData('BLOOD_GROUP_CODE', studentInfo.BLOOD_GROUP_CODE);
    appendFormData('RELIGION_CODE', studentInfo.RELIGION_CODE);
    appendFormData('NATIONALITY_CODE', studentInfo.NATIONALITY_CODE);
    appendFormData('BIRTH_PLACE_CODE', studentInfo.BIRTH_PLACE_CODE);
    appendFormData('MARRIED_STATUS', studentInfo.MARRIED_STATUS);
    appendFormData('ADMISSION_DATE', studentInfo.ADMISSION_DATE);
    appendFormData('FATHERS_NAME', studentInfo.FATHERS_NAME);
    appendFormData('FATHER_CONTACT_NO', studentInfo.FATHER_CONTACT_NO);
    appendFormData('MOTHERS_NAME', studentInfo.MOTHERS_NAME);
    appendFormData('MOTHER_CONTACT_NO', studentInfo.MOTHER_CONTACT_NO);
    appendFormData('FATHER_OCCUPATION', studentInfo.FATHER_OCCUPATION);
    appendFormData('MOTHER_OCCUPATION', studentInfo.MOTHER_OCCUPATION);
    appendFormData('PARTENTS_INCOME', studentInfo.PARTENTS_INCOME);
    appendFormData('PRESENT_ADDRESS', studentInfo.PRESENT_ADDRESS);
    appendFormData('PARMANENT_ADDRESS', studentInfo.PARMANENT_ADDRESS);
    appendFormData('USER_NAME', studentInfo.USER_NAME);
    appendFormData('ROW_STATUS', studentInfo.ROW_STATUS);
    appendFormData('APPLICATION_ROLL', studentInfo.BOARD_ADMISSION_ROLL);
    appendFormData('GUARDIAN_NAME', studentInfo.GUARDIAN_NAME);
    appendFormData('GUARDIAN_NUMBER', studentInfo.GUARDIAN_NUMBER);
    appendFormData('GUARDIAN_ADDRESS', studentInfo.GUARDIAN_ADDRESS);
    appendFormData('BIRTH_REG_NUM', studentInfo.BIRTH_REG_NUM);
    appendFormData('FATHERS_NID', studentInfo.FATHERS_NID);
    appendFormData('MOTHERS_NID', studentInfo.MOTHERS_NID);
    appendFormData('ADMISSION_TYPE', studentInfo.ADMISSION_TYPE);
    // Helper function to append array data to FormData
    const appendArrayFormData = (key: string, array: string[] | undefined) => {
        if (array && array.length > 0) {
            array.forEach(item => {
                if (item != null) {
                    formData.append(key, item);
                }
            });
        }
    };

    // Append array fields
    appendArrayFormData('EDUCATION_ID', studentInfo.EDUCATION_ID);
    appendArrayFormData('EXAM_NAME', studentInfo.EXAM_NAME);
    appendArrayFormData('INSTITUTE', studentInfo.INSTITUTE);
    appendArrayFormData('PASSING_YEAR', studentInfo.PASSING_YEAR);
    appendArrayFormData('BOARD', studentInfo.BOARD);
    appendArrayFormData('ROLL_NO', studentInfo.ROLL_NO);
    appendArrayFormData('REG_NO', studentInfo.REG_NO);
    appendArrayFormData('RESULT', studentInfo.RESULT);

    appendArrayFormData('SUBJECT_CODE', studentInfo.SUBJECT_CODE);
    appendArrayFormData('IS_COM', studentInfo.IS_COM);
    appendArrayFormData('IS_OP', studentInfo.IS_OP);


    return this.httpClient.post(UrlConstants.studentAdmissionform, formData);
}


getStudentAdmissiondata(studentadmissionInfoParams:StudentadmissionInfoParams): Observable<any> {
    let params = new HttpParams();
    params = params.set('ORG_CODE', studentadmissionInfoParams.ORG_CODE);
    params = params.set('CAMPUS_CODE', studentadmissionInfoParams.CAMPUS_CODE);
    params = params.set('ADMISSION_ROLL',studentadmissionInfoParams.ADMISSION_ROLL);
    return this.httpClient.get(UrlConstants.getStudentAdmissiondata, { params: params});
  }

}
