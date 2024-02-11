import "./ServiceCard.css";
import React from "react";

function ServiceCard({ service, showModal }) {
  return (
    <div className="service">
      <div className="service_details">
        <div className="service_name">{service.serviceName}</div>
        <div className="service_category">{service.category}</div>
        <div className="service_id">ID: {service.serviceId}</div>
      </div>
      <button onClick={() => showModal(service.serviceId)}>Edit</button>
    </div>
  );
}

export default ServiceCard;
