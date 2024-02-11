import "./Company.css";
import React from "react";
import Loader from "../../components/loader/Loader.jsx";
import ServiceCard from "../../components/serviceCard/ServiceCard.jsx";
import EditModal from "../../components/editModal/EditModal.jsx";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function Company() {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [ownedServices, setOwnedServices] = useState([]);

  const [serviceId, setServiceId] = useState(0);
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("");
  const [data, setData] = useState("");

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
          getOwnedServices();
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
          getOwnedServices();
        });
    } catch (error) {
      console.error("Error creating service:", error);
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
        <div className="owned_services">
          {ownedServices.length > 0 && (
            <>
              {ownedServices.map((service) => (
                <div key={service.serviceId}>
                  <ServiceCard service={service} showModal={showModal} />
                </div>
              ))}
              <button className="add_service" onClick={() => addService()}>
                Add New Service
              </button>
            </>
          )}
        </div>
        {editing && (
          <EditModal
            updating={updating}
            updateService={updateService}
            createService={createService}
            setEditing={setEditing}
            setServiceName={setServiceName}
            setCategory={setCategory}
            setData={setData}
            serviceId={serviceId}
            serviceName={serviceName}
            category={category}
            data={data}
          />
        )}
      </div>
    </>
  );
}

export default Company;
