import {useState} from "react";


      const apiUrl = "http://localhost:3000/api";
      // token management
      function getAuthToken() {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          alert("You must be logged in.");
          throw new Error("No JWT token found.");
        }
        return token;
      }

      // Login form submission
      export async function submitLoginForm(event) {
        event.preventDefault();
        const email = useState("loginEmail").value;
        const password = useState("loginPassword").value;

        try {
          const response = await fetch(
            "http://localhost:3000/api/users/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            }
          );
          const result = await response.json();
          if (response.ok) {
            localStorage.setItem("jwtToken", result.token);
            alert("Login successful");
            console.log("Login Successful");
          } else {
            alert("Login failed: " + result.message);
            console.log("Login Unsuccessful");
          }
        } catch (error) {
          console.error("Error during login:", error);
          alert("Error during login");
        }
      }

      //update account
      async function updateUserInfo() {
        const token = getAuthToken();
        if (!token) {
          alert("You must be logged in to update your account.");
          return;
        }

        const username = document.getElementById("updateUsername").value;
        const email = document.getElementById("updateEmail").value;
        const password = document.getElementById("updatePassword").value;

        const data = {};
        if (username) data.username = username;
        if (email) data.email = email;
        if (password) data.password = password;

        try {
          const response = await fetch(
            "http://localhost:3000/api/users/update",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(data),
            }
          );

          const result = await response.json();
          if (response.ok) {
            alert("Account updated successfully!");
          } else {
            alert("Error updating account: " + result.message);
          }
        } catch (error) {
          console.error("Error updating account:", error);
        }
      }

      // Delete account
      async function deleteUserAccount() {
        const token = getAuthToken();
        if (!token) {
          alert("You must be logged in to delete your account.");
          return;
        }

        if (
          !confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
          )
        ) {
          return;
        }

        try {
          const response = await fetch(
            "http://localhost:3000/api/users/delete",
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            alert("Account deleted successfully.");
            localStorage.removeItem("jwtToken");
            window.location.reload();
          } else {
            const result = await response.json();
            alert("Error deleting account: " + result.message);
          }
        } catch (error) {
          console.error("Error deleting account:", error);
        }
      }

      // Create Club
      async function submitCreateClubForm(event) {
        event.preventDefault();
        const token = getAuthToken();
        if (!token) {
          alert("No token found. Please login first.");
          return;
        }

        const form = document.getElementById("createClubForm");
        const data = {
          name: form.name.value,
          description: form.description.value,
          roomKey: form.roomKey.value,
        };

        try {
          const response = await fetch(
            "http://localhost:3000/api/club/create",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(data),
            }
          );
          const result = await response.json();
          if (response.ok) {
            alert("Club created successfully!");
          } else {
            alert("Error creating club: " + result.message);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }

      // Select Club for Update
      async function selectClubForUpdate() {
        const token = getAuthToken();
        if (!token) {
          alert("You must be logged in to update a club.");
          return;
        }

        try {
          const response = await fetch(
            "http://localhost:3000/api/club/my-clubs",
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!response.ok) {
            const result = await response.json();
            console.error("Error fetching clubs:", result);
            alert(
              "Error fetching clubs: " + (result.message || "Unknown error")
            );
            return;
          }

          const clubs = await response.json();
          const ownedClubs = clubs.filter((club) => club.role === "Owner");
          if (!ownedClubs.length) {
            alert("You do not own any clubs to update.");
            return;
          }
          const updateClubContainer = document.getElementById(
            "updateClubContainer"
          );
          const existingDropdown = document.getElementById(
            "clubSelectForUpdate"
          );
          if (existingDropdown) existingDropdown.remove();

          const dropdown = document.createElement("select");
          dropdown.id = "clubSelectForUpdate";

          ownedClubs.forEach((club) => {
            const option = document.createElement("option");
            option.value = club._id;
            option.textContent = club.name;
            dropdown.appendChild(option);
          });

          const confirmButton = document.createElement("button");
          confirmButton.textContent = "Confirm Selection";
          confirmButton.type = "button";
          confirmButton.addEventListener("click", () => {
            const selectedClubId = dropdown.value;
            document.getElementById("updateClubForm").style.display = "block";
            dropdown.remove();
            confirmButton.remove();
            document
              .getElementById("updateClubButton")
              .setAttribute("data-club-id", selectedClubId);
          });

          updateClubContainer.appendChild(dropdown);
          updateClubContainer.appendChild(confirmButton);
        } catch (error) {
          console.error("Error fetching clubs:", error);
          alert("Error fetching clubs. Check the console for details.");
        }
      }

      // Update the selected club
      async function updateSelectedClub() {
        const token = getAuthToken();
        const clubId = document
          .getElementById("updateClubButton")
          .getAttribute("data-club-id");

        if (!clubId) {
          alert("No club selected to update.");
          return;
        }

        const data = {
          name: document.getElementById("updateName").value,
          description: document.getElementById("updateDescription").value,
          roomKey: document.getElementById("updateRoomKey").value,
        };

        try {
          const response = await fetch(
            `http://localhost:3000/api/club/${clubId}/update`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(data),
            }
          );

          const result = await response.json();
          if (response.ok) {
            alert("Club updated successfully!");
          } else {
            alert("Error updating club: " + result.message);
          }
        } catch (error) {
          console.error("Error updating club:", error);
        }
      }

      // select for Delete Club
      async function selectClubForDeletion() {
        const token = getAuthToken();
        if (!token) {
          alert("You must be logged in to delete a club.");
          return;
        }

        try {
          const response = await fetch(
            "http://localhost:3000/api/club/my-clubs",
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!response.ok) {
            const result = await response.json();
            console.error("Error fetching clubs:", result);
            alert(
              "Error fetching clubs: " + (result.message || "Unknown error")
            );
            return;
          }

          const clubs = await response.json();
          const ownedClubs = clubs.filter((club) => club.role === "Owner");
          if (!ownedClubs.length) {
            alert("You do not own any clubs to delete.");
            return;
          }
          const deleteClubContainer = document.getElementById(
            "deleteClubContainer"
          );
          const existingDropdown = document.getElementById(
            "clubSelectForDelete"
          );
          if (existingDropdown) existingDropdown.remove(); // Remove any previous dropdown

          const dropdown = document.createElement("select");
          dropdown.id = "clubSelectForDelete";

          ownedClubs.forEach((club) => {
            const option = document.createElement("option");
            option.value = club._id;
            option.textContent = club.name;
            dropdown.appendChild(option);
          });

          const confirmButton = document.createElement("button");
          confirmButton.textContent = "Confirm Selection";
          confirmButton.type = "button";
          confirmButton.addEventListener("click", () => {
            const selectedClubId = dropdown.value;
            if (
              confirm(
                `Are you sure you want to delete the club "${
                  dropdown.options[dropdown.selectedIndex].text
                }"? This action cannot be undone.`
              )
            ) {
              deleteSelectedClub(selectedClubId);
            }
            dropdown.remove(); // Remove dropdown after selection
            confirmButton.remove();
          });

          deleteClubContainer.appendChild(dropdown);
          deleteClubContainer.appendChild(confirmButton);
        } catch (error) {
          console.error("Error fetching clubs:", error);
          alert("Error fetching clubs. Check the console for details.");
        }
      }

      // Delete the selected club
      async function deleteSelectedClub(clubId) {
        const token = getAuthToken();

        try {
          const response = await fetch(
            `http://localhost:3000/api/club/${clubId}/delete`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const result = await response.json();
          if (response.ok) {
            alert("Club deleted successfully!");
          } else {
            alert("Error deleting club: " + result.message);
          }
        } catch (error) {
          console.error("Error deleting club:", error);
          alert("Error deleting club. Check the console for details.");
        }
      }

      // Search Books
      async function searchBooks(event) {
        event.preventDefault();
        const query = document.getElementById("query").value;

        if (!query) {
          alert("Please enter a search term.");
          return;
        }

        try {
          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
              query
            )}`
          );
          const data = await response.json();

          const resultsContainer = document.getElementById("searchResults");
          resultsContainer.innerHTML = "";

          if (data.items && data.items.length > 0) {
            data.items.forEach((book) => {
              const bookDiv = document.createElement("div");

              // Button for adding to personal library
              const addToUserButton = document.createElement("button");
              addToUserButton.textContent = "Add to My Library";
              addToUserButton.addEventListener("click", () => {
                console.log("Adding book to personal library:", book.id);
                addBookToPersonalLibrary(book.id);
              });

              // Button for adding to club library
              const addToClubButton = document.createElement("button");
              addToClubButton.textContent = "Add to Club Library";
              console.log("Add to Club button created:", addToClubButton);
              addToClubButton.addEventListener("click", async () => {
                console.log("Add to Club button clicked");
                try {
                  const clubId = await selectClub();
                  console.log("Selected Club ID:", clubId);
                  if (clubId) {
                    console.log("Selected Club ID:", clubId);
                    await addBookToClubLibrary(book.id, clubId);
                  } else {
                    alert("No club selected.");
                  }
                } catch (error) {
                  console.error(
                    "Error during club selection or book addition:",
                    error
                  );
                }
              });

              bookDiv.innerHTML = `
                    <p><strong>${book.volumeInfo.title}</strong> by ${
                book.volumeInfo.authors?.join(", ") || "Unknown"
              }</p>
                `;
              bookDiv.appendChild(addToUserButton);
              bookDiv.appendChild(addToClubButton);

              resultsContainer.appendChild(bookDiv);
            });
          } else {
            resultsContainer.innerHTML = "<p>No results found.</p>";
          }
        } catch (error) {
          console.error("Error searching Google Books:", error);
          alert("Error searching books.");
        }
      }
      // Add Book to personal Library
      async function addBookToPersonalLibrary(bookId) {
        console.log("Adding to personal library. Book ID:", bookId);

        const token = getAuthToken();
        if (!token) {
          alert("You must be logged in to add books.");
          return;
        }

        const payload = { googleId: bookId, targetType: "user" };

        try {
          const response = await fetch("http://localhost:3000/api/books/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          const result = await response.json();
          console.log("API Response for personal library:", result); // Debugging

          if (response.ok) {
            alert("Book added to personal library successfully!");
          } else {
            console.error(
              "Error adding book to personal library:",
              result.message
            );
            alert(`Error: ${result.message}`);
          }
        } catch (error) {
          console.error("Error adding book to personal library:", error);
          alert("Error adding book to personal library.");
        }
      }

      // Select Club
      async function selectClub() {
        const token = getAuthToken();
        if (!token) {
          alert("You must be logged in to view your clubs.");
          return null;
        }

        console.log("Fetching clubs for user"); // Debugging
        try {
          const response = await fetch(
            "http://localhost:3000/api/club/my-clubs",
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!response.ok) {
            const result = await response.json();
            console.error("Error response from API:", result);
            alert(
              "Error fetching clubs: " + (result.message || "Unknown error")
            );
            return null;
          }

          const clubs = await response.json();
          console.log("Fetched clubs:", clubs); // Debugging

          if (!clubs.length) {
            alert("No clubs available to select.");
            return null;
          }

          const ownedClubs = clubs.filter((club) => club.role === "Owner");
          if (!ownedClubs.length) {
            alert("You do not own any clubs.");
            return null;
          }

          return new Promise((resolve) => {
            const existingDropdown = document.getElementById(
              "clubDropdownContainer"
            );
            if (existingDropdown) existingDropdown.remove(); // Avoid duplicates

            const dropdownContainer = document.createElement("div");
            dropdownContainer.id = "clubDropdownContainer";

            const dropdown = document.createElement("select");
            dropdown.id = "clubSelect";

            ownedClubs.forEach((club) => {
              const option = document.createElement("option");
              option.value = club._id;
              option.textContent = club.name;
              dropdown.appendChild(option);
            });

            const confirmButton = document.createElement("button");
            confirmButton.textContent = "Confirm";
            confirmButton.addEventListener("click", () => {
              const selectedClubId = dropdown.value;
              console.log("Confirmed club selection:", selectedClubId); // Debugging
              dropdownContainer.remove(); // Clean up
              resolve(selectedClubId); // Resolve with selected club ID
            });

            dropdownContainer.appendChild(dropdown);
            dropdownContainer.appendChild(confirmButton);

            document.body.appendChild(dropdownContainer); // Attach to DOM
            console.log("Dropdown and Confirm Button added to DOM"); // Debugging
          });
        } catch (error) {
          console.error("Error fetching clubs:", error);
          alert("Error fetching clubs. Check the console for details.");
          return null;
        }
      }

      // Add Book to Club Library
      async function addBookToClubLibrary(bookId, clubId) {
        console.log(
          "Adding to club library. Book ID:",
          bookId,
          "Club ID:",
          clubId
        );

        const token = getAuthToken();
        if (!token) {
          alert("You must be logged in to add books.");
          return;
        }

        const payload = { googleId: bookId, targetType: "club", clubId };
        console.log("Payload being sent:", payload); // Debugging

        try {
          const response = await fetch("http://localhost:3000/api/books/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          const result = await response.json();
          console.log("Response from API:", result); // Debugging

          if (response.ok) {
            alert("Book added to club library successfully!");
          } else {
            console.error("Error adding book to club library:", result.message);
            alert(`Error: ${result.message}`);
          }
        } catch (error) {
          console.error("Error adding book to club library:", error);
          alert("Error adding book to club library.");
        }
      }

      // Fetch Personal Library
      const fetchPersonalLibrary = async () => {
        try {
          const token = getAuthToken();
          const response = await fetch(
            "http://localhost:3000/api/users/library",
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!response.ok) throw new Error("Failed to fetch personal library");

          const library = await response.json();
          console.log("Personal Library Response:", library); // Check structure

          displayPersonalLibraryBooks(library); // Pass valid data structure
        } catch (error) {
          console.error("Error fetching personal library:", error);
        }
      };
      // Select Book for Personal Deletion
      async function selectBookForPersonalDeletion() {
        const token = getAuthToken();
        if (!token) {
          alert(
            "You must be logged in to delete a book from your personal library."
          );
          return;
        }

        try {
          const response = await fetch(
            "http://localhost:3000/api/users/library",
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!response.ok) {
            const result = await response.json();
            console.error("Error fetching personal library:", result);
            alert(
              "Error fetching personal library: " +
                (result.message || "Unknown error")
            );
            return;
          }

          const books = await response.json();
          if (!books.length) {
            alert("No books in your personal library to delete.");
            return;
          }

          const deletePersonalBookContainer = document.getElementById(
            "deletePersonalBookContainer"
          );
          const existingDropdown = document.getElementById(
            "bookSelectForPersonalDelete"
          );
          if (existingDropdown) existingDropdown.remove();

          const dropdown = document.createElement("select");
          dropdown.id = "bookSelectForPersonalDelete";

          books.forEach((book) => {
            const option = document.createElement("option");
            option.value = book._id;
            option.textContent = book.title;
            dropdown.appendChild(option);
          });

          const confirmButton = document.createElement("button");
          confirmButton.textContent = "Delete Book";
          confirmButton.type = "button";
          confirmButton.addEventListener("click", () => {
            const selectedBookId = dropdown.value;
            deleteBookFromPersonalLibrary(selectedBookId);
            dropdown.remove();
            confirmButton.remove();
          });

          deletePersonalBookContainer.appendChild(dropdown);
          deletePersonalBookContainer.appendChild(confirmButton);
        } catch (error) {
          console.error("Error fetching personal library:", error);
          alert(
            "Error fetching personal library. Check the console for details."
          );
        }
      }

      // Delete Book from Personal Library
      async function deleteBookFromPersonalLibrary(bookId) {
        const token = getAuthToken();

        try {
          const response = await fetch(
            `http://localhost:3000/api/users/library/${bookId}/delete`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const result = await response.json();
          if (response.ok) {
            alert("Book deleted from personal library successfully!");
          } else {
            alert("Error deleting book: " + result.message);
          }
        } catch (error) {
          console.error("Error deleting book from personal library:", error);
        }
      }

      // Select Book for Club Deletion
      async function selectBookForClubDeletion() {
        const token = getAuthToken();
        if (!token) {
          alert("You must be logged in to delete a book from a club library.");
          return;
        }

        try {
          const response = await fetch(
            "http://localhost:3000/api/club/my-clubs",
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!response.ok) {
            const result = await response.json();
            console.error("Error fetching clubs:", result);
            alert(
              "Error fetching clubs: " + (result.message || "Unknown error")
            );
            return;
          }

          const clubs = await response.json();
          const ownedClubs = clubs.filter((club) => club.role === "Owner");
          if (!ownedClubs.length) {
            alert("You do not own any clubs with books to delete.");
            return;
          }

          const deleteClubBookContainer = document.getElementById(
            "deleteClubBookContainer"
          );
          const existingDropdown = document.getElementById(
            "clubSelectForBookDelete"
          );
          if (existingDropdown) existingDropdown.remove();

          const dropdown = document.createElement("select");
          dropdown.id = "clubSelectForBookDelete";

          ownedClubs.forEach((club) => {
            const option = document.createElement("option");
            option.value = club._id;
            option.textContent = club.name;
            dropdown.appendChild(option);
          });

          const confirmButton = document.createElement("button");
          confirmButton.textContent = "Select Club";
          confirmButton.type = "button";
          confirmButton.addEventListener("click", () => {
            const selectedClubId = dropdown.value;
            dropdown.remove();
            confirmButton.remove();
            fetchBooksInClub(selectedClubId);
          });

          deleteClubBookContainer.appendChild(dropdown);
          deleteClubBookContainer.appendChild(confirmButton);
        } catch (error) {
          console.error("Error fetching clubs:", error);
          alert("Error fetching clubs. Check the console for details.");
        }
      }

      // Fetch Books in Club
      async function fetchBooksInClub(clubId) {
        const token = getAuthToken();

        try {
          const response = await fetch(
            `http://localhost:3000/api/club/${clubId}/library`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const books = await response.json();
          if (!response.ok) throw new Error("Failed to fetch club books");

          const deleteContainer = document.getElementById(
            "deleteClubBookContainer"
          );
          deleteContainer.innerHTML = ""; // Clear previous content

          if (books.length === 0) {
            deleteContainer.innerHTML = "<p>No books available to delete.</p>";
            return;
          }

          const dropdown = document.createElement("select");
          dropdown.id = "bookSelectForClubDelete";

          books.forEach((book) => {
            const option = document.createElement("option");
            option.value = book._id;
            option.textContent = book.title;
            dropdown.appendChild(option);
          });

          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete Book";
          deleteButton.type = "button";
          deleteButton.addEventListener("click", () => {
            const selectedBookId = dropdown.value;
            deleteBookFromClubLibrary(clubId, selectedBookId);
          });

          deleteContainer.appendChild(dropdown);
          deleteContainer.appendChild(deleteButton);
        } catch (error) {
          console.error("Error fetching books in club:", error);
        }
      }

      // Delete selected Book from Club Library
      async function deleteBookFromClubLibrary(clubId, bookId) {
        const token = getAuthToken();

        try {
          const response = await fetch(
            `http://localhost:3000/api/club/${clubId}/library/${bookId}/delete`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const result = await response.json();

          if (response.ok) {
            alert("Book deleted from club library successfully!");
            fetchBooksInClub(clubId); // Refresh book dropdown
          } else {
            alert("Error deleting book: " + result.message);
          }
        } catch (error) {
          console.error("Error deleting book from club library:", error);
        }
      }

      // Display personal library books in a dropdown
      function displayPersonalLibraryBooks(books) {
        const dropdown = document.getElementById("personalBookSelect");
        dropdown.innerHTML = ""; // Clear previous entries

        books.forEach((book) => {
          const option = document.createElement("option");
          option.value = book._id; // Ensure `book._id` matches API structure
          option.textContent = book.title || "Untitled"; // Use title or fallback
          dropdown.appendChild(option);
        });

        document.getElementById("createTaskPersonalForm").style.display =
          "block";
      }

      // Create a task for a personal library book
      async function createTaskForPersonalBook(event) {
        event.preventDefault();
        try {
          const token = getAuthToken();
          const bookId = document.getElementById("personalBookSelect").value;
          const description = document.getElementById(
            "personalTaskDescription"
          ).value;

          const response = await fetch(
            "http://localhost:3000/api/tasks/create",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ bookId, description }),
            }
          );

          const result = await response.json();

          if (response.ok) {
            alert("Task created successfully!");
            document.getElementById("personalTaskDescription").value = ""; // Clear the form
          } else {
            console.error("Error creating task:", result.message);
            alert(`Error: ${result.message}`);
          }
        } catch (error) {
          console.error("Error creating personal task:", error);
          alert("Error creating personal task.");
        }
      }

      // Fetch user's clubs
      async function fetchClubs() {
        try {
          const token = getAuthToken();
          const response = await fetch(
            "http://localhost:3000/api/club/my-clubs",
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!response.ok) throw new Error("Failed to fetch clubs");

          const clubs = await response.json();
          console.log("Fetched Clubs:", clubs); // Debugging
          if (!Array.isArray(clubs) || clubs.length === 0) {
            alert("No clubs found.");
            return;
          }

          displayClubs(clubs);
        } catch (error) {
          console.error("Error fetching clubs:", error);
          alert("Error fetching clubs.");
        }
      }

      // Display clubs in a dropdown and fetch their books
      function displayClubs(clubs) {
        const container = document.getElementById("clubContainer");
        container.innerHTML = ""; // Clear existing content

        const dropdown = document.createElement("select");
        dropdown.id = "clubSelect";

        clubs.forEach((club) => {
          const option = document.createElement("option");
          option.value = club._id;
          option.textContent = club.name;
          dropdown.appendChild(option);
        });

        const button = document.createElement("button");
        button.textContent = "Fetch Books";
        button.addEventListener("click", fetchBooksForSelectedClub);

        container.appendChild(dropdown);
        container.appendChild(button);
      }

      // Fetch books for the selected club
      async function fetchBooksForSelectedClub() {
        const clubId = document.getElementById("clubSelect").value;
        console.log("Selected Club ID:", clubId); // Debugging

        if (!clubId) {
          alert("No club selected.");
          return;
        }

        try {
          const token = getAuthToken();
          const response = await fetch(
            `http://localhost:3000/api/club/${clubId}/library`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const books = await response.json();
          console.log("API Response for Club Books:", books); // Debugging

          if (!response.ok) {
            throw new Error(
              `Error: ${books.message || "Failed to fetch books"}`
            );
          }

          if (!Array.isArray(books) || books.length === 0) {
            alert("No books available in the club library.");
            return;
          }

          displayClubBooks(books);
        } catch (error) {
          console.error("Error fetching books for the selected club:", error);
          alert("Error fetching books. Please check the console for details.");
        }
      }
      // Display club books in a dropdown
      function displayClubBooks(books) {
        const form = document.getElementById("createTaskClubForm");
        form.innerHTML = ""; // Clear previous content

        if (books.length === 0) {
          form.innerHTML = "<p>No books available in this club library.</p>";
          return;
        }

        const dropdown = document.createElement("select");
        dropdown.id = "clubBookSelect";

        books.forEach((book) => {
          const option = document.createElement("option");
          option.value = book._id; // Ensure `book._id` matches API structure
          option.textContent = book.title || "Untitled"; // Use title or fallback
          dropdown.appendChild(option);
        });

        const taskLabel = document.createElement("label");
        taskLabel.for = "clubTaskDescription";
        taskLabel.textContent = "Task Description:";

        const taskInput = document.createElement("input");
        taskInput.type = "text";
        taskInput.id = "clubTaskDescription";
        taskInput.required = true;

        const submitButton = document.createElement("button");
        submitButton.textContent = "Create Task";
        submitButton.id = "createTaskClubButton";
        submitButton.type = "button"; // Prevent form submission

        submitButton.addEventListener("click", createTaskForClubBook);

        form.appendChild(dropdown);
        form.appendChild(taskLabel);
        form.appendChild(taskInput);
        form.appendChild(submitButton);

        form.style.display = "block";
      }

      // Create a task for a club book
      async function createTaskForClubBook(event) {
        event.preventDefault();
        try {
          const token = getAuthToken();
          const bookId = document.getElementById("clubBookSelect").value;
          const description = document.getElementById(
            "clubTaskDescription"
          ).value;

          const response = await fetch(
            "http://localhost:3000/api/tasks/create",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ bookId, description }),
            }
          );

          const result = await response.json();

          if (response.ok) {
            alert("Task created successfully!");
            document.getElementById("clubTaskDescription").value = ""; // Clear the form
          } else {
            console.error("Error creating task:", result.message);
            alert(`Error: ${result.message}`);
          }
        } catch (error) {
          console.error("Error creating club task:", error);
          alert("Error creating club task.");
        }
      }

      //add comment to task
      async function addCommentToTask() {
        const token = getAuthToken();
        const taskId = document.getElementById("taskSelect").value;
        const bookId = document.getElementById("bookSelect").value;
        const content = document.getElementById("commentContent").value;

        // Log the payload to verify
        console.log("Payload to be sent:", { taskId, bookId, content });

        // Validate required fields
        if (!taskId || !bookId || !content) {
          alert("Please fill in all fields before adding a comment.");
          return;
        }

        try {
          const response = await fetch(`${apiUrl}/comments`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ taskId, bookId, content }),
          });

          if (response.ok) {
            alert("Comment added successfully!");
            document.getElementById("commentContent").value = ""; // Clear the input
          } else {
            const error = await response.json();
            console.error("Backend error response:", error); // Debugging backend error
            alert(`Error: ${error.message}`);
          }
        } catch (error) {
          console.error("Error adding comment:", error);
        }
      }
      // Fetch Clubs or Personal Library
      async function fetchLibraries(libraryType, clubId = null) {
        const token = getAuthToken();
        const endpoint =
          libraryType === "club" && clubId
            ? `${apiUrl}/club/${clubId}/library`
            : `${apiUrl}/users/library`;

        console.log("Fetching from endpoint:", endpoint); // Debugging

        const response = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorText = await response.text(); // Capture error response
          console.error("Error response from API:", errorText); // Debugging
          throw new Error(`Failed to fetch library: ${errorText}`);
        }

        const data = await response.json();
        console.log("Fetched library data:", data); // Debugging
        return data;
      }

      // Fetch Clubs
      async function fetchClubsForComments() {
        const token = getAuthToken();
        try {
          const response = await fetch(`${apiUrl}/club/my-clubs`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) {
            const errorText = await response.text(); // Debugging
            console.error(
              "Error response from API (comments fetch):",
              errorText
            );
            throw new Error("Failed to fetch clubs for comments.");
          }

          const clubs = await response.json();
          console.log("Fetched clubs for comments:", clubs); // Debugging
          return clubs;
        } catch (error) {
          console.error("Error fetching clubs for comments:", error);
          throw error;
        }
      }

      // Fetch Tasks for a Book
      async function fetchTasksForBook(bookId) {
        const token = getAuthToken();

        try {
          const response = await fetch(`${apiUrl}/tasks/book/${bookId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) {
            const errorText = await response.text(); // Debugging
            console.error("Error response from API (tasks fetch):", errorText);
            throw new Error("Failed to fetch tasks for the selected book.");
          }

          const tasks = await response.json();
          console.log("Fetched tasks for book:", tasks); // Debugging
          return tasks;
        } catch (error) {
          console.error("Error in fetchTasksForBook:", error);
          throw error;
        }
      }
      // Populate dropdowns
      function populateDropdown(dropdownId, items, textKey, valueKey) {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) {
          console.error(`Dropdown with ID "${dropdownId}" not found.`);
          return;
        }

        dropdown.innerHTML = ""; // Clear existing options

        if (!items || items.length === 0) {
          console.warn(`No items available for dropdown "${dropdownId}".`);
          const option = document.createElement("option");
          option.textContent = "No items available";
          option.disabled = true;
          dropdown.appendChild(option);
          return;
        }

        console.log(`Populating dropdown "${dropdownId}" with items:`, items);
        items.forEach((item) => {
          const option = document.createElement("option");
          option.value = item[valueKey];
          option.textContent = item[textKey];
          dropdown.appendChild(option);
        });
      }

      // Handle library type change
      document
        .getElementById("libraryTypeForm")
        .addEventListener("change", async (event) => {
          const libraryType = event.target.value; // personal or club
          const clubContainer = document.getElementById(
            "clubSelectionContainer"
          );
          const bookDropdown = document.getElementById("bookSelect");
          const taskDropdown = document.getElementById("taskSelect");

          // Clear dropdowns
          populateDropdown("bookSelect", [], "title", "_id");
          populateDropdown("taskSelect", [], "description", "_id");

          if (libraryType === "club") {
            clubContainer.style.display = "block";

            try {
              const clubs = await fetchClubsForComments(); // Use new function
              populateDropdown("clubSelect", clubs, "name", "_id");
            } catch (error) {
              console.error("Error fetching clubs for comments:", error);
            }
          } else {
            clubContainer.style.display = "none";

            try {
              const books = await fetchLibraries("personal");
              populateDropdown("bookSelect", books, "title", "_id");
            } catch (error) {
              console.error("Error fetching personal books:", error);
            }
          }
        });

      // Handle club selection change
      document
        .getElementById("clubSelect")
        .addEventListener("change", async () => {
          const clubId = document.getElementById("clubSelect").value;

          if (!clubId) {
            console.warn("No club selected.");
            return;
          }

          console.log(
            "Fetching books for selected club ID (comments):",
            clubId
          );

          try {
            populateDropdown("bookSelect", [], "title", "_id"); // Clear existing
            const books = await fetchLibraries("club", clubId);
            console.log("Books fetched for club:", books); // Debugging
            populateDropdown("bookSelect", books, "title", "_id");
          } catch (error) {
            console.error(
              "Error fetching books for selected club (comments):",
              error
            );
          }
        });

      // Handle book selection change
      document
        .getElementById("bookSelect")
        .addEventListener("change", async () => {
          const bookId = document.getElementById("bookSelect").value;

          if (!bookId) {
            console.warn("No book selected.");
            return;
          }

          console.log("Fetching tasks for selected book ID:", bookId);

          try {
            populateDropdown("taskSelect", [], "description", "_id"); // Clear existing tasks
            const tasks = await fetchTasksForBook(bookId);
            console.log("Tasks fetched for book:", tasks); // Debug fetched tasks
            populateDropdown("taskSelect", tasks, "description", "_id");
          } catch (error) {
            console.error("Error fetching tasks for the selected book:", error);
          }
        });
      // Add Comment
      document
        .getElementById("addCommentButton")
        .addEventListener("click", async () => {
          const taskId = document.getElementById("taskSelect").value;
          const bookId = document.getElementById("bookSelect").value;
          const content = document.getElementById("commentContent").value;

          if (!taskId || !bookId || !content) {
            alert("All fields are required to add a comment.");
            return;
          }

          console.log("Submitting comment payload:", {
            taskId,
            bookId,
            content,
          });

          try {
            const response = await fetch(`${apiUrl}/comments`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAuthToken()}`,
              },
              body: JSON.stringify({ taskId, bookId, content }),
            });

            if (response.ok) {
              alert("Comment added successfully!");
              document.getElementById("commentContent").value = ""; // Clear input
            } else {
              const error = await response.json();
              console.error("Backend error:", error);
              alert(`Error adding comment: ${error.message}`);
            }
          } catch (error) {
            console.error("Error adding comment:", error);
          }
        });
