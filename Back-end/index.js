const express = require("express");
const bodyparser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const moment = require("moment-timezone");
const db = require("./db");
const multer = require("multer");
const jwt = require("jsonwebtoken");

const secretKey = "secret-token";

function expressJwt(options, query) {
  return function (req, res, next) {
    // Get the JWT token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Invalid or missing authorization token." });
    }
    const token = authHeader.substring(7);

    // Decode and verify the JWT token
    jwt.verify(token, options.secret, options, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Invalid or expired authorization token." });
      }
      req.user = decoded;

      if (query) {
        if (query === "photo") {
          getUserData(req.user.userId)
            .then((result) => {
              if (result.length > 0) {
                req.data = result[0];
              }
              next();
            })
            .catch((error) => {
              return res
                .status(500)
                .json({ message: "Something went wrong!", error });
            });
        } else {
          next();
        }
      } else {
        next();
      }
    });
  };
}

const app = express();
app.use(cors());
app.use(express.static("uploads"));
app.use(bodyparser.json());

const timeoutProtocol = (timeout) => {
  return (req, res, next) => {
    const resTimeout = setTimeout(() => {
      res.status(200).json({ validation: "false", message: "No data return" });
    }, timeout);

    res.on("finish", () => {
      clearTimeout(resTimeout);
    });

    res.on("error", () => {
      clearTimeout(resTimeout);
    });

    next();
  };
};

const getUserData = (userId) => {
  return new Promise((resolve, reject) => {
    const getUserQuery = `SELECT * FROM user WHERE user_id = ${userId}`;
    db.query(getUserQuery, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// protocolif the database is disconnected
function connectDb() {
  db.on("error", (err) => {
    console.log("Database error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("Attempting to reconnect to database");
      db.connect;
    }
  });
}

// check if upload folder exist if not create it
let uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// check if user are exist if not delete the deleted user folder

// store uploaded file to the new directory
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const folderPath = `uploads/${req.body.fullname}`;
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    callback(null, __dirname + "/uploads/" + req.body.fullname);
  },
  filename: (req, file, callback) => {
    const newName = "1";
    const originalName = file.originalname;
    const extension = originalName.substring(originalName.lastIndexOf("."));
    const newFileName = newName + extension;
    callback(null, newFileName);
  },
});

const uploads = multer({ storage: storage });

// regis user
app.post("/regis/user", uploads.array("files"), (req, res) => {
  const password = req.body.password;
  const name = req.body.fullname;
  const agencyId = req.body.agencyid;
  const status = req.body.status;
  const email = req.body.email;
  const picture = name.replace(/\s/g, "");

  const createUser = `
  insert into user 
  (user_agency_id,user_password,user_name,user_status,user_role,user_email,user_picture) 
  values ('${agencyId}','${password}','${name}','${status}','${status}', '${email}','${picture}')`;

  db.query(createUser, (err, result) => {
    console.log(err)
    if (err) {
      return res.status(500).json({ message: "Something Wrong!?", error: err });
    }

    return res.status(200).json({ message: "user-added successfully" });
  });
});

// regis agency
app.post("/regis/agency", (req, res) => {
  const name = req.body.name;
  const id = req.body.id;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  const createAgency = `insert into agency (agency_id,agency_name,latitude,longitude) values ('${id}','${name}','${latitude}','${longitude}')`;

  db.query(createAgency, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Something Wrong!?", error: err });
    }

    return res.status(200).json({ message: "agency-added successfully" });
  });
});

// login user
app.get(
  "/login/:userId/:userPassword/:agencyCode",
  timeoutProtocol(2000),
  (req, res) => {
    const userId = req.params.userId;
    const userPassword = req.params.userPassword;
    const agencyCode = req.params.agencyCode;

    const loginUser = `select * from user 
    where user_id = ${userId} and 
    user_password = '${userPassword}' and 
    user_agency_id = '${agencyCode}'`;

    db.query(loginUser, (err, result) => {
      if (err) {
        return res.status(500).send("Something Error!?");
      }
      if (result.length > 0) {
        const token = jwt.sign({ userId }, secretKey, { expiresIn: "24h" });
        res.json({ token });
      } else {
        res.status(401).send("Invalid Credentials");
      }
    });
  }
);

