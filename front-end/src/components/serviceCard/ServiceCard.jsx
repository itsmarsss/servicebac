import "./ServiceCard.css";
import React from "react";
import { useNavigate } from "react-router-dom";

function ServiceCard({ empty, service }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/service/${service.serviceId}`);
  };

  return (
    <div
      className={"service" + (empty ? " stealth" : "")}
      onClick={() => handleCardClick()}
    >
      {!empty && service && (
        <>
          <div className="service_graphics">
            <img
              className="service_marquee"
              src={service.marquee ? service.marquee : ""}
            ></img>
            <img
              className="service_logo"
              src={service.icon ? service.icon : ""}
            ></img>
          </div>
          <div className="service_details">
            <div className="service_name">
              {service.serviceName ? service.serviceName : "..."}
            </div>
            <div className="service_about">
              {service.category ? service.category : "..."}
            </div>
            <div className="service_location">{`${
              service.city ? service.city : "..."
            }, ${service.country ? service.country : "..."}`}</div>
            <div className="service_description">
              {service.description ? service.description : "..."}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ServiceCard;
