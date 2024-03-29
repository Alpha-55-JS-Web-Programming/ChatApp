import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import { auth } from "./config/firebase-config";
import { RecoilRoot } from 'recoil';
import { useAuthState } from "react-firebase-hooks/auth";
import { AppContext } from "./appContext/AppContext";
import { getUserData } from "./service/users.service";
import { RecoverPassword } from "./authentication/RecoverPassword";
import Authenticated from "./authentication/Authenticated";
import { SidebarMenu } from "./sidebar-menu/Sidebar-menu";
import { Meta } from "./meta/Meta";
import { LockScreen } from "./authentication/LockScreen";
import { Login } from "./authentication/Login";
import { Register } from "./authentication/Register";
import { Profile } from "./profile/Profile";
import { ChatView } from "./chats/ChatView";
import { Groups } from "./groups/Groups";
import { Contacts } from "./contacts/Contacts";
import { Home } from "./home/Home";
import { Chats } from "./chats/Chats";
import { Settings } from "./settings/Settings";
import { Meeting } from "./views/Meeting";
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import "./App.css";

function App() {
  const [context, setContext] = useState({
    user: null,
    userData: null,
  });
  const [user, loading, error] = useAuthState(auth);
  const { id } = useParams();
  const [meeting, initMeeting] = useDyteClient();
  useEffect(() => {
    initMeeting({
      authToken: '<auth-token>',
      defaults: {
        audio: true,
        video: false,
      },
    });
  }, []);
  useEffect(() => {
    if (user) {
      getUserData(user.uid)
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            setContext({
              user,
              userData: snapshot.val()[Object.keys(snapshot.val())[0]],
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [user]);

  return (
    <AppContext.Provider value={{ ...context, setContext }}>
      <RecoilRoot>
      <DyteProvider value={meeting}>
        <Router> {/* Un-commented Router component to wrap Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/chats/:id?" element={<ChatView />} />
            <Route path="/profile" element={<Authenticated> <Profile /> </Authenticated>} />
            <Route path="/sidebar-menu" element={<SidebarMenu />} />
            <Route path="/meet" element={<Meeting />} />
            <Route path="/lock-screen" element={<Authenticated> <LockScreen /> </Authenticated>} />
            <Route path="/recover" element={<RecoverPassword />} />
            <Route path="/meta" element={<Meta />} />
          </Routes>
        </Router>
        </DyteProvider>
      </RecoilRoot>
    </AppContext.Provider>
  );
}

export default App;
