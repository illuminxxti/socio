import React, { useContext, useEffect, useState } from "react";
import "./message.css";
import { combinedId } from "../../firebase/messageuser";
import { db } from "../../firebase/config";
import {
  getDoc,
  updateDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { update } from "firebase/database";
import { authContext } from "../../firebase/firebaseContext";
import { uploaderUser } from "../../firebase/uploaderuser";

function Message() {
  const { chatCombinedId, setChatCombinedId } = useContext(combinedId);
  const { user } = useContext(authContext);
  const [userchatsArray, setUserChatsArray] = useState([]);
  const [chater, setChater] = useState();
  const { uploadUser, setUploadUser } = useContext(uploaderUser);
  const [defaultChater, SetDefaultChater] = useState();
  const [value, setValue] = useState();
  const [loadMessages, setLoadMessages] = useState();
  const [array, setArray] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "userChats"),
      where("owner", "==", user.uid)
    );

    getDocs(q).then((querySnapshot) => {
      setUserChatsArray(
        querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        })
      );
    });

    const p = query(
      collection(db, "userChats"),
      where("messagers.userId", "==", uploadUser)
    );
    getDocs(p).then((doc) => {
      doc.forEach((e) => {
        SetDefaultChater(e.data());
      });
    });
    setLoadMessages(chater ? chater : defaultChater);
    const msgId =
      loadMessages?.messagers.userId > user.uid
        ? loadMessages?.messagers.userId + user.uid
        : user.uid + loadMessages?.messagers.userId;
    onSnapshot(doc(db, "Messages", msgId), (doc) => {
      setArray(doc.data()?.chats);
    });
  });

  const handleSend = (e) => {
    const combinedId =
      e.messagers.userId > user.uid
        ? e.messagers.userId + user.uid
        : user.uid + e.messagers.userId;
    updateDoc(doc(db, "Messages", combinedId), {
      chats: arrayUnion({
        Sender: user.displayName,
        userId: user.uid,
        message: value,
        time:new Date().toLocaleString()
      }),
    }).then(() => {
      setValue("");
    });
  };

  const handleMessage = (doc) => {
    setChater(doc);
  };

  return (
    <div
      style={{
        height: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="outerContainer">
        <div className="userMessages">
          <div className="titleHeader">
            <p>Messages</p>
          </div>
          <div className="chatsusername">
            {userchatsArray.map((doc) => {
              return (
                <div
                  className="userNames"
                  onClick={() => {
                    handleMessage(doc);
                  }}
                >
                  <img
                    src={doc ? doc.messagers.profileUrl : ""}
                    className="profileImg"
                    alt=""
                  />
                  <p>{doc ? doc.messagers.Name : ""}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="innerContainer">
          <div className="userHeader">
            <div className="userProfile">
              <div>
                <img
                  className="profileImg"
                  src={
                    chater
                      ? chater.messagers.profileUrl
                      : defaultChater?.messagers.profileUrl
                  }
                  alt=""
                />
              </div>
              <div className="currentuserName">
                <p>
                  {chater
                    ? chater.messagers.Name
                    : defaultChater?.messagers.Name}
                </p>
              </div>
            </div>
            <div className="communication">
              <div className="voiceCall">
                <img src="phone-flip.png" alt="" />
              </div>
              <div className="videoCall">
                <img src="video-camera-alt.png" alt="" />
              </div>
            </div>
          </div>
          <div className="messageUser">
            <div className="messageFrame">
              {array?.map((e) => {
                return (
                  <>
                  { e.userId === user.uid?
                    <div className="sender">
                      <p className="Sender">
                        {e.message}
                      </p>
                    </div>:null}
                    {e.userId!=user.uid?
                    <div className="reader">
                      <p className="Reader">{e.message}</p>
                    </div>:null}
                  </>
                );
              })}
            </div>
          </div>
          <div className="messageSend">
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              placeholder="Send message"
            />
            <button
              onClick={() => {
                handleSend(chater ? chater : defaultChater);
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
