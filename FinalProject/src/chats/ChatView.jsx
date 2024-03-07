import { PartFromIndex } from "../home/PartFromIndex";
import { SidebarMenu } from "../sidebar-menu/Sidebar-menu";
import { Chats } from "./Chats";

export function ChatView() {
    return (
        <div>
            <div>
                <SidebarMenu />
            </div>
            <div>
                <Chats />
                <PartFromIndex />
            </div>
        </div>
    );
}
