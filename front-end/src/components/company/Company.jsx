import "./Company.css";
import React from "react";
import Loader from "../../components/loader/Loader.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import * as toast from "../../components/toastAlert/toastAlert";
import ReactMarkdown from "react-markdown";

function Company() {
  const [loading, setLoading] = useState(false);
  const [marquee, setMarquee] = useState();
  const [icon, setIcon] = useState();
  const [category, setCategory] = useState();
  const [description, setDescription] = useState();
  const [markdown, setMarkdown] = useState();
  const [service, setService] = useState();

  const navigate = useNavigate();

  const getToken = () => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/signin");
    }
    return token;
  };

  const getOwnedServices = () => {
    try {
      setLoading(true);
      fetch("/api/partner/owned-services", {
        method: "GET",
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      })
        .then((data) => data.json())
        .then((response) => {
          if (response.success) {
            setOwnedServices(response.services);
            toast.showSuccessAlert("Fetched all owned services");
          } else {
            toast.showErrorAlert(response.message);
          }
          setLoading(false);
        });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleSaveChanges = () => {};

  useEffect(() => {
    getOwnedServices();
  }, []);

  return (
    <>
      <div className="company_container">
        {/* {loading && <Loader />} */}
        <div className="service_normal service">
          <div className="service_graphics">
            <img className="service_marquee" src=""></img>
            <img className="service_logo" src=""></img>
          </div>
          <div className="service_details">
            <div className="service_name">
              {service && service.serviceName
                ? service.serviceName
                : "Company Name"}
            </div>
            <div className="service_about" contentEditable="true">
              {category}
            </div>
            <div className="service_location">{`${
              service && service.city ? service.city : "City"
            }, ${
              service && service.country ? service.country : "Country"
            }`}</div>
            <div className="service_description" contentEditable="true">
              {description}
            </div>
          </div>
        </div>
        <form className="company_form">
          <div className="company_form_section">
            <div>
              <label htmlFor="marqueeURL">Marquee URL</label>
              <input
                type="text"
                placeholder="Marquee URL"
                value={marquee}
                maxLength={50}
                onChange={(e) => setMarquee(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="iconURL">Icon URL</label>
              <input
                type="text"
                placeholder="Icon URL"
                value={icon}
                maxLength={200}
                onChange={(e) => setIcon(e.target.value)}
              />
            </div>
          </div>
          <div className="company_form_section">
            <div>
              <label htmlFor="markdown">Markdown</label>
              <textarea
                placeholder="Markdown"
                value={markdown}
                maxLength={100_000}
                onChange={(e) => setMarkdown(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="markdown">Preview</label>
              <ReactMarkdown className="markdown_display" children={markdown} />
            </div>
          </div>

          <button className="fill_button" onClick={handleSaveChanges}>
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
}

export default Company;
