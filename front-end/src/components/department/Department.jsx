import "./Department.css";
import React from "react";
import Loader from "../../components/loader/Loader.jsx";
import ServiceLister from "../../components/serviceLister/ServiceLister.jsx";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function Department() {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [serviceResults, setServiceResults] = useState([]);

  const getToken = () => {
    return Cookies.get("token") || "";
  };

  const getServices = (pageNumber) => {
    try {
      setLoading(true);
      fetch(`http://localhost:3000/api/partner/service-list/${pageNumber}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      })
        .then((data) => data.json())
        .then((response) => {
          if (response.success) {
            setServiceResults(response.services);
            setCurrentPage(Math.max(1, pageNumber));
          } else {
            alert(response.message);
          }
          setLoading(false);
        });
    } catch (error) {
      console.error("Error getting service list:", error);
    }
  };

  const setPageNumber = (num) => {
    getServices(num);
  };

  useEffect(() => {
    getServices(currentPage);
  }, []);

  return (
    <>
      <div className="department">
        {loading && <Loader />}
        <ServiceLister
          doneAction={getServices}
          setLoading={setLoading}
          serviceList={serviceResults}
          noEdit={true}
        />
      </div>
      <div className="page_seekers">
        <button onClick={() => setPageNumber(currentPage - 1)}>Prev</button>
        <div className="page_input">
          <span className="page_text">Page:</span>
          <input
            type="number"
            placeholder="Page Number"
            value={currentPage}
            onChange={(e) => setPageNumber(e.target.value)}
          />
        </div>
        <button onClick={() => setPageNumber(currentPage + 1)}>Next</button>
      </div>
    </>
  );
}

export default Department;
