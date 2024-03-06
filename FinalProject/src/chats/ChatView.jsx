import { SidebarMenu } from "../sidebar-menu/Sidebar-menu";
import { Chats } from "./Chats";


export function ChatView() {
    return (
        <div>
            <SidebarMenu />
            <Chats />
        </div>
    );
}