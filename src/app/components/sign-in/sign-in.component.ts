import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  constructor(private authService: AuthService) {}

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  resetEmail = new FormControl('', [Validators.required, Validators.email]);

  loginForm = new FormGroup({
    email: this.email,
    password: this.password,
  });

  resetPasswordForm = new FormGroup({
    resetEmail: this.resetEmail,
  });

  showResetPassword = false;

  @Output() close = new EventEmitter<void>();
  @Output() switchToSignUp = new EventEmitter<void>();
  @Output() signInSuccess = new EventEmitter<void>(); // Emit on successful sign-in

  login() {
    if (this.loginForm.valid) {
      this.authService.loginUser(this.loginForm.value.email!, this.loginForm.value.password!)
        .then(() => {
          this.signInSuccess.emit(); // Emit success event
        })
        .catch((error) => {
          console.error('Login error:', error);
          alert('Something went wrong while signing in. Please try again.');
        });
    }
  }

  showSignUp() {
    this.switchToSignUp.emit();
  }

  showResetPasswordForm() {
    this.showResetPassword = true;
  }

  showSignIn() {
    this.showResetPassword = false;
  }

  resetPassword() {
    this.authService.resetPassword(this.resetEmail.value!).then(() => {
      alert('Password reset email sent if the email address is associated with an account.');
      this.showSignIn(); // Go back to sign-in form after sending the reset email
    }).catch((error) => {
      console.error('Error sending password reset email:', error);
      alert('Error sending password reset email. Please try again.');
    });
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
