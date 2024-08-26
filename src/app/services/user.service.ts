import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore ) {}

  getUserProfile(userId: string): Observable<any> {
    return this.firestore.collection('users').doc(userId).valueChanges();
  }

  updateUserProfile(userId: string, userData: any): Promise<void> {
    return this.firestore.collection('users').doc(userId).update(userData);
  }
}
