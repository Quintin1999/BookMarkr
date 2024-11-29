import React from 'react';


const SignupPage: React.FC = () => {
  return (

      <div className="form-container">
        <h1>Sign Up</h1>
        <form action="/api/signup" method="POST" className="form">
          <div className="form-group">
            <label htmlFor="nickname">Nickname</label>
            <input type="text" id="nickname" name="nickname" placeholder="e.g., Jane, John, etc." required />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input type="text" id="username" name="username" placeholder="username" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input type="email" id="email" name="email" placeholder="example@email.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input type="password" id="password" name="password" placeholder="password" required />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Verify Password *</label>
            <input type="password" id="confirm-password" name="confirm-password" placeholder="password" required />
          </div>
          <div className="form-group checkbox">
            <input type="checkbox" id="terms" name="terms" required />
            <label htmlFor="terms">Agree to <a href="/terms">Terms of Service</a></label>
          </div>
          <button type="submit" className="button-primary">Sign Up</button>
        </form>
        <p className="form-footer">
          Already have an account? <a href="/login">Login.</a>
        </p>
      </div>

  );
};

export default SignupPage;
