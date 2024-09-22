import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from "@stomp/stompjs";
import { RiRobot2Line } from "react-icons/ri";
import { TbMessageDots } from "react-icons/tb";
import { RiSendPlane2Fill } from "react-icons/ri";
import { DOMAIN } from "../common/common";
import axios from "axios";

import './style.css';

const ChatRoom = ({ username }) => {
  const stompClient = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [inputCnt, setInputCnt] = useState(0);
  const [userCnt, setUserCnt] = useState(0);
  const SOCKET_DOMAIN = `${DOMAIN}/chat`;
  const messagesEndRef = useRef(null);
  const max_length = 200;

  // 메시지 전송
  const sendMessage = () => {
    const body = {
      writer: username,
      message: inputMessage,
      createdDate: ""
    };

    if (inputMessage === null || inputMessage.trim().length === 0) {
      /* 에러 */
      axios.post(`${DOMAIN}/api/v1/filtering`, {
        status: "error",
        data: body,
        message: "no data chatMessage"
      })
        .then(response => {
          console.log("Response:", response.data);
        })
        .catch(error => {
          console.error("Error:", error);
        });
    }

    if (inputMessage.length > 200) {
      /* 에러 */
      axios.post(`${DOMAIN}/api/v1/filtering`, {
        status: "error",
        data: body,
        message: "too long chatMessage data"
      })
        .then(response => {
          console.log("Response:", response.data);
        })
        .catch(error => {
          console.error("Error:", error);
        });
    }

    if (stompClient.current && inputMessage && inputMessage.trim().length > 0) {
      stompClient.current.send("/pub/messages", {}, JSON.stringify(body));

      /* 성공 */
      axios.post(`${DOMAIN}/api/v1/filtering`, {
        status: "success",
        data: body,
        message: null
      })
        .then(response => {
          console.log("Response:", response.data);
        })
        .catch(error => {
          console.error("Error:", error);
        });

      setInputMessage('');
      setInputCnt(0);
    }
  };

  const activeSend = (e) => {
    if (e.key === 'Enter' && e.nativeEvent.isComposing === false && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }

    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      setInputMessage(inputMessage + '\n');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= max_length) {
      setInputMessage(value);
      setInputCnt(value.length);
    }
  };

  // 입장
  const handleEnter = () => {
    if (stompClient.current && username) {
      const body = {
        writer: username,
        message: "",
        createdDate: ""
      };
      stompClient.current.send("/pub/enter", {}, JSON.stringify(body));
    }
  };

  // 퇴장
  const handleExit = () => {
    const body = {
      writer: username,
      message: "",
      createdDate: ""
    };
    stompClient.current.send("/pub/exit", {}, JSON.stringify(body));
    disconnect();
  };

  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.disconnect(() => {
        console.log("Disconnected");
      });
    }
  };

  useEffect(() => {
    if (!username) return;

    const socket = new SockJS(SOCKET_DOMAIN);
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect({}, (frame) => {
      console.log('Connected: ' + frame);

      stompClient.current.subscribe("/sub/chat", (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        console.log(message.body);
      });

      handleEnter();

      stompClient.current.subscribe("/sub/users", (messageCount) => {
        const count = parseInt(messageCount.body);
        setUserCnt(count);
      });
    }, (error) => {
      console.error("STOMP connection error:", error);
    });

    window.addEventListener('beforeunload', handleExit);

    return () => {
      window.removeEventListener('beforeunload', handleExit);
      disconnect();
    };
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
      <div className='chat-header'>
      </div>

      <div className='chat-container'>
        <div className='chat-messages'>
          {messages.map((item, index) => (
            <div
              key={index}
              className={`chat-message ${item.writer === username ? 'my-message' :
                item.writer === '알림' ? 'notify-message' : 'other-message'}`}>

              <div className='message-content'>
                <span className='message-name'>{item.writer}</span>
                <span className='message-text'>{item.message}</span>
                <span className='message-time'>{item.createdDate}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className='info'>
          <span className='user-count'> {userCnt}명의 참여자 </span>
          <span className='message-length'>글자 수 : {inputCnt}/{max_length}</span>
        </div>
        <div className="chat-input-wrapper">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <RiRobot2Line style={{ marginRight: '8px' }} />
            <span>클린봇이 감지하고 있습니다</span>
          </div>
          <textarea
            placeholder='채팅을 입력하세요.'
            className="chat-input-container"
            maxLength={max_length}
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={(e) => activeSend(e)}
          />
          <button
            className="chat-input-button"
            onClick={sendMessage}
          >
            <RiSendPlane2Fill />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ChatRoom;
