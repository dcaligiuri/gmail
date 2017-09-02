import { Component, Input } from '@angular/core';



@Component({
    selector: 'my-app',
    templateUrl: './app.component.html'
})

export class AppComponent {

	range;

	ngOnInit(){}

	output(event: any){
		this.range = event;
	}
	
	isLoggedIn(){
        return localStorage.getItem('token') !== null;
  	}

}