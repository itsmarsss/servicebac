import "./Company.css";
import React from "react";
import Loader from "../../components/loader/Loader.jsx";
import ServiceLister from "../../components/serviceLister/ServiceLister.jsx";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function Company() {
  const [loading, setLoading] = useState(false);
  const [ownedServices, setOwnedServices] = useState([]);

  const getToken = () => {
    return Cookies.get("token") || "";
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
          } else {
            alert(response.message);
          }
          setLoading(false);
        });
    } catch (error) {
      console.error("Error getting dashboard:", error);
    }
  };

  useEffect(() => {
    getOwnedServices();
  }, []);

  return (
    <>
      <div className="company">
        <div className="title">Dashboard:</div>
        {loading && <Loader />}
        <ServiceLister
          doneAction={getOwnedServices}
          setLoading={setLoading}
          serviceList={ownedServices}
        />
      </div>
    </>
  );
}

export default Company;
