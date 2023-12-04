import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import mqtt from "mqtt";
import "../Style/Chat.css";

interface Message {
  sender: number;
  receiver: number;
  timestamp: Date;
  chat: string;
}

const Chat: React.FC = () => {
  const [senderUserID, setSenderUserID] = useState<number>();
  const [receiver, setReceiver] = useState<number | null>(null);
  const [chat, setChat] = useState<string>("");
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);

  const location = useLocation();
  const user = location.state && location.state.user;

  //   set Sender userID
  useEffect(() => {
    if (user) {
      const userIdString = user.id.toString();

      const lastDigit = userIdString.charAt(userIdString.length - 1);

      const lastDigitNumber = parseInt(lastDigit, 10);

      setSenderUserID(lastDigitNumber);
    }
  }, [user]);

  const client = mqtt.connect({
    host: "localhost",
    port: 8030,
    username: "azmin",
    password: "azmin",
  });

  useEffect(() => {
    client.on("connect", () => {
      console.log("MQTT Connected");
    });

    client.on("error", (err) => {
      console.error("MQTT Connection Error:", err);
    });

    return () => {
      client.end();
    };
  }, []);

  const handleReceiver = (userId: number) => {
    setReceiver(userId);
  };

  const handleSend = () => {
    setChat(chat);
    console.log(chat);

    compileMessage();
  };

  const compileMessage = () => {
    if (senderUserID !== null && receiver !== null && chat.trim() !== "") {
      const message: Message = {
        sender: senderUserID ?? 0,
        receiver: receiver,
        timestamp: new Date(),
        chat: chat,
      };

      console.log("Compiled Message:", message);

      const topic = `user/${receiver}/messages`;

      client.publish(topic, JSON.stringify(message));
      console.log("Sent message:", message);

      setChat("");
    }
  };

  useEffect(() => {
    if (senderUserID !== null && senderUserID !== undefined) {
      console.log("userId: ", senderUserID);
      const senderTopic = `user/${senderUserID}/messages`;
      const receiverTopic = `user/${receiver}/messages`;

      console.log("Subscribing to:", senderTopic);

      client.subscribe(senderTopic);
      client.subscribe(receiverTopic);

      client.on("message", (topic, message) => {
        // Handle incoming messages
        console.log("Received message:", message.toString());
        const parsedMessage = JSON.parse(message.toString()) as Message;
        setReceivedMessages((prevMessages) => [...prevMessages, parsedMessage]);
      });

      return () => {
        client.unsubscribe(senderTopic);
        client.unsubscribe(receiverTopic);
        client.end();
      };
    }
  }, [senderUserID, receiver]);

  // Helper function to format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getLatestMessagePreview = (userId: number) => {
    const userMessages = receivedMessages.filter(
      (message) =>
        (message.sender === userId && message.receiver === senderUserID) ||
        (message.sender === senderUserID && message.receiver === userId)
    );

    // Exclude messages sent by the active user from the sorting
    const filteredMessages = userMessages.filter(
      (message) => message.sender !== senderUserID
    );

    const sortedMessages = filteredMessages.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const latestMessage = sortedMessages.length > 0 ? sortedMessages[0] : null;

    if (latestMessage) {
      if (receiver === userId) {
        // Display the latest message only for the active user
        return (
          <div className="MessagePreviewContainer">{latestMessage.chat}</div>
        );
      } else {
        // Display "Message Preview" and the number of messages received
        return (
          <div className="MessagePreviewContainer">
            {latestMessage.chat}
            <div className="MessageCount">{`${filteredMessages.length}`}</div>
          </div>
        );
      }
    } else {
      // Display "No Message" if there are no messages
      return <div className="MessagePreviewContainer">No Message</div>;
    }
  };

  const getLatestMessageTimestamp = (userId: number) => {
    const userMessages = receivedMessages.filter(
      (message) =>
        (message.sender === userId && message.receiver === senderUserID) ||
        (message.sender === senderUserID && message.receiver === userId)
    );

    const sortedMessages = userMessages.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const latestMessage = sortedMessages.length > 0 ? sortedMessages[0] : null;

    return latestMessage ? new Date(latestMessage.timestamp).getTime() : 0;
  };

  return (
    <>
      <div className="ChatBoxContainer">
        <div className="UsersContainer">
          {senderUserID && (
            <>
              {Array.from({ length: 3 }, (_, index) => index + 1)
                .filter((userId) => userId !== senderUserID)
                .sort((a, b) => {
                  const latestMessageA = getLatestMessageTimestamp(a);
                  const latestMessageB = getLatestMessageTimestamp(b);
                  return latestMessageB - latestMessageA;
                })
                .map((userId) => (
                  <div
                    key={userId}
                    className={`User ${
                      receiver === userId ? "ActiveUser" : ""
                    }`}
                    onClick={() => handleReceiver(userId)}
                  >
                    User {userId}
                    {getLatestMessagePreview(userId)}
                  </div>
                ))}
            </>
          )}
        </div>

        <div className="ChatContainer">
          <div className="Conversation">
            {receivedMessages
              .filter(
                (message) =>
                  (message.sender === senderUserID &&
                    message.receiver === receiver) ||
                  (message.sender === receiver &&
                    message.receiver === senderUserID)
              )
              .map((message, index) => (
                <div
                  key={index}
                  className={`MessageContainer ${
                    message.sender === senderUserID ? "SentMessage" : ""
                  } ${
                    message.receiver === senderUserID ? "ReceivedMessage" : ""
                  }`}
                >
                  <p className="Timestamp">
                    {formatTime(new Date(message.timestamp))}
                  </p>
                  <p className="Chat">{message.chat}</p>
                </div>
              ))}
          </div>
          {receiver && (
            <div className="ChatField">
              <input
                className="ChatText"
                type="text"
                placeholder="Type..."
                value={chat}
                onChange={(e) => setChat(e.target.value)}
              />
              <button className="SendButton" onClick={() => handleSend()}>
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
