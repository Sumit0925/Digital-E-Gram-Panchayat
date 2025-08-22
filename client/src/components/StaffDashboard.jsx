import React, { useState, useEffect } from "react";
import API from "../api/axios";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  Eye,
} from "lucide-react";

const StaffDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await API.get("/applications/assigned");
      if (response.data.success) {
        setApplications(response.data.apps);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationStatusUpdate = async (applicationId, status) => {
    try {
      await API.put(`/applications/${applicationId}`, { status });
      fetchApplications();
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
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

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status.toLowerCase() === filter;
  });

  const stats = {
    totalApplications: applications.length,
    pendingApplications: applications.filter((app) => app.status === "Pending")
      .length,
    approvedApplications: applications.filter(
      (app) => app.status === "Approved"
    ).length,
    rejectedApplications: applications.filter(
      (app) => app.status === "Rejected"
    ).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-lg text-gray-600 mt-2">
            Review and process service applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Applications
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalApplications}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingApplications}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.approvedApplications}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.rejectedApplications}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              {
                key: "all",
                label: "All Applications",
                count: stats.totalApplications,
              },
              {
                key: "pending",
                label: "Pending",
                count: stats.pendingApplications,
              },
              {
                key: "approved",
                label: "Approved",
                count: stats.approvedApplications,
              },
              {
                key: "rejected",
                label: "Rejected",
                count: stats.rejectedApplications,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="bg-white p-8 text-center rounded-lg shadow-md">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-lg shadow-md">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">
              {filter === "all"
                ? "No applications found"
                : `No ${filter} applications`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">
                        {application.serviceId?.title || "Service Not Found"}
                      </h3>
                      <div
                        className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {getStatusIcon(application.status)}
                        <span className="ml-1">{application.status}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Applicant:</span>{" "}
                        {application.userId?.email || "User Not Found"}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="font-medium">Applied:</span>{" "}
                        {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="font-medium">Updated:</span>{" "}
                        {new Date(application.updatedAt).toLocaleDateString()}
                      </div>
                      {application.serviceId?.fee !== undefined && (
                        <div>
                          <span className="font-medium">Fee:</span>{" "}
                          {application.serviceId.fee === 0
                            ? "Free"
                            : `₹${application.serviceId.fee}`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="border-t pt-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Service Details:
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {application.serviceId?.description ||
                      "No description available"}
                  </p>

                  {application.serviceId?.requiredDocuments?.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Required Documents:
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {application.serviceId.requiredDocuments.map(
                          (doc, index) => (
                            <div
                              key={index}
                              className="flex items-center text-sm text-gray-600"
                            >
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                              {doc}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="border-t pt-4">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        handleApplicationStatusUpdate(
                          application._id,
                          "Approved"
                        )
                      }
                      disabled={application.status === "Approved"}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                        application.status === "Approved"
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {application.status === "Approved"
                        ? "Already Approved"
                        : "Approve"}
                    </button>

                    <button
                      onClick={() =>
                        handleApplicationStatusUpdate(
                          application._id,
                          "Rejected"
                        )
                      }
                      disabled={application.status === "Rejected"}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                        application.status === "Rejected"
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {application.status === "Rejected"
                        ? "Already Rejected"
                        : "Reject"}
                    </button>

                    <button
                      onClick={() =>
                        handleApplicationStatusUpdate(
                          application._id,
                          "Pending"
                        )
                      }
                      disabled={application.status === "Pending"}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                        application.status === "Pending"
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-yellow-600 text-white hover:bg-yellow-700"
                      }`}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {application.status === "Pending"
                        ? "Already Pending"
                        : "Mark Pending"}
                    </button>
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

export default StaffDashboard;
