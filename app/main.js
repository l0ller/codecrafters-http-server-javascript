const net = require("net");

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
    let response;
    let connectionon = true;
  
    
    headers.forEach(header =>{
        if(header){
            const[key,value] = header.split(": ");
            headerObj[key] = value;
        }

    });
    console.log(method)
    console.log(path)
    console.log(headers)
    console.log(headerObj)
   
    

    if(method === "POST" && path.startsWith("/files/")){
    try{
        console.log("1 1")
        const slicedPath = path.substring("/files/".length);
        const fs = require("fs");
        const filepath = process.argv[3] + slicedPath;

        const content = headers[headers.length-1];
  
        fs.writeFileSync(filepath, content);
        response = "HTTP/1.1 201 Created\r\n\r\n";
        
    } catch (err) {
        console.log("1 2")
        console.error("Error writing file:", err);
        response = "HTTP/1.1 500 Internal Server Error\r\n\r\nFile write failed";      
    }
    }

    else if(method === "GET" && path.startsWith("/files/")){
        console.log("2")
        const slicedPath = path.substring("/files/".length);
        const fs = require("fs");
        const filepath = process.argv[3]+"/" + slicedPath;
        
        fs.readFile(filepath, (err, data) => {
            if(err){
                console.log("2 1");
                
                response = "HTTP/1.1 404 Not Found\r\n\r\n";


            }
            else{
                console.log("2 2")
                response = "HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: " + data.length + "\r\n\r\n" + data;

            }
        });
    }


    else if(method === "GET" && path.startsWith("/echo/")){
        if (
          headerObj["Accept-Encoding"] &&
          (headerObj["Accept-Encoding"] === "gzip" ||
            headerObj["Accept-Encoding"].includes("gzip"))
        ) {
        console.log("3 1")
        const zlib = require("zlib");
          const slicedPath = path.substring("/echo/".length);
          const buffer = Buffer.from(slicedPath, "utf-8");
          const compressed = zlib.gzipSync(buffer); // Synchronous gzip
        
          const responseHeaders =
            "HTTP/1.1 200 OK\r\n" +
            "Content-Encoding: gzip\r\n" +
            "Content-Type: text/plain\r\n" +
            "Content-Length: " +
            compressed.length +
            "\r\n\r\n";
          
            socket.write(responseHeaders);
            console.log(responseHeaders);
            response = compressed;
        }
        
        else{
        console.log("3 2")
        const slicedPath = path.substring("/echo/".length);
        response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length:" + slicedPath.length + "\r\n\r\n" + slicedPath;
        }
    }

    else if(method === "GET" && path.startsWith("/user-agent")){
        console.log("4 1")
        const userAgent = headerObj["User-Agent"];
        response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length:" + userAgent.length + "\r\n\r\n" + userAgent;
    }
    
    
    else if(path !== "/"){
        console.log("5 1")
        console.log(path);
        response = "HTTP/1.1 404 Not Found\r\n\r\n";
    }
    else {
    console.log("else")
    response = "HTTP/1.1 200 OK\r\n\r\n"
    }

    //for writing closing the connection

    if(headerObj["Connection"] && headerObj["Connection"] == "close"){
        console.log(response)        
        response = response.replace("\r\n\r\n", "\r\nConnection: close\r\n\r\n");
        socket.write(response);
        socket.end();
      
    }
    else{
        socket.write(response);
    }


    

  });
});

server.listen(4221, "localhost")