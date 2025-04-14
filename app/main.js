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
        const slicedPath = path.substring("/files/".length);
        const fs = require("fs");
        const filepath = process.argv[3] + slicedPath;

        const content = headers[headers.length-1];
  
        fs.writeFileSync(filepath, content);
        response = "HTTP/1.1 201 Created\r\n\r\n";
        
    } catch (err) {
        console.error("Error writing file:", err);
        response = "HTTP/1.1 500 Internal Server Error\r\n\r\nFile write failed";
        
    }
    


    }

    else if(method === "GET" && path.startsWith("/files/")){
        const slicedPath = path.substring("/files/".length);
        const fs = require("fs");
        const filepath = process.argv[3]+"/" + slicedPath;
        
        fs.readFile(filepath, (err, data) => {
            let response;
            if(err){
                
                response = "HTTP/1.1 404 Not Found\r\n\r\n";


            }
            else{
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
          console.log(compressed);
          socket.write(compressed); // Binary-safe
          //socket.end();
          return;
        }
        
        // else if(headerObj["Accept-Encoding"] && !headerObj["Accept-Encoding"].includes("gzip")){

        // }
        else{
        const slicedPath = path.substring("/echo/".length);
        response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length:" + slicedPath.length + "\r\n\r\n" + slicedPath;
        console.log(response);
        socket.write(response);
        //socket.end();
        }
    }

    else if(method === "GET" && path.startsWith("/user-agent")){
        const userAgent = headerObj["User-Agent"];
        response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length:" + userAgent.length + "\r\n\r\n" + userAgent;
        socket.write(response);
        //socket.end();
    }
    
    
    else if(path !== "/"){
        console.log(path);
        response = "HTTP/1.1 404 Not Found\r\n\r\n";
        socket.write(response);
        //socket.end();
    }
    else {
    const response = "HTTP/1.1 200 OK\r\n\r\n"
    socket.write(response);
    //socket.end();
    }

    //for closing the connection

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


