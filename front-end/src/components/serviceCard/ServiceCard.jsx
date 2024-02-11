import "./ServiceCard.css";
import React from "react";

function ServiceCard({ empty, service, noEdit, showModal, deleteService }) {
  return (
    <div
      className={
        "service" + (noEdit ? " pointer" : "") + (empty ? " stealth" : "")
      }
    >
      {!empty && (
        <>
          <div className="service_details">
            <div className="service_name">{service.serviceName}</div>
            <div className="service_category">{service.category}</div>
            <div className="service_id">ID: {service.serviceId}</div>
          </div>
          {!noEdit && (
            <div className="service_actions">
              <button
                className="fill_button"
                onClick={() => showModal(service.serviceId)}
              >
                Edit
              </button>
              <button onClick={() => deleteService(service.serviceId)}>
                Delete
              </button>
            </div>
          )}
          {noEdit && (
            <code className="service_data">{JSON.stringify(service.data)}</code>
          )}
        </>
      )}
    </div>
  );
}

export default ServiceCard;
