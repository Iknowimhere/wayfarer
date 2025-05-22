import http from 'http'
import app from './app.js';
let PORT=process.env.PORT || 3000;
let server=http.createServer(app);

server.listen(PORT,()=>{
    console.log(`🚀 Server running on port ${PORT}`);
})