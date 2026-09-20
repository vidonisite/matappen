import { useState } from "react";
import { supabase } from "./supabaseClient";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage(
          "Kontot är skapat! Kontrollera din e-post om Supabase ber dig bekräfta adressen."
        );
      }
    }

    setLoading(false);
  }

  return (
    <main>
      <h1>Skafferiet</h1>

      <h2>{isLogin ? "Logga in" : "Skapa konto"}</h2>

      <form onSubmit={handleSubmit}>
        <label>
          E-post
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Lösenord
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading
            ? "Laddar..."
            : isLogin
            ? "Logga in"
            : "Skapa konto"}
        </button>
      </form>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      <button
        type="button"
        onClick={() => {
          setIsLogin(!isLogin);
          setError("");
          setMessage("");
        }}
      >
        {isLogin
          ? "Har du inget konto? Skapa ett"
          : "Har du redan ett konto? Logga in"}
      </button>
    </main>
  );
}

export default Login;