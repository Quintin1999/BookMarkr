import React from 'react';
import Footer from '../components/Footer';


const PersonalBook: React.FC = () => {
  return (
    <div className="personal-book-page">
      {/* Main Content */}
      <main className="content">
        {/* Left Column */}
        <section className="left-column">
          <div className="book-cover"></div>
          <h2>Title of the Book</h2>
          <p>Author Name</p>
          <p>Publication Year: 2024</p>
          <button className="status-button">To Be Read</button>
          <div className="metadata">
            <p><strong>Date Added:</strong> January 12, 2023</p>
            <p><strong>Date Completed:</strong> January 12, 2024</p>
          </div>
        </section>

        {/* Right Column */}
        <section className="right-column">
          {/* Description */}
          <p className="book-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <div className="book-stats">
            <p><strong>249 Pages</strong></p>
            <p><strong>23 Chapters</strong></p>
          </div>

          {/* Tasks */}
          <div className="tasks-section">
            <h3>Tasks</h3>
            <ul>
              <li>Read Chapter 1 - 5 <span>Due January 7th</span></li>
              <li>Read Chapter 6 - 10 <span>Due January 14th</span></li>
              <li>Read Chapter 11 - 15 <span>Due January 21st</span></li>
            </ul>
            <button className="create-task-button">Create Task</button>
          </div>

          {/* Comments */}
          <div className="comments-section">
            <h3>Comments</h3>
            <textarea placeholder="Add your comment..."></textarea>
            <button className="add-comment-button">Add Comment</button>
            <div className="comment-card">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
              </p>
              <span>December 4th, 2024</span>
              <div className="comment-tags">
                <button>Read Chapter 1-5</button>
                <button>Main Character</button>
              </div>
            </div>
            {/* Repeat CommentCard for additional comments */}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PersonalBook;