// Change password
app.get(
  "/change/password/:email/:password",
  timeoutProtocol(1000),
  (req, res) => {
    const userEmail = req.params.email;
    const newPassword = req.params.password;
    const updatePassword = `update user set user_password = '${newPassword}' where user_email = '${userEmail}' `;
    db.query(updatePassword, (err, result) => {
      if (err) {
        return res.status(500).send("Something Error!?");
      }

      if (result.affectedRows > 0) {
        res.status(200).json({ msg: "success" });
      } else {
        res.status(401).json({ msg: "failed" });
      }
    });
  }
);
// after login take data by token
app.get(
  "/getUser/data",
  timeoutProtocol(1000),
  expressJwt({ secret: secretKey }),
  (req, res) => {
    if (req.user) {
      const userId = req.user.userId;
      const getData = `select * from user where user_id = ${userId}`;
      db.query(getData, (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Something Wrong!?", error: err });
        }
        if (result.length > 0) {
          delete req.user;
          return res.status(200).json({ data: result });
        } else {
          delete req.user;
          return req.status(204);
        }
      });
    }
  }
);

//check agency
app.get("/check/agency/:agencyId", timeoutProtocol(1000), (req, res) => {
  const agencyId = req.params.agencyId;

  const checkAgency = `select * from agency where agency_id = '${agencyId}'`;

  db.query(checkAgency, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Something Wrong!?", error: err });
    }
    if (result.length > 0) {
      return res.status(200).json({ validation: "true", data: result });
    } else {
      return res.status(204);
    }
  });
});

// get user today attendance data
app.get(
  "/user/today/attendance",
  timeoutProtocol(3000),
  expressJwt({ secret: secretKey }),
  (req, res) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    if (req.user) {
      const userId = req.user.userId;
      const getTodayAttendance = `select * from attendance 
    where user_id = ${userId} and attend_date = '${formattedDate}'`;
      db.query(getTodayAttendance, (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Something Wrong!?", error: err });
        }
        if (result.length > 0) {
          delete req.user;
          return res.status(200).json({ data: result });
        } else {
          delete req.user;
          return res.status(204);
        }
      });
    }
  }
);

// get user monthly attendance data
app.get(
  "/user/month/attendance",
  timeoutProtocol(3000),
  expressJwt({ secret: secretKey }),
  (req, res) => {
    const currentMonth = new Date().getMonth() + 1;

    if (req.user) {
      const userId = req.user.userId;
      const qr = `select * from attendance where MONTH(attend_date) = ${currentMonth} and user_id = ${userId}`;
      db.query(qr, (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Something Wrong!?", error: err });
        }
        if (result.length > 0) {
          const restructuredData = [];
          let clock_out;

          for (let i = 0; i < result.length; i++) {
            const item = result[i];
            if (item.clock_out !== null) {
              clock_out = new Date(item.clock_out).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });
            } else {
              clock_out = "--:-- --";
            }

            const restructuredItem = {
              no: i + 1,
              date: new Date(item.attend_date).toLocaleDateString("en-US"),
              in: new Date(item.clock_in).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              out: clock_out,
            };
            restructuredData.push(restructuredItem);
          }
          delete req.user;
          return res.status(200).json({ data: restructuredData });
        } else {
          delete req.user;
          return res.status(204);
        }
      });
    }
  }
);

// get total day
app.get(
  "/user/total/attend",
  timeoutProtocol(3000),
  expressJwt({ secret: secretKey }),
  (req, res) => {
    if (req.user) {
      const userId = req.user.userId;
      const getTotalAttend = `SELECT COUNT(*) as totalAttend FROM attendance 
    WHERE clock_in IS NOT NULL and clock_out is NOT NULL AND 
    MONTH(attend_date) = MONTH(CURDATE()) AND user_id = ${userId}`;
      db.query(getTotalAttend, (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Something Wrong!?", error: err });
        }
        if (result.length > 0) {
          delete req.user;
          return res.status(200).json({ data: result });
        } else {
          delete req.user;
          return res.status(204);
        }
      });
    }
  }
);

