import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Email } from './email.model';
import { EmailService } from './email.service';
import {EmailComponent} from '../message/email.component';
import { ViewChild } from '@angular/core';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styles: [
    `
        li {
          color: blue;
        }
    `
    ]
})

export class MyContextMenuClass {

	constructor(private emailService: EmailService) {}

	sayHi(){
		this.emailService.clearHighlightedEmails();
    //console.log(this.emailService.getHighlightedEmails());
	}

  
  public items = [
      { name: 'John', otherProperty: 'Foo' },
      { name: 'Joe', otherProperty: 'Bar' }
  ];
  @ViewChild(EmailComponent) public basicMenu: EmailComponent;
}