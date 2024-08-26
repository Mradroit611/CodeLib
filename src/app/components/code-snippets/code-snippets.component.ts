import { Component, OnInit } from '@angular/core';
import { DbService } from '../../services/db.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommunityComponent } from '../community/community.component';
import { AuthService } from '../../services/auth.service';
import { CustomAlertComponent } from '../../custom-alert/custom-alert.component';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-code-snippets',
  standalone: true,
  imports: [RouterLink, CommonModule, CommunityComponent, CustomAlertComponent],
  templateUrl: './code-snippets.component.html',
  styleUrls: ['./code-snippets.component.scss']
})
export class CodeSnippetsComponent implements OnInit {
  items: { id: string; name: string; title: string; description: string; createdAt: Date }[] = [];
  isCommunityFormVisible = false;
  isLoggedIn: any;
  showAlert = false;
  alertMessage = '';

  constructor(private dbService: DbService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.authStatus$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
    this.dbService.getAllSnippet().then((data: any) => {
      console.log(data);
      this.items = data;
    });
  }

  trackById(index: number, item: { id: string }) {
    return item.id;
  }

  openCommunityForm() {
    this.isCommunityFormVisible = true;
    document.body.style.overflow = 'hidden'; // Prevent page scroll
  }

  closeCommunityForm() {
    this.isCommunityFormVisible = false;
    document.body.style.overflow = 'auto'; // Restore page scroll
  }

  onShareYourCodeClick() {
    if (this.isLoggedIn) {
      this.openCommunityForm();
    } else {
      this.alertMessage = 'You must be signed in to share your code.';
      this.showAlert = true;
      // Optionally redirect to sign-in page
      this.router.navigate(['/codeSnippet']); // Adjust path as needed
    }
  }
  
  
}
