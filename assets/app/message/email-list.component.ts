import { Component, OnInit} from '@angular/core';
import { Email } from './email.model';
import { EmailService } from './email.service';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { AutocompleteComponent } from "./autocomplete.component";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
    selector: 'app-email-list',
    templateUrl: './email-list.component.html',
    styles: [
    `
        .btn:focus {outline: none;}
        li {color: blue;}
    `
    ]
   
})


export class EmailListComponent implements OnInit {

public messages: Email[];
public isStarred: String;
public upper: number;
public lower: number; 
public searchTerm: string;
private subscription: any;    
private subscriptionLow: any; 
private sub: any;
private subUrls: any; 
public currentPath: string;

    constructor(private emailService: EmailService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {

      
        this.sub = this.route.params.subscribe(params => {
        this.searchTerm = params['searchTerm']; 
   
    });

        this.subscription = this.emailService.upp$
            .subscribe(item => this.upper = item);
        this.subscriptionLow = this.emailService.low$
            .subscribe(item => this.lower = item);



        this.subUrls = this.route.url.subscribe(urlsegs => {
            this.emailService.setCurrentTab(this.retCurrTab(urlsegs));
            this.chooseEmailList(urlsegs);
        });



      /*


        else if (this.route.url.value[1].path === 'search'){
                var searchTerm = this.route.url.value[2].path;
                this.emailService.searchMessages(searchTerm)
                    .subscribe(
                        (messages: Email[]) => {
                            this.messages = messages;
                        }
                    );
        }












        else if (this.route.url.value[1].path === 'sent'){
             this.emailService.getMessages('sent')
            .subscribe(
                (messages: Email[]) => {
                    this.messages = messages;
                }
            );
        }
        else if (this.route.url.value[1].path === 'spam'){
             this.emailService.getMessages('spam')
            .subscribe(
                (messages: Email[]) => {
                    this.messages = messages;
                }
            );
        }
        else if (this.route.url.value[1].path === 'trash'){
             this.emailService.getMessages('trash')
            .subscribe(
                (messages: Email[]) => {
                    this.messages = messages;
                }
            );
        }
        else if (this.route.url.value[1].path === 'all'){
             this.emailService.getMessages('all')
            .subscribe(
                (messages: Email[]) => {
                    this.messages = messages;
                }
            );
        }

        */


    }

    displayInboxHeader(){
        if(this.route.url.value[1].path === 'inbox'){
            return true; 
        }
    }


    getStuff(){
        return this.emailService.emails;
    }


    chooseEmailList(urlseg: UrlSegment[]){
        if (urlseg[1].path === 'inbox'){
                this.emailService.getMessages(urlseg[2].path)
                .subscribe(
                    (messages: Email[]) => {
                        this.messages = messages;
                    }
                ); 
            }
            else if(urlseg[1].path === 'starred'){
                this.emailService.getMessages('starred')
                    .subscribe(
                        (messages: Email[]) => {
                            this.messages = messages;
                        }
                    );

            }

            else if(urlseg[1].path === 'search'){
                let searchTerm = urlseg[2].path
                this.emailService.searchMessages(this.searchTerm)
                    .subscribe(
                        (messages: Email[]) => {
                            this.messages = messages;
                        }
                    );

            }
            else{
                this.emailService.getMessages(urlseg[1].path)
                    .subscribe(
                        (messages: Email[]) => {
                            this.messages = messages;
                        }
                    );
            }

    }


    retCurrTab(urlseg: UrlSegment[]){
        if (urlseg[1].path === 'inbox'){
                return urlseg[2].path;
            }
            else if(urlseg[1].path === 'starred'){
                return urlseg[1].path;
            }
            else if(urlseg[1].path === 'search'){
                //let searchTerm = urlseg[2].path
                //this.emailService.getMessages('starred')
                 //   .subscribe(
                //        (messages: Email[]) => {
                 //           this.messages = messages;
                 //       }
                 //   );

            }
            else{
                return urlseg[1].path;
            }

    }

     


    }


   

   /*


              else if (this.route.url.value[1].path === 'inbox'){
            if (this.route.url.value[2].path === 'primary') {
                this.emailService.getMessages('inbox')
                    .subscribe(
                        (messages: Email[]) => {
                            this.messages = messages;
                        }
                    );
            }
            else if (this.route.url.value[2].path === "updates"){
                this.emailService.getMessages('updates')
                    .subscribe(
                        (messages: Email[]) => {
                            this.messages = messages;
                        }
                    );
            }
            else if (this.route.url.value[2].path === "forums"){
                this.emailService.getMessages('forums')
                    .subscribe(
                        (messages: Email[]) => {
                            this.messages = messages;
                        }
                    );
            }
            else if (this.route.url.value[2].path === "social"){
                this.emailService.getMessages('social')
                    .subscribe(
                        (messages: Email[]) => {
                            this.messages = messages;
                        }
                    );
            }
            else if (this.route.url.value[2].path === "promotions"){
                this.emailService.getMessages('promotions')
                    .subscribe(
                        (messages: Email[]) => {
                            this.messages = messages;
                        }
                    );
            }
        }
  
        if (this.route.url.value[1].path === 'starred'){
             this.emailService.getMessages('starred')
            .subscribe(
                (messages: Email[]) => {
                    this.messages = messages;
                }
            );
        }

        */

