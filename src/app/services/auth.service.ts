import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getCurrentUser() {
    throw new Error('Method not implemented.');
  }
  // private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private auth = getAuth();
  private uid?: string;
  authStatus$ = new BehaviorSubject<boolean>(false);
  private currentUserEmail$ = new BehaviorSubject<string | null>(null);

  constructor(private router: Router, ) {
    // const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    // this.currentUserSubject.next(user);
    
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.uid = user.uid;
        this.currentUserEmail$.next(user.email);
        if (user.emailVerified) {
          this.authStatus$.next(true);
        } else {
          this.authStatus$.next(false);
          this.signOut(); // Ensure user is logged out if email is not verified
        }
      } else {
        this.uid = undefined;
        this.authStatus$.next(false);
        this.currentUserEmail$.next(null);
      }
    });
  }


  getUserEmail(): Observable<string | null> {
    return this.currentUserEmail$.asObservable();
  }
  
  getUser(): Observable<User | null> {
    return new Observable<User | null>((observer) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        observer.next(user);
      });
      // Cleanup subscription
      return () => unsubscribe();
    });
  }

  isAuthenticated(): boolean {
    return !!this.uid && !!this.auth.currentUser?.emailVerified;
  }

  getUserId(): string | undefined {
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

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      this.uid = undefined; // Clear UID on sign out
      this.authStatus$.next(false);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Logout error:', error);
      alert('Something went wrong while logging out.');
    }
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
