import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Import AuthService
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SignInComponent } from '../sign-in/sign-in.component';
import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule, SignInComponent, SignUpComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  isLoggedIn = false;
  isMobile = false;
  isDropdownOpen = false;
  showSignIn = false;
  showSignUp = false;

  constructor(private renderer: Renderer2, private authService: AuthService) {}

  ngOnInit() {
    this.checkScreenSize();
    this.renderer.listen('window', 'resize', () => this.checkScreenSize());

    // Subscribe to authentication status changes
    this.authService.authStatus$.subscribe((authenticated: boolean) => {
      this.isLoggedIn = authenticated;
    });

    this.renderer.listen('window', 'click', (event) => {
      if (this.isDropdownOpen && !this.isClickInsideDropdown(event)) {
        this.isDropdownOpen = false;
      }
    });

    this.renderer.listen('window', 'click', (event) => {
      const clickedElement = event.target as HTMLElement;
      if (this.isMenuOpen && clickedElement.closest('.mobile-menu a')) {
        this.isMenuOpen = false;
      }
    });
  }

  checkScreenSize() {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth <= 768;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown(event: Event) {
    this.isDropdownOpen = !this.isDropdownOpen;
    event.stopPropagation();
  }

  isClickInsideDropdown(event: MouseEvent): boolean {
    const dropdown = document.querySelector('.profile-icon .dropdown');
    return dropdown?.contains(event.target as Node) ?? false;
  }

  navigateTo(route: string) {
    console.log(`Navigating to ${route}`);
    this.isDropdownOpen = false;
  }

  logout() {
    console.log('Logging out...');
    this.authService.signOut().then(() => {
      console.log('Logged out');
      this.isDropdownOpen = false; // Close dropdown after logout
    }).catch((error) => {
      console.log('Error logging out:', error);
    });
  }

  openSignIn() {
    if (!this.isLoggedIn) {
      this.showSignIn = true;
      this.showSignUp = false;
      document.body.style.overflow = 'hidden';
    }
  }

  closeModals() {
    this.showSignIn = false;
    this.showSignUp = false;
    document.body.style.overflow = '';
  }

  openSignUp() {
    this.showSignUp = true;
    this.showSignIn = false;

  }

  onSignInSuccess() {
    this.closeModals();
  }

  onSignUpSuccess() {
    this.closeModals();
  }

  onSignInClose() {
    this.closeModals();
  }

  onSignUpClose() {
    this.closeModals();
  }

  showSignUpFromSignIn() {
    this.openSignUp();
  }

  showSignInFromSignUp() {
    this.openSignIn();
  }
}
