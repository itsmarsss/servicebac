import "./Service.css";
import React, { useEffect } from "react";
import Nav from "../../components/nav/Nav.jsx";
import Loader from "../../components/loader/Loader.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import * as toast from "../../components/toastAlert/toastAlert";
import ReactMarkdown from "react-markdown";

function Service() {
  const [loading, setLoading] = useState(false);
  const [marquee, setMarquee] = useState("");
  const [icon, setIcon] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [service, setService] = useState();

  const getToken = () => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/signin");
    }
    return token;
  };

  useEffect(() => {
    try {
      const pathname = window.location.pathname;
      const parts = pathname.split("/");
      const id = parts[parts.length - 1];

      console.log(id);
      setLoading(true);
      fetch(`/api/partner/id/${id}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      })
        .then((data) => data.json())
        .then((response) => {
          if (response.success) {
            console.log(response);
            setService(response.service);
            setMarquee(response.service.marquee);
            setIcon(response.service.icon);
            setServiceName(response.service.serviceName);
            setCategory(response.service.category);
            setCity(response.service.city);
            setCountry(response.service.country);
            setDescription(response.service.description);
            setMarkdown(response.service.markdown);
            toast.showSuccessAlert("Fetched service");
          } else {
            toast.showErrorAlert(response.message);
          }
          setLoading(false);
        });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, []);
  return (
    <>
      <Nav />
      {loading && <Loader />}
      {service ? (
        <>
          <div className="service_profile_graphics service_island">
            <div className="service_graphics">
              <img className="service_profile_banner" src={marquee}></img>
              <img className="service_profile_icon" src={icon}></img>
            </div>
            <div className="service_profile_details">
              <div className="service_profile_name">{serviceName}</div>
              <div className="service_profile_about">{category}</div>
              <div className="service_profile_location">{`${city}, ${country}`}</div>
              <div className="service_profile_description">{description}</div>
            </div>
          </div>
          <div className="service_markdown service_island">
            <ReactMarkdown
              className="markdown_profile_display"
              children={markdown}
            />
          </div>
        </>
      ) : (
        <h1>Service Not Found</h1>
      )}
    </>
  );
}

export default Service;
