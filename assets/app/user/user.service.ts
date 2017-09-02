import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";

@Injectable()
export class UserService {

    constructor(private http: Http, private router: Router) {
    }


    submitLogin(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/user/login', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }


    sayHi(email: String) {
       let email = '?email=' + email;
       return this.http.get('http://localhost:3000/user/sayHi' +  email)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    isLoggedIn(){
        return localStorage.getItem('token') !== null;
    }


    signup(user: User) {

        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/user/signup', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }


}