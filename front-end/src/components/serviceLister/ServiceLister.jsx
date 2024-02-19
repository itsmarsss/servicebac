import "./ServiceLister.css";
import React from "react";
import ServiceCard from "../serviceCard/ServiceCard.jsx";
import { useState, useEffect } from "react";

function ServiceLister({ serviceList }) {
  const [width, setWidth] = useState(window.innerWidth);

  const [empty, setEmpty] = useState([]);

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
    empties += 5; // lazy coding
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
              <ServiceCard key={service.serviceId} service={service} />
            ))}
            {empty.map((index) => (
              <ServiceCard key={index} empty={true} />
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default ServiceLister;
