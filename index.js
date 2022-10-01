const http = require("http");
const fs = require("fs");
const url = require("url");
const jimp = require("jimp");

http
    .createServer((req, res) => {
        if (req.url == "/") {
            try {
                res.writeHead(200, { "Content-Type": "text/html" });
                let html = fs.readFileSync("./public/index.html", "utf8");
                res.end(html);
            } catch (error) {
                res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
                res.end("<h1>Error del servidor</h1>");
            }
        } else if (req.url == "/estilos") {
            res.writeHead(200, { "Content-Type": "text/css" });
            fs.readFile("./public/assets/css/styles.css", (err, css) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
                    res.end("<h1>Error del servidor</h1>");
                } else {
                    res.end(css)
                }
            })
        } else if (req.url == "/estilos_error") {
            res.writeHead(200, { "Content-Type": "text/css" });
            fs.readFile("./public/assets/css/stylesError.css", (err, css) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
                    res.end("<h1>Error del servidor</h1>");
                } else {
                    res.end(css)
                }
            })
        } else if (req.url.includes("/imagen")) {
            try {
                let params = url.parse(req.url, true).query;
                let { imagen } = params;
                jimp.read(imagen, (err, imagen) => {
                    if (!err) {
                        {
                            imagen
                                .grayscale()
                                .quality(60)
                                .resize(350, jimp.AUTO)
                                .writeAsync("newImg.jpg")
                                .then(() => {
                                    fs.readFile("newImg.jpg", (err, img) => {
                                        res.writeHead(200, { "Content-Type": "image/jpeg" });
                                        res.end(img);
                                    })
                                })
                        }
                    } else {
                        let respHtml = fs.readFileSync("./public/error.html", "utf8");
                        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
                        res.end(respHtml);
                    }
                });
            } catch (error) {
                res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
                res.end("<h1>Error de Usuario</h1>");
            }
        } else {
            try {
                let respHtml = fs.readFileSync("./public/error.html", "utf8");
                res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
                res.end(respHtml);
            } catch (error) {
                console.log(error.message);
                res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
                res.end("<h1>Error en el servidor</h1>");
            }
        }
    })
    .listen(8080, () => {
        console.log("Servidor corriendo en http://localhost:8080");
        process.send(process.pid)
    });

// Terminal: node yargs.js access -k 123