import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-alert',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './custom-alert.component.html',
  styleUrl: './custom-alert.component.scss'
})
export class CustomAlertComponent implements OnChanges {
  @Input() message: string = '';
  @Input() show: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && this.show) {
      setTimeout(() => this.show = false, 3000); // Hide alert after 3 seconds
    }
  }
}
