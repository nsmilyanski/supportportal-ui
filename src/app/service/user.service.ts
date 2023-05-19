import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from '../model/user' 
import { CustomHttpResponse } from '../model/custom-http-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private host: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getUsers(): Observable<User[] | HttpErrorResponse> {
    return this.http.get<User[]>(`${this.host}/users`)
  }

  public addUser(formData: FormData): Observable<User | HttpErrorResponse> {
    return this.http.post<User>(`${this.host}/users`, formData);
  }

  public updateUser(formData: FormData): Observable<User | HttpErrorResponse> {
    return this.http.put<User>(`${this.host}/users`, formData);
  }

  public resetPassword(email: string): Observable<CustomHttpResponse | HttpErrorResponse> {
    return this.http.get<CustomHttpResponse>(`${this.host}/users/resetPassword/${email}`);
  }

  public updateProfileImg(formData: FormData): Observable<HttpEvent<User> | HttpErrorResponse> {
    return this.http.put<User>(`${this.host}/users/updateProfileImage`, formData, 
    {reportProgress: true, observe: 'events'});
  }

  public deleteUser(userId: number): Observable<CustomHttpResponse | HttpErrorResponse> {
    return this.http.delete<any>(`${this.host}/users/${userId}`)
  }

  public addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsersFromLocalCache(): User[] | null {
    const users = localStorage.getItem('users');
    if(users) {
      return JSON.parse(users);
    }
    return null;
  }
  public createUsersFromData(loggedInUsername: string, user: User, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('profileImage', profileImage);
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNonLocked', JSON.stringify(user.notLocked));
    return formData;
  }
}