//all user from agency
app.get("/agency/:agency", timeoutProtocol(3000), (req, res) => {
  const agency = req.params.agency;

  let qr = `select user_name as folderName from user where user_agency_id = '${agency}'`;

  db.query(qr, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Something Wrong", error: err });
    }
    if (result.length > 0) {
      const data = [];
      for (let item of result) {
        data.push(item.folderName);
      }
      return res.send({ data: data });
    }
  });
});

// record attendance
app.get(
  "/attendance/:type",
  timeoutProtocol(3000),
  expressJwt({ secret: secretKey }),
  (req, res) => {
    const userId = req.user.userId;
    const type = req.params.type;
    const currentDatetime = moment()
      .tz("Asia/Jakarta")
      .format("YYYY-MM-DD HH:mm:ss.SSSSSS");
    const currentDate = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");

    const checkTodayAttend = `select * from attendance where user_id = ${userId} and attend_date = '${currentDate}'`;
    db.query(checkTodayAttend, (err, result) => {
      if (err) {
        // Handle the error
        console.error(err);
        res.status(500).json({ msg: "Error checking data" });
      }
      if (result.length > 0 && type === "out") {
        // Data already exists
        const editTodayAttendance = `update attendance set clock_out = '${currentDatetime}' where user_id = ${userId} and attend_date = '${currentDate}'`;
        db.query(editTodayAttendance, (error) => {
          if (error) {
            // Handle the error
            console.error(error);
            res.status(500).json({ msg: "Error creating data" });
            delete req.user;
          } else {
            res.status(200).json({ msg: "Data created successfully" });
            delete req.user;
          }
        });
      } else if (type === "in") {
        const createTodayAttendance = `insert into attendance (user_id, clock_in, clock_out, attend_date) VALUES (${userId}, '${currentDatetime}', null, '${currentDate}')`;

        db.query(createTodayAttendance, (error) => {
          if (error) {
            // Handle the error
            console.error(error);
            res.status(500).json({ msg: "Error creating data" });
            delete req.user;
          } else {
            res.status(200).json({ msg: "Data created successfully" });
            delete req.user;
          }
        });
      }
    });
  }
);

//timeliness user
app.get(
  "/attendance/timeliness/:value",
  timeoutProtocol(3000),
  expressJwt({ secret: secretKey }),
  (req, res) => {
    if (req.user) {
      const userId = req.user.userId;
      const currentDate = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
      const check = `select * from attendance where user_id = ${userId} and attend_date = '${currentDate}'`;
      db.query(check, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ msg: "Error checking data" });
        }
        if (result.length > 0) {
          if (result[0].timeliness === null) {
            const insert = `update attendance set timeliness = '${req.params.value}' where user_id = ${userId} and attend_date = '${currentDate}'`;
            db.query(insert, (err) => {
              if (err) {
                // Handle the error
                console.error(err);
                res.status(500).json({ msg: "Error update data" });
                delete req.user;
              } else {
                res.status(200).json({ msg: "Data update successfully" });
                delete req.user;
              }
            });
          }
        }
      });
    }
  }
);

app.get("/admin/monitor/:agency", (req, res) => {
  const agency = req.params.agency;
  const query = `select u.user_id, 
  u.user_name, 
  u.user_status, 
  count(a.attend_id) as total_attend, 
  round(avg(a.timeliness), 0) as average_timeliness
  from user u join attendance a on u.user_id = a.user_id
  where u.user_agency_id = '${agency}'
  group by u.user_id, u.user_agency_id`;

  db.query(query, (err, result) => {
    res.json({ data: result });
  });
});

app.listen(3000, () => {
  console.log("server running");
});
