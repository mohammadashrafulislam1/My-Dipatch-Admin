import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import { IoSend, IoArrowBackOutline } from "react-icons/io5";
import { BsPaperclip } from "react-icons/bs";
import { MdImage } from "react-icons/md";
import useAuth from "../../../Components/useAuth";
import { endPoint } from "../../../Components/ForAPIs";
import { v4 as uuidv4 } from "uuid";

const clientMessageId = uuidv4();
const Chat = () => {
  const { admin, token } = useAuth();
  const adminId = admin?._id;
const [sending, setSending] = useState(false);
const [unreadMap, setUnreadMap] = useState({});
const [lastMessageMap, setLastMessageMap] = useState({});
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
  const socket = useRef(null); // Use useRef for socket

  // Fetch All Users
  const fetchUsers = async () => {
    const res = await axios.get(`${endPoint}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Remove admins from list
    const filtered = res.data.filter((u) => u.role !== "admin");
    setAllUsers(filtered);
  };

  // Fetch All Rides
  const fetchRides = async () => {
    const res = await axios.get(`${endPoint}/rides`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRideData(res.data.rides);
  };

const fetchChatHistory = async (userId) => {
  const res = await axios.get(`${endPoint}/chat/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const filtered = res.data.messages.filter(
    m =>
      (m.senderId === adminId && m.recipientId === userId) ||
      (m.senderId === userId && m.recipientId === adminId)
  );
  setMessages(filtered);
  // ⏱️ set last message time
  if (filtered.length > 0) {
    const last = filtered[filtered.length - 1];
    setLastMessageMap((prev) => ({
      ...prev,
      [userId]: new Date(last.createdAt).getTime(),
    }));
  }
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

  // Get active ride ID for user
  const getActiveRideId = (userId) => {
    const activeStatuses = ["pending", "accepted", "on_the_way", "in_progress", "at_stop"];
    const activeRide = rideData.find(
      (r) =>
        activeStatuses.includes(r.status) &&
        (r.driverId === userId || r.customerId === userId)
    );
    return activeRide?._id || null;
  };

  useEffect(() => {
    fetchUsers();
    fetchRides();
  }, []);

  // Socket connection
  useEffect(() => {
  if (!adminId) return;

  console.log("Connecting socket for adminId:", adminId);
  socket.current = io(endPoint, {
    transports: ["websocket"],
    query: { userId: adminId, role: "admin" },
    withCredentials: true,
  });

  socket.current.emit("join", { userId: adminId, role: "admin" });

  socket.current.on("connect", () => {
    console.log("Socket connected:", socket.current.id);
  });

  return () => {
    socket.current.disconnect();
    console.log("Socket disconnected");
  };
}, [adminId]);


  // Socket message listener
 useEffect(() => {
  if (!socket.current) return;

  const handleNewMessage = (msg) => {
    const otherUserId =
    msg.senderId === adminId ? msg.recipientId : msg.senderId;

  // ⏱️ update last message time
  setLastMessageMap((prev) => ({
    ...prev,
    [otherUserId]: new Date(msg.createdAt || Date.now()).getTime(),
  }));
    setMessages((prev) => {
      // avoid duplicates
      if (prev.some((m) => m._id === msg._id)) return prev;

      // only append if it belongs to currently opened chat
      if (
        selectedUser &&
        (
          (msg.senderId === selectedUser._id && msg.recipientId === adminId) ||
          (msg.senderId === adminId && msg.recipientId === selectedUser._id)
        )
      ) {
        return [...prev, msg];
      }

      return prev;
    });
    // 🔔 MARK UNREAD if message is NOT from admin
  if (msg.senderId !== adminId) {
    setUnreadMap((prev) => ({
      ...prev,
      [msg.senderId]: (prev[msg.senderId] || 0) + 1,
    }));
  }
  };

  socket.current.on("support-message", handleNewMessage);

  return () => {
    socket.current.off("support-message", handleNewMessage);
  };
}, [adminId, selectedUser]);

  // Auto-select user via URL param
  useEffect(() => {
    const userId = searchParams.get("user");
    if (userId && allUsers.length > 0) {
      const found = allUsers.find((u) => u._id === userId);
      if (found) {
        setSelectedUser(found);
        fetchChatHistory(found._id);
      }
    }
  }, [allUsers, searchParams]);
useEffect(() => {
  if (!selectedUser) return;

  const interval = setInterval(() => {
    fetchChatHistory(selectedUser._id);
  }, 5000); // every 5s

  return () => clearInterval(interval);
}, [selectedUser]);

  // handleSend function
const handleSend = async () => {
  if (sending) return; // prevent double sending
  if (!selectedUser) return;
  if (!message.trim() && !selectedFile) return;

  setSending(true); // start sending

  try {
    // Get active ride ID for this user
    const rideId = getActiveRideId(selectedUser._id);

    let fileUrl = null;
    let fileType = null;

    // FILE upload
    if (selectedFile) {
      const form = new FormData();
      form.append("file", selectedFile);
      if (rideId) form.append("rideId", rideId);
      form.append("senderId", adminId);
      form.append("senderRole", "admin");
      form.append("recipientId", selectedUser._id);

      try {
        const upload = await axios.post(`${endPoint}/chat/support/upload`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        fileUrl = upload.data.url || upload.data.fileUrl;
        fileType = selectedFile.type.startsWith("image") ? "image" : "file";
      } catch (err) {
        console.error("Failed to upload file:", err);
        fileUrl = URL.createObjectURL(selectedFile);
        fileType = selectedFile.type.startsWith("image") ? "image" : "file";
      }
    }

    // CREATE optimistic message
    const messageData = {
      rideId: rideId || `admin-chat-${adminId}-${selectedUser._id}`,
      senderId: adminId,
      senderRole: "admin",
      recipientId: selectedUser._id,
      message: message.trim(),
      fileUrl,
      fileType,
    };
    const optimisticMsg = {
      ...messageData,
      _id: `temp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      optimistic: true,
    };
setLastMessageMap((prev) => ({
  ...prev,
  [selectedUser._id]: Date.now(),
}));

    setMessages((prev) => [...prev, optimisticMsg]);

    // Send via socket
    if (socket.current) {
      socket.current.emit("support-message", messageData);
    }

    // Save to backend
    if (!selectedFile && message.trim()) {
      const res = await axios.post(
        `${endPoint}/chat/admin-reply`,
        {
          rideId: messageData.rideId,
          senderId: adminId,
          senderRole: "admin",
          recipientId: selectedUser._id,
          text: message.trim(),
          clientMessageId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) =>
        prev.filter((m) => m._id !== optimisticMsg._id).concat(res.data.chat || res.data)
      );
    }

    // Clear inputs
    setMessage("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  } catch (err) {
    console.error("Failed to send message:", err);
    // Mark optimistic message as failed
    setMessages((prev) =>
      prev.map((m) =>
        m._id.startsWith("temp-") ? { ...m, failed: true, optimistic: false } : m
      )
    );
  } finally {
    setSending(false); // STOP spinner for both text and file
  }
};

  const handleBack = () => {
    setSelectedUser(null);
    navigate("/chat");
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size too large. Maximum size is 10MB.");
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
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
    const timeA = lastMessageMap[a._id] || 0;
    const timeB = lastMessageMap[b._id] || 0;

    // 🔥 newest message first
    if (timeA !== timeB) return timeB - timeA;

    // fallback: active ride
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
            className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* USER LIST */}
        <div className="overflow-y-auto max-h-[500px]">
          {filteredUsers.map((u) => {
            const active = isActiveRide(u);
            return (
              <div
                key={u._id}
                onClick={() => {
                  setSelectedUser(u);
                  fetchChatHistory(u._id);
                  navigate(`/chat?user=${u._id}`);
                  // ✅ Clear unread badge
  setUnreadMap((prev) => ({
    ...prev,
    [u._id]: 0,
  }));
                }}
                className={`cursor-pointer px-4 py-3 flex items-center gap-3 hover:bg-gray-200 transition-colors ${
                  selectedUser?._id === u._id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg font-semibold text-blue-700">
                    {(u.firstName || "U").charAt(0).toUpperCase()}
                  </div>
                  {active && (
                    <span className="absolute -right-1 -top-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {u.firstName} {u.lastName}
                    {/* 🔵 UNREAD BADGE */}
    {unreadMap[u._id] > 0 && (
      <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
        {unreadMap[u._id]}
      </span>
    )}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    {u.role === "driver" ? "Driver" : "Customer"}
                    {active && <span className="text-green-600 text-xs ml-1">• Active</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT CHAT WINDOW */}
      <div className="flex-1 flex flex-col">
        {!selectedUser ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-lg">
            👈 Select a user to start chatting
          </div>
        ) : (
          <>
            {/* CHAT HEADER */}
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <button onClick={handleBack} className="sm:hidden text-xl text-gray-600 hover:text-gray-800">
                  <IoArrowBackOutline />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-700">
                    {(selectedUser.firstName || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedUser.role === "driver" ? "Driver" : "Customer"}
                      {isActiveRide(selectedUser) && <span className="text-green-600 ml-2">• Active ride</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MESSAGES AREA */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="text-lg mb-2">No messages yet</div>
                  <div className="text-sm">Start a conversation with {selectedUser.firstName}</div>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isFromAdmin = msg.senderId === adminId;
                  const isFailed = msg.failed;
                  
                  return (
                    <div
                      key={msg._id || idx}
                      className={`flex ${isFromAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                          isFromAdmin
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                        } ${isFailed ? 'opacity-70' : ''}`}
                      >
                        {/* Message text */}
                        {msg.message && <p className="break-words">{msg.message}</p>}
                        
                        {/* File/image */}
                        {msg.fileUrl && msg.fileType === "image" && (
                          <img 
                            src={msg.fileUrl} 
                            alt="Shared" 
                            className="w-48 h-auto rounded-lg mt-2 border border-gray-200" 
                          />
                        )}
                        
                        {msg.fileUrl && msg.fileType === "file" && (
                          <a
                            href={msg.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <BsPaperclip />
                            <span>Download File</span>
                          </a>
                        )}
                        
                        {/* Timestamp and status */}
                        <div className={`text-xs mt-1 ${isFromAdmin ? 'text-blue-100' : 'text-gray-500'} flex items-center justify-end gap-1`}>
                          {msg.createdAt && new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {isFailed && <span className="text-red-300 ml-1">(Failed)</span>}
                          {msg.optimistic && <span className="text-yellow-300 ml-1">(Sending...)</span>}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* INPUT AREA */}
            <div className="border-t p-3 bg-white">
              {/* Selected file preview */}
              {selectedFile && (
                <div className="mb-2 p-2 bg-blue-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedFile.type.startsWith("image/") ? (
                      <>
                        <MdImage className="text-blue-500" />
                        <img 
                          src={URL.createObjectURL(selectedFile)} 
                          alt="Preview" 
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                      </>
                    ) : (
                      <>
                        <BsPaperclip className="text-blue-500" />
                        <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                {/* File upload buttons */}
                <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <BsPaperclip className="text-xl text-gray-600" />
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </label>
                
                <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MdImage className="text-xl text-gray-600" />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={imageInputRef}
                    onChange={handleFileChange}
                  />
                </label>
                
                {/* Message input */}
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message..."
                  disabled={!selectedUser}
                />
                
                {/* Send button */}
                <button
                  onClick={handleSend}
                  disabled={(!message.trim() && !selectedFile) || !selectedUser}
                  className={`p-3 rounded-full ${
                    (!message.trim() && !selectedFile) || !selectedUser
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  } transition-colors`}
                >
                 {sending ? (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  ) : (
    <IoSend />
  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;