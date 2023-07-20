const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
admin.initializeApp();
const moment = require("moment");

var app = express();
app.use(
  cors({
    origin: "*",
  })
);

const db = admin.firestore();
app.get("/", async function (req, res) {
  const data = await db.collection("User").get();
  return res.send(
    data.docs.map((item) => {
      return { ...item.data(), id: item.id };
    })
  );
});

/* connect assistance */
const dbassitance = admin.firestore();
app.get("/assistance", async function (req, res) {
  const sortBy = req.query.sortBy;
  const first = req.query.first;
  const data = await dbassitance
    .collection("Assistance")
    .orderBy(sortBy, first)
    .get();
  return res.send(
    data.docs.map((item) => {
      return { ...item.data(), id: item.id };
    })
  );
});

/* connect activity */
app.get("/activity", async function (req, res) {
  const sortBy = req.query.sortBy;
  const first = req.query.first;
  const data = await db.collection("Activity").orderBy(sortBy, first).get();
  return res.send(
    data.docs.map((item) => {
      return { ...item.data(), id: item.id };
    })
  );
});

/* connect chatopen */
app.get("/chatopen", async function (req, res) {
  const sortBy = req.query.sortBy;
  const first = req.query.first;
  console.log(sortBy, first);
  const data = await db.collection("ChatOpen").orderBy(sortBy, first).get();
  return res.send(
    data.docs.map((item) => {
      return { ...item.data(), id: item.id };
    })
  );
});

/* connect paginate */
app.get("/paginate", async function (req, res) {
  const sortBy = req.query.sortBy;
  const first = req.query.first;
  console.log(sortBy, first);
  const data = await db
    .collection("ChatOpen")
    .orderBy(sortBy, first)
    .limit(5)
    .get();

  const snapshot = data;
  const end = snapshot.docs[snapshot.docs.length - 1];

  const prePage = db
    .collection("ChatOpen")
    .orderBy(sortBy, first)
    .startAfter(end.data().sortBy)
    .limit(5);

  const nextSnapshot = await prePage.get();
  console.log("Num results:", nextSnapshot.docs.length);
  chatnegativ;
  return res.send(
    data.docs.map((item) => {
      return { ...item.data(), id: item.id };
    })
  );
});

/* connect chatpositive */
const dbchatpositive = admin.firestore();
app.get("/chatpositive", async function (req, res) {
  const sortBy = req.query.sortBy;
  const first = req.query.first;
  const data = await dbchatpositive
    .collection("ChatPositive")
    .orderBy(sortBy, first)
    .get();
  return res.send(
    data.docs.map((item) => {
      return { ...item.data(), id: item.id };
    })
  );
});

/* connect chatnegative */
const dbchatnegative = admin.firestore();
app.get("/chatnegative", async function (req, res) {
  const sortBy = req.query.sortBy;
  const first = req.query.first;
  const data = await dbchatnegative
    .collection("ChatNegative")
    .orderBy(sortBy, first)
    .get();
  return res.send(
    data.docs.map((item) => {
      return { ...item.data(), id: item.id };
    })
  );
});

/* connect chatstimulate */
const dbchatstimulate = admin.firestore();
app.get("/chatstimulate", async function (req, res) {
  const sortBy = req.query.sortBy;
  const first = req.query.first;
  const data = await dbchatstimulate
    .collection("ChatStimulate")
    .orderBy(sortBy, first)
    .get();
  return res.send(
    data.docs.map((item) => {
      return { ...item.data(), id: item.id };
    })
  );
});

/* connect chatclose */
const dbchatclose = admin.firestore();
app.get("/chatclose", async function (req, res) {
  const sortBy = req.query.sortBy;
  const first = req.query.first;
  const data = await dbchatclose
    .collection("ChatClose")
    .orderBy(sortBy, first)
    .get();
  return res.send(
    data.docs.map((item) => {
      return { ...item.data(), id: item.id };
    })
  );
});
/* connect queryTextChatPositive*/
app.get("/queryChatPositive", async function (req, res) {
  const data = await dbchatclose.collection("queryTextChatPositive").get();
  return res.send(
    data.docs.map((item) => {
      return { ...item.data(), id: item.id };
    })
  );
});

