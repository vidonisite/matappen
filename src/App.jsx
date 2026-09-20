import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Login from "./Login";
import Home from "./Home";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setLoading(false);
    }

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <p>Laddar...</p>;
  }

  if (!session) {
    return <Login />;
  }

  return <Home />;
}

export default App;