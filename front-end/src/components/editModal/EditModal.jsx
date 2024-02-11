import "./EditModal.css";
import React from "react";

function EditModal({
  updating,
  updateService,
  createService,
  setEditing,
  setServiceName,
  setCategory,
  setData,
  serviceId,
  serviceName,
  category,
  data,
}) {
  return (
    <div className="edit_modal">
      <div className="edit">
        <div className="edit_id">
          {updating ? "Editing:" : "Creating new service"}{" "}
          {updating && serviceId}
        </div>
        <div className="edit_property">
          <label>
            Service Name:{" "}
            <span className="property_note">(100 characters)</span>
          </label>
          <input
            type="text"
            placeholder="Service Name"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            maxLength={100}
          />
        </div>
        <div className="edit_property">
          <label>
            Category: <span className="property_note">(50 characters)</span>
          </label>
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            maxLength={50}
          />
        </div>
        <div className="edit_property edit_data_cont">
          <label>
            Data:{" "}
            <span className="property_note">
              (Text-only or JSON-only, 10,000 characters)
            </span>
          </label>
          <textarea
            className="edit_data"
            type="text"
            placeholder="Text and links"
            value={data}
            onChange={(e) => setData(e.target.value)}
            maxLength={10000}
          />
        </div>
        <div className="edit_actions">
          <button
            className="fill_button"
            onClick={() => (updating ? updateService() : createService())}
          >
            {updating ? "Save" : "Submit"}
          </button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
