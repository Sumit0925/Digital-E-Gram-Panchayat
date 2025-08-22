import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { FileText, Clock, CheckCircle, XCircle, Calendar } from "lucide-react";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      const response = await API.get("/applications/my");
      if (response.data.success) {
        setApplications(response.data.apps);
      }
    } catch (error) {
      setError("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "Approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "Rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-lg text-gray-600 mt-2">
            Track the status of your service applications
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <FileText className="mx-auto h-24 w-24 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No applications found
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't applied for any services yet.
            </p>
            <a
              href="/services"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Services
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {application.serviceId?.title ||
                          "Service Title Not Available"}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {application.serviceId?.description ||
                          "Service description not available"}
                      </p>
                    </div>
                    <div
                      className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {getStatusIcon(application.status)}
                      <span className="ml-2">{application.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium mr-2">Applied:</span>
                      {new Date(application.createdAt).toLocaleDateString()}
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium mr-2">Last Updated:</span>
                      {new Date(application.updatedAt).toLocaleDateString()}
                    </div>

                    {application.serviceId?.fee !== undefined && (
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium mr-2">Fee:</span>
                        {application.serviceId.fee === 0
                          ? "Free"
                          : `₹${application.serviceId.fee}`}
                      </div>
                    )}
                  </div>

                  {application.status === "Pending" && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                      <p className="text-sm text-yellow-800">
                        Your application is being reviewed. You will be notified
                        once a decision is made.
                      </p>
                    </div>
                  )}

                  {application.status === "Approved" && (
                    <div className="mt-4 p-3 bg-green-50 rounded-md">
                      <p className="text-sm text-green-800">
                        Congratulations! Your application has been approved.
                        Please contact the office for further instructions.
                      </p>
                    </div>
                  )}

                  {application.status === "Rejected" && (
                    <div className="mt-4 p-3 bg-red-50 rounded-md">
                      <p className="text-sm text-red-800">
                        Your application has been rejected. Please contact the
                        office for more information or to reapply.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
