const functions = require("firebase-functions");
const { WebhookClient, Payload } = require("dialogflow-fulfillment");
const { Card, Suggestion } = require("dialogflow-fulfillment");
const axios = require("axios");
const backendUrl =
  "https://us-central1-gler2-wqhk.cloudfunctions.net/adminbackend";

const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://gler2-wqhk.firebaseio.com",
});
const db = admin.firestore();

process.env.DEBUG = "dialogflow:debug";

exports.dialogflowFirebaseFulfillment2 = functions.https.onRequest(
  (request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log(
      "Dialogflow Request headers: " + JSON.stringify(request.headers)
    );
    console.log("Dialogflow Request body: " + JSON.stringify(request.body));

    function ReccordEmotionYes() {
      var level = agent.parameters.level;
      const userId =
        request.body.originalDetectIntentRequest.payload.data.source.userId;
      return (
        db
          .collection("users")
          .where("id", "==", userId)
          .get()
          .then((data) => {
            data.forEach((doc) => {
              db.collection("users").doc(doc.id).collection("emotions").add({
                level: level,
                date: new Date(),
              });
            });
          }),
        db.collection("Emotiondetails").add({
          id: userId,
          level: level,
          date: new Date(),
        })
      );
    }

    function Activities() {
      let activity = request.body.queryResult.parameters.activity;
      let result = "none";

      if (activity == "ออกกำลังกาย") {
        result = "01";
      } else if (activity == "ทำอาหาร") {
        result = "02";
      }
      return admin
        .firestore()
        .collection("Activity")
        .doc(result)
        .get()
        .then((doc) => {
          agent.add(doc.data().title + `\n` + doc.data().description);
        });
    }

   async function RandomActivities() {
      const data = await db
      .collection("ChatOpen").count()
      .get();

      let random = Math.floor(Math.random() * data.data().count + 1);
      var randomStr = random.toString();
      if (random < 10) {
        randomStr = "0" + randomStr;
      }
      return db
        .collection("Activity")
        .doc(randomStr)
        .get()
        .then((doc) => {
          agent.add(doc.data()?.description || '');
        });
    }

    function Assistance() {
      let astanswer = request.body.queryResult.parameters.astanswer;
      return db
        .collection("Assistance")
        .get()
        .then((data) => {
          data.forEach((doc) => {
            if (astanswer == "ทั้งหมด") {
              agent.add(
                "หากคุณต้องการความช่วยเหลือ ขณะนี้มีบริการที่ให้บริการ 24ชม. ดังนี้"
              );
              agent.add(
                "ชื่อ: " +
                  doc.data().Title +
                  "\n" +
                  "เบอร์ :" +
                  doc.data().Tel +
                  "\n" +
                  "Facebook :" +
                  doc.data().Facebook +
                  "\n" +
                  "Line ID :" +
                  doc.data().LineID
              );
            } else if (astanswer == "โซเชียลมีเดีย") {
              agent.add(
                "หากคุณต้องการความช่วยเหลือ ขณะนี้มีบริการที่ให้บริการ 24ชม. ดังนี้"
              );
              agent.add(
                "ชื่อ: " +
                  doc.data().Title +
                  "\n" +
                  "Facebook :" +
                  doc.data().Facebook +
                  "\n" +
                  "Line ID :" +
                  doc.data().LineID
              );
            } else if (astanswer == "เบอร์โทร") {
              agent.add(
                "หากคุณต้องการความช่วยเหลือ ขณะนี้มีบริการที่ให้บริการ 24ชม. ดังนี้"
              );
              agent.add(
                "ชื่อ: " + doc.data().Title + "\n" + "เบอร์ :" + doc.data().Tel
              );
            }
          });
        });
    }

    async function ChatOpen() {
      const userId = request.body.originalDetectIntentRequest.payload.data.source.userId;
        const data = await db
        .collection("ChatOpen").count()
        .get();
      let random = Math.floor(Math.random() * data.data().count + 1);
      var randomStr = random.toString();
      // console.log(data.data().count);
      if (random < 10) {
        randomStr = "0" + randomStr;
      }
      const queryText = request.body.queryResult.queryText;
      return (
        db.collection("users").doc(userId).set({ id: userId }),
        db.collection("queryTextChatOpen").add({
          id: userId,
          date: new Date(),
          queryText: queryText,
          replymessage: randomStr,
        }), 
        db
          .collection("ChatOpen")
          .doc(randomStr)
          .get()
          .then((doc) => {
            agent.add(doc.data()?.Text || '');
          })

      );
    }

    async function ChatPositive() {
      let random = Math.floor(Math.random() * data.data().count + 1);
      var randomStr = random.toString();
      const data = await db
      .collection("ChatPositive").count()
      .get();

      if (random < 10) {
        randomStr = "0" + randomStr;
      }

      const userId =
        request.body.originalDetectIntentRequest.payload.data.source.userId;
      const queryText = request.body.queryResult.queryText;

      return (
        db.collection("queryTextChatPositive").add({
          id: userId,
          date: new Date(),
          queryText: queryText,
          replymessage: randomStr,
       }) ,
       db
          .collection("ChatPositive")
          .doc(randomStr)
          .get()
          .then((doc) => {
            agent.add(doc.data()?.Text || '');
          })
    
        
      );
    }

    async function ChatNegative() {
      let random = Math.floor(Math.random() * data.data().count + 1);
      var randomStr = random.toString();
      const data = await db
      .collection("ChatNegative").count()
      .get();

      if (random < 10) {
        randomStr = "0" + randomStr;
      }
      const userId =
        request.body.originalDetectIntentRequest.payload.data.source.userId;
      const queryText = request.body.queryResult.queryText;
      return (
        db.collection("queryTextChatNegative").add({
          id: userId,
          queryText: queryText,
          date: new Date(),
          replymessage: randomStr,
        }),
        db
          .collection("ChatNegative")
          .doc(randomStr)
          .get()
          .then((doc) => {
            agent.add(doc.data()?.Text || '');
          })

      );
    }

    async function ChatStimulate() {
      let random = Math.floor(Math.random() * data.data().count + 1);
      var randomStr = random.toString();
      const data = await db
      .collection("ChatStimulate").count()
      .get();

      if (random < 10) {
        randomStr = "0" + randomStr;
      }
      const userId =
        request.body.originalDetectIntentRequest.payload.data.source.userId;
      const queryText = request.body.queryResult.queryText;

      return (
        db.collection("queryTextChatStimulate").add({
          id: userId,
          date: new Date(),
          queryText: queryText,
          replymessage: randomStr,
        }),
        db
          .collection("ChatStimulate")
          .doc(randomStr)
          .get()
          .then((doc) => {
            agent.add(doc.data()?.Text || '');
          })

      );
    }

    async function ChatStimulateChatStimulateno() {
      let random = Math.floor(Math.random() * data.data().count + 1);
      var randomStr = random.toString();
      const data = await db
      .collection("ChatClose").count()
      .get();

      if (random < 10) {
        randomStr = "0" + randomStr;
      }

      const userId =
        request.body.originalDetectIntentRequest.payload.data.source.userId;
      const queryText = request.body.queryResult.queryText;
      return (
        db.collection("queryTextChatStimulate").add({
          id: userId,
          date: new Date(),
          queryText: queryText,
          replymessage: randomStr,
        }),
        db
          .collection("ChatClose")
          .doc(randomStr)
          .get()
          .then((doc) => {
            agent.add(doc.data()?.Text || '');
          })
  
      );
    }

    async function ChatClose() {
      let random = Math.floor(Math.random() * data.data().count + 1);
      var randomStr = random.toString();
      const data = await db
      .collection("ChatOpen").count()
      .get();

      if (random < 10) {
        randomStr = "0" + randomStr;
      }
      const userId =
        request.body.originalDetectIntentRequest.payload.data.source.userId;
      const queryText = request.body.queryResult.queryText;

      return (
        db.collection("queryTextChatStimulate").add({
          id: userId,
          date: new Date(),
          queryText: queryText,
          replymessage: randomStr,
        }),
        db
          .collection("ChatClose")
          .doc(randomStr)
          .get()
          .then((doc) => {
            agent.add(doc.data()?.Text || '');
            GetLevel;
          })

      );
    }

    async function GetLevel() {
      const moment = require("moment");

      const userId =
        request.body.originalDetectIntentRequest.payload.data.source.userId;
      console.log("-------------------------------");
      const doc = await db.collection("users").where("id", "==", userId).get();
      console.log("getted doc");
      const docId = doc.docs[0].id;

      //ดูระดับอารมณ์รายวัน
      const startDay = moment().startOf("day").toDate();
      const endDay = moment().endOf("day").toDate();
      const dataDay = await db
        .collection("users")
        .doc(docId)
        .collection("emotions")
        .where("date", ">=", startDay)
        .where("date", "<=", endDay)
        .get();
      const averageDay =
        (dataDay.docs
          .map((item) => {
            return item.data().level;
          })
          .reduce((a, b) => parseInt(a) + parseInt(b)) /
          dataDay.docs.length /
          5) *
        100;

      //ดูระดับอารมณ์รายสัปดาห์
      const startWeek = moment().startOf("week").toDate();
      const endWeek = moment().endOf("week").toDate();
      const dataWeek = await db
        .collection("users")
        .doc(docId)
        .collection("emotions")
        .where("date", ">=", startWeek)
        .where("date", "<=", endWeek)
        .get();
      const averageWeek =
        (dataWeek.docs
          .map((item) => {
            return item.data().level;
          })
          .reduce((a, b) => parseInt(a) + parseInt(b)) /
          dataWeek.docs.length /
          5) *
        100;

      //ดูระดับอารมณ์รายเดือน
      const startMonth = moment().startOf("month").toDate();
      const endMonth = moment().endOf("month").toDate();
      const data = await db
        .collection("users")
        .doc(docId)
        .collection("emotions")
        .where("date", ">=", startMonth)
        .where("date", "<=", endMonth)
        .get();
      console.log(docId);
      const averageMonth =
        (data.docs
          .map((item) => {
            return item.data().level;
          })
          .reduce((a, b) => parseInt(a) + parseInt(b)) /
          data.docs.length /
          5) *
        100;

      let resultemotionDay = "ไม่พบการประเมิน";
      let resultemotionWeek = "ไม่พบการประเมิน";
      let resultemotionMonth = "ไม่พบการประเมิน";

      if (averageDay >= 81 && averageDay <= 100) {
        resultemotionDay = "สบายใจมาก 😄";
      } else if (averageDay >= 61 && averageDay <= 80) {
        resultemotionDay = "สบายใจ 🙂";
      } else if (averageDay >= 41 && averageDay <= 60) {
        resultemotionDay = "เฉยๆ 😌";
      } else if (averageDay >= 21 && averageDay <= 40) {
        resultemotionDay = "ไม่สบายใจ 😔";
      } else if (averageDay >= 1 && averageDay <= 20) {
        resultemotionDay = "ไม่สบายใจมาก ☹️";
      }

      if (averageWeek >= 81 && averageWeek <= 100) {
        resultemotionWeek = "สบายใจมาก 😄";
      } else if (averageWeek >= 61 && averageWeek <= 80) {
        resultemotionWeek = "สบายใจ 🙂";
      } else if (averageWeek >= 41 && averageWeek <= 60) {
        resultemotionWeek = "เฉยๆ 😌";
      } else if (averageWeek >= 21 && averageWeek <= 40) {
        resultemotionWeek = "ไม่สบายใจ 😔";
      } else if (averageWeek >= 1 && averageWeek <= 20) {
        resultemotionWeek = "ไม่สบายใจมาก ☹️";
      }

      if (averageMonth >= 81 && averageMonth <= 100) {
        resultemotionMonth = "สบายใจมาก 😄";
      } else if (averageMonth >= 61 && averageMonth <= 80) {
        resultemotionMonth = "สบายใจ 🙂";
      } else if (averageMonth >= 41 && averageMonth <= 60) {
        resultemotionMonth = "เฉยๆ 😌";
      } else if (averageMonth >= 21 && averageMonth <= 40) {
        resultemotionMonth = "ไม่สบายใจ 😔";
      } else if (averageMonth >= 1 && averageMonth <= 20) {
        resultemotionMonth = "ไม่สบายใจมาก ☹️";
      }

      const showemt = agent.parameters.showemt;
      const month = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ];
      const d = new Date();
      let date = d.getDate();
      let namemonth = month[d.getMonth()];

      if (showemt == "รายวัน") {
        agent.add(
          "ระดับอารมณ์ " +
            "วันที่ " +
            date +
            " เดือน " +
            namemonth +
            "ของคุณคือ \n\n" +
            averageDay.toFixed(0) +
            " / 100" +
            "\n\n อยู่ในเกณฑ์ " +
            resultemotionDay
        );
      } else if (showemt == "รายสัปดาห์") {
        agent.add(
          "ระดับอารมณ์ในสัปดาห์นี้ของคุณคือ \n\n" +
            averageWeek.toFixed(0) +
            " / 100" +
            "\n\n อยู่ในเกณฑ์ " +
            resultemotionWeek +
            "\n\n( เริ่มจากวันอาทิตย์ )"
        );
      } else if (showemt == "รายเดือน") {
        agent.add(
          "ระดับอารมณ์ในเดือน " +
            namemonth +
            " ของคุณคือ \n\n" +
            averageMonth.toFixed(0) +
            " / 100" +
            "\n\n อยู่ในเกณฑ์ " +
            resultemotionMonth
        );
      }
    }

    function Test() {
      const testnum = request.body.queryResult.queryText;
      if (testnum == 1) {
        agent.add("ถูก1");
      } else if (testnum == 2) {
        agent.add("ถูก2");
      } else if (testnum == 3) {
        agent.add("ถูก3");
      } else if (testnum == 4) {
        agent.add("ถูก4");
      } else if (testnum == 5) {
        agent.add("ถูก5");
      } else {
        agent.add("กรอกเฉพาะ1-5เท่านั้น!!!");
      }
    }

    function Reviews() {
      const comments = request.body.queryResult.queryText;
      const userId =
      request.body.originalDetectIntentRequest.payload.data.source.userId;
    return (
      db.collection("Reviews").add({
        id: userId,
        date: new Date(),
        comment: comments,
      })
    );
  
    }
    let intentMap = new Map();
    intentMap.set("Reccord Emotion - Yes", ReccordEmotionYes);
    intentMap.set("Activitiesanswer", Activities);
    intentMap.set("RandomActivitiessanswer", RandomActivities);
    intentMap.set("Assistance - custom", Assistance);
    intentMap.set("Default Welcome Intent", ChatOpen);
    intentMap.set("ChatPositive", ChatPositive);
    intentMap.set("ChatNegative", ChatNegative);
    intentMap.set("ChatStimulate", ChatStimulate);
    intentMap.set(
      "ChatStimulateChatStimulate - no",
      ChatStimulateChatStimulateno
    );
    intentMap.set("ChatClose", ChatClose);
    intentMap.set("GetLevel - answer", GetLevel);
    intentMap.set("TestReccordEmotion", Test);
    intentMap.set("Reviews - custom", Reviews);

    agent.handleRequest(intentMap);
  }
);