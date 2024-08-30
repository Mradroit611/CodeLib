import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { notesData, NotesData } from '../../notes-data'; // Import your type or interface for notes data
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  topic: string = '';
  notesData: { [heading: string]: { description: string } } = {};
  selectedHeading: string | null = null;
  headingData: { description?: string } = {};

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.topic = params.get('topic') || '';
      this.notesData = (notesData as NotesData)[this.topic] || {};
      
      // Automatically select the first heading if available
      const firstHeading = Object.keys(this.notesData)[0];
      if (firstHeading) {
        this.selectHeading(firstHeading);
      }
    });
  }

  getHeadings(): string[] {
    return Object.keys(this.notesData);
  }

  selectHeading(heading: string): void {
    this.selectedHeading = heading;
    this.headingData = this.notesData[heading] || {};
  }

  formatDescription(description: string): string {
    // Check for undefined and default to an empty string if needed
    if (!description) {
      return '';
    }

    // Replace newlines with <br> tags
    description = description.replace(/\n/g, '<br>');

    // Check for URLs and replace them with clickable links
    const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    description = description.replace(urlPattern, '<a href="$1" target="_blank">$1</a>');

    // Convert bullet points to HTML list
    description = description.replace(/^(\d+)\)/gm, '<li>').replace(/(?:\r\n|\r|\n)/g, '</li>\n');
    description = '<ul>' + description + '</ul>';

    return description;
  }
}
