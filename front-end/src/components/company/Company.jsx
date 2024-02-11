import "./Company.css";
import React from "react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function Company() {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [ownedServices, setOwnedServices] = useState([]);

  const getToken = () => {
    return Cookies.get("token") || "";
  };

  useEffect(() => {
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
            navigator("/login");
          }
          setLoading(false);
        });
    } catch (error) {
      console.error("Error getting dashboard:", error);
    }
  }, []);

  return (
    <>
      <div className="company">
        <div className="title">Dashboard:</div>
        <div className="owned_services">
          {loading && <h1>Loading...</h1>}

          {ownedServices.length > 0 && (
            <>
              {ownedServices.map((service) => (
                <div key={service.serviceId}>
                  <div href="#" className="service">
                    <div className="service_details">
                      <div className="service_name">{service.serviceName}</div>
                      <div className="service_category">{service.category}</div>
                      <div className="service_id">ID: {service.serviceId}</div>
                    </div>
                    <button>Edit</button>
                  </div>
                </div>
              ))}
              <button className="add_service" onClick={() => setEditing(true)}>
                Add New Service
              </button>
            </>
          )}
        </div>
        {editing && <div className="edit_modal"></div>}
      </div>
    </>
  );
}

export default Company;
