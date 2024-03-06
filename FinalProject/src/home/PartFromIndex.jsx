import { useState, useEffect, useContext } from "react";
import { useRecoilValue } from 'recoil';
import { currentRoomId } from "../atom/atom";
import { serverTimestamp } from "firebase/database";
import { get, query, ref, update, set, onChildAdded, push } from "firebase/database";
import { AppContext, RoomContext } from "../appContext/AppContext";
import { Chats } from "../chats/Chats";
import { SidebarMenu } from "../sidebar-menu/Sidebar-menu";
import { db } from "../config/firebase-config";
import { updateUserData } from "../service/users.service";
import { uploadFile } from "../service/auth.service";
import { UploadFileComponent } from "./UploadFileComponent";


export function PartFromIndex() {

    const currentRoom = useRecoilValue(currentRoomId);
    // Upload File State: Create a state to store the file and loading state.
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const { user, userData, updateUserData } = useContext(AppContext);
console.log({currentRoom});
    // Add Message State: Create a state to store messages in the chat room.
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [selectedTab, setSelectedTab] = useState('chats');

    function handleUploadFile(e) {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    }


    function uploadFileURL() {
        if (!file) {
            console.error('No file selected.');
            return;
        }
        setLoading(true);


        // Assuming uploadFile is a function that handles the file upload
        uploadFile(file, user, setLoading)
            .then((photoURL) => {
                if (user) {
                    userData.fileURL = photoURL; // Update with the correct property name (e.g., fileURL)
                    updateUserData(userData?.uid, userData);
                    console.log(photoURL);
                } else {
                    console.error('Error updating user data: User is undefined');
                }

                setLoading(false);
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
                setLoading(false);
            });
    }
   
    useEffect(() => {
        if (currentRoom) {
          const roomRef = ref(db, `rooms/${currentRoom}/messages`);
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
                            <div className="p-4 border-b border-gray-100 lg:p-6 dark:border-zinc-600">
                                <div className="grid items-center grid-cols-12">
                                    <div className="col-span-8 sm:col-span-4">
                                        <div className="flex items-center">
                                            <div className="block ltr:mr-2 rtl:ml-2 lg:hidden">
                                                <a href="#" onClick={() => { }} className="p-2 text-gray-500 user-chat-remove text-16"><i className="ri-arrow-left-s-line"></i></a>
                                            </div>
                                            <div className="rtl:ml-3 ltr:mr-3">
                                                <img src="assets/images/users/avatar-4.jpg" className="rounded-full h-9 w-9" alt="" />
                                            </div>
                                            <div className="flex-grow overflow-hidden">
                                                <h5 className="mb-0 truncate text-16 ltr:block rtl:hidden"><a href="#" className="text-gray-800 dark:text-gray-50">{userData?.username}</a> <i className="text-green-500 ltr:ml-1 rtl:mr-1 ri-record-circle-fill text-10 "></i></h5>
                                                <h5 className="mb-0 truncate text-16 rtl:block ltr:hidden"><i className="text-green-500 ltr:ml-1 rtl:mr-1 ri-record-circle-fill text-10 "></i> <a href="#" className="text-gray-800 dark:text-gray-50">Doris Brown</a></h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-4 sm:col-span-8">
                                        <ul className="flex items-center justify-end lg:gap-4">
                                            <li className="px-3">
                                                <div className="relative dropstart">
                                                    <button className="p-0 text-xl text-gray-500 border-0 btn dropdown-toggle dark:text-gray-300" type="button" data-bs-toggle="dropdown" id="dropdownMenuButton10" data-tw-auto-close="outside">
                                                        <i className="ri-search-line"></i>
                                                    </button>
                                                    <ul className="absolute z-50 hidden mt-2 text-left list-none bg-white border rounded-lg shadow-lg w-fit border-gray-50 dropdown-menu top-8 dark:bg-zinc-700 bg-clip-padding dark:border-gray-700" aria-labelledby="dropdownMenuButton10">
                                                        <li className="p-2">
                                                            <input type="text" className="text-gray-500 border-0 rounded bg-gray-50 placeholder:text-14 text-14 dark:bg-zinc-600 dark:text-gray-300 placeholder:dark:text-gray-300 focus:ring-0" placeholder="Search.." />
                                                        </li>
                                                    </ul>
                                                </div>
                                            </li>

                                            <li>
                                                <button type="button" className="hidden text-xl text-gray-500 border-0 btn dark:text-gray-300 lg:block" data-tw-toggle="modal" data-tw-target="#audiCallModal">
                                                    <i className="ri-phone-line"></i>
                                                </button>
                                            </li>

                                            {/* <!-- Modal start --> */}
                                            <li className="relative z-50 hidden modal" id="audiCallModal">
                                                <div className="fixed inset-0 z-50 overflow-hidden">
                                                    <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay"></div>
                                                    <div className="flex items-center justify-center max-w-lg min-h-screen p-4 mx-auto text-center animate-translate">
                                                        <div className="relative w-full max-w-lg my-8 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl -top-10 dark:bg-zinc-700">
                                                            <div className="group-data-[theme-color=violet]:bg-violet-800/10 group-data-[theme-color=green]:bg-green-50/50 group-data-[theme-color=red]:bg-red-50/50 group-data-[theme-color=violet]:dark:bg-zinc-600 group-data-[theme-color=green]:dark:bg-zinc-600 group-data-[theme-color=red]:dark:bg-zinc-600">
                                                                <div className="p-4">
                                                                    <div className="p-6">
                                                                        <div className="p-4 text-center">
                                                                            <div className="mb-6">
                                                                                <img src="assets/images/users/avatar-4.jpg" alt="" className="w-24 h-24 mx-auto rounded-full" />
                                                                            </div>

                                                                            <h5 className="mb-1 text-gray-800 truncate dark:text-gray-50">Doris Brown</h5>
                                                                            <p className="text-gray-500 dark:text-gray-300">Start Audio Call</p>

                                                                            <div className="mt-10">
                                                                                <ul className="flex justify-center mb-1">
                                                                                    <li className="px-2 ml-0 mr-2">
                                                                                        <button type="button" className="w-12 h-12 text-white bg-red-500 border-transparent rounded-full btn hover:bg-red-600" data-tw-dismiss="modal">
                                                                                            <span className="text-xl bg-transparent">
                                                                                                <i className="ri-close-fill"></i>
                                                                                            </span>
                                                                                        </button>
                                                                                    </li>
                                                                                    <li className="px-2">
                                                                                        <button type="button" className="w-12 h-12 text-white bg-green-500 border-transparent rounded-full btn hover:bg-green-600">
                                                                                            <span className="text-xl bg-transparent">
                                                                                                <i className="ri-phone-fill"></i>
                                                                                            </span>
                                                                                        </button>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* <!-- Modal end --> */}

                                            <li>
                                                <button type="button" className="hidden text-xl text-gray-500 border-0 btn dark:text-gray-300 lg:block" data-tw-toggle="modal" data-tw-target="#videoCallModal">
                                                    <i className="ri-vidicon-line"></i>
                                                </button>
                                            </li>

                                            {/* <!-- Modal start --> */}
                                            <li className="relative z-50 hidden modal dark:text-gray-300" id="videoCallModal">
                                                <div className="fixed inset-0 z-50 overflow-hidden">
                                                    <div className="absolute inset-0 transition-opacity bg-black bg-opacity-50 modal-overlay"></div>
                                                    <div className="flex items-center justify-center max-w-lg min-h-screen p-4 mx-auto text-center animate-translate">
                                                        <div className="relative w-full max-w-lg my-8 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl -top-10 dark:bg-zinc-700">
                                                            <div className="group-data-[theme-color=violet]:bg-violet-800/10 group-data-[theme-color=green]:bg-green-50/50 group-data-[theme-color=red]:bg-red-50/50 group-data-[theme-color=violet]:dark:bg-zinc-600 group-data-[theme-color=green]:dark:bg-zinc-600 group-data-[theme-color=red]:dark:bg-zinc-600">
                                                                <div className="p-4">
                                                                    <div className="p-6">
                                                                        <div className="p-4 text-center">
                                                                            <div className="mb-6">
                                                                                <img src="assets/images/users/avatar-4.jpg" alt="" className="w-24 h-24 mx-auto rounded-full" />
                                                                            </div>

                                                                            <h5 className="mb-1 truncate dark:text-gray-50">Doris Brown</h5>
                                                                            <p className="text-gray-500 dark:text-gray-300">Start Video Call</p>

                                                                            <div className="mt-10">
                                                                                <ul className="flex justify-center mb-1">
                                                                                    <li className="px-2 ml-0 mr-2">
                                                                                        <button type="button" className="w-12 h-12 text-white bg-red-500 border-transparent rounded-full btn hover:bg-red-600" data-tw-dismiss="modal">
                                                                                            <span className="text-xl bg-transparent">
                                                                                                <i className="ri-close-fill"></i>
                                                                                            </span>
                                                                                        </button>
                                                                                    </li>
                                                                                    <li className="px-2">
                                                                                        <button type="button" className="w-12 h-12 text-white bg-green-500 border-transparent rounded-full btn hover:bg-green-600">
                                                                                            <span className="text-xl bg-transparent">
                                                                                                <i className="ri-vidicon-fill"></i>
                                                                                            </span>
                                                                                        </button>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            {/* <!-- Modal end --> */}

                                            <li className="px-3">
                                                <a href="#" className="hidden text-gray-500 dark:text-gray-300 lg:block profileTab">
                                                    <i className="text-xl ri-group-line"></i>
                                                </a>
                                            </li>

                                            <li className="px-3">
                                                <div className="relative dropdown">
                                                    <button className="p-0 text-xl text-gray-500 border-0 btn dropdown-toggle dark:text-gray-300" type="button" data-bs-toggle="dropdown" id="dropdownMenuButton11">
                                                        <i className="ri-more-fill"></i>
                                                    </button>
                                                    <ul className="absolute z-50 hidden w-40 py-2 mx-4 mt-2 text-left list-none bg-white border rounded shadow-lg ltr:-right-4 border-gray-50 dropdown-menu top-8 dark:bg-zinc-600 bg-clip-padding dark:border-gray-600/50 rtl:-left-5" aria-labelledby="dropdownMenuButton11">
                                                        <li className="block lg:hidden">
                                                            <a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent profileTab dropdown-item whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-700 ltr:text-left rtl:text-right" href="#">View profile <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-300 ri-user-2-line text-16"></i></a>
                                                        </li>
                                                        <li className="block lg:hidden"><a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-700 ltr:text-left rtl:text-right" href="#" data-tw-toggle="modal" data-tw-target="#audiCallModal">Audio <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-300 ri-phone-line text-16"></i></a>
                                                        </li>
                                                        <li className="block lg:hidden"><a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-700 ltr:text-left rtl:text-right" href="#" data-tw-toggle="modal" data-tw-target="#videoCallModal">Video <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-300 ri-vidicon-line text-16"></i></a>
                                                        </li>
                                                        <li><a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-700 ltr:text-left rtl:text-right" href="#">Archive <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-300 ri-archive-line text-16"></i></a>
                                                        </li>
                                                        <li><a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-700 ltr:text-left rtl:text-right" href="#">Muted <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-300 ri-volume-mute-line text-16"></i></a>
                                                        </li>
                                                        <li><a className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-700 ltr:text-left rtl:text-right" href="#">Delete <i className="text-gray-500 rtl:float-left ltr:float-right dark:text-gray-300 ri-delete-bin-line text-16"></i></a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- end chat user head --> */}

                            {/* <!-- start chat conversation --> */}
                            <div className="h-[80vh] p-4 lg:p-6" data-simplebar>
                               {/* {fetching Messages} */}
                               <ul className="mb-0">
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
                                        <input type="text" value={newMessage} onChange={handleInputMessage} onClick={()=>{sendMessage(messages)}} className="w-full border-transparent rounded bg-gray-50 placeholder:text-14 text-14 dark:bg-zinc-700 dark:placeholder:text-gray-300 dark:text-gray-300" placeholder="Enter Message..." />
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

                                                <UploadFileComponent/>
                                                {/* Send Message */}
                                                <li className="inline-block">
                                                    <button type="submit" onClick={() => {sendMessage()}} className="text-white border-transparent btn group-data-[theme-color=violet]:bg-violet-500 group-data-[theme-color=green]:bg-green-500 group-data-[theme-color=red]:bg-red-500 group-data-[theme-color=violet]:hover:bg-violet-600 group-data-[theme-color=green]:hover:bg-green-600">
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