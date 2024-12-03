import React from "react";
const Debug: React.FC = () => {
    return(
        <div>
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
<h1>API Testing Form</h1>


<h2>Create User</h2>
<form action="http://localhost:3000/api/users/create" method="POST">
  <label htmlFor="username">Username:</label>
  <input type="text" name="username" id="username" required /><br />

  <label htmlFor="email">Email:</label>
  <input type="email" name="email" id="email" required /><br />

  <label htmlFor="password">Password:</label>
  <input type="password" name="password" id="password" required /><br />

  <button type="submit">Create User</button>
</form>


<h2>Login</h2>
<form id="loginForm">
  <label htmlFor="loginEmail">Email:</label>
  <input type="email" id="loginEmail" name="email" required /><br />

  <label htmlFor="loginPassword">Password:</label>
  <input
    type="password"
    id="loginPassword"
    name="password"
    required
  /><br />
  <button type="submit">Login</button>
</form>


<h2>Update Account</h2>
<form id="updateUserForm">
  <label htmlFor="updateUsername">New Username:</label>
  <input type="text" id="updateUsername" name="username" /><br />

  <label htmlFor="updateEmail">New Email:</label>
  <input type="email" id="updateEmail" name="email" /><br />

  <label htmlFor="updatePassword">New Password:</label>
  <input type="password" id="updatePassword" name="password" /><br />

  <button type="button" id="updateUserButton">Update</button>
</form>


<h2>Delete Account</h2>
<button type="button" id="deleteUserButton">Delete My Account</button>


<h2>Create Club</h2>
<form id="createClubForm">
  <label htmlFor="name">Club Name:</label>
  <input type="text" name="name" id="name" required /><br />

  <label htmlFor="description">Description:</label>
  <input type="text" name="description" id="description" /><br />

  <label htmlFor="roomKey">Room Key:</label>
  <input type="text" name="roomKey" id="roomKey" required /><br />

  <button type="button" id="createClubButton">Create Club</button>
</form>


<h2>Update Club</h2>
<div id="updateClubContainer">
  <button type="button" id="selectClubToUpdateButton">
    Select Club to Update
  </button>
</div>
<form id="updateClubForm">
  <label htmlFor="updateName">New Club Name:</label>
  <input type="text" id="updateName" name="name" /><br />

  <label htmlFor="updateDescription">New Description:</label>
  <input type="text" id="updateDescription" name="description" /><br />

  <label htmlFor="updateRoomKey">New Room Key:</label>
  <input type="text" id="updateRoomKey" name="roomKey" /><br />

  <button type="button" id="updateClubButton">Update Club</button>
</form>


<h2>Delete Club</h2>
<div id="deleteClubContainer">
  <button type="button" id="selectClubToDeleteButton">
    Select Club to Delete
  </button>
</div>


<h2>Search Google Books</h2>
<form id="searchBooksForm">
  <label htmlFor="query">Search:</label>
  <input type="text" name="query" id="query" required />
  <button type="button" id="searchBooksButton">Search</button>
</form>
<div id="searchResults"></div>


<h2>Delete Book from Personal Library</h2>
<div id="deletePersonalBookContainer">
  <button type="button" id="selectBookToDeleteFromPersonal">
    Select Book to Delete
  </button>
</div>

<h2>Delete Book from Club Library</h2>
<div id="deleteClubBookContainer">
  <button type="button" id="selectBookToDeleteFromClub">
    Select Club and Book to Delete
  </button>
</div>


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


<h2>Create Task for Club Library Book</h2>
<div id="clubContainer">
  <button type="button" id="fetchClubsButton">Fetch Clubs</button>
</div>
<form id="createTaskClubForm" >
  <label htmlFor="clubTaskDescription">Task Description:</label>
  <input type="text" id="clubTaskDescription" required />
  <button type="button" id="createTaskClubButton">Create Task</button>
</form>

<h2>Select Library Type</h2>
<form id="libraryTypeForm">
  <label>
    <input type="radio" name="libraryType" value="personal" checked />
    Personal Library
  </label>
  <label>
    <input type="radio" name="libraryType" value="club" />
    Club Library
  </label>
</form>


<div id="clubSelectionContainer">
  <label htmlFor="clubSelect">Select Club:</label>
  <select id="clubSelect"></select>
</div>


<h2>Select Book</h2>
<div>
  <label htmlFor="bookSelect">Select Book:</label>
  <select id="bookSelect"></select>
</div>


<h2>Select Task</h2>
<div>
  <label htmlFor="taskSelect">Select Task:</label>
  <select id="taskSelect"></select>
</div>


<h2>Add Comment</h2>
<form id="addCommentForm">
  <label htmlFor="commentContent">Comment:</label>
  <textarea id="commentContent" required></textarea>
  <button type="button" id="addCommentButton">Add Comment</button>
</form>
</div>
    );
}

export default Debug;