import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Import AuthService
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SignInComponent } from '../sign-in/sign-in.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { CustomAlertComponent } from '../../custom-alert/custom-alert.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CustomAlertComponent ,FormsModule, CommonModule, SignInComponent, SignUpComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  showAlert = false;
  alertMessage = '';
  isMenuOpen = false;
  isLoggedIn = false;
  isMobile = false;
  isDropdownOpen = false;
  showSignIn = false;
  showSignUp = false;
  userEmail: string | null = null;
  // router: any;
  // route: any;

  constructor(private renderer: Renderer2, private authService: AuthService, private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.checkScreenSize();
    this.renderer.listen('window', 'resize', () => this.checkScreenSize());

    // Subscribe to authentication status changes
    this.authService.authStatus$.subscribe((authenticated: boolean) => {
      this.isLoggedIn = authenticated;
    });

    // Subscribe to user email
    this.authService.getUserEmail().subscribe(email => {
      this.userEmail = email;
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

     // Handle query parameters for alert
     this.route.queryParams.subscribe((params: { [x: string]: string; }) => {
      if (params['alert'] === 'sign-in-required') {
        console.log('Setting alert message');
        this.alertMessage = 'You need to sign in to access this page.';
        this.showAlert = true;
        setTimeout(() => this.showAlert = false, 3000); // Hide alert after 3 seconds
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

  // navigateTo(route: string) {
  //   console.log(`Navigating to ${route}`);
  //   if (route === '/profile' && !this.isLoggedIn) {
  //     this.alertMessage = 'You need to sign in to access the profile page.';
  //     this.showAlert = true;
  //     this.router.navigate(['/home']);
  //   } else {
  //     this.router.navigate([route]);
  //   }
  //   this.isDropdownOpen = false;
  // }
  navigateTo(route: string) {
    console.log(`Navigating to ${route}`);
    this.router.navigate([route]);
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

  // handleNavigation(route: string) {
  //   if (route === '/profile' && !this.isLoggedIn) {
  //     this.alertMessage = 'You need to sign in to access the profile page.';
  //     this.showAlert = true;
  //     this.router.navigate(['/home']);
  //   } else {
  //     this.router.navigate([route]);
  //   }
  // }

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
