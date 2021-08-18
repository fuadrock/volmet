import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, EMPTY,throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
@Injectable()
export class MyInterceptor implements HttpInterceptor {
  constructor( private toaster: NbToastrService,private router:Router){

  }
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const API_KEY = '123456';
    let lastResponse: HttpEvent<any>;
    let error: HttpErrorResponse;
    return next.handle(httpRequest.clone({ setHeaders: { API_KEY } }))
    .pipe(

      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof Error) {

          console.error('An error occurred:', error);
        } else {

          if(error.error?.errors[0]?.code==402 || error.error?.errors[0]?.code==401){
            this.showToast('danger', error.error.errors[0].message);
            localStorage.clear();
            this.router.navigate(['/notFound']);
          }
          else{
            return throwError(error);
          }

        }
        return EMPTY;
      }),

    );
  }
  showToast(status: NbComponentStatus, message) {
    this.toaster.show(status, message, { status });
  }
}
