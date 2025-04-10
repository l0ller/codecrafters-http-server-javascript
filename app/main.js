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
        }

    });

    if(path !== "/"){
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


