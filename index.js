const express = require("express");
const path = require("path");
const cors = require('cors');
const secure = require('ssl-express-www');
const fs = require('fs');
const petPetGif = require('pet-pet-gif');

const app = express();
const PORT = process.env.PORT || 8080 || 5000 || 3000;

app.enable('trust proxy');
app.set("json spaces", 2);
app.use(cors());
app.use(secure);
app.use(express.static("assets"));

const _DEFAULTS = {
  status: false,
  creator: `Balhisyhrl • Spinfal`,
  github: `https://github.com/spinfal/PETPET-API`
};

app.get('/', (req, res) => {
  res.json({
    ..._DEFAULTS,
    msg: "Cannot GET parameter url or File",
    example_petpet: "https://PETPET-API.clit.repl.co/petpet?url=https://upload.wikimedia.org/wikipedia/en/3/3d/480px-Gawr_Gura_-_Portrait_01.png",
    example_get_petpet: "https://PETPET-API.clit.repl.co/file/PETPET-165795955795822.gif"
  });
});

app.get('/petpet', async (req, res) => {
  const petpet = req.query.url;
  if (!petpet) return res.json({
    ..._DEFAULTS,
    msg: "Cannot GET parameter url",
    example: "https://PETPET-API.clit.repl.co/petpetpetpet?url=https://upload.wikimedia.org/wikipedia/en/3/3d/480px-Gawr_Gura_-_Portrait_01.png"
  });
  try {
    let animatedGif = await petPetGif(petpet);
    let filename = "PETPET-" + new Date().getTime() + + Math.floor(Math.random() * 999) + '.gif';
    await fs.writeFileSync(`./tmp/${ filename }`, animatedGif);
    let imggiff = filename;
    res.json({
      ..._DEFAULTS,
      status: true,
      result: "https://PETPET-API.clit.repl.co/file/" + imggiff
    });
  } catch (e) {
    //console.log(e)
    res.json({
      ..._DEFAULTS,
      msg: "Cannot GET parameter url",
      example: "https://PETPET-API.clit.repl.co/petpet?url=https://upload.wikimedia.org/wikipedia/en/3/3d/480px-Gawr_Gura_-_Portrait_01.png"
    });
  }
});

app.get('/file/:file', (req, res) => {
  const petpet = req.params.file;
  if (!petpet) return res.json({
    ..._DEFAULTS,
    msg: "Cannot GET FILE"
  });
  try {
    let filename = petpet;
    fs.readFile(__dirname + `/tmp/${ filename }`, function (err, data) {
      res.writeHead(200, {'content-type': 'image/gif'});
      res.end(data);
    });
  } catch (e) {
    //console.log(e)
    res.json({
      ..._DEFAULTS,
      msg: "Cannot GET FILE"
    });
  }
});

app.use('/', async (req, res, next) => {
  if (req.params.file) {
    const petpet = req.params.file;
    if (!petpet) return res.json({
      status: false,
      creator: `Balhisyhrl`,
      github: `https://github.com/balhisyhrl`,
      msg: "Cannot GET FILE"
    });
    try {
      let filename = petpet;
      fs.readFile(__dirname + `/tmp/${ filename }`, function (err, data) {
        res.writeHead(200, {'content-type': 'image/gif'});
        res.end(data);
      });
    } catch (e) {
      //console.log(e)
      res.json({
        status: false,
        creator: `Balhisyhrl`,
        github: `https://github.com/balhisyhrl`,
        msg: "Cannot GET FILE"
      });
    }
  } else {
    res.json({
      status: false,
      creator: `Balhisyhrl`,
      github: `https://github.com/balhisyhrl`,
      msg: "Cannot GET parameter url or File",
      example_petpet: "https://PETPET-API.clit.repl.co/petpet?url=https://upload.wikimedia.org/wikipedia/en/3/3d/480px-Gawr_Gura_-_Portrait_01.png",
      example_get_petpet: "https://PETPET-API.clit.repl.co/?file=PETPET-165795955795822.gif"
    });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

module.exports = app

