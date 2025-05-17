import { generateStreamToken } from "../lib/stream.js";

export const getStreamToken = (req,res) => {
    try {
        const token = generateStreamToken(req.user.id);

        res.status(200).json({ token })
    } catch (error) {
        res.status(500).jsoin({ message: 'Internal Server Error '});
    }
}