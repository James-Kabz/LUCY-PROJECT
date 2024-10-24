import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditItem from './EditItem';
import DeleteItem from './DeleteItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function CosmeticsShop() {
  const [records, setItemsData] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItemsData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/item/getAllItems');
      setItemsData(response.data);
      calculateTotalValue(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchItemsData();
  }, [fetchItemsData]);

  const calculateTotalValue = (items) => {
    let total = 0;
    items.forEach(item => {
      total += item.price * item.quantity_in_stock;
    });
    setTotalValue(total);
  };

  const handleUpdateItem = async () => {
    await fetchItemsData();
    toast.success('Item updated successfully!');
  };

  const handleDelete = async () => {
    await fetchItemsData();
    toast.success('Item deleted successfully!');
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  

  return (
    <div className="p-2">
      <div className="lg:max-w-lg bg-pink-500 rounded-lg shadow-md p-6 text-white">
        <h2 className="sm:text-xl lg:text-2xl font-extrabold mb-3">
          Total Value of Items in Stock
        </h2>
        <p className="sm:text-xl lg:text-2xl">KES {totalValue}</p>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center">Sales Analysis</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 sm:max-w-sm lg:max-w-7xl gap-6">
        {records.map((item, index) => (
          <div
            key={index}
            className="rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition duration-1000 ease-out bg-gray-100 shadow-gray-600 p-6 "
          >
            <h2 className="sm:text-xl lg:text-2xl font-extrabold mb-3">
              {item.item_name}
            </h2>
            <p className="sm:text-xl lg:text-2xl mb-2">
              Stock: {item.quantity_in_stock}
            </p>
            <p className="sm:text-xl lg:text-2xl">Price: KES {item.price}</p>
            <img
              src={item.image}
              alt={item.item_name}
              className="w-full rounded-xl mb-3"
              style={{ width: "90%", height: "400px", objectFit: "cover" }}
            />
            <div className="flex space-x-4">
              <button
                className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  setSelectedItem(item);
                  setShowUpdateModal(true);
                }}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  setSelectedItem(item);
                  setShowDeleteModal(true);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80">
          <div className="bg-white p-9 mt-5 lg:ml-20 rounded-lg max-w-sm lg:max-w-3xl w-full">
            <h2 className="text-3xl font-bold text-center mt-44 lg:mt-auto">
              Update Item
            </h2>
            <EditItem
              item={selectedItem}
              onClose={handleCloseUpdateModal}
              onUpdate={handleUpdateItem}
            />
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Delete Item</h2>
            <DeleteItem
              item={selectedItem}
              onClose={handleCloseDeleteModal}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default CosmeticsShop;
