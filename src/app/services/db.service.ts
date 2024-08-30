import { Injectable } from '@angular/core';
import { doc, getDoc, getDocs, getFirestore, Timestamp } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Snippet } from '../model';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private db: any;

  constructor(private authService: AuthService, private router: Router) {
    this.db = getFirestore();
  }

  async createSnippet(snippet: Snippet) {
    try {
      const docRef = await addDoc(collection(this.db, 'snippets'), {
        ...snippet,
        by: this.authService.getUserId(),
        createdAt: Timestamp.fromDate(new Date()),
      });
      console.log('Document written with ID: ', docRef.id);
      this.router.navigate(['/']);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  async getAllSnippets() {
    let result: any[] = [];
    const querySnapshot = await getDocs(collection(this.db, 'snippets'));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`${doc.id} => ${doc.data()}`);
      const createdAt = data['createdAt'] ? data['createdAt'].toDate() : new Date();
      result.push({
        id: doc.id,
        ...data,
        createdAt,
      });
    });
    return result;
  }

  async getSnippetById(docId: string) {
    const docRef = doc(this.db, 'snippets', docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
      return docSnap.data();
    } else {
      return {
        id: "",
        name: "",
        title: "",
        description: "",
        codes: [],
        createdAt: new Date(),
      };
    }
  }
}
