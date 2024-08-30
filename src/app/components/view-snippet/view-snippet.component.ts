import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DbService } from '../../services/db.service';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript.min'; // Import other languages as needed
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-snippet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-snippet.component.html',
  styleUrls: ['./view-snippet.component.scss']
})
export class ViewSnippetComponent implements OnInit {
  codeSnippet = {
    title: '',
    description: '',
    codes: [] as string[],
  };
  highlightedCode: string[] = []; // Array to hold highlighted code

  constructor(private route: ActivatedRoute, private dbService: DbService) {}

  ngOnInit() {
    const docId = this.route.snapshot.paramMap.get('id');
    this.dbService.getSnippetById(docId!).then((data: any) => {
      this.codeSnippet = data;
      this.highlightCode();
    });
  }

  private highlightCode() {
    this.highlightedCode = this.codeSnippet.codes.map(code => {
      // Remove the first line for code highlighting
      const codeWithoutTitle = code.split('\n').slice(1).join('\n');
      return Prism.highlight(
        codeWithoutTitle,
        Prism.languages['javascript'], // Adjust based on the code language
        'javascript'
      );
    });
  }

  getCodeTitle(code: string): string {
    const lines = code.split('\n');
    return lines.length > 0 ? lines[0] : 'Untitled';
  }

  copyCode(code: string) {
    // Remove the first line from the code
    const lines = code.split('\n');
    const codeToCopy = lines.slice(1).join('\n');

    // Use the Clipboard API to copy the code
    navigator.clipboard.writeText(codeToCopy).then(() => {
      console.log('Code copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy code: ', err);
    });
  }
}