/* connect queryTextChatPositive*/
app.get("/queryChatNegative", async function (req, res) {
  const data = await dbchatclose.collection("queryTextChatNegative").get();
  return res.send(
    data.docs.map((item) => {
      return { ...item.data(), id: item.id };
    })
  );
});

/* Make AutoID ChatOpen*/
app.get("/chatOpenautoid", async function (req, res) {
  const data = await dbchatclose.collection("ChatOpen").get();
  return res.send(
    data.docs.map((item) => {
      return { ...item.data(), id: item.id };
    })
  );
});

///////////////////////insert/////////////////////////////

/* insert chatopen */
app.post(
  "/insertchatopen",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const iddocs = req.body.iddocs;
    const Text = req.body.Text;
    console.log(iddocs, Text);
    if (!iddocs & Text)
      return res.send({ error: true, message: "ID Not Found" });
    const data = await db.collection("ChatOpen").doc(iddocs).set({
      iddocs: iddocs,
      Text: Text,
    });

    res.send({ error: false, message: "Insert Success" });
  }
);

/* insert chatpositive */
app.post(
  "/insertchatpositive",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    // const iddocs = req.body.iddocs;
    const getdata = await db.collection("ChatOpen").count().get();
    const iddocs = getdata + 1;
    const Text = req.body.Text;
    if (!iddocs & Text)
      return res.send({ error: true, message: "ID Not Found" });
    const data = await db.collection("ChatPositive").doc(iddocs).set({
      iddocs: iddocs,
      Text: Text,
    });
    res.send({ error: false, message: "Insert Success" });
  }
);

/* insert chatnegative */
app.post(
  "/insertchatnegative",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const iddocs = req.body.iddocs;
    const Text = req.body.Text;

    if (!iddocs & text)
      return res.send({ error: true, message: "ID Not Found" });
    const data = await db.collection("ChatNegative").doc(iddocs).set({
      iddocs: iddocs,
      Text: Text,
    });
    res.send({ error: false, message: "Insert Success" });
  }
);

/* insert chatstimulate */
app.post(
  "/insertchatstimulate",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const iddocs = req.body.iddocs;
    const Text = req.body.Text;

    if (!iddocs & Text)
      return res.send({ error: true, message: "ID Not Found" });
    const data = await db.collection("ChatStimulate").doc(iddocs).set({
      iddocs: iddocs,
      Text: Text,
    });
    res.send({ error: false, message: "Insert Success" });
  }
);

/* insert chatclose */
app.post(
  "/insertchatclose",
  cors(),
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const iddocs = req.body.iddocs;
    const Text = req.body.Text;

    if (!iddocs & Text)
      return res.send({ error: true, message: "ID Not Found" });
    const data = await db.collection("ChatClose").doc(iddocs).set({
      iddocs: iddocs,
      Text: Text,
    });
    res.send({ error: false, message: "Insert Success" });
  }
);

/* insert Admin */
app.post(
  "/insertadmin/:name/:useranme/:email/:password/:type",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const name = req.params.name;
    const username = req.params.useranme;
    const email = req.params.email;
    const password = req.params.password;
    const type = req.params.type;
    if (!name & !username & !email & !password & !type)
      return res.send({ error: true, message: "ID Not Found" });
    const data = await db.collection("Admin").add({
      Name: name,
      Username: username,
      Email: email,
      Password: password,
      Type: type,
    });
    res.send({ error: false, message: "Insert Success" });
  }
);

