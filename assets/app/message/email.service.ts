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
    public currentTab = ""; 
    public emails: Email[] = [];
    public unreadEmails: Email[] = [];
    public highlightedEmails: Email[] = [];
    public upperLimit: number;
    public lowerLimit: number;

    constructor(private http: Http, userService: UserService, private route: ActivatedRoute ) {
       
    }

    public upper = new BehaviorSubject<number>(13);
    public lower = new BehaviorSubject<number>(0);
    public emailThickness = new BehaviorSubject<string>('comfortable');

    
    thickness$ = this.emailThickness.asObservable();
    upp$ = this.upper.asObservable();
    low$ = this.lower.asObservable();
    
    changeThickness(string) {
        this.emailThickness.next(string);
    }

    setCurrentTab(currPath: string){
        this.currentTab = currPath;
    }

    getCurrentTab(){
        return this.currentTab;
    }

    changeUpp(number) {
        this.upper.next(number);
    }

    changeLow(number) {
        this.lower.next(number);
    }

    

    moveEmail(newLocation: String, oldLocation: String){
         const token = localStorage.getItem('token')
        ? localStorage.getItem('token')
        : '';
       var highlighted = {'auth': token};
       for (var index = 0; index < this.highlightedEmails.length; index++) { 
            highlighted[this.highlightedEmails[index].messageId] = this.highlightedEmails[index].labels;
       }

       //let newUnread = [];
       //for (var index = 0; index < this.highlightedEmails.length; index++) { 
            //if (this.unreadEmails.includes(this.highlightedEmails[index]) === false){
                //console.log(this.unreadEmails[index]);
                //newUnread.push(this.unreadEmails[index]);
            //}
       //}
       //console.log(newUnread);
       //this.unreadEmails = newUnread;


       const headers = new Headers({'Content-Type': 'application/json'});
       return this.http.post('https://dansgmail.herokuapp.com/mail/moveEmail' + '?oldLocation=' + oldLocation + '&newLocation=' + newLocation , highlighted, {headers: headers})
            .map((response: Response) => {
                const messages = response.json().obj;
                console.log(messages);
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
                        message.isChecked,
                        message._id
                    ));
                }
                //if (oldLocation === 'primary' || newLocation === 'primary'){
                    //this.unreadEmails = transformedMessages;
               // }

                this.emails = transformedMessages.sort(function(a, b) {
                    return (a.timeStamp < b.timeStamp) ? -1 : ((a.timeStamp > b.timeStamp) ? 1 : 0);
                });

                return transformedMessages.reverse();
            })
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
        
        let highlighted = this.getHighlightedEmails();
        let canAdd = true; 
        highlighted.forEach(function (value) {
            if (value.messageId === email.messageId){
                canAdd = false; 
            }
        });


        if (canAdd === true){
            email.isChecked = true;
            this.highlightedEmails.push(email);
        }
        
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

    //markAllRead(){
       /// console.log("HELLO");
        // const token = localStorage.getItem('token') ?
       // '?token=' + localStorage.getItem('token')
       /// : '';
       /// const body = {};
       // const headers = new Headers({'Content-Type': 'application/json'});
       /// return this.http.post('https://dansgmail.herokuapp.com/mail/markAllRead' + token, body, {headers: headers})
       ///     .map((response: Response) => {
       ///         const result = response;
       ///     })
        ///    .catch((error: Response) => Observable.throw(error.json()));
   // }

    markNotSpamHighlighted(){
        const token = localStorage.getItem('token')
        ? localStorage.getItem('token')
        : '';
       var highlighted = {'auth': token};
       for (var index = 0; index < this.highlightedEmails.length; index++) { 
            highlighted[index] = this.highlightedEmails[index].messageId;
        }
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('https://dansgmail.herokuapp.com/mail/markAsNotSpamHighlighted', highlighted, {headers: headers})
            .map((response: Response) => {
                const result = response;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    markSpamHighlighted(target: string){
        const token = localStorage.getItem('token')
        ? localStorage.getItem('token')
        : '';
        const modifiedTarget = target ?
        '?target=' + target
        : '';
       var highlighted = {'auth': token};
       for (var index = 0; index < this.highlightedEmails.length; index++) { 
            highlighted[index] = this.highlightedEmails[index].messageId;
        }
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('https://dansgmail.herokuapp.com/mail/markAsSpamHighlighted' + modifiedTarget, highlighted, {headers: headers})
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
                        message.isChecked,
                        message._id
                    ));
                }
                if (target === 'primary'){
                    this.unreadEmails = transformedMessages;
                }
                this.emails = transformedMessages.sort(function(a, b) {
                    return (a.timeStamp < b.timeStamp) ? -1 : ((a.timeStamp > b.timeStamp) ? 1 : 0);
                });
                return transformedMessages.reverse();
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

    trashHighlightedEmails(target: string){
        const token = localStorage.getItem('token')
        ? localStorage.getItem('token')
        : '';
        const modifiedTarget = target ?
        '?target=' + target
        : '';
       var highlighted = {'auth': token};
       for (var index = 0; index < this.highlightedEmails.length; index++) { 
            highlighted[index] = this.highlightedEmails[index].messageId;
        }
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('https://dansgmail.herokuapp.com/mail/trashHighlighted' + modifiedTarget, highlighted, {headers: headers})
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
                        message.isChecked,
                        message._id
                    ));
                }
                if (target === 'primary'){
                    this.unreadEmails = transformedMessages;
                }
                this.emails = transformedMessages.sort(function(a, b) {
                    return (a.timeStamp < b.timeStamp) ? -1 : ((a.timeStamp > b.timeStamp) ? 1 : 0);
                });
                return transformedMessages.reverse();
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
        return this.http.post('https://dansgmail.herokuapp.com/mail/changeLabelHighlighted', highlighted, {headers: headers})
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
        return this.http.post('https://dansgmail.herokuapp.com/mail/starHighlighted', highlighted, {headers: headers})
            .map((response: Response) => {
                const result = response;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    deleteHighlighted(target: string){
        const token = localStorage.getItem('token')
        ? localStorage.getItem('token')
        : '';
        const modifiedTarget = target ?
        '?target=' + target
        : '';
       var highlighted = {'auth': token };
       for (var index = 0; index < this.highlightedEmails.length; index++) { 
            highlighted[index] = this.highlightedEmails[index].messageId;
        }
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('https://dansgmail.herokuapp.com/mail/deleteHighlighted' + modifiedTarget, highlighted, {headers: headers})
            .map((response: Response) => {
                const messages = response.json().obj;
                console.log(messages);
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
                        message.isChecked,
                        message._id
                    ));
                }
                if (target === 'primary'){
                    this.unreadEmails = transformedMessages;
                }
                this.emails = transformedMessages.sort(function(a, b) {
                    return (a.timeStamp < b.timeStamp) ? -1 : ((a.timeStamp > b.timeStamp) ? 1 : 0);
                });
                return transformedMessages.reverse();
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }


    markReadHighlighted(target: string){
        const token = localStorage.getItem('token')
        ? localStorage.getItem('token')
        : '';
        const modifiedTarget = target ?
        '?target=' + target
        : '';
       var highlighted = {'auth': token };
       for (var index = 0; index < this.highlightedEmails.length; index++) { 
            highlighted[index] = this.highlightedEmails[index].messageId;
        }
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('https://dansgmail.herokuapp.com/mail/markAsReadHighlighted' + modifiedTarget, highlighted, {headers: headers})
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
                        message.isChecked,
                        message._id
                    ));
                }
                if (target === 'primary'){
                    this.unreadEmails = transformedMessages;
                }
                this.emails = transformedMessages.sort(function(a, b) {
                    return (a.timeStamp < b.timeStamp) ? -1 : ((a.timeStamp > b.timeStamp) ? 1 : 0);
                });
                return transformedMessages.reverse();
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }


    markUnreadHighlighted(target: string){
        const token = localStorage.getItem('token')
        ? localStorage.getItem('token')
        : '';
        const modifiedTarget = target ?
        '?target=' + target
        : '';
       var highlighted = {'auth': token};
       for (var index = 0; index < this.highlightedEmails.length; index++) { 
            highlighted[index] = this.highlightedEmails[index].messageId;
        }
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('https://dansgmail.herokuapp.com/mail/markAsUnreadHighlighted' + modifiedTarget, highlighted, {headers: headers})
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
                        message.isChecked,
                        message._id
                    ));
                }
                if (target === 'primary'){
                    this.unreadEmails = transformedMessages;
                }
                this.emails = transformedMessages.sort(function(a, b) {
                    return (a.timeStamp < b.timeStamp) ? -1 : ((a.timeStamp > b.timeStamp) ? 1 : 0);
                });
                return transformedMessages.reverse();
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    addMessage(email: Email) {
        const token = localStorage.getItem('token')
        ? localStorage.getItem('token')
        : '';
        const body = {"auth": token, "email": email};
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('https://dansgmail.herokuapp.com/mail/compose', body, {headers: headers})
            .map((response: Response) => {
                const messages = response.json().obj;
                let transformedMessage: Email = new Email(messages.content, messages.fromEmail, messages.toEmail, messages.starred, messages.subject, messages.read, messages.spam, new Date(), ["primary"], messages.trash, messages.isChecked);
                this.emails.push(transformedMessage);
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    readMessage(messageId: String){
       return this.http.get(`https://dansgmail.herokuapp.com/mail/${messageId}`)
            .map((response: Response) => {
                const messages = response.json().obj;
                let transformedMessage: Email = new Email(messages.content, messages.fromEmail, messages.toEmail, messages.starred, messages.subject, messages.read, messages.spam, new Date(), ["primary"], messages.trash, messages.isChecked);
                return transformedMessage;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    markAsRead(messageId: String){
        const body = {"messageId": messageId}
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('https://dansgmail.herokuapp.com/mail/mark', body, {headers: headers})
            .map((response: Response) => {
                const result = response;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }


    applyStar(messageId: String) {
        const body = {"messageId": messageId}
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('https://dansgmail.herokuapp.com/mail/inbox/star', body, {headers: headers})
            .map((response: Response) => {
                const result = response;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

     removeStar(messageId: String) {
        const body = {"messageId": messageId}
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('https://dansgmail.herokuapp.com/mail/inbox/unstar', body, {headers: headers})
            .map((response: Response) => {
                const result = response.json().obj;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getSpamCount(){
        const token = localStorage.getItem('token') ?
        '?token=' + localStorage.getItem('token')
        : '';
        return this.http.get('https://dansgmail.herokuapp.com/mail/countSpam' + token)
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
        const token = localStorage.getItem('token')
        ? localStorage.getItem('token')
        : '';
        const body = {"auth": token};
        return this.http.post(`https://dansgmail.herokuapp.com/mail/search/${searchFor}` , body)
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
                        message.isChecked,
                        message._id
                    ));
                }
                this.emails = transformedMessages.sort(function(a, b) {
                    return (a.timeStamp < b.timeStamp) ? -1 : ((a.timeStamp > b.timeStamp) ? 1 : 0);
                });

                return transformedMessages.reverse();
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }


    /*
    getMessages(target: String){
        const token = localStorage.getItem('token') ?
        '?token=' + localStorage.getItem('token')
        : '';
        return this.http.get('https://dansgmail.herokuapp.com/mail/' + target + token)
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
                //console.log(target);
                if (target === 'primary'){
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

    */



    getMessages(target: String){
        //const token = localStorage.getItem('token') ?
        //'?token=' + localStorage.getItem('token')
        //: '';
        const token = localStorage.getItem('token')
        ? localStorage.getItem('token')
        : '';
        const body = {"auth": token};
        return this.http.post('https://dansgmail.herokuapp.com/mail/' + target, body)
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
                        message.isChecked,
                        message._id
                    ));
                }
                if (target === 'primary'){
                    this.unreadEmails = transformedMessages;
                }

                this.emails = transformedMessages.sort(function(a, b) {
                    return (a.timeStamp < b.timeStamp) ? -1 : ((a.timeStamp > b.timeStamp) ? 1 : 0);
                });

                return transformedMessages.reverse();
            })
            //.catch((error: Response) => Observable.throw(error.json()));
    }


    getEmails(){
        return this.emails; 
    }





/*

    getMessages(target: String){
        const token = localStorage.getItem('token') ?
        '?token=' + localStorage.getItem('token')
        : '';
        return this.http.get('https://dansgmail.herokuapp.com/mail/' + target + token)
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
                if (target === 'primary'){
                    this.unreadEmails = transformedMessages.reverse().reverse();
                }
                this.emails = transformedMessages.reverse();
                console.log(transformedMessages);
                return transformedMessages.reverse();
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

 */

    getMessagesForSearch(target: String) {
        const token = localStorage.getItem('token')
        ? localStorage.getItem('token')
        : '';
        const body = {"auth": token};
        return this.http.post('https://dansgmail.herokuapp.com/mail/' + target, body)
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
                        message.isChecked,
                        message._id
                    ));
                }
                return transformedMessages.sort();
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }


    fillSearchBox(target: String) {
        const token = localStorage.getItem('token') ?
        '?token=' + localStorage.getItem('token')
        : '';
        return this.http.get('https://dansgmail.herokuapp.com/mail/' + target + token)
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
                        message.isChecked,
                        message._id
                    ));
                }
                return transformedMessages.reverse();
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }






}
