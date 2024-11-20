//@ts-ignore
import { submitLoginForm } from "../scripts.js";

const LoginButton =() => {
    return(
        <div>
        <h2>LOG IN HERE</h2>
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
    </div>
    );
};

export default LoginButton;