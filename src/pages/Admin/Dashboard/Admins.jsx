import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { endPoint } from "../../../Components/ForAPIs";
import useAuth from "../../../Components/useAuth";

const Admin = () => {
  const { admin, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch Admins & Moderators
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${endPoint}/user`);
        const filteredUsers = res.data.filter(
          u => u.role === "admin" || u.role === "moderator"
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load admin users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🔹 Update Role (Admin only)
  const updateRole = async (id, role) => {
    try {
      const res = await axios.put(`${endPoint}/user/update-role/${id}`,
        { role },
  {
    headers: {
      Authorization: `Bearer ${token}`, // if using token
    },
  }
      );

      toast.success(res.data.message || `Role updated to ${role}`);

      setUsers(prev =>
        prev.map(u =>
          u._id === id ? { ...u, role } : u
        )
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to update role"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admins & Moderators</h1>

        {admin?.role === "admin" && (
          <a href="/add-admin" className="btn btn-primary">
            + Add Admin
          </a>
        )}
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              {admin?.role === "admin" && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  No admins or moderators found
                </td>
              </tr>
            )}

            {users.map((u, index) => (
              <tr key={u._id}>
                <td>{index + 1}</td>
                <td>
                  {u.firstName} {u.lastName}
                </td>
                <td>{u.email}</td>
                <td>
                  <span
                    className={`badge ${
                      u.role === "admin"
                        ? "badge-primary"
                        : "badge-secondary"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>

                {admin?.role === "admin" && (
                  <td className="flex gap-2">
                    {u.role !== "moderator" && (
                      <button
                        className="btn btn-xs btn-outline"
                        onClick={() =>
                          updateRole(u._id, "moderator")
                        }
                      >
                        Make Moderator
                      </button>
                    )}

                    {u.role !== "admin" && (
                      <button
                        className="btn btn-xs btn-primary"
                        onClick={() =>
                          updateRole(u._id, "admin")
                        }
                      >
                        Make Admin
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
