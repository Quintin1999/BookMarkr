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

export interface Task {
  _id: string;
  description: string;
  status: string;
}

export interface Comment {
  _id: string;
  taskId: string;
  content: string;
  userId: {
    _id: string;
    username: string;
  };
}
