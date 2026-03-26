import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import genToken from '../utils/token.js';

async function handleSignup(req, res) {
    try {
        const {email, password} = req.body;
        
        if(!email || !password) {
            return res.status(400).json({
                error : "All fields are required"
            });
        }
        
        if(password.length < 8) {
            return res.status(400).json({
                error : "Password must be atleast 8 characters long"
            });
        }
        
        const user = await User.findOne({email});
        
        if(user) {
            return res.status(400).json({
                error : "User already exsits"
            });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);    
        
        const newUser = await User.create({
            email,
            password : hashPassword, 
        });
        
        
        return res.status(200).json({
            message : "New User Created",
        });
    }
    catch (error) {
        console.log(`handleSignup Error : ${error}`)
        return res.status(500).json({
            error : "Internal Server Error"
        });
    }
} 

async function handleLogin(req, res) {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({
                error : "All fields are required"
            });
        }
        
        const user = await User.findOne({email});
        
        if(!user) {
            return res.status(400).json({
                error : "Invalid Credentials"
            });
        }
        
        const verifyPassword = await bcrypt.compare(password, user.password);
        
        if(!verifyPassword) {
            return res.status(400).json({
                error : "Invalid Credentials"
            })
        }
        
        const token = genToken(user, res);

        return res.status(200).json({
            message : "Login successful",
            token
        });

    
    }
    catch (error) {
        console.log(`handleLogin Error : ${error}`);
        return res.status(500).json({
            error : "Internal Server Error"
        });
    }
}

function handleLogout(req, res) {
    try {
        res.cookie("UID", "", {
            httpOnly: true,
            expires: new Date(0), 
        });
        
        return res.status(200).json({
            message: "Logged out successfully"
        });
    }
    catch (error) {
        console.log(`handleLogout Error : ${error}`);
        return res.status(500).json({
            error : "Internal Server Error"
        });
    }
}

export {
    handleSignup,
    handleLogin, 
    handleLogout,
}