export interface Book {
  _id: string;
  title: string;
  author: string[];
  year: number;
  thumbnail: string;
  description?: string;
  dateAdded?: string;
  onAdd?: () => void;
}

export interface BookCardProps {
  _id: string; // Add the book ID for navigation
  title: string;
  author: string[];
  year: number;
  thumbnail: string; // Add thumbnail to props
  // Triggered when "+" button is clicked
}
