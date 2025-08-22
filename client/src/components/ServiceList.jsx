import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { FileText, DollarSign, Send, Plus } from "lucide-react";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applicationLoading, setApplicationLoading] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await API.get("/services");
      if (response.data.success) {
        setServices(response.data.services);
      }
    } catch (error) {
      setError("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (serviceId) => {
    if (!user) {
      alert("Please login to apply for services");
      return;
    }

    if (user.role !== "user") {
      alert("Only users can apply for services");
      return;
    }

    setApplicationLoading((prev) => ({ ...prev, [serviceId]: true }));

    try {
      const response = await API.post("/applications", { serviceId });
      if (response.data.success) {
        alert("Application submitted successfully!");
      } else {
        alert("Failed to submit application");
      }
    } catch (error) {
      alert("Error submitting application");
    } finally {
      setApplicationLoading((prev) => ({ ...prev, [serviceId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Available Services
          </h1>
          <p className="text-lg text-gray-600">
            Browse and apply for various government services
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {services.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-24 w-24 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No services available
            </h3>
            <p className="text-gray-500">Check back later for new services.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 flex-1">
                      {service.title}
                    </h3>
                    <div className="flex items-center text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
                      {/* <DollarSign className="h-4 w-4 mr-1" /> */}
                      {service.fee === 0 ? "Free" : `₹${service.fee}`}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  {service.requiredDocuments.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Required Documents:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {service.requiredDocuments
                          .slice(0, 3)
                          .map((doc, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                              {doc}
                            </li>
                          ))}
                        {service.requiredDocuments.length > 3 && (
                          <li className="text-blue-600">
                            +{service.requiredDocuments.length - 3} more
                            documents
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      Created:{" "}
                      {new Date(service.createdAt).toLocaleDateString()}
                    </div>

                    {user && user.role === "user" ? (
                      <button
                        onClick={() => handleApply(service._id)}
                        disabled={applicationLoading[service._id]}
                        className={`flex items-center px-4 py-2 rounded-md text-white font-medium ${
                          applicationLoading[service._id]
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {applicationLoading[service._id] ? (
                          <>
                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                            Applying...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Apply Now
                          </>
                        )}
                      </button>
                    ) : !user ? (
                      <div className="text-center flex justify-center items-center bg-red-100 px-2 py-1 rounded-full text-sm text-red-600">
                        Login to apply
                      </div>
                    ) : (
                      <div className="text-center flex justify-center items-center bg-red-100 px-2 py-1 rounded-full text-sm text-red-600">
                        User role required to apply
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceList;
