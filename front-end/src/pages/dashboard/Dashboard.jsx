import React from "react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

function Dashboard() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerms, setSearchTerms] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serviceIdToDelete, setServiceIdToDelete] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  useEffect(() => {
    auth(currentPage);
  }, [currentPage]);

  const getToken = () => {
    return Cookies.get("token") || "";
  };

  const auth = async (page) => {
    try {
      const response = await fetch(`/api/partner/service-list/${page}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `/api/partner/search?terms=${encodeURIComponent(searchTerms)}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response.data.success) {
        setSearchResults(response.data.services);
        setError(null);
      } else {
        setError("Search Failed. Please Try Again.");
      }
    } catch (error) {
      setError("Error, Please Try Again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (serviceId) => {
    try {
      const response = await axios.delete(`/api/partner/delete-service`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        data: {
          serviceId: serviceId,
        },
      });

      if (response.data.success) {
        setDeleteSuccess(true);
      } else {
        setDeleteSuccess(false);
      }
    } catch (error) {
      setDeleteSuccess(false);
      console.error("Error deleting service:", error);
    }
  };

  const handleDeleteService = () => {
    deleteService(serviceIdToDelete);
  };

  return (
    <>
      <div className="flex justify-center">
        <div>
          <div className="ml-10 space-y-10">
            <label
              for="default-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Semantic Search
            </label>
            <input
              type="text"
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
              placeholder="Enter search terms"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />

            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            >
              Search
            </button>

            <div>
              <label
                for="small-input"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Enter Service ID to Delete:
              </label>
              <input
                type="text"
                value={serviceIdToDelete}
                onChange={(e) => setServiceIdToDelete(e.target.value)}
                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <button
                onClick={handleDeleteService}
                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold mt-10 hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              >
                Delete Service
              </button>

              {deleteSuccess === true && <p>Service deleted successfully.</p>}
              {deleteSuccess === false && (
                <p style={{ color: "red" }}>
                  Error deleting service. Try again.
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {searchResults.length > 0 && (
            <div className="flex space-x-6 my-10 mx-10">
              <h2 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Search Results:
              </h2>
              {searchResults.slice(0, 3).map((service) => (
                <div key={service.serviceId}>
                  <a
                    href="#"
                    className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {service.serviceName}
                    </h5>
                    <p className=" text-gray-700 dark:text-gray-400 text-sm font-medium">
                      {service.category}
                    </p>
                    <p className=" text-gray-700 dark:text-gray-400 text-sm font-medium">
                      Similarity: {service.similarity}
                    </p>
                  </a>
                </div>
              ))}
            </div>
          )}

          {data.services && data.services.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mx-4 bg-gray-100 rounded-xl m-10 p-10">
              {data.services.map((e) => (
                <div className="px-4 mb-8" key={e.serviceId}>
                  <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {e.serviceName}
                    </h5>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                      ID: {e.serviceId}
                    </p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                      {e.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="m-10">
            <button
              className="bg-transparent mr-4 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={handlePrevPage}
            >
              Go Back
            </button>
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={handleNextPage}
            >
              Next Page
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
