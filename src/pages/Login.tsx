import { type FormEvent } from "react";
import "../styles/App.css";
import useToken from "../contexts/TokenContext";
import { useNavigate } from "react-router";
import { useLogin } from "../api";

function Login() {
  const { saveToken } = useToken();
  const navigate = useNavigate();
  const { login } = useLogin();

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const passwd = formData.get("password") as string;

    //console.log("Logging in with:", { email, passwd });

    const result = await login({ email, passwd });
    console.log("Login result despues del login:", result);
    if (result) {
      saveToken(result.token);
      navigate("/expenses_summary");
    } else {
      alert(result);
    }
  }

  return (
    <div className="big-container">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Login
      </h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          placeholder="Email"
          type="email"
          name="email"
          required
        />
        <input
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          placeholder="Password"
          type="password"
          name="password"
          required
        />
        <button
          className="w-full bg-blue-600 text-black py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
          type="submit"
        >
          Log in
        </button>
        <button
          className="w-full bg-blue-600 text-black py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
          type="button"
          onClick={() => navigate("/signup")}
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default Login;
