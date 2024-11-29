import React from 'react';

interface BookCardProps{
    title: string;
    author: string;
    year: number;
    onAdd:() => void;//triggered when + button is clicked
}

const BookCard: React.FC<BookCardProps> = ({title, author,year,onAdd})=>{
    return(
        <div className="book-card">
            <div className="book-cover">
                <button className="add-button" onClick={onAdd}>
                    +
                </button>
            </div>
            <div className="book-info">
                <h3 className="book-title">{title}</h3>
                <p className="book-author">{author}</p>
                <p className="book-year">{year}</p>
            </div>
        </div>
    );
};
//book card component, takes title, author, year arguments, and has handler for clicking add button. flexible to handle logged in and new user states
export default BookCard