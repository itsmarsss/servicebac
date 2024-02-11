import "./ServiceViewer.css";
import React from "react";

function ServiceViewer({ setServiceView, service }) {
  return (
    <div className="service_viewer_modal">
      <div className="service_viewer">
        <div className="service_viewer_id">ID: {service.serviceId}</div>
        <div className="service_viewer_name">{service.serviceName}</div>
        <div className="service_viewer_category">{service.category}</div>
        <div className="service_viewer_data">
          {typeof data !== "string" ? (
            <table>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(service.data).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            service.data
          )}
        </div>

        <button onClick={() => setServiceView(false)}>Done</button>
      </div>
    </div>
  );
}

export default ServiceViewer;
