import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from "@stomp/stompjs";
import { TbMessageChatbot } from "react-icons/tb";
import { RiSendPlane2Fill } from "react-icons/ri";
import { getCookie } from "../common/Cookie";
import { DOMAIN } from "../common/common";

import './ChatRoomStyles.css';

const ChatRoom = ({ username }) => {
  const stompClient = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [inputCnt, setInputCnt] = useState(0);
  const [userCnt, setUserCnt] = useState(0);
  const SOCKET_DOMAIN = `${DOMAIN}/chat`;
  const messagesEndRef = useRef(null);
  const max_length = 200;

  const activeSend = (e) => {
    if (e.key === 'Enter' && e.nativeEvent.isComposing === false) sendMessage(); 
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

  // 메시지 전송
  const sendMessage = () => {
    if (stompClient.current && inputMessage) {
      const body = {
        writer: username,
        message: inputMessage,
        createdDate: ""
      };
      stompClient.current.send("/pub/messages", {}, JSON.stringify(body)); 
      setInputMessage('');
      setInputCnt(0);
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
        <h1>Coupong Chat <TbMessageChatbot /></h1>
        <div className='user-count'> {userCnt}명의 참여자 </div>
      </div>

      <div className='chat-container'>
        <div className='chat-messages'>
          {messages.map((item, index)=> (
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
        <div className='chat-input-container'>
          <div className='chat-input'>
            <input 
              maxLength={max_length}
              type='text'
              value={inputMessage}
              onChange={handleInputChange}
              onKeyDown={(e) => activeSend(e)}
            />
            <button onClick={sendMessage}> <RiSendPlane2Fill /> </button>
          </div>
          <div className='chat-input-footer'>
            <span className='message-length'>글자 수 : {inputCnt}/{max_length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
