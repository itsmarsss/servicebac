import "./Department.css";
import React from "react";
import Loader from "../../components/loader/Loader.jsx";
import ServiceLister from "../../components/serviceLister/ServiceLister.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import * as toast from "../../components/toastAlert/toastAlert";

function Department() {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [serviceResults, setServiceResults] = useState([]);
  const [resultsFor, setResultsFor] = useState("");

  const navigate = useNavigate();

  const getToken = () => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/signin");
    }
    return token;
  };

  const getServices = (pageNumber) => {
    try {
      setLoading(true);
      fetch(`/api/partner/service-list/${pageNumber}`, {
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
            toast.showSuccessAlert(`Fetched page ${pageNumber}`);
          } else {
            toast.showErrorAlert(response.message);
          }
          setLoading(false);
        });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const setPageNumber = (num) => {
    if (search !== "") {
      semanticSearch(Math.max(1, num));
    } else {
      getServices(Math.max(1, num));
    }
  };

  const semanticSearch = (pageNumber) => {
    if (search === "") {
      return;
    }

    try {
      setLoading(true);
      fetch(`/api/partner/search?terms=${search}&page=${pageNumber}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      })
        .then((data) => data.json())
        .then((response) => {
          if (response.success) {
            setResultsFor(search);
            setServiceResults(response.services);
            setCurrentPage(pageNumber);
            toast.showSuccessAlert("Fetched services");
          } else {
            toast.showErrorAlert(response.message);
          }
          setLoading(false);
        });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    getServices(currentPage);
  }, []);

  return (
    <>
      <div className="browse_method">
        <div className="semantic_search">
          <input
            className="semantic_input"
            type="text"
            placeholder="Search Terms"
            value={search}
            maxLength={200}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                semanticSearch(1);
              }
            }}
          />
          <button onClick={() => semanticSearch(1)}>Search</button>
        </div>
      </div>
      <div className="department">
        <div className="results_for">
          {resultsFor !== "" ? (
            <span>
              Results for <b>"{resultsFor}"</b>
            </span>
          ) : (
            <br />
          )}
        </div>

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
        <div className="page_input_cont">
          <span className="page_text">Page:</span>
          <input
            className="page_input"
            type="number"
            placeholder="Page Number"
            value={currentPage}
            onChange={() => {}}
            onBlur={(e) => setPageNumber(e.target.value)}
          />
        </div>
        <button onClick={() => setPageNumber(currentPage + 1)}>Next</button>
      </div>
    </>
  );
}

export default Department;
