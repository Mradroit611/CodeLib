import { Component, ElementRef, HostListener, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTimes, faComments } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements AfterViewChecked {
  isOpen = false;
  messages: { text: string; fromBot: boolean }[] = [
    { text: "Hi there! How can I assist you today?", fromBot: true }
  ];
  input = '';
  hasNewMessages = false; // Initialize as false
  userIsAtBottom = true; // Track if user is at the bottom

  @ViewChild('chatbotRef') chatbotRef!: ElementRef;
  @ViewChild('messagesEnd') messagesEndRef!: ElementRef;

  constructor(library: FaIconLibrary) {
    library.addIcons(faTimes, faComments);
  }

  toggleChatbot() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.hasNewMessages = false; // Hide the new messages indicator when closing
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (this.isOpen && this.chatbotRef && !this.chatbotRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.hasNewMessages = false; // Hide the new messages indicator when clicking outside
    }
  }

  ngAfterViewChecked() {
    // Scroll to the bottom if user is at the bottom and new messages have been added
    if (this.userIsAtBottom) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    this.messagesEndRef?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  handleSend() {
    if (this.input.trim()) {
      this.messages.push({ text: this.input, fromBot: false });
      const botResponse = this.getChatbotResponse(this.input);
      this.messages.push({ text: botResponse, fromBot: true });
      this.input = '';
      this.hasNewMessages = true; // Show new messages indicator
      this.userIsAtBottom = true; // Ensure scroll to bottom is triggered
    }
  }

  getChatbotResponse(message: string): string {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hey') || lowerCaseMessage.includes('what\'s up')) {
      return "Hi there! How can I assist you today?";
    }

    // Responses for HTML
    if (lowerCaseMessage.includes('html')) {
      return "HTML (HyperText Markup Language) is the standard language for creating web pages. It describes the structure of web pages using markup tags.";
    }

    // Responses for CSS
    if (lowerCaseMessage.includes('css')) {
      return "CSS (Cascading Style Sheets) is used to style and layout web pages. It controls the visual appearance of HTML elements.";
    }

    // Responses for Node.js
    if (lowerCaseMessage.includes('node.js') || lowerCaseMessage.includes('node')) {
      return "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to build scalable network applications.";
    }

    // Responses for Express
    if (lowerCaseMessage.includes('express')) { 
      return "Express.js is a web application framework for Node.js. It provides a robust set of features to develop web and mobile applications.";
    }

    // Responses for React.js
    if (lowerCaseMessage.includes('react.js') || lowerCaseMessage.includes('react')) {
      return "React is a JavaScript library for building user interfaces. It allows you to create reusable UI components and manage the state of your application.";
    }

    if (lowerCaseMessage.includes('owner') || lowerCaseMessage.includes('ceo') || lowerCaseMessage.includes('founder') || lowerCaseMessage.includes('co founder') || lowerCaseMessage.includes('boss'))  {
      return "Sanjay Verma is the CEO and owner of this site. If you have any questions or need assistance, feel free to ask!";
    }
    

    // General web development questions
    if (lowerCaseMessage.includes('web development')) {
      return "Web development encompasses creating and maintaining websites. It includes front-end (client-side) and back-end (server-side) development.";
    }

    // Default response for unrecognized queries
    return "I'm not sure about that. Can I help with something else related to web development?";
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 1;
    this.userIsAtBottom = atBottom; // Update user scroll position
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
