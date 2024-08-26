import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UpdateProfileComponent } from '../update-profile/update-profile.component'; // Adjust the path as needed

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, UpdateProfileComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userEmail: string | null = null;
  showUpdateProfile = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUserEmail();
  }

  loadUserEmail() {
    this.authService.getUser().subscribe((user: User | null) => {
      if (user) {
        this.userEmail = user.email; // Accessing email from Firebase User object
      } else {
        this.userEmail = null; // Handle case when user is not logged in
      }
    });
  }

  openUpdateProfile() {
    this.showUpdateProfile = true;
  }

  closeUpdateProfile() {
    this.showUpdateProfile = false;
  }
}
