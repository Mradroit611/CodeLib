import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import * as languagesData from '../../../data/languages.json';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Language {
  image: string;
  topic: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  languages: Language[] = (languagesData as any).default;

  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    // Set the page title and description for SEO
    this.titleService.setTitle('Welcome to CodeLib - Explore Technologies');
    this.metaService.updateTag({ name: 'description', content: 'Explore a curated list of technologies and learn about their features and applications. CodeLib provides a quick overview of popular technologies used in modern development.' });
    this.metaService.updateTag({ name: 'keywords', content: 'programming, technologies, languages, coding, learning, code sharing' });
  }

}
