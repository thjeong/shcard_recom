import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
  })
export class RecomService {
  //base_url = 'http://1.243.55.188:3000/';
  base_url = environment.apiUrl;
  recom_url = this.base_url + 'recom';
  meta_url = this.base_url + 'cardmeta';
  log_url = this.base_url + 'select';
  
  constructor(private http: HttpClient) { }

  getRecom(data) {
    return this.http.post(this.recom_url, data);
  }

  getCardMeta() {
    return this.http.get(this.meta_url);
  }

  writeLog(body) {
    return this.http.post(this.log_url, body);
  }
}