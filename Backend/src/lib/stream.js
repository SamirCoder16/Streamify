import { StreamChat } from 'stream-chat';
import 'dotenv/config';

const apikey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apikey || !apiSecret){
    console.error('Stream API key or Secret key is missing ');
}

const streamClient = StreamChat.getInstance(apikey,apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error('Error create in upsertStreamUser');
    }
}

export const generateStreamToken = (userId) => {
    try {
        // ensure the UserId must be a String.
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr)
    } catch (error) {
        console.log("Error generating Stream Token : ", error)
    }
}