import "./ServiceCard.css";
import React from "react";

function ServiceCard({ service, noEdit, showModal }) {
  return (
    <div className={"service" + (noEdit ? " pointer" : "")}>
      <div className="service_details">
        <div className="service_name">{service.serviceName}</div>
        <div className="service_category">{service.category}</div>
        <div className="service_id">ID: {service.serviceId}</div>
      </div>
      {!noEdit && (
        <button onClick={() => showModal(service.serviceId)}>Edit</button>
      )}
      {noEdit && (
        <code className="service_data">{JSON.stringify(service.data)}</code>
      )}
    </div>
  );
}

export default ServiceCard;