/* insert assistance */
app.post(
  "/insertassistance",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const iddocs = req.body.iddocs;
    const title = req.body.title;
    const tel = req.body.tel;
    const facebook = req.body.facebook;
    const Linkfacebook = req.body.Linkfacebook;
    const lineid = req.body.lineid;
    const Linkline = req.body.Linkline;
    const description = req.body.description;

    if (
      !iddocs &
      title &
      tel &
      facebook &
      Linkfacebook &
      Linkline &
      lineid &
      description
    )
      return res.send({ error: true, message: "ID Not Found" });
    const data = await db.collection("Assistance").doc(iddocs).set({
      iddocs: iddocs,
      Title: title,
      Tel: tel,
      Facebook: facebook,
      Linkfacebook: Linkfacebook,
      LineID: lineid,
      Linkline: Linkline,
      Description: description,
      /*Admin_ref:userInfo.email*/
    });

    res.send({ error: false, message: "Insert Success" });
  }
);

// app.post('/insertassistance/:name/:tel/:description', express.urlencoded({ extended: true }), async function (req, res) {

//     const name = req.params.name
//     const tel = req.params.tel
//     const description = req.params.description
//     if (!name & description & tel) return res.send({ error: true, message: 'ID Not Found' })
//     const data = await db.collection('Assistance').add({
//         Name: name,
//         Description: description,
//         Tel: tel

//     });
//     res.send({ error: false, message: 'Insert Success' })

// });

/* insert activity */
app.post(
  "/insertactivity/:iddocs/:title/:description",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const iddocs = req.params.iddocs;
    const title = req.params.title;
    const description = req.params.description;
    if (!iddocs & title & description)
      return res.send({ error: true, message: "ID Not Found" });
    const data = await db.collection("Activity").doc(iddocs).set({
      iddocs: iddocs,
      title: title,
      description: description,
      /*Admin_ref:userInfo.email*/
    });
    res.send({ error: false, message: "Insert Success" });
  }
);

//////////////////////////// getByID  ///////////////////////////////////

// app.get('/adminByID/:id', express.urlencoded({ extended: true }), async function (req, res) {

//     const id = req.params.id
//     const doc = await db.collection("Admin").doc(id).get()
//     if (!doc.exists) {
//         return res.send('')
//       } else {
//         return res.send(doc.data())
//       }

// });

app.get(
  "/chatopenByID/:id/",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const id = req.params.id;
    const doc = await db.collection("ChatOpen").doc(id).get();
    if (!doc.exists) {
      return res.send("");
    } else {
      return res.send(doc.data());
    }
  }
);

app.get(
  "/chatpositiveByID/:id",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const id = req.params.id;
    const doc = await db.collection("ChatPositive").doc(id).get();
    if (!doc.exists) {
      return res.send("");
    } else {
      return res.send(doc.data());
    }
  }
);

app.get(
  "/chatnegativeByID/:id",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const id = req.params.id;
    const doc = await db.collection("ChatNegative").doc(id).get();
    if (!doc.exists) {
      return res.send("");
    } else {
      return res.send(doc.data());
    }
  }
);

app.get(
  "/chatstimulateByID/:id",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const id = req.params.id;
    const doc = await db.collection("ChatStimulate").doc(id).get();
    if (!doc.exists) {
      return res.send("");
    } else {
      return res.send(doc.data());
    }
  }
);

app.get(
  "/chatcloseByID/:id",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const id = req.params.id;
    const doc = await db.collection("ChatClose").doc(id).get();
    if (!doc.exists) {
      return res.send("");
    } else {
      return res.send(doc.data());
    }
  }
);

app.get(
  "/ActivityByID/:id",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const id = req.params.id;
    const doc = await db.collection("Activity").doc(id).get();
    if (!doc.exists) {
      return res.send("");
    } else {
      return res.send(doc.data());
    }
  }
);

app.get(
  "/AssistanceByID/:id",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const id = req.params.id;
    const doc = await db.collection("Assistance").doc(id).get();
    if (!doc.exists) {
      return res.send("");
    } else {
      return res.send(doc.data());
    }
  }
);

