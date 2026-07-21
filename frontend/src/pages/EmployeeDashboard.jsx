import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

const emptyForm = {
  leaveType: "Vacation",
  startDate: "",
  endDate: "",
  reason: "",
};

function EmployeeDashboard() {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      setLoading(true);

      const response = await api.get("/leaves/my-requests");

      setRequests(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load requests.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const counts = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter(
        (request) => request.status === "Pending",
      ).length,
      approved: requests.filter(
        (request) => request.status === "Approved",
      ).length,
      rejected: requests.filter(
        (request) => request.status === "Rejected",
      ).length,
    }),
    [requests],
  );

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError("End date cannot be before start date.");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/leaves/${editingId}`, form);
        setMessage("Leave request updated.");
      } else {
        await api.post("/leaves", form);
        setMessage("Leave request submitted.");
      }

      resetForm();
      await loadRequests();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to save request.",
      );
    }
  };

  const handleEdit = (request) => {
    setEditingId(request._id);

    setForm({
      leaveType: request.leaveType,
      startDate: request.startDate.slice(0, 10),
      endDate: request.endDate.slice(0, 10),
      reason: request.reason,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this pending leave request?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/leaves/${id}`);
      setMessage("Leave request deleted.");
      await loadRequests();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to delete request.",
      );
    }
  };

  return (
    <Layout
      title="Employee Dashboard"
      subtitle="Submit leave requests and track their status."
    >
      <section className="stats-grid">
        <article className="stat-card">
          <span>Total</span>
          <strong>{counts.total}</strong>
        </article>

        <article className="stat-card">
          <span>Pending</span>
          <strong>{counts.pending}</strong>
        </article>

        <article className="stat-card">
          <span>Approved</span>
          <strong>{counts.approved}</strong>
        </article>

        <article className="stat-card">
          <span>Rejected</span>
          <strong>{counts.rejected}</strong>
        </article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>
              {editingId
                ? "Edit Leave Request"
                : "New Leave Request"}
            </h2>
            <p>
              Complete all fields before submitting your request.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="request-form">
          <label>
            Leave Type
            <select
              name="leaveType"
              value={form.leaveType}
              onChange={handleChange}
            >
              <option>Vacation</option>
              <option>Sick Leave</option>
              <option>Personal Leave</option>
              <option>Bereavement</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Start Date
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            End Date
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              min={form.startDate}
              required
            />
          </label>

          <label className="full-width">
            Reason
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows="4"
              maxLength="500"
              required
            />
          </label>

          <div className="form-actions full-width">
            <button
              type="submit"
              className="button button-primary"
            >
              {editingId ? "Save Changes" : "Submit Request"}
            </button>

            {editingId && (
              <button
                type="button"
                className="button button-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {message && (
          <p className="success-message">{message}</p>
        )}

        {error && <p className="error-message">{error}</p>}
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>My Leave Requests</h2>
            <p>Review all previously submitted requests.</p>
          </div>
        </div>

        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p>No leave requests have been submitted.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.leaveType}</td>

                    <td>
                      {new Date(
                        request.startDate,
                      ).toLocaleDateString()}
                      {" – "}
                      {new Date(
                        request.endDate,
                      ).toLocaleDateString()}
                    </td>

                    <td>{request.reason}</td>

                    <td>
                      <StatusBadge status={request.status} />
                    </td>

                    <td>
                      {new Date(
                        request.createdAt,
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {request.status === "Pending" ? (
                        <div className="table-actions">
                          <button
                            className="text-button"
                            onClick={() => handleEdit(request)}
                          >
                            Edit
                          </button>

                          <button
                            className="text-button danger"
                            onClick={() =>
                              handleDelete(request._id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Layout>
  );
}

export default EmployeeDashboard;