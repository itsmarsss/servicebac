import "./Company.css";
import React from "react";
import Loader from "../../components/loader/Loader.jsx";
import ServiceLister from "../../components/serviceLister/ServiceLister.jsx";
import ServiceViewer from "../../components/serviceViewer/ServiceViewer.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import * as toast from "../../components/toastAlert/toastAlert";

function Company() {
  const [loading, setLoading] = useState(false);
  const [ownedServices, setOwnedServices] = useState([]);

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

  const getOwnedServices = () => {
    try {
      setLoading(true);
      fetch("http://localhost:3000/api/partner/owned-services", {
        method: "GET",
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      })
        .then((data) => data.json())
        .then((response) => {
          if (response.success) {
            setOwnedServices(response.services);
            toast.showSuccessAlert("Fetched all owned services");
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
    getOwnedServices();
  }, []);

  return (
    <>
      <div className="company">
        {loading && <Loader />}
        <ServiceLister
          doneAction={getOwnedServices}
          setLoading={setLoading}
          onClick={setService}
          onClickAction={setServiceView}
          serviceList={ownedServices}
          noEdit={false}
        />
      </div>
      {serviceView && (
        <ServiceViewer setServiceView={setServiceView} service={service} />
      )}
    </>
  );
}

export default Company;
