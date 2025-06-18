import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { CustomerService } from '../services/customer.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const custService= inject(CustomerService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const isContinue= confirm("Are you sure you want to continue?");
        if (isContinue) {
           custService.tokenExpired$.next(true);
        }  
      }
    return throwError(error)
  }));
};
