const http = require("http");
const fs = require("fs");
const port = process.env.PORT || 3000;

function serveStaticFile(res, path, contentType, responseCode = 200) {
  fs.readFile(__dirname + path, (err, data) => {
    if (err) {
      console.log(err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      return res.end("500 - Internal Error");
    }
    res.writeHead(responseCode, { "Content-Type": contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  // Normalise the URL to retain only the path
  const path = req.url.replace(/\/?(?:\?.*)?$/, "").toLowerCase();
  switch (path) {
    case "":
      serveStaticFile(res, "/public/index.html", "text/html");
      break;
    case "/about":
      serveStaticFile(res, "/public/about.html", "text/html");
      break;
    case "/aboutnode":
      serveStaticFile(res, "/public/aboutnode.html", "text/html");
      break;
    case "/aboutexpress":
      serveStaticFile(res, "/public/aboutexpress.html", "text/html");
      break;
    case "/css/bootstrap.min.css":
      serveStaticFile(res, "/public/css/bootstrap.min.css", "text/css");
      break;
    case "/js/bootstrap.bundle.min.js":
      serveStaticFile(
        res,
        "/public/js/bootstrap.bundle.min.js",
        "text/javascript"
      );
      break;
    default:
      serveStaticFile(res, "/public/404.html", "text/html", 404);
      break;
  }
});

server.listen(port, () =>
  console.log(
    `server started on
port ${port}; ` + "press Ctrl-C to terminate...."
  )
);
