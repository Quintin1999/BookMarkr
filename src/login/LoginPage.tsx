import React from 'react';
import Layout from '../components/Layout';
import './styles.css';

const LoginPage: React.FC = () => {
  return (
    <Layout>
      <div className="form-container">
        <h1>Login</h1>
        <form action="/api/login" method="POST" className="form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="example@email.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="password" required />
          </div>
          <button type="submit" className="button-primary">Login</button>
        </form>
        <p className="form-footer">
          Don’t have an account yet? <a href="/signup">Sign-up.</a>
        </p>
      </div>
    </Layout>
  );
};

export default LoginPage;
