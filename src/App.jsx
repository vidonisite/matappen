import { useState } from "react";

const initialProducts = [
  {
    id: 1,
    name: "Mjölk",
    quantity: 1,
    unit: "st",
    emoji: "🥛",
  },
  {
    id: 2,
    name: "Smör",
    quantity: 1,
    unit: "paket",
    emoji: "🧈",
  },
  {
    id: 3,
    name: "Tomater",
    quantity: 4,
    unit: "st",
    emoji: "🍅",
  },
  {
    id: 4,
    name: "Ägg",
    quantity: 8,
    unit: "st",
    emoji: "🥚",
  },
];

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");

  function decreaseQuantity(id) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id
          ? {
              ...product,
              quantity: Math.max(0, product.quantity - 1),
            }
          : product
      )
    );
  }

  function increaseQuantity(id) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id
          ? {
              ...product,
              quantity: product.quantity + 1,
            }
          : product
      )
    );
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <h1>Home Inventory</h1>

        <button className="scan-button">
          📷 Skanna
        </button>
      </header>

      <main>
        <div className="search-container">
          <input
            type="search"
            placeholder="Sök bland det hemma..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <section>
          <div className="section-header">
            <h2>Hemma</h2>
            <span>{products.length} varor</span>
          </div>

          <div className="product-list">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-icon">
                  {product.emoji}
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>

                  <p>
                    {product.quantity} {product.unit}
                  </p>
                </div>

                <div className="quantity-controls">
                  <button
                    onClick={() => decreaseQuantity(product.id)}
                    aria-label={`Ta bort en ${product.name}`}
                  >
                    −
                  </button>

                  <span>{product.quantity}</span>

                  <button
                    onClick={() => increaseQuantity(product.id)}
                    aria-label={`Lägg till en ${product.name}`}
                  >
                    +
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;