import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent {
  profile = {
    name: '',
    username: '',
    age: '',
    gender: '',
    contact: '',
    address: ''
  };

  profileImageUrl: string | ArrayBuffer | null = null;
  modalVisible: boolean = true;  // Modal visibility state

  onSubmit() {
    console.log('Form submitted with:', this.profile);
    this.closeModal();  // Optionally close modal after submission
  }

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        this.profileImageUrl = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }

  closeModal(event?: Event) {
    if (event) {
      event.stopPropagation();  // Prevent click event from propagating if called from within the modal
    }
    this.modalVisible = false;  // Update modal visibility state
    console.log('Modal closed');
  }

  stopPropagation(event: Event) {
    event.stopPropagation();  // Stop click event propagation for clicks inside modal content
  }
}
