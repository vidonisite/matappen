import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./Home.css";

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

    setProducts(data || []);
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
    return (
      <main className="app">
        <p>Laddar Skafferiet...</p>
      </main>
    );
  }

  return (
    <main className="app">
      <header className="header">
        <h1>Skafferiet</h1>

        <button className="scan-button">
          Skanna
        </button>
      </header>

      <div className="search-container">
        <input
          type="search"
          placeholder="Sök bland dina varor..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <section>
        <div className="section-header">
          <h2>Hemma</h2>
          <span>
            {products.length}{" "}
            {products.length === 1 ? "vara" : "varor"}
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <p>
            {products.length === 0
              ? "Du har inga varor i Skafferiet ännu."
              : "Inga varor matchar sökningen."}
          </p>
        ) : (
          <div className="product-list">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-icon">
                  {product.emoji || "📦"}
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>

                  {product.brand && <p>{product.brand}</p>}

                  <p>
                    {product.quantity} {product.unit || "st"}
                  </p>
                </div>

                <div className="quantity-controls">
                  <button
                    onClick={() => changeQuantity(product, -1)}
                    aria-label={`Minska mängden av ${product.name}`}
                  >
                    −
                  </button>

                  <span>{product.quantity}</span>

                  <button
                    onClick={() => changeQuantity(product, 1)}
                    aria-label={`Öka mängden av ${product.name}`}
                  >
                    +
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;
