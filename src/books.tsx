const BookPage = () => {
    return (
        <>
        {/* <!-- Search Google Books --> */}
    <h2>Search Google Books</h2>
    <form id="searchBooksForm">
      <label htmlFor="query">Search:</label>
      <input type="text" name="query" id="query" required />
      <button type="button" id="searchBooksButton">Search</button>
    </form>
    <div id="searchResults"></div>

    {/* <!-- delete Book from personal Library --> */}
    <h2>Delete Book from Personal Library</h2>
    <div id="deletePersonalBookContainer">
      <button type="button" id="selectBookToDeleteFromPersonal">
        Select Book to Delete
      </button>
    </div>

    {/* <!-- delete Book from Club Library --> */}
    <h2>Delete Book from Club Library</h2>
    <div id="deleteClubBookContainer">
      <button type="button" id="selectBookToDeleteFromClub">
        Select Club and Book to Delete
      </button>
    </div>

    {/* <!-- Select Book from Personal Library to create a task --> */}
    <h2>Create task for personal Books</h2>
    <form id="createTaskPersonalForm">
      <button type="button" id="fetchPersonalLibraryButton">
        Fetch Personal Library
      </button>
      <label htmlFor="personalBookSelect">Select Book:</label>
      <select id="personalBookSelect"></select>

      <label htmlFor="personalTaskDescription">Task Description:</label>
      <input type="text" id="personalTaskDescription" required />

      <button type="button" id="createTaskPersonalButton">Create Task</button>
    </form>

        </>
    );
  };
  
  export default BookPage;