import React, { useState, useEffect } from 'react';
import trophy from './trophy.svg';
import Winner from './Winner.svg';

// 카테고리 상수화
const CATEGORIES = ['CHICKEN', 'COFFEE', 'PIZZA'];

const LeaderboardScreen = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [message, setMessage] = useState('');
  const [eventSource, setEventSource] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = () => {
      fetch(`http://localhost:8080/sse/leaderboard?couponCategory=${selectedCategory}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then((data) => {
          const winnersArray = data[selectedCategory] || [];
          setLeaderboard(winnersArray);
          setMessage(winnersArray.length === 0 ? '아직 당첨자가 없습니다.' : '');
        })
        .catch((error) => {
          console.error('Error fetching leaderboard:', error);
          setLeaderboard([]);
          setMessage('아직 당첨자가 없습니다.');
        });
    };
    console.log('useEffect triggered on page reload or category change, selectedCategory:', selectedCategory);
    
    const newEventSource = new EventSource(`http://localhost:8080/sse/leaderboard/stream?couponCategory=${selectedCategory}`, { withCredentials: true });
    console.log('EventSource created:', newEventSource);
    setEventSource(newEventSource);

    newEventSource.onopen = () => {
        console.log('EventSource connection opened, readyState:', newEventSource.readyState);
      };


    newEventSource.onmessage = (event) => {
        console.log('Received message:', event.data);
        try {
          const jsonData = JSON.parse(event.data);
          console.log('Parsed JSON data:', jsonData);
      
          // 카테고리 체크 추가
          if (jsonData.couponCategory === selectedCategory) {
            const winnersArray = jsonData.winners || [];
            
            // winnersArray에서 빈 문자열을 필터링
            const validWinners = winnersArray.filter(winner => winner.trim() !== '');
            
            if (validWinners.length === 0) {
              setMessage('아직 당첨자가 없습니다.');
              setLeaderboard([]); // 빈 배열로 리더보드 초기화
            } else {
              setLeaderboard(validWinners);
              setMessage('');
            }
          }
        } catch (error) {
          console.error('Failed to parse JSON:', error);
        }
      };

    newEventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      setMessage('리더보드 업데이트를 받을 수 없습니다.');

      // SSE 연결 실패 시 재연결 시도
      setTimeout(() => {
        console.log('Reconnecting SSE...');
        const reconnectEventSource = new EventSource(`http://localhost:8080/sse/leaderboard/stream?couponCategory=${selectedCategory}`, { withCredentials: true });
        setEventSource(reconnectEventSource);
      }, 5000);
    };

    // 초기 데이터 로딩
    fetchLeaderboard();

    return () => {
      newEventSource.close(); 
      console.log('EventSource closed');
    };
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    if (eventSource) {
      eventSource.close(); // 이전 SSE 연결 종료
    }
  };

  return (
    <div style={containerStyle}>
      <div style={titleContainerStyle}>
        <img src={trophy} alt="Winner Icon" style={logo} />
        <img src={Winner} alt="Winner" style={logo} />
      </div>

      <div style={formcontrol}>
        <label htmlFor="category-select">카테고리 선택</label>
        <select id="category-select" value={selectedCategory} onChange={handleCategoryChange}>
          {CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div style={scrollContainerStyle}>
        <ul style={listStyle}>
          {leaderboard.map((item, index) => (
            <li key={index} style={listItemStyle}>
              <span style={textStyle}>
                축하합니다! 
                <br /> {item} 님께서 {selectedCategory} 응모에 
                <br /> 당첨되셨습니다!
              </span>
            </li>
          ))}
        </ul>
        {message && (
          <div style={{ textAlign: 'center', marginTop: '20px', color: '#000000' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

// 인라인 스타일링
const formcontrol = {
  width: '250px',
  margin: '20px 10px 20px 15px',
};

const containerStyle = {
  backgroundColor: '#FFFFFF',
  width: '25%',
  height: '100%',
  borderRight: '2px solid #d9d9d9',
  padding: '0px',
};

const titleContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'left',
  backgroundColor: '#377fee',
  borderRadius: '0px 0px 10px 10px',
  height: '7%',
  width: '100%',
};

const scrollContainerStyle = {
  width: '100%',
  height: 'calc(100% - 150px)', 
  overflowY: 'auto',
  margin: '0px 10px 20px 15px',
};

const listStyle = {
  padding: 0,
  width: '250px',
  margin: 0,
};

const logo = {
  marginLeft: '10px',
};

const listItemStyle = {
  backgroundColor: '#f5f5f5',
  borderRadius: '20px',
  padding: '10px',
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const textStyle = {
  color: '#333',
  fontSize: '16px',
};

export default LeaderboardScreen;
