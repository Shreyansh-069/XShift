import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_KEY = process.env.JWT_KEY;

async function genToken(newUser, res) {
    try {
        const token = jwt.sign(
            {userId : newUser._id},
            JWT_KEY,
            {expiresIn : "7d"}
        );
    
        res.cookie("UID", token, {
            maxAge : 7 * 24 * 60 * 60 * 1000, 
            httpOnly : true, 
            sameSite : "strict",
        });
    
        return token;
    }
    catch (error) {
        console.log(`genToken Error : ${error}`);
    }
}

export default genToken;