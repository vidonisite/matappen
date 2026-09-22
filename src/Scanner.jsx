import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { supabase } from "./supabaseClient";
import "./Scanner.css";

function Scanner() {
  const scannerRef = useRef(null);
  const scannerStarted = useRef(false);

  const [product, setProduct] = useState(null);
  const [inventoryItem, setInventoryItem] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  async function startScanner() {
    if (scannerStarted.current) return;

    scannerStarted.current = true;

    const scanner = new Html5Qrcode("barcode-reader");
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 280,
            height: 120,
          },
        },
        async (decodedText) => {
          await handleBarcode(decodedText);
        },
        () => {}
      );
    } catch (error) {
      console.error("Kunde inte starta kameran:", error);
      setMessage(
        "Kunde inte starta kameran. Kontrollera att du har gett appen kameratillstånd."
      );
      scannerStarted.current = false;
    }
  }

  async function stopScanner() {
    if (!scannerRef.current) return;

    try {
      if (scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }

      await scannerRef.current.clear();
    } catch (error) {
      console.error("Kunde inte stänga kameran:", error);
    }

    scannerRef.current = null;
    scannerStarted.current = false;
  }

  async function handleBarcode(barcode) {
    await stopScanner();

    setLoadingProduct(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Du måste vara inloggad.");
      setLoadingProduct(false);
      return;
    }

    const { data: existingItem, error: inventoryError } = await supabase
      .from("inventory")
      .select("*")
      .eq("user_id", user.id)
      .eq("barcode", barcode)
      .maybeSingle();

    if (inventoryError) {
      console.error("Kunde inte kontrollera inventory:", inventoryError);
    }

    setInventoryItem(existingItem);

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(
          barcode
        )}.json?fields=product_name,image_url,image_front_url,image_front_small_url`
      );

      if (!response.ok) {
        throw new Error("Open Food Facts svarade inte korrekt.");
      }

      const data = await response.json();

      if (data.status !== 1 || !data.product) {
        setMessage("Produkten hittades inte i Open Food Facts.");
        setLoadingProduct(false);
        return;
      }

      const offProduct = data.product;

      setProduct({
        barcode,
        name: offProduct.product_name || "Okänd produkt",
        image:
          offProduct.image_front_url ||
          offProduct.image_url ||
          offProduct.image_front_small_url ||
          null,
      });
    } catch (error) {
      console.error("Kunde inte hämta produkten:", error);
      setMessage("Kunde inte hämta information om produkten.");
    }

    setLoadingProduct(false);
  }

  async function buyProduct() {
    if (!product) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    if (inventoryItem) {
      const newQuantity = Number(inventoryItem.quantity) + 1;

      const { data, error } = await supabase
        .from("inventory")
        .update({
          quantity: newQuantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", inventoryItem.id)
        .select()
        .single();

      if (error) {
        console.error("Kunde inte uppdatera varan:", error);
        return;
      }

      setInventoryItem(data);
      return;
    }

    const { data, error } = await supabase
      .from("inventory")
      .insert({
        user_id: user.id,
        barcode: product.barcode,
        name: product.name,
        image_url: product.image,
        quantity: 1,
      })
      .select()
      .single();

    if (error) {
      console.error("Kunde inte lägga till varan:", error);
      return;
    }

    setInventoryItem(data);
  }

  async function finishProduct() {
    if (!inventoryItem) return;

    const newQuantity = Number(inventoryItem.quantity) - 1;

    if (newQuantity <= 0) {
      const { error } = await supabase
        .from("inventory")
        .delete()
        .eq("id", inventoryItem.id);

      if (error) {
        console.error("Kunde inte ta bort varan:", error);
        return;
      }

      setInventoryItem(null);
      return;
    }

    const { data, error } = await supabase
      .from("inventory")
      .update({
        quantity: newQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", inventoryItem.id)
      .select()
      .single();

    if (error) {
      console.error("Kunde inte minska mängden:", error);
      return;
    }

    setInventoryItem(data);
  }

  function scanAgain() {
    setProduct(null);
    setInventoryItem(null);
    setMessage("");

    scannerStarted.current = false;

    setTimeout(() => {
      startScanner();
    }, 100);
  }

  if (loadingProduct) {
    return (
      <main className="scanner-page">
        <div className="scanner-loading">
          <p>Hämtar produkt...</p>
        </div>
      </main>
    );
  }

  if (product) {
    return (
      <main className="scanner-page">
        <div className="product-detail">
          <div className="product-detail-content">
            {product.image ? (
              <img
                className="product-detail-image"
                src={product.image}
                alt={product.name}
              />
            ) : (
              <div className="product-detail-no-image">
                📦
              </div>
            )}

            <h1>{product.name}</h1>
          </div>

          <div className="product-detail-buttons">
            <button
              className="buy-button"
              onClick={buyProduct}
            >
              Jag har köpt
            </button>

            {inventoryItem && (
              <button
                className="finished-button"
                onClick={finishProduct}
              >
                Tagit slut
              </button>
            )}

            <button
              className="scan-again-button"
              onClick={scanAgain}
            >
              Skanna igen
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="scanner-page">
      <div className="scanner-container">
        <div className="camera-view">
          <div id="barcode-reader"></div>
        </div>

        <p className="scanner-text">
          Rikta kameran mot streckkoden
        </p>

        {message && (
          <p className="scanner-message">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}

export default Scanner;