import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { doc, getDoc, getDocs, getFirestore, updateDoc, addDoc, collection } from 'firebase/firestore';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Question } from '../question_model';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private db = getFirestore();

  constructor(private authService: AuthService, private router: Router) {}

  async createSnippet(question: Question) {
    try {
      const docRef = await addDoc(collection(this.db, 'questions'), {
        ...question,
        by: this.authService.getUserId(),
        answers: [] // Initialize with an empty array for answers
      });
      console.log('Document written with ID: ', docRef.id);
      this.router.navigate(['/']);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  async getAllSnippet(): Promise<Question[]> {
    let result: Question[] = [];
    const querySnapshot = await getDocs(collection(this.db, 'questions'));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      result.push({
        id: doc.id,
        name: data['name'] || '',
        question: data['question'] || '',
        code: data['code'] || '',
        createdAt: data['createdAt'] ? new Date(data['createdAt'].seconds * 1000) : new Date(),
        answers: data['answers'] || []
      });
    });
    return result;
  }
  

  async addAnswer(questionId: string, answerData: { answer: string; answeredAt: Date }) {
    try {
      const docRef = doc(this.db, 'questions', questionId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const answers = data['answers'] || [];
        answers.push(answerData);
        await updateDoc(docRef, { answers });
        console.log('Answer added successfully');
      } else {
        console.error('No such document!');
      }
    } catch (e) {
      console.error('Error adding answer: ', e);
    }
  }

  async getSnippetById(docId: string): Promise<Question> {
    const docRef = doc(this.db, 'questions', docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data['name'] || '',
        question: data['question'] || '',
        code: data['code'] || '',
        createdAt: data['createdAt'] ? new Date(data['createdAt'].seconds * 1000) : new Date(),
        answers: data['answers'] || []
      };
    } else {
      return {
        id: "",
        name: "",
        question: "",
        code: "",
        createdAt: new Date(),
        answers: []
      };
    }
  }
  
}
