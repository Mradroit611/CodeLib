import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { notesData, NotesData } from '../../notes-data';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'
})
export class NotesComponent implements OnInit{
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
}
