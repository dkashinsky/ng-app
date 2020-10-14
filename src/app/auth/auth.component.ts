import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService, SignupResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    const { email, password } = form.value;
    const auth$: Observable<SignupResponseData> = this.isLoginMode
      ? this.authService.login(email, password)
      : this.authService.signup(email, password);
      
    this.isLoading = true;
    auth$.subscribe({
      next: (authData) => {
        console.log(authData);
        this.isLoading = false;
        form.reset();
      },
      error: (errorMessage) => {
        this.isLoading = false;
        this.error = errorMessage;
      }
    });
  }
}
