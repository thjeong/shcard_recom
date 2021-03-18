import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
  })
export class RecomService {
  recom_url = 'recom';
  meta_url = 'cardmeta';
  
  constructor(private http: HttpClient) { }

  getRecom() {
    return this.http.get(this.recom_url);
  }

  getCardMeta() {
    return this.http.get(this.meta_url);
  }
}