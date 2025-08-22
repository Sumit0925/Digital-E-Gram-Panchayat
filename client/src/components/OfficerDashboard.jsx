import React, { useState, useEffect } from "react";
import API from "../api/axios";
import {
  Plus,
  FileText,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Calendar,
  X as CloseIcon,
} from "lucide-react";

const OfficerDashboard = () => {
  const [activeTab, setActiveTab] = useState("services");
  const [services, setServices] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    requiredDocuments: "",
    fee: 0,
  });

  useEffect(() => {
    // Load both so stats are always fresh, regardless of tab
    fetchServices();
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await API.get("/services");
      if (response.data.success) setServices(response.data.services);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await API.get("/applications/assigned");
      if (response.data.success) setApplications(response.data.apps);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const serviceData = {
      ...serviceForm,
      requiredDocuments: serviceForm.requiredDocuments
        .split(",")
        .map((doc) => doc.trim())
        .filter(Boolean),
      fee: Number(serviceForm.fee) || 0,
    };

    try {
      if (editingService) {
        await API.put(`/services/${editingService._id}`, serviceData);
      } else {
        await API.post("/services", serviceData);
      }

      setShowServiceForm(false);
      setEditingService(null);
      setServiceForm({ title: "", description: "", requiredDocuments: "", fee: 0 });
      fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await API.delete(`/services/${id}`);
        fetchServices();
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title || "",
      description: service.description || "",
      requiredDocuments: (service.requiredDocuments || []).join(", "),
      fee: service.fee ?? 0,
    });
    setShowServiceForm(true);
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
        return <Clock className="h-4 w-4 text-yellow-600" aria-hidden />;
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-600" aria-hidden />;
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-600" aria-hidden />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" aria-hidden />;
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

  const stats = {
    totalServices: services.length,
    totalApplications: applications.length,
    pendingApplications: applications.filter((a) => a.status === "Pending").length,
    approvedApplications: applications.filter((a) => a.status === "Approved").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Officer Dashboard</h1>
          <p className="text-base sm:text-lg text-gray-600 mt-2">Manage services and review applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex items-center">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Services</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalServices}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex items-center">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex items-center">
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Pending</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex items-center">
            <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Approved</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.approvedApplications}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex  sm:space-x-6 sm:space-y-0">
            <button
              onClick={() => setActiveTab("services")}
              className={`py-2 px-2 border-b-2 font-medium text-sm sm:text-base ${
                activeTab === "services"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Services Management
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`py-2 px-2 border-b-2 font-medium text-sm sm:text-base ${
                activeTab === "applications"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Applications Review
            </button>
          </nav>
        </div>

        {/* Services Tab */}
        {activeTab === "services" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-3 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Services Management</h2>
              <button
                onClick={() => {
                  setShowServiceForm(true);
                  setEditingService(null);
                  setServiceForm({ title: "", description: "", requiredDocuments: "", fee: 0 });
                }}
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 mr-2" aria-hidden />
                Add Service
              </button>
            </div>

            {/* Service Form Modal */}
            {showServiceForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-black/40"
                  onClick={() => setShowServiceForm(false)}
                />
                <div className="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-xl p-4 sm:p-6 m-4">
                  <button
                    onClick={() => setShowServiceForm(false)}
                    aria-label="Close"
                    className="absolute right-3 top-3 p-1 rounded hover:bg-gray-100"
                  >
                    <CloseIcon className="h-5 w-5 text-gray-500" />
                  </button>

                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingService ? "Edit Service" : "Add New Service"}
                  </h3>

                  <form onSubmit={handleServiceSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        required
                        value={serviceForm.title}
                        onChange={(e) => setServiceForm((p) => ({ ...p, title: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        required
                        rows={3}
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm((p) => ({ ...p, description: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Required Documents (comma-separated)</label>
                      <input
                        type="text"
                        value={serviceForm.requiredDocuments}
                        onChange={(e) => setServiceForm((p) => ({ ...p, requiredDocuments: e.target.value }))}
                        placeholder="Document 1, Document 2, Document 3"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fee (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={serviceForm.fee}
                        onChange={(e) => setServiceForm((p) => ({ ...p, fee: e.target.value }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowServiceForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        {loading ? "Saving..." : editingService ? "Update" : "Create"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Services List */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading services...</p>
                </div>
              ) : services.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">No services created yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                        <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Documents</th>
                        <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Created</th>
                        <th className="px-3 sm:px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {services.map((service) => (
                        <tr key={service._id}>
                          <td className="px-3 sm:px-6 py-4 align-top">
                            <div className="text-sm font-medium text-gray-900">{service.title}</div>
                            <div className="text-xs text-gray-500 mt-1">{(service.description || "").slice(0, 120)}{(service.description || "").length > 120 ? "…" : ""}</div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap align-top">
                            {service.fee === 0 ? "Free" : `₹${service.fee}`}
                          </td>
                          <td className="px-3 sm:px-6 py-4 hidden sm:table-cell align-top">
                            {(service.requiredDocuments || []).length} docs
                          </td>
                          <td className="px-3 sm:px-6 py-4 hidden sm:table-cell whitespace-nowrap text-sm text-gray-500 align-top">
                            {service.createdAt ? new Date(service.createdAt).toLocaleDateString() : "—"}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleEditService(service)}
                                className="p-2 rounded hover:bg-blue-50 text-blue-600"
                                aria-label={`Edit ${service.title}`}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteService(service._id)}
                                className="p-2 rounded hover:bg-red-50 text-red-600"
                                aria-label={`Delete ${service.title}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Applications Review</h2>

            {loading ? (
              <div className="bg-white p-6 text-center rounded-lg shadow-md">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="bg-white p-6 text-center rounded-lg shadow-md">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">No applications submitted yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {applications.map((application) => (
                  <div key={application._id} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                          {application.serviceId?.title || "Service Not Found"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Applied by: {application.userId?.email || "User Not Found"}
                        </p>
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          Applied on: {new Date(application.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`flex items-center mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1 sm:ml-2">{application.status}</span>
                      </div>
                    </div>

                    <div className="border-t pt-3 sm:pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Service Details:</h4>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3">
                        {application.serviceId?.description || "No description available"}
                      </p>

                      {application.serviceId?.requiredDocuments?.length > 0 && (
                        <div className="mb-3 sm:mb-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Required Documents:</h5>
                          <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                            {application.serviceId.requiredDocuments.map((doc, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
                        <button
                          onClick={() => handleApplicationStatusUpdate(application._id, "Approved")}
                          disabled={application.status === "Approved"}
                          className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium ${
                            application.status === "Approved"
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                          aria-label="Approve Application"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </button>

                        <button
                          onClick={() => handleApplicationStatusUpdate(application._id, "Rejected")}
                          disabled={application.status === "Rejected"}
                          className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium ${
                            application.status === "Rejected"
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-red-600 text-white hover:bg-red-700"
                          }`}
                          aria-label="Reject Application"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </button>

                        <button
                          onClick={() => handleApplicationStatusUpdate(application._id, "Pending")}
                          disabled={application.status === "Pending"}
                          className={`flex items-center justify-center px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium ${
                            application.status === "Pending"
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-yellow-600 text-white hover:bg-yellow-700"
                          }`}
                          aria-label="Mark Pending"
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Set Pending
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerDashboard;
