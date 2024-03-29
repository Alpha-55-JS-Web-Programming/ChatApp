import { useState, useEffect, useContext } from "react";
import { useRecoilValue } from 'recoil';
import { currentRoomId } from "../atom/atom";
import { serverTimestamp } from "firebase/database";
import { get, query, ref, update, set, onChildAdded, push } from "firebase/database";
import { AppContext, RoomContext } from "../appContext/AppContext";
import { Chats } from "../chats/Chats";
import { db } from "../config/firebase-config";
import { UploadFileComponent } from "./UploadFileComponent";
import { useNavigate, useParams } from "react-router-dom";
import { ChatUserHead } from "./ChatUserHead";


export function PartFromIndex() {
    const navigate = useNavigate();
    let { id } = useParams();

    const currentRoom = useRecoilValue(currentRoomId);
    const { user, userData, updateUserData } = useContext(AppContext);
    console.log({ currentRoom });
    // Add Message State: Create a state to store messages in the chat room.
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [selectedTab, setSelectedTab] = useState('chats');


    // navigate(`/rooms/${room.id}`);
    const checkRoomMessages = async (id = id) => {
        const roomRef = ref(db, `rooms/${id}`);

        try {
            // Attempt to read data from roomRef
            const snapshot = await get(roomRef);

            // Check if the data exists
            if (snapshot.exists()) {
                // Data exists, you can proceed
                console.log("Data exists:", snapshot.val());

                // If you need to check for the messages node
                const messagesRef = child(roomRef, 'messages');
                const messagesSnapshot = await get(messagesRef);
                if (messagesSnapshot.exists()) {
                    console.log("Messages exist:", messagesSnapshot.val());
                } else {
                    console.log("No messages yet in this room.");
                }
            } else {
                console.log("Room does not exist.");
                // Handle the case where the room doesn't exist yet
            }
        } catch (error) {
            // Handle any errors
            console.error("Error accessing roomRef:", error);
        }
    }

    // Call the function with the ID of the room you want to check
    // const roomId = "yo_room_id";
    // checkRoomMessages(roomId);ur









    useEffect(() => {
        try {
            if (id) {

                //   const roomRef = ref(db, `rooms/${currentRoom}/messages`);
                const roomRef = ref(db, `rooms/${id}/messages`);// useParams
                const queryRef = query(roomRef);
                const unsubscribe = onChildAdded(queryRef, (snapshot) => {
                    const messageData = snapshot.val();
                    // Check if message data is available
                    // console.log({ messageData});
                    if (messageData) {
                        setMessages((prevMessages) => [...prevMessages, messageData]);
                    }
                });
                return () => {
                    unsubscribe();
                };

            } else {
                // If there's no current room, clear the messages
                setMessages([]);
            }
        } catch (error) {
            console.log("Error accessing roomRef:", error);
        }
    }, [currentRoom]);

    const handleInputMessage = (e) => {
        e.preventDefault();
        const message = e.target.value;
        setNewMessage(message);
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const message = {
            senderId: userData.uid,
            senderName: userData.username,
            content: newMessage,
            timestamp: serverTimestamp(),
            avatar: userData?.photoURL || null,
        };

        // Log the message object to verify its structure
        console.log("Message to be sent:", message);

        await push(ref(db, `rooms/${currentRoom}/messages`), message);
        setNewMessage("");
    };


    return (
        <>
            {/* <!-- Start User chat --> */}
            <div className="w-full overflow-hidden transition-all duration-150 bg-white user-chat dark:bg-zinc-800">
                <div className="lg:flex">
                    {/* <!-- start chat conversation section --> */}

                    <div className="relative w-full overflow-hidden ">
                    <ChatUserHead  user={userData} ></ChatUserHead>
                        {/* <!-- end chat user head --> */}

                        {/* <!-- start chat conversation --> */}
                        <div className="h-[80vh] p-4 lg:p-6">
                            {/* {fetching Messages} */}
                            <ul className="mb-0">
                                { id ? () => checkRoomMessages(id) : <p>Select a friend to start a chat.</p>}
                                {messages.length > 0 &&
                                    messages.map((message) => (
                                        <li key={message.messageId} className="clear-both py-4" >
                                            <div className="flex items-end gap-3">
                                                <div>
                                                    {/* <img src="assets/images/users/avatar-4.jpg" alt="" className="rounded-full h-9 w-9" /> */}
                                                    <img src={message?.avatar} alt="" className="rounded-full h-9 w-9" />
                                                </div>

                                                <div>
                                                    <div className="flex gap-2 mb-2">
                                                        <div className="relative px-5 py-3 text-white rounded-lg ltr:rounded-bl-none rtl:rounded-br-none group-data-[theme-color=violet]:bg-violet-500 group-data-[theme-color=green]:bg-green-500 group-data-[theme-color=red]:bg-red-500">
                                                            <p className="mb-0">
                                                                {message.content}
                                                            </p>
                                                            <p className="mt-1 mb-0 text-xs text-right text-white/50"><i className="align-middle ri-time-line"></i> <span className="align-middle">    {`${new Date(message.timestamp).toLocaleDateString()} ${new Date(message.timestamp).toLocaleTimeString()}`}</span></p>
                                                            <div className="before:content-[''] before:absolute before:border-[5px] before:border-transparent group-data-[theme-color=violet]:ltr:before:border-l-violet-500 group-data-[theme-color=violet]:ltr:before:border-t-violet-500 group-data-[theme-color=green]:ltr:before:border-l-green-500 group-data-[theme-color=green]:ltr:before:border-t-green-500 group-data-[theme-color=red]:ltr:before:border-l-red-500 group-data-[theme-color=red]:ltr:before:border-t-red-500 group-data-[theme-color=violet]:rtl:before:border-r-violet-500 group-data-[theme-color=violet]:rtl:before:border-t-violet-500 group-data-[theme-color=green]:rtl:before:border-r-green-500 group-data-[theme-color=green]:rtl:before:border-t-green-500 group-data-[theme-color=red]:rtl:before:border-r-red-500 group-data-[theme-color=red]:rtl:before:border-t-red-500 ltr:before:left-0 rtl:before:right-0 before:-bottom-2"></div>
                                                        </div>
                                                        <div className="relative self-start dropdown">
                                                            <a className="p-0 text-gray-400 border-0 btn dropdown-toggle dark:text-gray-100" href="#" role="button" data-bs-toggle="dropdown" id="dropdownMenuButton12">
                                                                <i className="ri-more-2-fill"></i>
                                                            </a>
                                                            <div className="absolute z-50 hidden w-40 py-2 my-6 text-left list-none bg-white border-none rounded shadow-lg ltr:left-auto ltr:right-0 xl:ltr:left-0 xl:ltr:right-auto rtl:left-0 rtl:right-auto xl:rtl:right-0 xl:rtl:left-auto dropdown-menu bg-clip-padding dark:bg-zinc-700 dark:border-gray-600/50" aria-labelledby="dropdownMenuButton12">
                                                                <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Copy <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-file-copy-line"></i></a>
                                                                <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Save <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-save-line"></i></a>
                                                                <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Forward <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-chat-forward-line"></i></a>
                                                                <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/50 dark:text-gray-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right" href="#">Delete <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-200 ri-delete-bin-line"></i></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="font-medium text-gray-700 text-14 dark:text-gray-300">{message.senderName}</div>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                            {/* {End of fetching Messages} */}
                        </div>
                        {/* <!-- end chat conversation end --> */}
                        {/* <!-- start chat input section --> */}
                        <div className="z-40 w-full p-6 mb-0 bg-white border-t lg:mb-1 border-gray-50 dark:bg-zinc-800 dark:border-zinc-700">
                            <div className="flex gap-2">
                                <div className="flex-grow">
                                    {/* handleSendMessage    sendMessage(messages) */}
                                    <input type="text" value={newMessage} onChange={handleInputMessage} onClick={() => { sendMessage(messages) }} onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            sendMessage(messages);
                                        }
                                    }} className="w-full border-transparent rounded bg-gray-50 placeholder:text-14 text-14 dark:bg-zinc-700 dark:placeholder:text-gray-300 dark:text-gray-300" placeholder="Enter Message..." />
                                </div>
                                <div>
                                    <div>
                                        <ul className="mb-0">
                                            <li className="inline-block" title="Emoji">
                                                <button type="button" className="border-transparent group/tooltip btn relative group-data-[theme-color=violet]:dark:text-violet-200 group-data-[theme-color=green]:dark:text-green-200 group-data-[theme-color=red]:dark:text-red-200 group-data-[theme-color=violet]:text-violet-500 group-data-[theme-color=green]:text-green-500 group-data-[theme-color=red]:text-red-500 text-16">
                                                    <div className="absolute items-center hidden -top-10 ltr:-left-2 group-hover/tooltip:flex rtl:-right-2">
                                                        <div className="absolute -bottom-1 left-[40%] w-3 h-3 rotate-45 bg-black"></div>
                                                        <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">Emoji</span>
                                                    </div>
                                                    <i className="ri-emotion-happy-line"></i>
                                                </button>
                                            </li>

                                            <UploadFileComponent />
                                            {/* Send Message */}
                                            <li className="inline-block">
                                                <button type="submit" onClick={() => { sendMessage() }} className="text-white border-transparent btn group-data-[theme-color=violet]:bg-violet-500 group-data-[theme-color=green]:bg-green-500 group-data-[theme-color=red]:bg-red-500 group-data-[theme-color=violet]:hover:bg-violet-600 group-data-[theme-color=green]:hover:bg-green-600">
                                                    <i className="ri-send-plane-2-fill"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <!-- end chat input section --> */}

                    </div>
                    {/* <!-- end chat conversation section --> */}
                </div>
            </div>

        </>
    );
}