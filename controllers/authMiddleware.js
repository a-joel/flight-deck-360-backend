const express = require('express')
const jwt = require('jsonwebtoken')


const authMiddleware = ( allowedRoles = [] ) => {
        return (req, res, next) => {
                const authHeader = req.headers.authorization;

                if(!authHeader || !authHeader.startsWith("Bearer")) {
                        return res.status(400).json({message: "Token not found"});
                }


                const token = authHeader.split(" ")[1];

                try {
                        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

                        const userRole = decoded.role;

                        console.log(userRole, decoded);

                        if(userRole === 'admin') {
                                return next();
                        }

                        if(userRole === 'passenger') {
                                if(req.method === 'GET') {
                                        return next();
                                } else {
                                        return req.status(403).json({message: "Unauthorized"});
                                }
                        }

                          return res.status(403).json({ message: "Forbidden: Insufficient role" });
                        
                } catch (error) {
                        console.log(error);
                        
                        return res.status(500).json({message: error.message});
                }

        }
}

module.exports = authMiddleware;