/*-------------------------------------------update------------------------------------------/
/*update activiy*/
app.patch(
  "/updateActivity/:id/:title/:description",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const id = req.params.id;
    const title = req.params.title;
    const description = req.params.description;
    if (!id & title & description)
      return res.send({ error: true, message: "ID Not Found" });
    const data = await db.collection("Activity").doc(id).update({
      title: title,
      description: description,
    });
    res.send({ error: false, message: "update Success" });
  }
);

// /*update activiy*/
// app.get('/Activity/:id', async function (req, res) {
//     const id = req.params.id
//     const data = await dbactivity.collection("Activity").doc(id).get()
//     return res.send(data.data())
// });

/* update Admin 
app.patch('/updateAdmin/:id/:name/:useranme/:email/:password/:type', express.urlencoded({ extended: true }), async function (req, res) {

    const id = req.params.id
    const name = req.params.name
    const username = req.params.useranme
    const email = req.params.email
    const password = req.params.password
    const type = req.params.type
    if (!id & !name & !username & !email & !password & !type) return res.send({ error: true, message: 'ID Not Found' })
    const data = await db.collection('Admin').doc(id).update({
        Name: name,
        Username: username,
        Email: email,
        Password: password,
        Type: type,
    });
    res.send({ error: false, message: 'update Success' })

});*/

/* update Assistance */
app.patch(
  "/updateAssistance/:id/:title/:tel/:facebook/:lineID/:description",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const id = req.params.id;
    const title = req.params.title;
    const tel = req.params.tel;
    const facebook = req.params.facebook;
    const lineID = req.params.lineID;
    const description = req.params.description;

    if (!id & !title & !tel & !facebook & !lineID & !description)
      return res.send({ error: true, message: "ID Not Found" });
    const data = await db.collection("Assistance").doc(id).update({
      Title: title,
      Tel: tel,
      Facebook: facebook,
      LineID: lineID,
      Description: description,
    });
    res.send({ error: false, message: "update Success" });
  }
);

/* update chatopen */
app.patch(
  "/updatechatOpen/:id/:text",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const id = req.params.id;
    const text = req.params.text;
    if (!id & text) return res.send({ error: true, message: "ID Not Found" });
    const data = await db.collection("ChatOpen").doc(id).update({
      Text: text,
    });
    res.send({ error: false, message: "update Success" });
  }
);

app.patch(
  "/updatechatPositive/:id/:text",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const id = req.params.id;
    const text = req.params.text;
    if (!id & text) return res.send({ error: true, message: "ID Not Found" });
    const data = await db.collection("ChatPositive").doc(id).update({
      Text: text,
    });
    res.send({ error: false, message: "update Success" });
  }
);
app.patch(
  "/updatechatNegative/:id/:text",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const id = req.params.id;
    const text = req.params.text;
    if (!id & text) return res.send({ error: true, message: "ID Not Found" });
    const data = await db.collection("ChatNegative").doc(id).update({
      Text: text,
    });
    res.send({ error: false, message: "update Success" });
  }
);

app.patch(
  "/updatechatStimulate/:id/:text",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const id = req.params.id;
    const text = req.params.text;
    if (!id & text) return res.send({ error: true, message: "ID Not Found" });
    const data = await db.collection("ChatStimulate").doc(id).update({
      Text: text,
    });
    res.send({ error: false, message: "update Success" });
  }
);
app.patch(
  "/updatechatClose/:id/:text",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const id = req.params.id;
    const text = req.params.text;
    if (!id & text) return res.send({ error: true, message: "ID Not Found" });
    const data = await db.collection("ChatClose").doc(id).update({
      Text: text,
    });
    res.send({ error: false, message: "update Success" });
  }
);

/*---------------------------------------------Delete-------------------------------------------------/
/* Delete chatpositive */
app.delete("/chatpositive/:id", async function (req, res) {
  const id = req.params.id;
  if (!id) return res.send({ error: true, message: "ID Not Found" });
  const data = await db.collection("ChatPositive").doc(id).delete();
  res.send({ error: false, message: "Delete Success" });
});

