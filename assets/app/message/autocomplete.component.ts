import { Component, EventEmitter, Output} from '@angular/core';
import { CompleterCmp, CompleterData, CompleterService, CompleterItem, RemoteData } from'ng2-completer';
import { EmailService } from './email.service';
import { Email } from './email.model';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';

@Component({
  selector: 'app-autocomplete',
   template: `<ng2-completer [clearSelected]="true" (selected)="readEmail($event)" (keyup)="onChange($event)" [(ngModel)]="searchBox" [datasource]="dataService"></ng2-completer>`
})

export class AutocompleteComponent {
  public messages: Email[] = [];
  quote = "";
  protected searchStr: string;
  @Output() updateSearch = new EventEmitter<string>();
  public searchBox: string; 
  protected dataService: CompleterData;
 
  constructor(private activeRoute: ActivatedRoute, private router: Router, private completerService: CompleterService, private emailService: EmailService) {
    
  }

  ngOnInit() {

     this.emailService.getMessagesForSearch('all')
            .subscribe(
                (messages: Email[]) => {
                    this.messages = messages;
                }
            );
             
  }

    onChange(event: any){
      this.dataService = this.completerService.local(this.messages, "content", "fromEmail").descriptionField("content");
      this.updateSearch.emit(this.searchBox);
    } 

    readEmail(event: any){
      this.router.navigate(['', event.originalObject.messageId]); 
    }
}

