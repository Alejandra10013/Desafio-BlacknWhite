const yargs = require("yargs");
const cp = require("child_process");

const key = "123";

const argv = yargs
    .command("access", "clave de acceso", {
        key: {
            describe: "key",
            demand: true,
            alias: "k"
        }
    }, (args) => {
        if (args.key == key) {
            const child = cp.fork("index.js");
            child.on("message", (message) => {
                console.log(message)
            })
            console.log("Acceso concedido");
        } else {
            console.log("Clave incorrecta, Acceso denegado.");
        }
    })
    .help()
    .argv;