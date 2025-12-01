import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import { IoSend, IoArrowBackOutline } from "react-icons/io5";
import { BsPaperclip } from "react-icons/bs";
import { MdImage } from "react-icons/md";
import useAuth from "../../../Components/useAuth";
import { endPoint } from "../../../Components/ForAPIs";

const socket = io(endPoint, {
  transports: ["websocket"],
});

const Chat = () => {
  const { admin } = useAuth();
  const adminId = admin?._id;

  const [allUsers, setAllUsers] = useState([]);
  const [rideData, setRideData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Fetch All Users
  const fetchUsers = async () => {
    const res = await axios.get(`${endPoint}/user`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    });
    setAllUsers(res.data);
  };

  // Fetch All Rides
  const fetchRides = async () => {
    const res = await axios.get(`${endPoint}/rides`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    });
    setRideData(res.data.rides);
  };

  // Fetch Chat History
  const fetchChatHistory = async (userId) => {
    const res = await axios.get(`${endPoint}/chat/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    });

    setMessages(res.data.messages);
  };

  // Detect if user has an ACTIVE ride
  const isActiveRide = (user) => {
    const activeStatuses = ["pending", "accepted", "on_the_way", "in_progress", "at_stop"];

    return rideData.some(
      (r) =>
        activeStatuses.includes(r.status) &&
        (r.driverId === user._id || r.customerId === user._id)
    );
  };

  useEffect(() => {
    fetchUsers();
    fetchRides();
  }, []);

  // SOCKET join
  useEffect(() => {
    if (adminId) {
      socket.emit("join", { userId: adminId, role: "admin" });
    }
  }, [adminId]);

  // SOCKET receive message
  useEffect(() => {
    socket.on("chat-message", (msg) => {
      if (msg.senderId === selectedUser?._id || msg.recipientId === selectedUser?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("chat-message");
  }, [selectedUser]);

  // Auto-select user via URL param
  useEffect(() => {
    const userId = searchParams.get("user");
    if (userId) {
      const found = allUsers.find((u) => u._id === userId);
      if (found) {
        setSelectedUser(found);
        fetchChatHistory(found._id);
      }
    }
  }, [allUsers]);

  // Send Message
  const handleSend = async () => {
    if (!selectedUser) return;
    if (!message.trim() && !selectedFile) return;

    let fileUrl = null;
    let fileType = null;

    if (selectedFile) {
      const form = new FormData();
      form.append("file", selectedFile);

      const upload = await axios.post(`${endPoint}/upload/chat-file`, form);
      fileUrl = upload.data.url;
      fileType = selectedFile.type.startsWith("image") ? "image" : "file";
    }

    const localMsg = {
      senderId: adminId,
      recipientId: selectedUser._id,
      senderRole: "admin",
      message,
      fileUrl,
      fileType,
    };

    setMessages((prev) => [...prev, localMsg]);

    socket.emit("chat-message", localMsg);

    setMessage("");
    setSelectedFile(null);
  };

  const handleBack = () => {
    setSelectedUser(null);
    navigate("/chat");
  };

  // FILTER + SORT USERS
  const filteredUsers = allUsers
    .filter((u) => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      return (
        fullName.includes(searchText.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        u.phone?.includes(searchText)
      );
    })
    .sort((a, b) => {
      const aActive = isActiveRide(a);
      const bActive = isActiveRide(b);

      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;

      return 0;
    });

  return (
    <div className="flex h-[600px] max-w-4xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">

      {/* LEFT SIDEBAR */}
      <div className="w-full sm:w-1/3 border-r bg-gray-100">
        <div className="p-4 text-xl font-bold border-b">All Users</div>

        {/* SEARCH BAR */}
        <div className="px-4 py-2">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search user..."
            className="w-full px-3 py-2 rounded-lg border"
          />
        </div>

        {/* USER LIST */}
        {filteredUsers.map((u) => {
          const active = isActiveRide(u);

          return (
            <div
              key={u._id}
              onClick={() => {
                setSelectedUser(u);
                fetchChatHistory(u._id);
                navigate(`/chat?user=${u._id}`);
              }}
              className={`cursor-pointer px-4 py-3 flex items-center gap-3 ${
                selectedUser?._id === u._id ? "bg-gray-200" : ""
              }`}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-lg">
                  {(u.firstName || "U").charAt(0).toUpperCase()}
                </div>

                {active && (
                  <span className="absolute -right-1 -top-1 w-3 h-3 bg-green-500 rounded-full"></span>
                )}
              </div>

              <div>
                <div className="font-medium">
                  {u.firstName} {u.lastName}
                </div>
                <div className="text-sm text-gray-500">
                  {u.role === "driver" ? "Driver" : "Customer"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT CHAT WINDOW */}
      <div className="flex-1 flex flex-col">
        {!selectedUser ? (
          <div className="flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        ) : (
          <>
            <div className="p-4 border-b font-semibold flex items-center gap-2">
              <button onClick={handleBack} className="sm:hidden text-xl text-gray-600">
                <IoArrowBackOutline />
              </button>
              Chat with {selectedUser.firstName} {selectedUser.lastName}
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[300px] px-3 py-2 rounded-lg ${
                    msg.senderId === adminId
                      ? "ml-auto bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.message && <p>{msg.message}</p>}

                  {msg.fileUrl && msg.fileType === "image" && (
                    <img src={msg.fileUrl} alt="img" className="w-40 rounded mt-1" />
                  )}

                  {msg.fileUrl && msg.fileType === "file" && (
                    <a
                      href={msg.fileUrl}
                      target="_blank"
                      className="underline"
                      rel="noreferrer"
                    >
                      Download File
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* INPUT */}
            <div className="border-t p-3 flex items-center gap-2">
              <label>
                <BsPaperclip className="text-xl cursor-pointer" />
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </label>

              <label>
                <MdImage className="text-xl cursor-pointer" />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={imageInputRef}
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </label>

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 border rounded-full px-4 py-2"
                placeholder="Type message..."
              />

              <button onClick={handleSend} className="p-2 bg-blue-500 text-white rounded-full">
                <IoSend />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
