


const Signup = ({ setIsLogin }) => {
  return (
    <div className="form signup-form">
      <input
        type="text"
        name="username"
        placeholder="username"
        className="input signup-input"
      />
      <input
        type="text"
        name="displayname"
        placeholder="displayname"
        className="input signup-input"
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        className="input signup-input"
      />
      <button className="button sign-up" onClick={() => setIsLogin(true)}>
        SIGN UP
      </button>
      <div className="separator">
        <hr />
      </div>
      <div className="message">
        <h5 className="error">error</h5>
        <h5 className="success">success</h5>
      </div>
    </div>
  );
};

export default Signup;
