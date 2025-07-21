"use client";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, updateQuantity } from "../utils/cartSlice";

export default function ShoppingCart() {
  const cartItems = useSelector((store) => store.cart.items);
  const dispatch = useDispatch();

  // Local quantities state synced with redux quantities for UI responsiveness
  const [quantities, setQuantities] = useState({});

  // Sync local quantities state when cartItems change
  useEffect(() => {
    const qtys = {};
    cartItems.forEach((item) => {
      qtys[item.id] = item.quantity || 1;
    });
    setQuantities(qtys);
  }, [cartItems]);

  // Handle quantity change locally and dispatch to redux
  const updateQuantityHandler = (id, delta) => {
    const currentQty = quantities[id] || 1;
    const newQty = Math.max(1, currentQty + delta);
    setQuantities((prev) => ({ ...prev, [id]: newQty }));
    dispatch(updateQuantity({ id, quantity: newQty }));
  };

  // Remove item from cart
  const remove = (id) => {
    dispatch(removeItem({ id }));
  };

  // Calculate totals
  const orderPrice = cartItems.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] || 1),
    0
  );
  const gstRate = 0;
  const gst = Math.round(orderPrice * gstRate);
  const total = orderPrice + gst;         

  return (
    <div className="min-h-screen bg-[#F5F6ED] p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6 px-2 sm:px-4 md:px-6 lg:px-[48px]">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl" style={{ fontFamily: "Arial, sans-serif" }}>
          Shopping Cart
        </h2>
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-10">
          <div className="w-full lg:w-[70%] space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500 text-lg">Your cart is empty.</p>
            ) : (
              cartItems.map((product) => (
                <div
                  key={product.id}
                  className="relative flex flex-col justify-between rounded-lg bg-[#F5F6ED]"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-2 sm:p-3">
                    <button
                      onClick={() => remove(product.id)}
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>

                    <div className="flex gap-2 sm:gap-4 pb-2 sm:pb-4">
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="h-16 w-16 sm:h-20 sm:w-20 object-cover"
                        />
                        <div className="flex lg:hidden items-center rounded-full border border-[#FF9B57] px-1 sm:px-2">
                          <button
                            onClick={() => updateQuantityHandler(product.id, -1)}
                            className="p-1 sm:p-2 text-black"
                          >
                            -
                          </button>
                          <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">
                            {quantities[product.id]}
                          </span>
                          <button
                            onClick={() => updateQuantityHandler(product.id, 1)}
                            className="p-1 sm:p-2 text-black"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col h-[70px] sm:h-[90px] justify-between">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 max-w-[160px] sm:max-w-[220px]">
                      {product.name}
                    </p>

                    <div className="flex flex-col text-[10px] sm:text-xs text-gray-600 leading-tight">
                    <span className="text-[10px] sm:text-xs capitalize">
                      Size: {product.size || "N/A"}
                    </span>

                      <span>
                        DH {product.price} x {quantities[product.id]} ={" "}
                        <span className="font-medium text-black">
                          DH {(product.price * quantities[product.id]).toFixed(2)}
                        </span>
                      </span>
                    </div>
                  </div>

                    </div>

                    <div className="hidden lg:flex items-center rounded-full border border-[#FF9B57] px-2">
                      <button
                        onClick={() => updateQuantityHandler(product.id, -1)}
                        className="p-2 text-black"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {quantities[product.id]}
                      </span>
                      <button
                        onClick={() => updateQuantityHandler(product.id, 1)}
                        className="p-2 text-black"
                      >
                        +
                      </button>
                    </div>

                    <span className="absolute top-2 right-8 sm:right-10 text-sm sm:text-base lg:static lg:font-medium lg:text-lg lg:pr-20">
                    DH {(product.price * quantities[product.id]).toFixed(2)}
                    </span>
                  </div>

                  <div className="h-[1px] w-full bg-[#636363B2]"></div>
                </div>
              ))
            )}
          </div>

          <div className="w-full lg:w-[30%] rounded-lg bg-white p-3 sm:p-4 shadow-[0_2px_4px_rgba(0,0,0,0.05)] h-fit mt-4 lg:mt-0">
            <h3 className="mb-2 sm:mb-3 text-base sm:text-lg font-medium">Your Order</h3>
            <div className="space-y-2">
              <div className="flex items-center rounded-full bg-[#F5F6ED]">
                <input
                  type="text"
                  placeholder="Promo Code"
                  className="flex-1 bg-transparent px-2 sm:px-3 py-1 text-xs sm:text-sm outline-none"
                />
                <button className="rounded-full bg-orange-500 px-2 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm text-black">
                  Apply
                </button>
              </div>
              <div className="space-y-1 sm:space-y-2 border-gray-100">
                <div className="flex justify-between text-xs sm:text-sm border-b pb-1 sm:pb-2 mt-3 sm:mt-4">
                  <span className="text-[#636363]">Order Price</span>
                  <span>DH {orderPrice}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm border-b pb-1">
                  <span className="text-[#636363]">Discount</span>
                  <span>DH 0</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm border-b pb-1">
                  <span className="text-[#636363]">Promo Code</span>
                  <span>DH 0</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm border-b pb-1">
                  <span className="text-[#636363]">VAT (0%)</span>
                  <span>DH {gst}</span>
                </div>
              </div>
              <div className="flex justify-between text-base sm:text-lg font-bold mt-4">
                <span>Total</span>
                <span>DH {total}</span>
              </div>
             
              <Link
                to="/checkout"
                state={{ cartItems, quantities, total}}   // Pass cartItems and quantities state
                className="block bg-orange-500 text-black font-semibold py-3 px-4 rounded-lg mt-5 text-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
