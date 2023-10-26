import { useState } from "react";
import { useAppSelector } from "../app/hooks";
import { Navigate } from "react-router-dom";

function Authentication({ loginCheck }: any) {
  const [login, setLogin] = useState("");

  const currentStatus = useAppSelector((state) => state.recordStatus);

  const handleLogin = () => {
    loginCheck(login);
    console.log(`Logging in with login: ${login}`);
  };

  if (currentStatus.status.options !== "login") {
    return <Navigate replace to="/daily-records" />;
  } else {
    return (
      <div className="main-content">
        <h2>Authentication</h2>
        {/* <label>Login:</label>
        <form onSubmit={handleLogin}>
          <div>
            <label>Enter your login:</label>
            <input
              type="text"
              name="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </form> */}
        <input
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="custom-input"
        />
        <button onClick={handleLogin} className="login-button">
          Login
        </button>
      </div>
    );
  }
}

export default Authentication;
