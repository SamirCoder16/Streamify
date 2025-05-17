import { useEffect, useState } from "react";
import { useParams } from "react-router"
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window
} from 'stream-chat-react'
import { StreamChat } from "stream-chat";
import { getStreamToken } from "../lib/Api";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id:targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setloading] = useState(true);

  const { authUser } = useAuthUser();
  const { data: tokenData, isLoading } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser // This mean In JavaScript, the !! (double exclamation mark) is used to convert a value to its boolean equivalent — essentially a quick way to cast anything to true or false.
  });   // Another Things of this !! This function will not run until authUser is available (or executed)

  useEffect(()=> {
    const initChat = async () => {
       if(!tokenData?.token || !authUser) return;
       try {
         const client = StreamChat.getInstance(STREAM_API_KEY);

         await client.connectUser({
          id:authUser._id,
          name: authUser.fullname,
          image: authUser.profilePic
         }, tokenData.token)

         const channelId = [authUser._id, targetUserId].sort().join("_");

         const currChannel = client.channel("messaging", channelId, {
          members: [authUser?._id, targetUserId]
         });

         await currChannel.watch();

         setChatClient(client);
         setChannel(currChannel)
       } catch (error) {
        console.log(error)
         toast.error('Count not connect to chat. Please try again')
       } finally{
         setloading(false)
       }
    }

    initChat();
  },[tokenData, authUser, targetUserId])

  if(loading || !chatClient || !channel) return <ChatLoader />

const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };
  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall}/>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus/>
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>

    </div>
  )
}

export default ChatPage