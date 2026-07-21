import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

function ManagerDashboard() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/leaves", {
        params: {
          search,
          status,
        },
      });

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
    const timeout = setTimeout(() => {
      loadRequests();
    }, 250);

    return () => clearTimeout(timeout);
  }, [search, status]);

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

  const updateStatus = async (id, newStatus) => {
    try {
      setMessage("");
      setError("");

      await api.patch(`/leaves/${id}/status`, {
        status: newStatus,
      });

      setMessage(`Request ${newStatus.toLowerCase()}.`);

      await loadRequests();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update request.",
      );
    }
  };

  return (
    <Layout
      title="Manager Dashboard"
      subtitle="Review and manage employee leave requests."
    >
      <section className="stats-grid">
        <article className="stat-card">
          <span>Visible Requests</span>
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
        <div className="panel-heading manager-heading">
          <div>
            <h2>All Leave Requests</h2>
            <p>
              Search by employee name or filter by status.
            </p>
          </div>

          <div className="filters">
            <input
              type="search"
              placeholder="Search employee name"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >
              <option value="">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {message && (
          <p className="success-message">{message}</p>
        )}

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p>No leave requests match your filters.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
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
                    <td>
                      <strong>
                        {request.employee?.name}
                      </strong>

                      <small>
                        {request.employee?.email}
                      </small>
                    </td>

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
                            className="button button-approve"
                            onClick={() =>
                              updateStatus(
                                request._id,
                                "Approved",
                              )
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="button button-reject"
                            onClick={() =>
                              updateStatus(
                                request._id,
                                "Rejected",
                              )
                            }
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        "Completed"
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

export default ManagerDashboard;