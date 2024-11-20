const UserPage = () => {
  return (
    <>
    {/* <!-- Create User --> */}
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

    {/* <!-- Login --> */}
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

    {/* <!--Update account--> */}
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

    {/* <!--Delete account--> */}
    <h2>Delete Account</h2>
    <button type="button" id="deleteUserButton">Delete My Account</button>

    </>
  );
};

export default UserPage;


//for is htmlFor
//class is className