import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { AuthData } from "./auth-data.model";

@Injectable({ providedIn: "root" })
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) { }

    getToken(){
        return this.token;
    }

    getIsAuth(){
        return this.isAuthenticated;
    }

    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    signup(email: string, password: string) {
        const authData: AuthData = { email: email, password: password };
        this.http.post("http://localhost:3000/api/user/signup", authData)
            .subscribe(resSuccess => {
                console.log(resSuccess);
                this.router.navigate(['/home']);
            }, resError => {
                console.log(resError);
            });
    }

    login(email: string, password: string){
        const authData: AuthData = { email: email, password: password };
        this.http.post<{token: string}>("http://localhost:3000/api/user/login", authData)
            .subscribe(response => {
                if(response.token){
                    this.token = response.token;
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    this.router.navigate(['/home']);
                }
            });
    }

    logout(){
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.router.navigate(['/home']);
    }
}