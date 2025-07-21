import React, { useRef, useEffect, useState } from "react";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from '../utils/api';

const ProductCard = ({ price, discount, description, image }) => (
  <div className="w-[262px] h-[460px] rounded-[20px] shadow-sm snap-start flex flex-col bg-white">
    <div className="relative flex-1">
      <button className="absolute left-2 top-2 z-10">
        <Heart className="w-6 h-6 text-gray-400" />
      </button>
      <span className="absolute right-2 top-2 bg-orange-500 text-white text-sm px-2 py-1 rounded-md z-10">
        {discount}
      </span>
      <div className="rounded-lg p-6 flex justify-center items-center">
        <img
          src={image || "default.png"}
          alt="Product"
          className="w-[100px] h-[150px] object-contain"
        />
      </div>
    </div>

    <div className="mt-4 px-5 flex flex-col justify-between flex-1">
      <div className="flex mb-2">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <p className="text-gray-700 text-[18px] mb-2">{description}</p>
      <p className="text-xl font-bold text-[24px] mb-4">{price} AED</p>
      <Link to="/productDetails">
        <button className="w-[222px] h-[38px] bg-orange-400 hover:bg-orange-500 text-white rounded-full transition-colors mb-[20px] self-center">
          Add to Cart
        </button>
      </Link>
    </div>
  </div>
);

const ProductCarousel = () => {
  const scrollRef = useRef(null);
  const [scrollAmount, setScrollAmount] = useState(300);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Scroll responsiveness
  useEffect(() => {
    const updateScrollAmount = () => {
      if (window.innerWidth < 640) {
        setScrollAmount(270);
      } else if (window.innerWidth < 1024) {
        setScrollAmount(280);
      } else {
        setScrollAmount(300);
      }
    };
    updateScrollAmount();
    window.addEventListener("resize", updateScrollAmount);
    return () => window.removeEventListener("resize", updateScrollAmount);
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Fetch products
  const fetchInitialData = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get("/get-all-active-products", {
        params: { page },
      });

      const paginated = res.data.products || { data: [] };
      setProducts(paginated.data || []);
    } catch (error) {
      console.error("Initial load error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <div className="relative px-4 sm:px-10 lg:px-20 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        Our Best Seller
      </h1>

      {/* Scroll Buttons */}
      <div className="absolute top-6 right-4 flex gap-2 z-10">
        <button
          onClick={scrollLeft}
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={scrollRight}
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Product Scroll Area */}
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="inline-flex space-x-4 sm:space-x-6 w-max">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500">No products found.</p>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                price={product.price}
                discount={product.discount || "30%"}
                description={product.name || "No description"}
                image={product.image_url}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
