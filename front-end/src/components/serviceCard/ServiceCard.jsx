import "./ServiceCard.css";
import React from "react";

function ServiceCard({
  onClick,
  onClickAction,
  empty,
  service,
  noEdit,
  showModal,
  deleteService,
}) {
  return (
    <div
      className={"service" + (empty ? " stealth" : "")}
      onClick={() => {
        onClick(service);
        onClickAction(true);
      }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  showModal(service.serviceId);
                }}
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteService(service.serviceId);
                }}
              >
                Delete
              </button>
            </div>
          )}
          {noEdit && (
            <>
              <code className="service_data">
                {JSON.stringify(service.data)}
              </code>
              <span className="service_similarity">
                {service.similarity && "Similarity: " + service.similarity}
              </span>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ServiceCard;
