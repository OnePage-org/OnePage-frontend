import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from "@stomp/stompjs";
import { RiRobot2Line } from "react-icons/ri";
import { TbMessageDots } from "react-icons/tb";
import { RiSendPlane2Fill } from "react-icons/ri";
import { DOMAIN } from "../common/common";
import axios from "axios";
import style from "../css/chatroom.module.css"

import './style.css';
import { getCookie } from '../common/Cookie';

const ChatRoom = forwardRef (({ username }, ref ) => {
  const stompClient = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [inputCnt, setInputCnt] = useState(0);
  const [userCnt, setUserCnt] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const SOCKET_DOMAIN = `${DOMAIN}/chat`;
  const messagesEndRef = useRef(null);
  const max_length = 200;

  // 모달 닫기 함수
  const closeModal = () => {
    setModalVisible(false);
    setErrorMessage('');
  };


  useImperativeHandle(ref, () => ({
    handleExit,
  }));
  
  // 메시지 전송
  const sendMessage = () => {
    const body = {
      writer: username,
      message: inputMessage,
      createdDate: ""
    };

    if (inputMessage === null || inputMessage.trim().length === 0) {
      setErrorMessage("메시지를 입력해주세요.");
      setModalVisible(true);
      return;
    }

    if (stompClient.current && inputMessage && inputMessage.trim().length > 0) {
      axios.post(`${DOMAIN}/api/v1/filtering`, {
        message: body.message
      })
        .then(response => {
          if (response.data === "fail") { /* 금칙어가 포함된 상태 */
            setErrorMessage("금칙어가 포함되어 있습니다.");
            setModalVisible(true);
            return;
          }
          stompClient.current.send("/pub/messages", {}, JSON.stringify(body));
          setInputMessage('');
          setInputCnt(0);
        })
        .catch(error => {
          console.error("Error:", error);
        });
    }
  };

  const activeSend = (e) => { // Enter로 메시지 전송
    if (e.key === 'Enter' && e.nativeEvent.isComposing === false && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }

    if (e.key === 'Enter' && e.shiftKey) { // 줄바꿈 가능하도록 
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

  useEffect(() => { // 모달창 ESC로 닫기
    const handleKeyDown = (e) => {
      if (modalVisible && (e.key === 'Escape')) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalVisible]);




  return (
    <div className={style.container}>
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
            disabled={modalVisible}
          />
          <button
            className="chat-input-button"
            onClick={sendMessage}
          >
            <RiSendPlane2Fill />
          </button>
        </div>
        {modalVisible && (
          <div className="modal">
            <div className="modal-content">
              <span className="modal-close" onClick={closeModal}>&times;</span>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
)
export default ChatRoom;
