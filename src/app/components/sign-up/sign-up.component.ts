import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  email: string = '';
  password: string = '';

  @Output() close = new EventEmitter<void>();

  constructor(private authService: AuthService) { }

  async register(regForm: NgForm) {
    if (regForm.invalid) {
      return;
    }

    try {
      await this.authService.registerUser(regForm.value.email, regForm.value.password);
      this.close.emit(); // Close the modal on success
    } catch (error) {
      console.error('Registration error:', error);
    }
  }

  showSignIn() {
    this.close.emit();
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
