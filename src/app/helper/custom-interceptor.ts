import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { UrlConstants } from '../enums/UrlConstants';
@Injectable()
export class CustomInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var customReq ;
    if (req.method=="GET") {

        customReq = req.clone({
            headers: req.headers.set('Custom-Header', 'Custom-Value'),
            url: UrlConstants.apiUrl + req.url
        });
    } else {
        customReq = req.clone({
            url: UrlConstants.apiUrl + req.url,
            body: req.body,
            headers: req.headers.set('Custom-Header', 'Custom-Value'),
        });
    }

    return next.handle(customReq).pipe(
      tap((event: HttpEvent<any>) => {
        // Handle the response here if needed
        if (event instanceof HttpResponse) {
          // Do something with the response
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle errors here and choose to rethrow or handle them gracefully
        return throwError(error);
      }),
      finalize(() => {
        // Perform any cleanup or finalization tasks here
        // For example, you can hide loading spinners
      })
    );
  }
}
