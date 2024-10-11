import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { RiRobot2Line, RiSendPlane2Fill } from "react-icons/ri";
import coupong_chat from "../assets/images/coupong_chat.svg";
import chat from "../assets/images/chat.svg";
import { DOMAIN } from "../common/common";
import axios from "axios";
import styles from '../css/chatroom.module.css';
import { PiChatDuotone, PiChatSlashDuotone } from "react-icons/pi";

const ChatRoom = forwardRef(({ username }, ref) => {
  const stompClient = useRef(null);
  const [totalUser, setTotalUser] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [inputCnt, setInputCnt] = useState(0);
  const [userCnt, setUserCnt] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userListVisible, setUserListVisible] = useState(false);

  const SOCKET_DOMAIN = `${DOMAIN}/chat`;
  const messagesEndRef = useRef(null);
  const max_length = 200;

  const closeModal = () => {
    setModalVisible(false);
    setUserListVisible(false);
    setErrorMessage('');
  };

  useImperativeHandle(ref, () => ({
    handleExit,
    handleEnter,
  }));

  const sendMessage = () => {
    const body = {
      writer: username,
      message: inputMessage,
      createdDate: ""
    };

    if (!inputMessage || inputMessage.trim().length === 0) {
      setErrorMessage("메시지를 입력해주세요.");
      setModalVisible(true);
      setInputMessage('');
      setInputCnt(0);
      return;
    }

    if (stompClient.current && stompClient.current.connected && inputMessage.trim().length > 0) {
      axios.post(`${DOMAIN}/api/v1/filtering`, {
        message: body.message
      })
        .then(response => {
          if (response.data === "fail") { // 금칙어가 포함된 상태
            setErrorMessage("금칙어가 포함되어 있습니다.");
            setModalVisible(true);
            setInputMessage('');
            setInputCnt(0);
            return;
          }
          stompClient.current.publish({
            destination: "/pub/messages",
            body: JSON.stringify(body),
          });
          setInputMessage('');
          setInputCnt(0);
        })
        .catch(error => {
          console.error("Error:", error);
        });
    }
  };

  const activeSend = (e) => {
    if (e.key === 'Enter' && e.nativeEvent.isComposing === false && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }

    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      setInputMessage(prev => prev + '\n');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= max_length) {
      setInputMessage(value);
      setInputCnt(value.length);
    }
  };

  const handleEnter = () => {
    if (stompClient.current && stompClient.current.connected && username) {
      const body = {
        writer: username,
        message: "",
        createdDate: ""
      };
      stompClient.current.publish({
        destination: "/pub/enter",
        body: JSON.stringify(body),
      });
    }
  };

  const handleExit = () => {
    if (stompClient.current && stompClient.current.connected) {
      const body = {
        writer: username,
        message: "",
        createdDate: ""
      };
      stompClient.current.publish({
        destination: "/pub/exit",
        body: JSON.stringify(body),
      });
      stompClient.current.deactivate();
    }
  };

  useEffect(() => {
    if (!username) return;
    const client = new Client({
      webSocketFactory: () => new SockJS(SOCKET_DOMAIN),
      reconnectDelay: 5000, // 자동 연결
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      // debug: (str) => {
      // console.log(str);
      // },
      onConnect: () => {

        client.subscribe("/sub/chat", (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          // console.log("Received message:", message.body);
        });

        client.subscribe("/sub/users", (messageCount) => {
          const count = parseInt(messageCount.body, 10);
          setUserCnt(count);
        });

        client.subscribe("/sub/total", (users) => {
          const receivedData = JSON.parse(users.body); // 사용자 목록 
          setTotalUser(receivedData);
        });

        handleEnter();

      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers['message']);
        console.error("Additional details: " + frame.body);
      },
      onWebSocketError: (event) => {
        console.error("WebSocket error:", event);
      },
      onDisconnect: () => {
        console.log("Disconnected from STOMP server.");
      },
    });

    stompClient.current = client;
    client.activate();

    window.addEventListener('beforeunload', handleExit);

    return () => {
      window.removeEventListener('beforeunload', handleExit);
      client.deactivate();
    };
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((modalVisible || userListVisible) && e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalVisible, userListVisible]);

  const displayNames = () => {
    return Object.keys(totalUser)
      .filter((key) => totalUser[key])
      .map((name, index) => (
        <span key={index} className={styles.userName}>
          {name}
        </span>
      ));
  };

  return (
    <div>
      <div className={styles.chatHeaderContainer}>
        <img src={chat} alt="chat icon" style={{ marginLeft: "10px" }} />
        <img src={coupong_chat} alt="chat header" style={{ marginLeft: "10px" }} />
      </div>
      <div className={styles.chatContainer}>
        <div className={styles.chatMessages}>
          {messages.map((item, index) => (
            <div
              key={index}
              className={`${styles.chatMessage} ${item.writer === username ? styles.myMessage :
                item.writer === '입장' || item.writer === '퇴장' ? styles.notifyMessage : styles.otherMessage}`}>
              <div className={styles.mesageContent}>
                {item.writer !== '입장' && item.writer !== '퇴장' &&
                  <span className={styles.messageName}>{item.writer}</span>}
                {item.writer === '입장' &&
                  <span className={styles.messageText}><PiChatDuotone style={{ marginRight: '3px', verticalAlign: 'middle', fontSize: '1.2em' }} />{item.message}</span>}
                {item.writer === '퇴장' &&
                  <span className={styles.messageText}><PiChatSlashDuotone style={{ marginRight: '3px', verticalAlign: 'middle', fontSize: '1.2em' }} />{item.message}</span>}
                {item.writer !== '입장' && item.writer !== '퇴장' &&
                  <span className={styles.messageText}>{item.message}</span>}
                <span className={styles.messageTime}>{item.createdDate}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.info}>
          <span
            className={styles.userCount}
            onClick={() => setUserListVisible(true)}
            style={{ cursor: 'pointer' }}
          >
            {userCnt}명의 참여자
          </span>
          <span className={styles.messageLength}>글자 수 : {inputCnt}/{max_length}</span>
        </div>

        <div className={styles.chatInputWrapper}>
          <div className={styles.cleanBotNotice}>
            <RiRobot2Line style={{ marginRight: '8px' }} />
            <span>클린봇이 감지하고 있습니다</span>
          </div>
          <textarea
            placeholder='채팅을 입력하세요.'
            className={styles.chatInputContainer}
            maxLength={max_length}
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={activeSend}
            disabled={modalVisible}
          />
          <button
            className={styles.chatInputButton}
            onClick={sendMessage}
            disabled={modalVisible}
          >
            <RiSendPlane2Fill />
          </button>
        </div>

        {modalVisible && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <span className={styles.modalClose} onClick={closeModal}>&times;</span>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {userListVisible && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <span className={styles.modalClose} onClick={closeModal}>&times;</span>
              <h3>참여자 목록</h3>
              <div className={styles.userList}>
                {displayNames()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
export default ChatRoom;
