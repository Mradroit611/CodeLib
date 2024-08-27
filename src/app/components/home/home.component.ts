import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { HttpClientModule } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as languagesData from '../../../data/languages.json';
import { RouterLink } from '@angular/router';

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

  constructor() {}

  ngOnInit(): void {}

}
