import React from "react";
import { useState } from "react";
import axios from "axios";

function Submit() {
  const [formData, setFormData] = useState({
    serviceName: "",
    category: "",
    data: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/api/partner/create-service",
        formData,
        {
          headers: {
            Authorization: `Bearer admin`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert("Service created successfully!");
      } else {
        alert("Error creating service. Please try again.");
      }
    } catch (error) {
      console.error("Error creating service:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="mt-20 flex flex-col space-y-4">
          <h1 className="text-4xl font-bold">
            Mandatory Company Data Submission Form
          </h1>
          <h1 className="text-2xl font-bold text-blue-400">
            Submit only if you comply with these rules:
          </h1>
          <p className="text-lg font-medium">
            1. Complete Information: Fill out the club form with accurate and
            comprehensive details, covering the club's purpose, goals, and
            proposed activities.
          </p>
          <p className="text-lg font-medium">
            2. Adherence to Deadlines: Submit the form within the specified
            deadlines to ensure a smooth processing and approval timeline.
          </p>
          <p className="text-lg font-medium">
            3. Faculty Endorsement: Obtain endorsement from a responsible
            faculty member or advisor to ensure alignment with school policies
            and provide a sense of accountability.
          </p>
          <p className="text-lg font-medium">
            4. Follow School Policies: Ensure that the club's activities and
            goals comply with school policies and regulations.
          </p>
          <p className="text-lg font-medium">
            5. Mindful of Requirements: Be aware of any specific requirements
            outlined by the school administration, such as budget considerations
            or event coordination protocols.
          </p>
        </div>

        <div className="mt-20 mb-20">
          <form onSubmit={handleSubmit}>
            <label className="font-medium" htmlFor="serviceName">
              Service Name:
            </label>
            <input
              className="bg-gray-50 border my-4 border-gray-300 text-gray-900 text-sm rounded-lg w-[30rem] focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
              id="serviceName"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              required
            />

            <label className="font-medium" htmlFor="category">
              Category:
            </label>
            <input
              className="bg-gray-50 border my-4 border-gray-300 text-gray-900 text-sm rounded-lg w-[30rem] focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />

            <label className="font-medium" htmlFor="data">
              Resources Link:
            </label>
            <textarea
              className="bg-gray-50 border my-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 w-[30rem] focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              id="data"
              name="data"
              value={formData.data}
              onChange={handleChange}
              required
            />
            <div class="flex items-start mb-6">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                  required
                />
              </div>
              <label
                for="remember"
                class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                I agree with the{" "}
                <a
                  href="#"
                  class="text-blue-600 hover:underline dark:text-blue-500"
                >
                  terms and conditions
                </a>
                .
              </label>
            </div>
            <input
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              type="submit"
              value="Create Service"
            />
          </form>
        </div>
      </div>
    </>
  );
}

export default Submit;
