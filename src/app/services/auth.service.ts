import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signOut, onAuthStateChanged, User } from "firebase/auth";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private uid?: string;
  private auth = getAuth();
  authStatus$ = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.uid = user.uid;
        if (user.emailVerified) {
          this.authStatus$.next(true);
        } else {
          this.authStatus$.next(false);
          this.signOut(); // Ensure user is logged out if email is not verified
        }
      } else {
        this.uid = undefined;
        this.authStatus$.next(false);
      }
    });
  }

  isAuthenticated(): boolean {
    // Ensure `this.uid` and `this.auth.currentUser` are properly checked
    return !!this.uid && !!this.auth.currentUser?.emailVerified;
  }

  getUserid(): string | undefined {
    return this.uid;
  }

  async registerUser(email: string, password: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);
      console.log('Verification email sent to:', email);
      alert('Registration successful! A verification email has been sent to your email address. Please verify your email before logging in.');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Something went wrong while signing up. Please try again.');
    }
  }

  async loginUser(email: string, password: string): Promise<void> {
    try {
      if (!this.isAuthenticated()) {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        const user = userCredential.user;
        if (user.emailVerified) {
          this.router.navigate(['/home']);
        } else {
          await this.signOut();
          alert('Please verify your email before logging in.');
        }
      } else {
        alert('You are already logged in.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong while signing in. Please try again.');
    }
  }

  signOut(): Promise<void> {
    return signOut(this.auth)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('Logout error:', error);
        alert('Something went wrong while logging out.');
      });
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('Password reset email sent to:', email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error; // Rethrow to handle in the component
    }
  }
}
