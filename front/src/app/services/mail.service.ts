import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private http: HttpClient) { }
  private urlSendMail = environment.baseUrl + environment.sendMail;
  private urlResetPassword = environment.baseUrl + environment.resetPassword;

  sendMail(data: any): Observable<any>{
    return this.http.post(this.urlSendMail, data);
  }

  resetPassword(token: string, data: { newPassword: string, confirmPassword: string }): Observable<any> {
    const url = `${this.urlResetPassword}/${token}`
    return this.http.post(url, data);
  }
}
