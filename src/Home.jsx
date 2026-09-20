import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("user_id", user.id)
      .order("name");

    if (error) {
      console.error("Kunde inte hämta inventory:", error);
      setLoading(false);
      return;
    }

    setProducts(data);
    setLoading(false);
  }

  async function changeQuantity(product, amount) {
    const newQuantity = Number(product.quantity) + amount;

    if (newQuantity <= 0) {
      const { error } = await supabase
        .from("inventory")
        .delete()
        .eq("id", product.id);

      if (error) {
        console.error("Kunde inte ta bort produkten:", error);
        return;
      }

      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      );

      return;
    }

    const { data, error } = await supabase
      .from("inventory")
      .update({
        quantity: newQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.id)
      .select()
      .single();

    if (error) {
      console.error("Kunde inte ändra mängden:", error);
      return;
    }

    setProducts((current) =>
      current.map((item) => (item.id === product.id ? data : item))
    );
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <p>Laddar Skafferiet...</p>;
  }

  return (
    <main>
      <h1>Skafferiet</h1>

      <input
        type="search"
        placeholder="Sök bland dina varor..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {filteredProducts.length === 0 ? (
        <p>
          {products.length === 0
            ? "Du har inga varor i Skafferiet ännu."
            : "Inga varor matchar sökningen."}
        </p>
      ) : (
        <div>
          {filteredProducts.map((product) => (
            <article key={product.id}>
              <div>
                <span>{product.emoji || "📦"}</span>

                <div>
                  <h2>{product.name}</h2>

                  {product.brand && <p>{product.brand}</p>}

                  <p>
                    {product.quantity} {product.unit || "st"}
                  </p>
                </div>
              </div>

              <div>
                <button onClick={() => changeQuantity(product, -1)}>
                  −
                </button>

                <span>{product.quantity}</span>

                <button onClick={() => changeQuantity(product, 1)}>
                  +
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Home;