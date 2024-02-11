import "./Department.css";
import React from "react";
import ServiceCard from "../../components/serviceCard/ServiceCard.jsx";
import Loader from "../../components/loader/Loader.jsx";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function Department() {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(false);
  const [page, setPage] = useState(1);
  const [serviceResults, setServiceResults] = useState([]);

  const [serviceId, setServiceId] = useState(0);
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("");
  const [data, setData] = useState("");

  const getToken = () => {
    return Cookies.get("token") || "";
  };

  const getServices = () => {
    try {
      setLoading(true);
      fetch(`http://localhost:3000/api/partner/service-list/${page}`, {
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
      console.error("Error getting service list:", error);
    }
  };

  const showModal = (serviceId) => {
    setUpdating(true);
    try {
      setLoading(true);
      fetch(`http://localhost:3000/api/partner/id/${serviceId}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      })
        .then((data) => data.json())
        .then((response) => {
          if (response.success) {
            const service = response.service;
            setServiceId(service.serviceId);
            setServiceName(service.serviceName);
            setCategory(service.category);

            let data = service.data;

            if (typeof data !== "string") {
              try {
                data = JSON.stringify(service.data, null, "\t");
              } catch (err) {}
            }

            setData(data);
            setEditing(true);
          } else {
            alert(response.message);
          }
          setLoading(false);
          setEditing(true);
        });
    } catch (error) {
      console.error("Error getting service:", error);
    }
  };

  const addService = () => {
    setServiceName("");
    setCategory("");
    setData("");
    setUpdating(false);
    setEditing(true);
  };

  const updateService = () => {
    setEditing(false);
    try {
      setLoading(true);
      let serviceData = data;
      try {
        serviceData = JSON.parse(data);
      } catch (err) {}

      fetch("http://localhost:3000/api/partner/update-service", {
        method: "PUT",
        headers: {
          authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: serviceId,
          serviceName: serviceName,
          category: category,
          data:
            typeof serviceData === "object" ? { ...serviceData } : serviceData,
        }),
      })
        .then((data) => data.json())
        .then((response) => {
          if (!response.success) {
            alert(response.message);
          }
          setLoading(false);
        });
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const createService = () => {
    setEditing(false);
    try {
      setLoading(true);
      let serviceData = data;
      try {
        serviceData = JSON.parse(data);
      } catch (err) {}

      fetch("http://localhost:3000/api/partner/create-service", {
        method: "POST",
        headers: {
          authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceName: serviceName,
          category: category,
          data:
            typeof serviceData === "object" ? { ...serviceData } : serviceData,
        }),
      })
        .then((data) => data.json())
        .then((response) => {
          if (!response.success) {
            alert(response.message);
          }
          setLoading(false);
        });
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  return (
    <>
      <div className="department">
        <div className="title">Services:</div>
        {loading && <Loader />}
        <div className="services">
          {serviceResults.length > 0 && (
            <>
              {serviceResults.map((service) => (
                <ServiceCard
                  key={service.serviceId}
                  service={service}
                  noEdit={true}
                  showModal={showModal}
                />
              ))}
            </>
          )}
        </div>
        <button>Prev</button>
        <button>Next</button>
      </div>
    </>
  );
}

export default Department;
