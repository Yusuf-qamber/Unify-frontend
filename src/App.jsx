import "./App.scss";
import NavBar from "./components/NavBar/NavBar";
import SignUp from "./components/SignUp/SignUp";
import SignIn from "./components/SignIn/SignIn";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import * as authService from "./services/authService.js";
import * as noteService from "./services/noteService.js";
import { useState,useEffect } from "react";
import Landing from "./components/Landing/Landing";
import College from "./components/College/College.jsx";
import NoteList from "./components/NoteList/NoteList.jsx";
import NoteDetails from "./components/NoteDetails/NoteDetails.jsx";
import NoteForm from "./components/NoteForm/NoteForm.jsx";
import EventList from "./components/EventList/EventList.jsx";
import * as eventServics from "./services/eventServics.js";
import EventDetails from "./components/EventDetails/EventDetails.jsx";
import EventForm from "./components/EventForm/EventForm.jsx";
import Schedule from "./components/Schedule/Schedule";
import ScheduleForm from "./components/ScheduleForm/ScheduleForm";
import { ConfirmProvider } from "material-ui-confirm";
import AssignmentList from "./components/AssignmentList/AssignmentList.jsx";
import AssignmentDetails from "./components/AssignmentDetails/AssignmentDetails.jsx";
import AssignmentForm from "./components/AssignmentForm/AssignmentForm.jsx";
import GpaList from "./components/GpaList/GpaList.jsx";
import GpaForm from "./components/GpaForm/GpaForm.jsx";
import GpaDetails from "./components/GpaDetails/GpaDetails.jsx";
import Profile from "./components/Profile/Profile.jsx";
import CollegeChat from "./components/CollegeChat/CollegeChat.jsx";
import ChatPage from "./components/ChatPage/ChatPage.jsx";
import PrivateChat from "./components/PrivateChat/PrivateChat.jsx"
import { io } from "socket.io-client";


const App = () => {
  const navigate = useNavigate();

  const initialState = authService.getUser();
  const [user, setUser] = useState(initialState);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(() => {
    if (user) {
      // connect to backend socket server
      const newSocket = io(import.meta.env.VITE_BACK_END_SERVER_URL, {
        query: { userId: user._id }, // send userId to identify the socket
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  useEffect(() => {
  if (!socket || !user?._id) return;

  // Mark user online
  socket.emit("userOnline", user._id);

  // Listen for updates
  socket.on("updateUserStatus", (users) => {
    setOnlineUsers(users);
  });

  // Clean up
  return () => {
    socket.off("updateUserStatus");
  };
}, [socket, user]);

useEffect(() => {
  const handleBeforeUnload = () => {
    if (socket && user?._id) {
      socket.emit("userOffline", user._id);
      socket.disconnect();
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, [socket, user]);



  const handleSignUp = async (formData) => {
    try {
      const res = await authService.signUp(formData);
      setUser(res);

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const handleSignOut = () => {
if (socket && user?._id) {
    socket.emit("userOffline", user._id); 
    socket.disconnect(); 
  }
    localStorage.removeItem("token");
    setUser(null);
  };

  const handleSignIn = async (formData) => {
    const res = await authService.signIn(formData);
    setUser(res);
  };

  const handleDeleteNote = async (college, noteId) => {
    try {
      await noteService.deleteNote(noteId, college);
      navigate(`/${college}/notes`);
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const handleUpdateNote = async (college, noteId, noteFormData) => {
    await noteService.updateNote(noteFormData, college, noteId);
    navigate(`/${college}/notes/${noteId}`);
  };

  const handleDeleteEvent = async (college, eventId) => {
    try {
      await eventServics.deleteEvent(eventId, college);
      navigate(`/${college}/events`);
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  const handleUpdateEvent = async (college, eventId, noteFormData) => {
    await eventServics.updateEvent(noteFormData, college, eventId);
    navigate(`/${college}/event/${eventId}`);
  };

  return (
    
    <>
      <NavBar user={user} handleSignOut={handleSignOut} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/sign-up"
          element={<SignUp handleSignUp={handleSignUp} user={user} setUser={setUser} />}
        />
        <Route
          path="/sign-in"
          element={<SignIn handleSignIn={handleSignIn} user={user} setUser={setUser} />}
        />
        <Route path="/:college" element={<College user={user}/> }  />
        <Route path="/:college/notes" element={<NoteList user={user} />} />
        <Route
          path="/:college/notes/:noteId"
          element={
            <NoteDetails user={user} handleDeleteNote={handleDeleteNote} />
          }
        />
        <Route
          path="/:college/events/:eventId"
          element={
            <EventDetails user={user} handleDeleteEvent={handleDeleteEvent} />
          }
        />
        <Route path="/:college/events" element={<EventList user={user} />} />

        <Route path="/404" element={<h1>404 Not Found</h1>} />
        <Route path="*" element={<Navigate to="/404" replace />} />
        {/* protected routes */}
        {user ? (
          <>
            <Route path="/:college/notes/new" element={<NoteForm />} />
            <Route path="/:college/events/new" element={<EventForm />} />
            <Route path="/:college/chat" element={<CollegeChat user={user} />} />

            <Route
              path="/:college/notes/:noteId/edit"
              element={<NoteForm handleUpdateNote={handleUpdateNote} />}
            />
            <Route
              path="/:college/events/:eventId/edit"
              element={<EventForm handleUpdateEvent={handleUpdateEvent} />}
            />
            <Route path="/schedule" element={<Schedule user={user} />} />
            <Route path="/assignments" element={<AssignmentList user={user} />} />
<Route path="/assignments/new" element={<AssignmentForm user={user} />} />
<Route path="/assignments/:assignmentId" element={<AssignmentDetails user={user} />} />
<Route path="/assignments/:assignmentId/edit" element={<AssignmentForm user={user} />} />
<Route path="/gpa" element={<GpaList user={user} />} />
<Route path="/gpa/new" element={<GpaForm />} />
<Route path="/gpa/:gpaId" element={<GpaDetails user={user} />} />
<Route path="/gpa/:gpaId/edit" element={<GpaForm />} />
<Route path="/profile" element={<Profile onSignOut={handleSignOut} user={user}/>}/>
<Route path="/profile/:userId" element={<Profile />} />
<Route path="/chat" element={<ChatPage user={user} socket={socket} onlineUsers={onlineUsers} />}/>
<Route path="/chat/:userId" element={<PrivateChat user={user} socket={socket} />} />

{user && (
  <>
    <Route path="/schedule/new" element={<ScheduleForm />} />
    <Route path="/schedule/:courseId/edit" element={<ScheduleForm />} />
  </>
)}
          </>
        ) : (
          
          <></>
        )}
      </Routes>
    </>
    
  );
};

export default App;
