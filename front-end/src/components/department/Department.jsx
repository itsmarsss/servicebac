import "./Department.css";
import React from "react";
import Loader from "../../components/loader/Loader.jsx";
import ServiceLister from "../../components/serviceLister/ServiceLister.jsx";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function Department() {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [semantic, setSemantic] = useState(false);
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
            setCurrentPage(pageNumber);
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
    getServices(Math.max(1, num));
  };

  const selectBrowser = (id) => {
    switch (id) {
      case 0:
        setSemantic(false);
        break;
      case 1:
        setSemantic(true);
        break;
    }
  };

  const semanticSearch = () => {
    try {
      setLoading(true);
      fetch(`http://localhost:3000/api/partner/search?terms=${search}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      })
        .then((data) => data.json())
        .then((response) => {
          if (response.success) {
            setServiceResults(response.services);
          } else {
            alert(response.message);
          }
          setLoading(false);
        });
    } catch (error) {
      console.error("Error searching services:", error);
    }
  };

  useEffect(() => {
    getServices(currentPage);
  }, []);

  return (
    <>
      <div className="browse_method">
        <div className="browse_method_buttons">
          <button
            className={semantic ? "" : "active"}
            onClick={() => selectBrowser(0)}
          >
            All Listing
          </button>
          <button
            className={semantic ? "active" : ""}
            onClick={() => selectBrowser(1)}
          >
            Semantic Search
          </button>
        </div>
        {semantic && (
          <div className="semantic_search">
            <span className="search_title">Search:</span>
            <input
              type="text"
              placeholder="Search Terms"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={() => semanticSearch()}>Search</button>
          </div>
        )}
      </div>
      <div className="department">
        {loading && <Loader />}
        <ServiceLister
          doneAction={getServices}
          setLoading={setLoading}
          serviceList={serviceResults}
          noEdit={true}
        />
      </div>
      {!semantic && (
        <div className="page_seekers">
          <button onClick={() => setPageNumber(currentPage - 1)}>Prev</button>
          <div className="page_input">
            <span className="page_text">Page:</span>
            <input
              type="number"
              placeholder="Page Number"
              value={currentPage}
              onChange={() => {}}
              onBlur={(e) => setPageNumber(e.target.value)}
            />
          </div>
          <button onClick={() => setPageNumber(currentPage + 1)}>Next</button>
        </div>
      )}
    </>
  );
}

export default Department;