/* Delete chatnegative */
app.delete("/chatnegative/:id", async function (req, res) {
  const id = req.params.id;
  if (!id) return res.send({ error: true, message: "ID Not Found" });
  const data = await db.collection("ChatNegative").doc(id).delete();
  res.send({ error: false, message: "Delete Success" });
});

/* Delete chatopen */
app.delete("/chatopen/:id", async function (req, res) {
  const id = req.params.id;
  if (!id) return res.send({ error: true, message: "ID Not Found" });
  const data = await db.collection("ChatOpen").doc(id).delete();
  res.send({ error: false, message: "Delete Success" });
});

/* Delete chatclose */
app.delete("/chatclose/:id", async function (req, res) {
  const id = req.params.id;
  if (!id) return res.send({ error: true, message: "ID Not Found" });
  const data = await db.collection("ChatClose").doc(id).delete();
  res.send({ error: false, message: "Delete Success" });
});

/* Delete chatstimulate*/
app.delete("/chatstimulate/:id", async function (req, res) {
  const id = req.params.id;
  if (!id) return res.send({ error: true, message: "ID Not Found" });
  const data = await db.collection("ChatStimulate").doc(id).delete();
  res.send({ error: false, message: "Delete Success" });
});

/* Delete activity*/
app.delete("/activity/:id", async function (req, res) {
  const id = req.params.id;
  if (!id) return res.send({ error: true, message: "ID Not Found" });
  const data = await db.collection("Activity").doc(id).delete();
  res.send({ error: false, message: "Delete Success" });
});

/* Delete assistance*/
app.delete("/assistance/:id", async function (req, res) {
  const id = req.params.id;
  if (!id) return res.send({ error: true, message: "ID Not Found" });
  const data = await db.collection("Assistance").doc(id).delete();
  res.send({ error: false, message: "Delete Success" });
});

/* Delete admin*/
app.delete("/admin/:id", async function (req, res) {
  /*const userInfo = await checkaccessToken(req)*/
  const id = req.params.id;
  if (!id) return res.send({ error: true, message: "ID Not Found" });
  const data = await db.collection("Admin").doc(id).delete();
  res.send({ error: false, message: "Delete Success" });
});

////////////////////////////////// Admin /////////////////////////////////////////////////////

/* connect Admin */

app.get("/Admin", async function (req, res) {
  const sortBy = req.query.sortBy;
  const first = req.query.first;
  const data = await db.collection("Admin").orderBy(sortBy, first).get();
  return res.send(
    data.docs.map((item) => {
      return { ...item.data(), id: item.id };
    })
  );
});

/* insert Admin */
app.post(
  "/insertadmindata/:uid/:providerid/:email/:displayName/:phonenum",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const uid = req.params.uid;
    const providerid = req.params.providerid;
    const email = req.params.email;
    const displayName = req.params.displayName;
    // const photoURL = req.params.photoURL;
    const phonenum = req.params.phonenum;
    if (!uid & providerid & email & displayName & phonenum)
      return res.send({ error: true, message: "ID Not Found" });
    const data = await db.collection("Admin").doc(uid).set({
      providerId: providerid,
      email: email,
      displayName: displayName,
      // photoURL: photoURL,
      phonenum: phonenum,
    });

    res.send({ error: false, message: "Delete Success" });
  }
);

//delete user //
app.delete("/deleteuser/:uid", async (req, res) => {
  const deleteUid = req.params.uid;
  await admin.auth().deleteUser(deleteUid);
  await dbAdmin.collection("Admin").doc(deleteUid).delete();
  res.send({ error: false, message: "Delete Success", uid: deleteUid });
});

//AdminByID //
app.get(
  "/AdminByID/:uid",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const uid = req.params.uid;
    const doc = await db.collection("Admin").doc(uid).get();
    if (!doc.exists) {
      return res.send("");
    } else {
      return res.send(doc.data());
    }
  }
);

