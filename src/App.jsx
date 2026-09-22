import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Login from "./Login";
import Home from "./Home";
import BottomNav from "./BottomNav";
import Scanner from "./Scanner";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("hem");

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

  return (
    <>
      {currentPage === "hem" && <Home />}

      {currentPage === "kamera" && <Scanner />}

      {currentPage === "handling" && (
        <main>
          <h1>Handlingslista</h1>
        </main>
      )}

      <BottomNav
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}

export default App;
