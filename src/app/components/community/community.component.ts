import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators, FormControl, FormGroup, ValidatorFn, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { DbService } from '../../services/db.service';
import { Snippet } from '../../model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';


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
    code: new FormControl('', Validators.required),
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

  get code() {
    return this.snippetForm.get('code')!;
  }

  async save() {
    if (this.snippetForm.valid) {
      this.loading = true;
      this.errorMessage = null; // Clear previous errors
      const snippetData: Snippet = {
        name: this.snippetForm.value.name ?? '',
        title: this.snippetForm.value.title ?? '',
        description: this.snippetForm.value.description ?? '',
        code: this.snippetForm.value.code ?? '',
        createdAt: new Date(),
      };

      try {
        await this.dbService.createSnippet(snippetData);
        this.snippetForm.reset();
        this.loading = false;
        // Optionally navigate or refresh the data
        // For example, you can navigate back to the snippets list
        this.router.navigate(['/codeSnippet']);
      } catch (error) {
        console.error('Error creating snippet:', error);
        this.errorMessage = 'Failed to create snippet. Please try again later.';
        this.loading = false;
      }
    }
  }
}
