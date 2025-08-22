import { useParams } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function ApplyServiceForm() {
  const { serviceId } = useParams();

  const handleApply = async () => {
    try {
      await api.post("/applications", { serviceId });
      toast.success("Application submitted!");
    } catch (err) {
      toast.error("Failed to apply");
    }
  };

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-4">Apply for Service</h2>
      <button
        onClick={handleApply}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Submit Application
      </button>
    </div>
  );
}
