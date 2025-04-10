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

    if(method === "GET" && path.startsWith("/echo/")){
        const slicedPath = path.substring("/echo/".length);
        response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length:" + slicedPath.length + "\r\n\r\n" + slicedPath;
        console.log(response);
        socket.write(response);
    }
    
    
    else if(path !== "/"){
        console.log(path);
        response = "HTTP/1.1 404 Not Found\r\n\r\n";
        socket.write(response);
    }
    else {
    const response = "HTTP/1.1 200 OK\r\n\r\n"
    socket.write(response);}

    socket.end();

  });
});

server.listen(4221, "localhost")


