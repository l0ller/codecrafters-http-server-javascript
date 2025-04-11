const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

//Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();
    const requestparts = request.split("\r\n");
    const requestline = requestparts[0];
    const [method,path,version] = requestline.split(" ");
    const headers = requestparts.slice(1);
    const headerObj = {};

  
    
    headers.forEach(header =>{
        if(header){
            const[key,value] = header.split(": ");
            headerObj[key] = value;
            // console.log(key);
            // console.log(value);
        }

    });

    let response;
    if(method === "POST" && path.startsWith("/files/")){
        const slicedPath = path.substring("/files/".length);
        const fs = require("fs");
        const filepath = process.argv[3]+"/" + slicedPath;
        console.log(filepath);
        console.log(headerObj[3]);

       // fs.writeFileSync(path, content);
        socket.end();
    }

    else if(method === "GET" && path.startsWith("/files/")){
        const slicedPath = path.substring("/files/".length);
        const fs = require("fs");
        const filepath = process.argv[3]+"/" + slicedPath;
        
        fs.readFile(filepath, (err, data) => {
            let response;
            if(err){
                
                response = "HTTP/1.1 404 Not Found\r\n\r\n";
                console.log(response);
                socket.write(response);
                socket.end();
            }
            else{
                response = "HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: " + data.length + "\r\n\r\n" + data;
                socket.write(response);
                socket.end();
            }
        });

        

    }


    else if(method === "GET" && path.startsWith("/echo/")){
        const slicedPath = path.substring("/echo/".length);
        response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length:" + slicedPath.length + "\r\n\r\n" + slicedPath;
        console.log(response);
        socket.write(response);
        socket.end();
    }

    else if(method === "GET" && path.startsWith("/user-agent")){
        const userAgent = headerObj["User-Agent"];
        response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length:" + userAgent.length + "\r\n\r\n" + userAgent;
        socket.write(response);
        socket.end();
    }
    
    
    else if(path !== "/"){
        console.log(path);
        response = "HTTP/1.1 404 Not Found\r\n\r\n";
        socket.write(response);
        socket.end();
    }
    else {
    const response = "HTTP/1.1 200 OK\r\n\r\n"
    socket.write(response);
    socket.end();}

    

  });
});

server.listen(4221, "localhost")


