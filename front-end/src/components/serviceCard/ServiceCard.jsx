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
  const handleCardClick = () => {
    onClick(service);
    onClickAction(true);
  };

  const handleShowModal = (e) => {
    e.stopPropagation();
    showModal(service.serviceId);
  };

  const handleDeleteService = (e) => {
    e.stopPropagation();
    deleteService(service.serviceId);
  };

  return (
    <div
      className={"service" + (empty ? " stealth" : "")}
      onClick={() => handleCardClick()}
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
                onClick={(e) => handleShowModal(e)}
              >
                Edit
              </button>
              <button onClick={(e) => handleDeleteService(e)}>Delete</button>
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
