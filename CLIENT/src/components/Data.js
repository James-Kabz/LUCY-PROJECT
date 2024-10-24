import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const DataPage = () => {
  const [sales, setSales] = useState([]);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const history = useHistory();

  const handleSearch = (e) => {
    e.preventDefault();
    history.push(`/Data?sale_date=${searchQuery}`);
  };

  useEffect(() => {
    const fetchSales = async () => {
      const query = new URLSearchParams(location.search);
      const saleDate = query.get("sale_date");

      try {
        const response = await axios.get(
          "http://localhost:4000/api/sale/getAllSales"
        );
        const salesData = response.data;

        let filteredSales = salesData;
        if (saleDate) {
          filteredSales = salesData.filter((sale) => {
            const saleDateString = new Date(
              sale.sale_date
            ).toLocaleDateString();
            const searchDateString = new Date(saleDate).toLocaleDateString();
            return saleDateString === searchDateString;
          });
        }

        const salesWithItemData = await Promise.all(
          filteredSales.map(async (sale) => {
            const itemResponse = await axios.get(
              `http://localhost:4000/api/item/getitem/${sale.item_id}`
            );
            return {
              ...sale,
              item_name: itemResponse.data.item_name,
              image: itemResponse.data.image,
            };
          })
        );

        setSales(salesWithItemData);
      } catch (error) {
        console.error("Error fetching sales", error);
      }
    };

    fetchSales();
  }, [location.search]);

  return (
    <div className="container mx-auto mt-10 p-5 sm:p-0 lg:mt-10">
      {/* Search Form */}
      <div className="flex-grow">
        <form
          className="flex items-center justify-center lg:justify-start w-full"
          onSubmit={handleSearch}
        >
          <input
            type="date"
            placeholder="Search by Date"
            className="bg-gray-100 border border-gray-300 rounded-md py-2 px-4 w-full lg:w-96 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition duration-300 ease-in-out"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 bg-pink-600 text-white font-semibold rounded-md py-2 px-4 hover:bg-pink-500 transition duration-300 ease-in-out"
          >
            Search
          </button>
        </form>
      </div>
      <h2 className="text-3xl font-semibold mb-6">
        Sales on {new URLSearchParams(location.search).get("sale_date")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sales.map((sale) => (
          <div
            key={sale.id}
            className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={sale.image}
              alt={sale.item_name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold mb-2">{sale.item_name}</h3>
              <p>
                <strong>Quantity Sold:</strong> {sale.quantity_sold}
              </p>
              <p>
                <strong>Total Price:</strong> {sale.total_price}
              </p>
              <p>
                <strong>Sale Date:</strong>{" "}
                {new Date(sale.sale_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataPage;
