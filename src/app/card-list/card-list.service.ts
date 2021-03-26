import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
  })
export class RecomService {
  base_url = 'http://1.243.55.188:3000/';
  recom_url = this.base_url + 'recom';
  meta_url = this.base_url + 'cardmeta';
  log_url = this.base_url + 'select';
  
  constructor(private http: HttpClient) { }

  getRecom() {
    return this.http.get(this.recom_url);
  }

  getCardMeta() {
    return this.http.get(this.meta_url);
  }

  writeLog(body) {
    return this.http.post(this.log_url, body);
  }
}