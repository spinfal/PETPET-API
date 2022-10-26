const express = require("express");
const path = require("path");
const cors = require("cors");
const secure = require("ssl-express-www");
const fs = require("fs");
const petPetGif = require("pet-pet-gif");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();
const PORT = process.env.PORT || 8080 || 5000 || 3000;

app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());
app.use(secure);

const _DEFAULTS = {
  status: false,
  creator: `Balhisyhrl • Spinfal`,
  github: `https://github.com/spinfal/PETPET-API`
};

const allowedTypes = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif"
];

app.get("/", (req, res) => {
  res.json({
    ..._DEFAULTS,
    msg: "Cannot GET query url or parameter file",
    example_petpet: "https://PETPET-API.clit.repl.co/petpet?url=https://upload.wikimedia.org/wikipedia/en/3/3d/480px-Gawr_Gura_-_Portrait_01.png",
    example_get_petpet: "https://femboy.productions/petpet/txifokss.gif"
  });
});

app.get("/petpet", async (req, res) => {
  const petpet = req.query.url;

  if (allowedTypes.indexOf(petpet.match(/\.\w+/g)?.pop().toLowerCase()) == -1) return res.json({
    ..._DEFAULTS,
    msg: "You have provided an invalid image link.",
    validTypes: allowedTypes.join(", "),
    example: "https://PETPET-API.clit.repl.co/petpet?url=https://upload.wikimedia.org/wikipedia/en/3/3d/480px-Gawr_Gura_-_Portrait_01.png"
  });

  const options = [req.query.size ?? 100, req.query.delay ?? 20];
  if (!petpet) return res.json({
    ..._DEFAULTS,
    msg: "Cannot GET parameter url",
    example: "https://PETPET-API.clit.repl.co/petpetpetpet?url=https://upload.wikimedia.org/wikipedia/en/3/3d/480px-Gawr_Gura_-_Portrait_01.png"
  });
  try {
    let animatedGif = await petPetGif(petpet, {
      resolution: parseInt(options[0]), // The width (or height) of the generated gif
      delay: parseInt(options[1]), // Delay between each frame in milliseconds. Defaults to 20.
      backgroundColor: null, // Other values could be the string "rgba(123, 233, 0, 0.5)". Defaults to null - i.e. transparent.
    });

    const filename = `PETPET-${ Math.floor(Math.random() * req.headers["x-target"].length ?? null) }.gif`;

    const form = new FormData();
    const path = `./tmp/${ filename }`;
    fs.writeFileSync(path, animatedGif);
    const stream = fs.createReadStream(path);
    form.append('file', stream);

    fetch("https://api.e-z.host/files", {
      method: "POST",
      headers: {
        "key": process.env['key']
      },
      body: form
    }).then(response => response.json()).then(response => {
      fs.unlink(path, (err => {
        if (err) {
          console.log(err);
          return res.status(500).send("An internal error has occurred");
        }

        if (response.success == true) {
          res.json({
            ..._DEFAULTS,
            status: true,
            result: response?.imageUrl
          });
        } else {
          console.log("[ e-z.host upload err ]", response);
          return res.status(500).send("An error has occurred while uploading the image, please try again or report this issue to spin~#5150");
        }
      }));
    });
  } catch (e) {
    console.log(e);
    res.json({
      ..._DEFAULTS,
      msg: "An internal server error has occurred",
      example: "https://PETPET-API.clit.repl.co/petpet?url=https://upload.wikimedia.org/wikipedia/en/3/3d/480px-Gawr_Gura_-_Portrait_01.png"
    });
  }
});

// app.get("/file/:file", (req, res) => {
//   const petpet = req.params.file;
//   if (!petpet) return res.json({
//     ..._DEFAULTS,
//     msg: "Cannot GET FILE"
//   });
//   try {
//     let filename = petpet;
//     res.status(200).sendFile(__dirname + `/tmp/${ filename }`);
//     // fs.readFile(__dirname + `/tmp/${ filename }`, function (err, data) {
//     //   res.writeHead(200, {"content-type": "image/gif"});
//     //   res.end(data);
//     // });
//   } catch (e) {
//     console.log(e)
//     res.json({
//       ..._DEFAULTS,
//       msg: "Cannot GET FILE"
//     });
//   }
// });

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

module.exports = app