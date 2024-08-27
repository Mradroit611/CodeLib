// Define the structure of a single note
interface Note {
    description: string;
  }
  
  // Define the structure of the notes data
  interface NotesData {
    [topic: string]: {
      [heading: string]: Note;
    };
  }
  
  // Import JSON data
  import notesData from '../data/notes.json';
  
  // Export the typed data
  export { notesData, NotesData };
  