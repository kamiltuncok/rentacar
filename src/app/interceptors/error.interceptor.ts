import { HttpInterceptorFn, HttpErrorResponse, HttpContextToken } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

/** Hatasını kendi arayüzünde gösteren istekler (ör. destek sohbeti) global toast'ı kapatır. */
export const SKIP_GLOBAL_ERROR_TOAST = new HttpContextToken<boolean>(() => false);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const toastr = inject(ToastrService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (req.context.get(SKIP_GLOBAL_ERROR_TOAST)) {
                return throwError(() => error);
            }

            switch (error.status) {
                case 401:
                    router.navigate(['/login']);
                    toastr.warning('Oturum süresi dolmuş, tekrar giriş yapınız.');
                    break;
                case 403:
                    toastr.error('Bu işlem için yetkiniz bulunmuyor.');
                    break;
                case 404:
                    toastr.error('İstenen kaynak bulunamadı.');
                    break;
                case 500:
                    toastr.error('Sunucu hatası, lütfen daha sonra tekrar deneyiniz.');
                    break;
                default:
                    if (error.status === 0) {
                        toastr.error('Sunucuya bağlanılamıyor.');
                    }
                    break;
            }
            return throwError(() => error);
        })
    );
};
