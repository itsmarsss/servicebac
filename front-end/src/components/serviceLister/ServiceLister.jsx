import "./ServiceLister.css";
import React from "react";
import ServiceCard from "../serviceCard/ServiceCard.jsx";
import EditModal from "../editModal/EditModal.jsx";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function ServiceLister({ doneAction, setLoading, serviceList, noEdit }) {
  const [width, setWidth] = useState(window.innerWidth);

  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [serviceId, setServiceId] = useState(0);
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("");
  const [data, setData] = useState("");

  const [empty, setEmpty] = useState([]);

  const getToken = () => {
    return Cookies.get("token") || "";
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
          doneAction();
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
          doneAction();
        });
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  const deleteService = (serviceId) => {
    try {
      setLoading(true);
      fetch("http://localhost:3000/api/partner/delete-service", {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: serviceId,
        }),
      })
        .then((data) => data.json())
        .then((response) => {
          if (!response.success) {
            alert(response.message);
          }
          setLoading(false);
          doneAction();
        });
    } catch (error) {
      console.error("Error getting dashboard:", error);
    }
  };

  useEffect(() => {
    let empties = 0;
    for (let i = 0; i < serviceList.length; i++) {
      const reqWidth = i * 300 + (i - 1) * 20;
      if (reqWidth > width - 100) {
        const rem = serviceList.length % (i - 1);
        empties = rem == 0 ? 0 : i - 1 - rem;
        break;
      }
    }
    let allEmpties = [];
    for (let i = 0; i < empties; i++) {
      allEmpties.push(i);
    }

    setEmpty(allEmpties);

    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [serviceList, width]);

  return (
    <>
      <div className="services">
        {serviceList.length > 0 && (
          <>
            {serviceList.map((service) => (
              <ServiceCard
                key={service.serviceId}
                service={service}
                noEdit={noEdit}
                showModal={showModal}
                deleteService={deleteService}
              />
            ))}
            {empty.map((index) => (
              <ServiceCard key={index} empty={true} />
            ))}
            {!noEdit && (
              <button className="add_service" onClick={() => addService()}>
                Add New Service
              </button>
            )}
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
    </>
  );
}

export default ServiceLister;
