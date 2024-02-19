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
          <div className="service_graphics">
            <img className="service_marquee" src="asd"></img>
            <img className="service_logo" src="asd"></img>
          </div>
          <div className="service_details">
            <div className="service_name">
              {service && service.serviceName ? service.serviceName : "..."}
            </div>
            <div className="service_about">
              {service && service.category ? service.category : "Fallback"}
            </div>
            <div className="service_location">{`${
              service && service.city ? service.city : "..."
            }, ${service && service.country ? service.country : "..."}`}</div>
            <div className="service_description">
              {service && service.description ? service.description : "..."}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ServiceCard;
