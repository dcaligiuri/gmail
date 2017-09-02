import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { UserService } from "../user/user.service";
import { Email } from "./email.model";
import { ActivatedRoute } from '@angular/router';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';


@Injectable()
export class EmailService {
    public unreadEmails: Email[] = [];
    public emails: Email[] = [];
    public highlightedEmails: Email[] = [];
    public upperLimit: number;
    public lowerLimit: number; 

    constructor(private http: Http, userService: UserService, private route: ActivatedRoute ) {
       
    }

    public upper = new BehaviorSubject<number>(7);
    public lower = new BehaviorSubject<number>(0);
    upp$ = this.upper.asObservable();
    low$ = this.lower.asObservable();
    
    changeUpp(number) {
        this.upper.next(number);
    }
    changeLow(number) {
        this.lower.next(number);
    }

    moveEmail(newLocation: String, oldLocation: String){
       var highlighted = {};
       for (var index = 0; index < this.highlightedEmails.length; index++) { 
            var tempArrPosistion = this.highlightedEmails[index].labels
            tempArrPosistion.push(newLocation);
            var oldPos = tempArrPosistion.indexOf(oldLocation);
            tempArrPosistion.splice(oldPos, 1);
            highlighted[this.highlightedEmails[index].messageId] = tempArrPosistion;
       }
       const headers = new Headers({'Content-Type': 'application/json'});
       return this.http.post('http://localhost:3000/mail/moveEmail', highlighted, {headers: headers})
            .map((response: Response) => {
                const result = response;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    countInbox(){
        let unreadEmails = 0; 
        for (let element of this.unreadEmails) {
            if (element.read === 'false'){
                unreadEmails = unreadEmails + 1;
            }
        }
        return unreadEmails;
    }


    countCurrentComponentEmails(){
        return this.emails.length;
    }


    clearHighlightedEmails(){
        this.highlightedEmails = [];
    }

    pushHighlighted(email: Email){
        this.highlightedEmails.push(email);
    }

    removeNotHighlighted(email: Email){
        var posEmail = this.highlightedEmails.indexOf(email);
        this.highlightedEmails.splice(posEmail, 1);
    }

    getHighlightedEmails(){
        return this.highlightedEmails;
    }

    highlighted(){
        if (this.highlightedEmails.length > 0){
            return true;
        }
        else{
            return false; 
        }

    }

    checkHighlightedForRead(){
        for (var index = 0; index < this.highlightedEmails.length; index++) { 
           if (this.highlightedEmails[index].read == 'true'){
               return true;
           }
        }
        return false; 
    }

    checkHighlightedForUnread(){
        for (var index = 0; index < this.highlightedEmails.length; index++) { 
           if (this.highlightedEmails[index].read == 'false'){
               return true;
           }
        }
        return false; 
    }

    markAllRead(){
         const token = localStorage.getItem('token') ?
        '?token=' + localStorage.getItem('token')
        : '';
        const body = {};
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/mail/markAllRead' + token, body, {headers: headers})
            .map((response: Response) => {
                const result = response;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    markNotSpamHighlighted(){
       var highlighted = {};
       for (var index = 0; index < this.highlightedEmails.length; index++) { 
            highlighted[index] = this.highlightedEmails[index].messageId;
        }
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/mail/markAsNotSpamHighlighted', highlighted, {headers: headers})
            .map((response: Response) => {
                const result = response;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    markSpamHighlighted(){
       var highlighted = {};
       for (var index = 0; index < this.highlightedEmails.length; index++) { 
            highlighted[index] = this.highlightedEmails[index].messageId;
        }
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/mail/markAsSpamHighlighted', highlighted, {headers: headers})
            .map((response: Response) => {
                const result = response;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    checkHighlightedForSpam(){
        for (var index = 0; index < this.highlightedEmails.length; index++) { 
           if (this.highlightedEmails[index].spam == 'true'){
               return true;
           }
        }
        return false; 
    }

    checkHighlightedForNotSpam(){
        for (var index = 0; index < this.highlightedEmails.length; index++) { 
           if (this.highlightedEmails[index].spam == 'false'){
               return true;
           }
        }
        return false; 
    }

    trashHighlightedEmails(){
       var highlighted = {};
       for (var index = 0; index < this.highlightedEmails.length; index++) { 
            highlighted[index] = this.highlightedEmails[index].messageId;
        }
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/mail/trashHighlighted', highlighted, {headers: headers})
            .map((response: Response) => {
                const result = response;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }
    
    changeLabelHighlightedEmails(newLabels: Array){
        var highlighted = {};
        for (var index = 0; index < this.highlightedEmails.length; index++) { 
            highlighted[this.highlightedEmails[index].messageId] = this.highlightedEmails[index];
            highlighted['labels'] = newLabels;
        }
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/mail/changeLabelHighlighted', highlighted, {headers: headers})
            .map((response: Response) => {
                const result = response;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    starHighlightedEmails(){
       var highlighted = {};
       for (var index = 0; index < this.highlightedEmails.length; index++) { 
            highlighted[index] = this.highlightedEmails[index].messageId;
            //remove from highlighted array upon deletion
        }
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/mail/starHighlighted', highlighted, {headers: headers})
            .map((response: Response) => {
                const result = response;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }


    markReadHighlighted(){
       const token = localStorage.getItem('token') ?
        '?token=' + localStorage.getItem('token')
        : '';
       var highlighted = {};
       for (var index = 0; index < this.highlightedEmails.length; index++) { 
            highlighted[index] = this.highlightedEmails[index].messageId;
        }
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/mail/markAsReadHighlighted' + token, highlighted, {headers: headers});
            //.map((response: Response) => {
            //    const result = response;
            //})
            //.catch((error: Response) => Observable.throw(error.json()));
    }


    markUnreadHighlighted(){
       var highlighted = {};
       for (var index = 0; index < this.highlightedEmails.length; index++) { 
            highlighted[index] = this.highlightedEmails[index].messageId;
        }
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/mail/markAsUnreadHighlighted', highlighted, {headers: headers})
            .map((response: Response) => {
                const result = response;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    addMessage(email: Email) {
       const token = localStorage.getItem('token') ?
        '?token=' + localStorage.getItem('token')
        : '';
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/mail/compose' + token, email, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    readMessage(messageId: String){
       return this.http.get(`http://localhost:3000/mail/${messageId}`)
            .map((response: Response) => {
                const messages = response.json().obj;
                let transformedMessage: Email = new Email(messages.content, messages.fromEmail, messages.toEmail, messages.starred, messages.subject, messages.read, messages.spam, new Date(), ["primary"], messages.trash);
                return transformedMessage;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    markAsRead(messageId: String){
        const body = {"messageId": messageId}
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/mail/mark', body, {headers: headers})
            .map((response: Response) => {
                const result = response;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }


    applyStar(messageId: String) {
        const body = {"messageId": messageId}
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/mail/inbox/star', body, {headers: headers})
            .map((response: Response) => {
                const result = response;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

     removeStar(messageId: String) {
        const body = {"messageId": messageId}
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/mail/inbox/unstar', body, {headers: headers})
            .map((response: Response) => {
                const result = response.json().obj;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getSpamCount(){
        const token = localStorage.getItem('token') ?
        '?token=' + localStorage.getItem('token')
        : '';
        return this.http.get('http://localhost:3000/mail/countSpam' + token)
            .map((response: Response) => {
                const messages = response.json().obj;
                return messages.length;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    setUpperLimit(upper: number){
         console.log(this.upperLimit);
        this.upperLimit = upper; 
    }

    setLowerLimit(lower: number){
        this.lowerLimit = lower; 
        console.log(this.lowerLimit);
    }
 

    searchMessages(searchFor: string) {
        const token = localStorage.getItem('token') ?
        '?token=' + localStorage.getItem('token')
        : '';
        return this.http.get(`http://localhost:3000/mail/search/${searchFor}` + token)
            .map((response: Response) => {
                const messages = response.json().obj;
                let transformedMessages: Email[] = [];
                for (let message of messages) {
                    transformedMessages.push(new Email(
                        message.content,
                        message.fromEmail,
                        message.toEmail,
                        message.starred,
                        message.subject,
                        message.read,
                        message.spam,
                        message.timeStamp,
                        message.labels,
                        message.trash,
                        message._id
                    ));
                }
                return transformedMessages.reverse();
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getMessages(target: String) {
        const token = localStorage.getItem('token') ?
        '?token=' + localStorage.getItem('token')
        : '';
        return this.http.get('http://localhost:3000/mail/' + target + token)
            .map((response: Response) => {
                const messages = response.json().obj;
                let transformedMessages: Email[] = [];
                for (let message of messages) {
                    transformedMessages.push(new Email(
                        message.content,
                        message.fromEmail,
                        message.toEmail,
                        message.starred,
                        message.subject,
                        message.read,
                        message.spam,
                        message.timeStamp,
                        message.labels,
                        message.trash,
                        message._id
                    ));
                }
                if (target === 'inbox'){
                    this.unreadEmails = transformedMessages;
                }
                //console.log(target);
                //problem with 
                //else{
                    this.emails = transformedMessages;
                    //console.log(this.emails);
                    //console.log(transformedMessages);
                //}
                return transformedMessages.reverse();
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }


    getMessagesForSearch(target: String) {
        const token = localStorage.getItem('token') ?
        '?token=' + localStorage.getItem('token')
        : '';
        return this.http.get('http://localhost:3000/mail/' + target + token)
            .map((response: Response) => {
                const messages = response.json().obj;
                let transformedMessages: Email[] = [];
                for (let message of messages) {
                    transformedMessages.push(new Email(
                        message.content,
                        message.fromEmail,
                        message.toEmail,
                        message.starred,
                        message.subject,
                        message.read,
                        message.spam,
                        message.timeStamp,
                        message.labels,
                        message.trash,
                        message._id
                    ));
                }
                return transformedMessages.reverse();
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }


    fillSearchBox(target: String) {
        const token = localStorage.getItem('token') ?
        '?token=' + localStorage.getItem('token')
        : '';
        return this.http.get('http://localhost:3000/mail/' + target + token)
            .map((response: Response) => {
                const messages = response.json().obj;
                let transformedMessages: Email[] = [];
                for (let message of messages) {
                    transformedMessages.push(new Email(
                        message.content,
                        message.fromEmail,
                        message.toEmail,
                        message.starred,
                        message.subject,
                        message.read,
                        message.spam,
                        message.timeStamp,
                        message.labels,
                        message.trash,
                        message._id
                    ));
                }
                return transformedMessages.reverse();
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }






}
