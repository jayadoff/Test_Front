import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentRequestData } from '../models/payment';
import { Observable } from 'rxjs';
import { UrlConstants } from '../enums/UrlConstants';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

 constructor(private httpClient: HttpClient) {

  }
  payment(paymentData: PaymentRequestData): Observable<any> {
    console.log('service',paymentData);
    
  return this.httpClient.post(UrlConstants.payment, paymentData);
}
}
