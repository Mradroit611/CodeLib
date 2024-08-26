import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, AbstractControl, ValidationErrors, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Question } from '../../question_model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-discussion',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent implements OnInit {
  // Define the custom validator function
  private wordLimitValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    const wordCount = value.trim().split(/\s+/).length;
    return wordCount <= 100 ? null : { wordLimit: true };
  };

  // Initialize the form group with validators
  snippetForm = new FormGroup({
    name: new FormControl('', Validators.required),
    question: new FormControl('', [Validators.required, this.wordLimitValidator]),
    code: new FormControl('')
  });

  questions: Question[] = [];
  maxVisibleAnswers = 2;
  answerForm = new FormGroup({
    answer: new FormControl('', Validators.required)
  });

  constructor(private dataService: DataService, private router: Router) {}

  get name() {
    return this.snippetForm.get('name')!;
  }

  get question() {
    return this.snippetForm.get('question')!;
  }

  get code() {
    return this.snippetForm.get('code')!;
  }

  get answer() {
    return this.answerForm.get('answer')!;
  }

  async ngOnInit() {
    await this.fetchQuestions();
  }

  async fetchQuestions() {
    try {
      this.questions = await this.dataService.getAllSnippet();
      console.log('Fetched questions:', this.questions); // Add this line to debug
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }

  async save() {
    if (this.snippetForm.valid) {
      const questionData: Question = {
        name: this.snippetForm.value.name ?? '',
        question: this.snippetForm.value.question ?? '',
        code: this.snippetForm.value.code ?? '',
        createdAt: new Date(),
        id: '',
        answers: []
      };
      await this.dataService.createSnippet(questionData);
      this.snippetForm.reset();
      await this.fetchQuestions(); // Refresh the questions list
    } else {
      this.snippetForm.markAllAsTouched();
    }
  }

  getVisibleAnswers(question: any) {
    return question.showAllAnswers ? question.answers : question.answers.slice(0, this.maxVisibleAnswers);
  }

  getShowMoreButtonText(question: any) {
    return question.showAllAnswers ? 'Show Less' : 'View More';
  }

  shouldShowMoreButton(question: any) {
    return question.answers.length > this.maxVisibleAnswers;
  }

  toggleViewMore(question: any) {
    question.showAllAnswers = !question.showAllAnswers;
  }

  async addAnswer(questionId: string) {
    if (this.answerForm.valid) {
      const answer = this.answerForm.value.answer ?? '';
      await this.dataService.addAnswer(questionId, { answer, answeredAt: new Date() });
      this.answerForm.reset();
      await this.fetchQuestions(); // Refresh answers
    } else {
      this.answerForm.markAllAsTouched();
    }
  }
}
