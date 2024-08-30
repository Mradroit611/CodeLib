import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators, FormControl, FormGroup, FormArray, ValidatorFn, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { DbService } from '../../services/db.service';
import { Snippet } from '../../model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent {
  // Define the custom validator function
  private wordLimitValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    const wordCount = value.trim().split(/\s+/).length;
    return wordCount <= 100 ? null : { wordLimit: true };
  };

  // Initialize the form group with validators
  snippetForm = new FormGroup({
    name: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    description: new FormControl('', [Validators.required, this.wordLimitValidator]),
    codes: new FormArray([this.createCodeControl()])
  });

  // Add loading and error states
  loading = false;
  errorMessage: string | null = null;

  constructor(private dbService: DbService, private router: Router) {}

  get name() {
    return this.snippetForm.get('name')!;
  }

  get title() {
    return this.snippetForm.get('title')!;
  }

  get description() {
    return this.snippetForm.get('description')!;
  }

  get codes() {
    return this.snippetForm.get('codes') as FormArray;
  }

  createCodeControl() {
    return new FormGroup({
      code: new FormControl('', Validators.required)
    });
  }

  addCode() {
    this.codes.push(this.createCodeControl());
  }

  removeCode(index: number) {
    if (this.codes.length > 1) {
      this.codes.removeAt(index);
    }
  }

  async save() {
    if (this.snippetForm.valid) {
      this.loading = true;
      this.errorMessage = null; // Clear previous errors

      // Map codes safely
      const snippetData: Snippet = { 
        name: this.snippetForm.value.name ?? '',
        title: this.snippetForm.value.title ?? '',
        description: this.snippetForm.value.description ?? '',
        codes: (this.snippetForm.value.codes as { code: string }[]).map(code => code.code ?? ''),
        createdAt: new Date(),
      };

      try {
        await this.dbService.createSnippet(snippetData);
        this.snippetForm.reset();
        this.loading = false;
        this.router.navigate(['/codeSnippet']);
      } catch (error) {
        console.error('Error creating snippet:', error);
        this.errorMessage = 'Failed to create snippet. Please try again later.';
        this.loading = false;
      }
    }
  }
}
