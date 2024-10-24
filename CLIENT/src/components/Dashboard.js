import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // Import useAuth hook
import { ToastContainer, toast } from "react-toastify"; // Import toast for notifications
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast notifications
import { FaShoppingCart } from "react-icons/fa";

const CosmeticsShop = () => {
  const [records, setItemsData] = useState([]);
  const { userRole } = useAuth();
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemData, setNewItemData] = useState({
    item_name: "",
    price: "",
    image: "",
    quantity_in_stock: "",
  });
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  }); // Cart state
  const [showCart, setShowCart] = useState(false); // State to control cart visibility

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/item/getAllItems")
      .then((response) => setItemsData(response.data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  useEffect(() => {
    // Persist cart state to localStorage whenever it changes
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/item/addItem",
        newItemData
      );
      console.log("New item added:", response.data);

      // Refresh the item list
      axios
        .get("http://localhost:4000/api/item/getAllItems")
        .then((response) => setItemsData(response.data))
        .catch((error) => console.error("Error fetching items:", error));
      setShowAddItemModal(false);
      toast.success("Item added successfully!");
    } catch (error) {
      // console.error("Error adding item:", error);
      toast.error("Error adding item.");
    }
  };

  const handleNewItemDataChange = (e) => {
    const { name, value } = e.target;
    setNewItemData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddToCart = (item) => {
    setCart((prevCart) => {
      // Check if the item is already in the cart
      const existingItem = prevCart.find((item) => item.item_id);
      if (existingItem) {
        // Update the quantity if it exists
        return prevCart.map((item) =>
          item.item_id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Add the item to the cart with a quantity of 1
      return [...prevCart, { ...item, quantity: 1 }];
    });
    toast.success(`${item.item_name} added to cart!`); // Notify user
  };

  const handleRemoveFromCart = (item_id) => {
    setCart((prevCart) => prevCart.filter((item) => item.item_id !== item_id));
    toast.info("Item removed from cart."); // Notify user
  };

  const handleQuantityChange = (item_id, newQuantity) => {
    setCart((prevCart) => {
      return prevCart.map((item) =>
        item.item_id === item_id ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const handleMakeSale = async () => {
    for (const item of cart) {
      try {
        const saleData = {
          item_id: item.item_id,
          quantity_sold: item.quantity,
          total_price: item.price * item.quantity,
          sale_date: new Date(),
        };

        const response = await axios.post(
          "http://localhost:4000/api/sale/makeSale",
          saleData
        );

        if (response.status === 200) {
          toast.success(`Sale successful for ${item.item_name}!`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          });
        } else {
          toast.error(`Sale failed for ${item.item_name}`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error("Error making sale for item:", item, error);
        toast.error(`Sale failed for ${item.item_name}`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      }
    }

    // Clear cart and reset form
    setCart([]);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  ); // Calculate total price

  return (
    <div className="p-5">
        <div className="flex justify-between items-center">
          {(userRole === "super-admin" || userRole === "admin") && (
            <button
              className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowAddItemModal(true)}
            >
              Add Item
            </button>
          )}

          <button
            className="flex items-center bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded relative"
            onClick={() => setShowCart(true)}
          >
            <FaShoppingCart className="mr-2" />
            View Cart
            <span className="ml-2 bg-red-600 text-white rounded-full w-6 h-6 text-center leading-6 text-sm absolute -top-2 -right-2">
              {cart.length}
            </span>
          </button>
        </div>

        {/* items Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 sm:max-w-sm lg:max-w-7xl gap-6">
          {records.map((item) => (
            <div
              key={item.item_id}
              className="rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition duration-1000 ease-out bg-gray-100 shadow-gray-700 p-6"
            >
              <h2 className=" sm:text-xl lg:text-2xl font-extrabold mb-3">
                {item.item_name}
              </h2>
              <p className="sm:text-2xl lg:text-3xl mb-3">
                Price: KES {item.price}
              </p>
              <img
                src={item.image}
                alt={item.item_name}
                className="w-full rounded-xl mb-3"
                style={{ width: "90%", height: "400px", objectFit: "cover" }}
              />
              <button
                onClick={() => handleAddToCart(item)}
                className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80">
          <div className="bg-white p-6 rounded-lg" style={{ width: "600px" }}>
            <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
            {cart.length > 0 ? (
              <ul>
                {cart.map((item) => (
                  <li key={item.item_id} className="flex justify-between mb-2">
                    <span>
                      {item.item_name} (KES {item.price}) x
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={
                          (e) =>
                            handleQuantityChange(
                              item.item_id,
                              Number(e.target.value)
                            ) // Handle quantity change
                        }
                        className="w-16 ml-2 p-1 border rounded"
                      />
                    </span>
                    <button
                      className="text-red-600"
                      onClick={() => handleRemoveFromCart(item.item_id)} // Remove from cart
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No items in cart.</p>
            )}
            <div className="flex justify-between mt-4">
              <span className="font-bold text-lg">
                Total Price: KES {totalPrice}
              </span>
              <button
                onClick={handleMakeSale} // Handle making sale
                className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
              >
                Make Sale
              </button>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowCart(false)} // Close cart
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddItemModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80">
          <div
            className="bg-white p-16 lg:p-15 mt-44 lg:mt-20 rounded-lg"
            style={{ width: "800px", height: "auto" }}
          >
            <h2 className="text-3xl font-bold mb-6">Add New Item</h2>
            <form onSubmit={handleAddItem}>
              <div className="mb-6">
                <label
                  htmlFor="item_name"
                  className="block text-2xl font-bold mb-2"
                >
                  Item Name
                </label>
                <input
                  type="text"
                  id="item_name"
                  name="item_name"
                  value={newItemData.item_name}
                  onChange={handleNewItemDataChange}
                  className="input-field w-full p-4 bg-gray-200 rounded-md"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="item_name"
                  className="block text-2xl font-bold mb-2"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity_in_stock"
                  name="quantity_in_stock"
                  value={newItemData.quantity_in_stock}
                  onChange={handleNewItemDataChange}
                  className="input-field w-full p-4 bg-gray-200 rounded-md"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="price"
                  className="block text-2xl font-bold mb-2"
                >
                  Price
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={newItemData.price}
                  onChange={handleNewItemDataChange}
                  className="input-field w-full p-4 bg-gray-200 rounded-md"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="image"
                  className="block text-2xl font-bold mb-2"
                >
                  Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={newItemData.image}
                  onChange={handleNewItemDataChange}
                  className="input-field w-full p-4 bg-gray-200 rounded-md"
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Item
                </button>
              </div>
            </form>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => setShowAddItemModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <ToastContainer /> {/* Toast notifications container */}
    </div>
  );
};

export default CosmeticsShop;