//getlevel //
app.get("/getlevel", async function (req, res) {
  const data = await db.collection("Emotiondetails").get();
  return res.send(
    data.docs.map((item) => {
      return { ...item.data(), id: item.id };
    })
  );
});

/////////////////////////////get users emotions per week by lineID //////////////////////////////////////
app.get(
  "/getEmotionPerWeek/:lineID",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const lineID = req.params.lineID;
    const week = req.query.week;
    const doc = await db.collection("users").where("id", "==", lineID).get();
    const docId = doc.docs[0].id;
    const startDay = moment().startOf("week").toDate();
    const endDay = moment().endOf("week").toDate();
    const data = await db
      .collection("users")
      .doc(docId)
      .collection("emotions")
      .where("date", ">=", startDay)
      .where("date", "<=", endDay)
      .get();
    const average =
      data.docs
        .map((item) => {
          return item.data().level;
        })
        .reduce((a, b) => parseInt(a) + parseInt(b)) / data.docs.length;
    return res.send({
      allData: data.docs.map((item) => {
        return {
          ...item.data(),
          id: item.id,
          date: moment(item.data().date.toDate()),
        };
      }),
      average: average,
      percentage: (average / 5) * 100,
      startDay: moment(startDay).format("DD/MM/YYYY"),
      endDay: moment(endDay).format("DD/MM/YYYY"),
    });
  }
);

//month
app.get(
  "/getEmotionPerMonth/:lineID",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const lineID = req.params.lineID;
    const month = req.query.month;
    const doc = await db.collection("users").where("id", "==", lineID).get();
    const docId = doc.docs[0].id;
    const startDay = moment().startOf("month").toDate();
    const endDay = moment().endOf("month").toDate();
    const data = await db
      .collection("users")
      .doc(docId)
      .collection("emotions")
      .where("date", ">=", startDay)
      .where("date", "<=", endDay)
      .get();
    const average =
      data.docs
        .map((item) => {
          return item.data().level;
        })
        .reduce((a, b) => parseInt(a) + parseInt(b)) / data.docs.length;
    return res.send({
      allData: data.docs.map((item) => {
        return {
          ...item.data(),
          id: item.id,
          date: moment(item.data().date.toDate()),
        };
      }),
      average: average,
      percentage: (average / 5) * 100,
      startDay: moment(startDay).format("DD/MM/YYYY"),
      endDay: moment(endDay).format("DD/MM/YYYY"),
    });
  }
);

//day
app.get(
  "/getEmotionPerDay/:lineID",
  express.urlencoded({ extended: true }),
  async function (req, res) {
    const lineID = req.params.lineID;
    const day = req.query.day;
    const doc = await db.collection("users").where("id", "==", lineID).get();
    const docId = doc.docs[0].id;
    const startDay = moment().startOf("day").toDate();
    const endDay = moment().endOf("day").toDate();
    const data = await db
      .collection("users")
      .doc(docId)
      .collection("emotions")
      .where("date", ">=", startDay)
      .where("date", "<=", endDay)
      .get();
    const average =
      data.docs
        .map((item) => {
          return item.data().level;
        })
        .reduce((a, b) => parseInt(a) + parseInt(b)) / data.docs.length;
    return res.send({
      allData: data.docs.map((item) => {
        return {
          ...item.data(),
          id: item.id,
          date: moment(item.data().date.toDate()),
        };
      }),
      average: average,
      percentage: (average / 5) * 100,
      startDay: moment(startDay).format("DD/MM/YYYY"),
      endDay: moment(endDay).format("DD/MM/YYYY"),
    });
  }
);

///////////////////////// get user //////////////////////////////
/* connect Admin */
app.get("/getusers", async function (req, res) {
  const data = await dbAdmin.collection("users").get();
  return res.send(
    data.docs.map((item) => {
      return { ...item.data(), id: item.id };
    })
  );
});

exports.adminbackend = functions.https.onRequest(app);
