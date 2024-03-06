import React, { useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "./config/firebase-config";
import { RecoilRoot } from 'recoil';
import { useAuthState } from "react-firebase-hooks/auth";
import { RecoverPassword } from "./authentication/RecoverPassword";
import { LockScreen } from "./authentication/LockScreen";
import { Login } from "./authentication/Login";
import { Register } from "./authentication/Register";
import { Meta } from "./meta/Meta";
import { Profile } from "./profile/Profile";
import { SidebarMenu } from "./sidebar-menu/Sidebar-menu";
import { AppContext } from "./appContext/AppContext";
import { getUserData } from "./service/users.service";
import { Chats } from "./chats/Chats";
import { Settings } from "./settings/Settings";
import { Contacts } from "./contacts/Contacts";
import { Groups } from "./groups/Groups";
import "./App.css";
import Authenticated from "./authentication/Authenticated";
// import { Index } from "./Index";
// import { UserProfileDetails } from "./UserProfileDetails/UserProfileDetails";
// import { Swicher } from "./components/Swicher/Swicher";



function App() {
  const [context, setContext] = useState({
    user: null,
    userData: null,
  });
  const [user, loading, error] = useAuthState(auth);

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
    <>
    <AppContext.Provider value={{ ...context, setContext }}>
      {/* <RoomContext.Provider value={{ ...roomId,  setRoomId: setRoomId }}> */}
      {/* <RecoilRoot> */}
      {/* <Router> */}
        <Routes>
        {/* <Route path="*" element={<Index />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lock-screen" element={<Authenticated> <LockScreen /> </Authenticated>} />
          <Route path="/recover" element={<RecoverPassword />} />
          <Route path="/chats/:id" element={<Chats />} />
          <Route path="/meta" element={<Meta />} />
          <Route path="/profile" element={<Authenticated> <Profile /> </Authenticated>} />
          <Route path="/sidebar-menu" element={<SidebarMenu />} />
          {/* <Route path="/user-profile-details" element={<UserProfileDetails/> }/> */}
          {/* <Route path="/switcher" element={<Switcher />} /> */}
          
          {/* The routing can be adapted for the master-slave view in a similar way: */}
          {/* <Route path="/profile" element={<Index selectedTab="profile" />} /> */}
          {/* <Route path="/groups" element={<Groups />} /> */}
          {/* <Route path="/contacts" element={<Contacts />} /> */}
          {/* <Route path="/settings" element={<Settings />} /> */}
        </Routes>
        <div className="App">{/* <Index /> */}</div>
      {/* </Router> */}
      {/* </RecoilRoot> */}
      {/* </RoomContext.Provider> */}
    </AppContext.Provider>
    </>
  );
}

export default App
