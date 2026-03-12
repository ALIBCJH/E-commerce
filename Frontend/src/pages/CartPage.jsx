import React, { useState } from "react";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [showMpesaForm, setShowMpesaForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const isValidPhone = /^0(7|1)\d{8}$/.test(phoneNumber);

  const handleMpesaPayment = (e) => {
    e.preventDefault();
    if (!isValidPhone) {
      setPaymentStatus("error");
      setPaymentMessage("Please enter a valid phone number.");
      return;
    }

    setPaymentStatus("loading");
    setPaymentMessage("");

    setTimeout(() => {
      if (Math.random() > 0.3) {
        setPaymentStatus("success");
        setPaymentMessage(
          "Payment request sent! Check your phone to complete."
        );
        clearCart();
        setShowMpesaForm(false);
        setPhoneNumber("");
      } else {
        setPaymentStatus("error");
        setPaymentMessage("Payment failed to initiate. Try again.");
      }
    }, 2000);
  };

  const goBackToHero = () => {
    const hero = document.getElementById("hero-section");
    if (hero) hero.scrollIntoView({ behavior: "smooth" });
    else window.location.href = "/";
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 gap-4 px-6">
        <p className="text-center text-xl text-gray-700 dark:text-gray-300">
          Your cart is empty.
        </p>
        <button
          onClick={goBackToHero}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-orange-600 mb-10">
        Your Cart
      </h1>

      <ul className="w-full max-w-3xl space-y-8">
        {cartItems.map(({ _id, name, price, image, quantity }) => {
          const safePrice = Number(price) || 0;
          const safeQty = Number(quantity) || 1;
          const itemTotal = (safePrice * safeQty).toFixed(2);

          return (
            <li
              key={_id}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 flex flex-wrap items-center justify-between gap-6 transition-transform transform hover:scale-[1.02] hover:shadow-orange-300"
            >
              <div className="flex items-center gap-6">
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    className="h-28 w-28 rounded-xl object-contain bg-gray-100 dark:bg-gray-700 p-2"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-28 w-28 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-xl text-gray-500">
                    No Image
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-orange-400">
                    {name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Ksh {itemTotal}{" "}
                    <span className="text-sm text-gray-400">
                      ({safeQty} × {safePrice.toFixed(2)})
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(_id)}
                disabled={paymentStatus === "loading"}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-full transition duration-300 disabled:opacity-50"
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>

      <div className="w-full max-w-3xl mt-12 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-2xl font-bold text-gray-800 dark:text-white">
          Total:{" "}
          <span className="text-orange-600">Ksh {totalPrice.toFixed(2)}</span>
        </p>

        {!showMpesaForm && (
          <button
            onClick={() => {
              setShowMpesaForm(true);
              setPaymentStatus(null);
              setPaymentMessage("");
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300"
          >
            Pay with M-Pesa
          </button>
        )}
      </div>

      {showMpesaForm && (
        <form
          onSubmit={handleMpesaPayment}
          className="w-full max-w-3xl mt-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 space-y-4"
        >
          <input
            type="tel"
            placeholder="Enter phone number (e.g. 0712345678)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            maxLength={10}
            pattern="0(7|1)[0-9]{8}"
            disabled={paymentStatus === "loading"}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <button
            type="submit"
            disabled={!isValidPhone || paymentStatus === "loading"}
            className={`w-full py-3 rounded-full font-semibold text-white transition duration-300 ${
              isValidPhone && paymentStatus !== "loading"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-green-300 cursor-not-allowed"
            }`}
          >
            {paymentStatus === "loading" ? "Processing..." : "Confirm Payment"}
          </button>

          {paymentMessage && (
            <p
              className={`text-center font-semibold ${
                paymentStatus === "success"
                  ? "text-green-700"
                  : paymentStatus === "error"
                  ? "text-red-600"
                  : ""
              }`}
            >
              {paymentMessage}
            </p>
          )}

          <button
            type="button"
            onClick={() => {
              setShowMpesaForm(false);
              setPhoneNumber("");
              setPaymentStatus(null);
              setPaymentMessage("");
            }}
            className="w-full py-2 text-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-white underline"
            disabled={paymentStatus === "loading"}
          >
            Cancel
          </button>
        </form>
      )}
    </section>
  );
};

export default CartPage;
