import "./Company.css";
import React from "react";
import Loader from "../../components/loader/Loader.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import * as toast from "../../components/toastAlert/toastAlert";
import ReactMarkdown from "react-markdown";

function Company({ companyName, city, country }) {
  const [loading, setLoading] = useState(false);
  const [marquee, setMarquee] = useState("");
  const [icon, setIcon] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [status, setStatus] = useState("");
  const [service, setService] = useState([]);

  const navigate = useNavigate();

  const getToken = () => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/signin");
    }
    return token;
  };

  const getService = () => {
    try {
      setLoading(true);
      fetch("/api/partner/service", {
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
            setCategory(response.service.category);
            setDescription(response.service.description);
            setMarkdown(response.service.markdown);
            setStatus(response.service.status);
            toast.showSuccessAlert("Fetched service");
          } else {
            toast.showErrorAlert(response.message);
          }
          setLoading(false);
        });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await fetch("/api/partner/update-service", {
        method: "PUT",
        headers: {
          authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marquee: marquee,
          icon: icon,
          serviceName: companyName,
          category: category,
          city: city,
          country: country,
          description: description,
          markdown: markdown,
          status: status,
        }),
      })
        .then((data) => data.json())
        .then((response) => {
          if (response.success) {
            toast.showSuccessAlert("Updated service");
          } else {
            toast.showErrorAlert(response.message);
          }
          setLoading(false);
        });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    getService();
  }, []);

  return (
    <>
      <div className="company_container">
        {loading && <Loader />}
        {service && (
          <>
            <div className="service_normal service">
              <div className="service_graphics">
                <img className="service_marquee" src={marquee}></img>
                <img className="service_logo" src={icon}></img>
              </div>
              <div className="service_details">
                <div className="service_name">{companyName}</div>
                <input
                  type="text"
                  placeholder="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <div className="service_location">{`${city}, ${country}`}</div>
                <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
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
                    maxLength={200}
                    onInput={(e) => setMarquee(e.target.value)}
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
              <hr />
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
                  <ReactMarkdown
                    className="markdown_display"
                    children={markdown}
                  />
                </div>
              </div>
              <hr />
              <div>
                <label htmlFor="status">Status</label>
                <select
                  onChange={(e) => setStatus(e.target.value)}
                  onClick={(e) => setStatus(e.target.value)}
                  value={status}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <hr />
              <button
                className="fill_button"
                onClick={(e) => handleSaveChanges(e)}
              >
                Save Changes
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}

export default Company;
