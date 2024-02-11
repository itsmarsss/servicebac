import "./Department.css";
import React from "react";
import Loader from "../../components/loader/Loader.jsx";
import ServiceLister from "../../components/serviceLister/ServiceLister.jsx";
import ServiceViewer from "../../components/serviceViewer/ServiceViewer.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import * as toast from "../../components/toastAlert/toastAlert";

function Department() {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [semantic, setSemantic] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [serviceResults, setServiceResults] = useState([]);

  const [service, setService] = useState();
  const [serviceView, setServiceView] = useState(false);
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
      fetch(`/api/partner/search?terms=${search}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      })
        .then((data) => data.json())
        .then((response) => {
          if (response.success) {
            setServiceResults(response.services);
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
              maxLength={200}
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
          onClick={setService}
          onClickAction={setServiceView}
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
      {serviceView && (
        <ServiceViewer setServiceView={setServiceView} service={service} />
      )}
    </>
  );
}

export default Department;
