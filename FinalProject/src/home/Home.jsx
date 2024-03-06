import { useState, useEffect, useContext } from "react";
import { get, query, ref, update, set, onChildAdded, push } from "firebase/database";
import { AppContext, RoomContext } from "../appContext/AppContext";
import { SidebarMenu } from "../sidebar-menu/Sidebar-menu";
import { PartFromIndex } from "./PartFromIndex";
import { db } from "../config/firebase-config";


// import { Chats } from "../components/Chats/Chats";
// import { Contacts } from "../components/Contacts/Contacts";
// import { Groups } from "../components/Groups/Groups";
// import { Meta } from "../components/Meta/Meta";
// import { Profile } from "../components/Profile/Profile";
// import { Settings } from "../components/Settings/Settings";
// // import { Switcher } from "../components/Switcher/Switcher";
// import { UserProfileDetails } from "../components/UserProfileDetails/UserProfileDetails";
// import { LockScreen } from "./LockScreen";
// import { Login } from "./Login";
// import { Register } from "./Register";
// import { RecoverPassword } from "./RecoverPassword";



export function Home() {

return (
    <div>
    <div>
        <SidebarMenu />
    </div>
    <div>
        <h1>Home</h1>
        <PartFromIndex />
    </div>
    </div>
);
}
