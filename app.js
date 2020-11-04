const express = require("express");
const app = express();

const config = require("./config/config");
const bodyParser = require("body-parser");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart({ uploadDir: "./uploads" });
// Send Resume Email
const sendEmail = require("./lib/sendEmail");
const textract = require("textract");
const rootRoute = require("./routes");
const userRoute = require("./routes/user");

const mongoose = require("mongoose");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/upload", function(request, response, next) {
  next();
});

function getMail(text) {
  return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}

app.post("/api/upload", multipartMiddleware, (req, res) => {
  if (req.files.file.type == "application/pdf") {
    (path = require("path")), (PDFParser = require("pdf2json"));
    let pdfParser = new PDFParser(this, 1);

    filePath = path.join(__dirname, req.files.file.path);

    pdfParser.on("pdfParser_dataError", errData =>
      console.error(errData.parserError)
    );
    pdfParser.on("pdfParser_dataReady", pdfData => {
      const test = getMail(pdfParser.getRawTextContent());
      const random = Math.floor(100000 + Math.random() * 900000);
      for (const [key, value] of Object.entries(test)) {
        // Email Data
        let email = "anbushanthi001@gmail.com";
        let name = "Anbu";
        const data = {
          from: {
            email,
            name
          },
          to: value,
          subject: "Email OTP Verification",
          template: "contact-us-email",
          substitutions: {
            name: "Hi Welcome",
            random
          }
        };
        sendEmail(data, () => {
          // Return Success Message
          return res.json(201, {
            message: "Email Send Successfully",
            email: value
          });
        });
      }
    });
    pdfParser.loadPDF(filePath);
  } else if (
    req.files.file.type == "image/jpeg" ||
    req.files.file.type == "image/png" ||
    req.files.file.type == "image/gif"
  ) {
    return res.status(500).json({
      message: "Invalid file format Please use .doc or .pdf"
    });
  } else {
    (path = require("path")),
      (filePath = path.join(__dirname, req.files.file.path));
    textract.fromFileWithPath(filePath, function(error, text) {
      if (error) {
        console.error(error);
      } else {
        const emailAddress = getMail(text);
        const random = Math.floor(100000 + Math.random() * 900000);
        for (const [key, value] of Object.entries(emailAddress)) {
          // Email Data
          let email = "anbushanthi001@gmail.com";
          let name = "Anbu";
          const data = {
            from: {
              email,
              name
            },
            to: value,
            subject: "Email OTP Verification",
            template: "contact-us-email",
            substitutions: {
              name: "Hi Welcome",
              random
            }
          };
          sendEmail(data, () => {
            // Return Success Message
            return res.json(201, {
              message: "Email Send Successfully",
              email: value
            });
          });
        }
      }
    });
  }
});

// apply routes
app.use("/", rootRoute);

app.use(`/v1/user`, userRoute);

app.use(function(err, req, res, next) {
  res.json({ error: err.message });
});

mongoose.connect(
  config.MONGODB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) throw err;
    console.log("DB Connected Successfully");
  }
);

app.listen(config.PORT, () =>
  console.log(`Example app listening on port ${config.PORT}!`)
);

module.exports = app;
