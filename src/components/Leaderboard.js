import React, { useState, useEffect } from "react";
import ConfettiExplosion from "react-confetti-explosion"; // 폭죽 효과 import
import { DOMAIN } from "../common/common";
import trophy from "../assets/images/trophy.svg";
import Winner from "../assets/images/Winner.svg"
import styles from '../css/leaderboard.module.css'; // CSS 모듈 import
import chicken from "../assets/logos/bhcChicken.jpeg";
import pizza from "../assets/logos/dominosPizza.jpg";
import coffee from "../assets/logos/banapresso.png";
import hamburger from "../assets/logos/burgerKing.png"
import goldTrophy from "../assets/images/gold-trophy.png";
import silverTrophy from "../assets/images/silver-trophy.png";
import bronzeTrophy from "../assets/images/bronze-trophy.png";

const LeaderboardScreen = () => {
    const [categories, setCategories] = useState([]);
    const [leaderboards, setLeaderboards] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("");
    const [message, setMessage] = useState("");
    const [eventSource, setEventSource] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false); // 폭죽 효과 상태 추가

    // 카테고리 데이터 가져오기
    const fetchCategories = () => {
        fetch(`${DOMAIN}/api/categories`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then((data) => {
                setCategories(data);
                setSelectedCategory("ALL"); // 기본 카테고리 설정
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                setMessage("카테고리를 불러오는 데 문제가 발생했습니다.");
            });
    };

    // 리더보드 데이터 가져오기
    const fetchLeaderboard = () => {
        if (selectedCategory === "ALL") {
            const fetchPromises = categories.map(category =>
                fetch(`${DOMAIN}/sse/leaderboard?couponCategory=${category}`)
                    .then(response => {
                        if (!response.ok) throw new Error("Network response was not ok.");
                        return response.json();
                    })
                    .then(data => {
                        const winners = Object.entries(data[category] || {}).map(([userId, score]) => ({
                            userId: userId,
                            entryTime: new Date(score).toLocaleString()
                        })) || [];
                        return { category, winners };
                    })
                    .catch(error => {
                        console.error(`Error fetching leaderboard for category ${category}:`, error);
                        return { category, winners: [] };
                    })
            );

            Promise.all(fetchPromises)
                .then(results => {
                    const newLeaderboards = {};
                    results.forEach(({ category, winners }) => {
                        newLeaderboards[category] = winners;
                    });
                    setLeaderboards(newLeaderboards); // 리더보드 데이터 업데이트
                })
                .catch(error => {
                    console.error("Error fetching leaderboards:", error);
                    setMessage("리더보드를 불러오는 데 문제가 발생했습니다.");
                });
        } else {
            fetch(`${DOMAIN}/sse/leaderboard?couponCategory=${selectedCategory}`)
                .then(response => {
                    if (!response.ok) throw new Error("Network response was not ok.");
                    return response.json();
                })
                .then(data => {
                    const winnersArray = Object.entries(data[selectedCategory] || {}).map(([userId, score]) => ({
                        userId: userId,
                        entryTime: new Date(score).toLocaleString()
                    })) || [];
                    setLeaderboards({ [selectedCategory]: winnersArray }); // 특정 카테고리 리더보드 업데이트
                })
                .catch(error => {
                    console.error("Error fetching leaderboard:", error);
                    setLeaderboards({});
                    setMessage("아직 당첨자가 없습니다.");
                });
        }
    };

    useEffect(() => {
        fetchCategories(); // 컴포넌트 마운트 시 카테고리 데이터 가져오기
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchLeaderboard(); // 카테고리 변경 시 리더보드 데이터 가져오기
            createEventSource(); // SSE 연결 생성
        }

        return () => {
            if (eventSource) {
                eventSource.close(); // 컴포넌트 언마운트 시 SSE 연결 종료
                console.log("EventSource closed");
            }
        };
    }, [selectedCategory]);

    // SSE 연결 생성
    const createEventSource = () => {
        const source = new EventSource(`${DOMAIN}/sse/leaderboard/stream?couponCategory=${selectedCategory}`, { withCredentials: true });
        console.log("EventSource created:", source);
        setEventSource(source);

        source.onopen = () => {
            console.log("EventSource connection opened, readyState:", source.readyState);
            setMessage(""); // 연결 시 메시지 초기화
        };

        source.onmessage = (event) => {
            console.log("Received message:", event.data);
            if (event.data.trim() === '') {
                console.warn("Received an empty message");
                return;
            }
        
            try {
                const jsonData = JSON.parse(event.data);
                console.log("Parsed JSON data:", jsonData);
        
                if (!jsonData || !jsonData.couponCategory || !jsonData.winners) {
                    console.warn("Invalid data received:", jsonData);
                    return;
                }
        
                // 폭죽 효과를 위해 유저가 추가된 경우 확인
                const currentWinners = leaderboards[jsonData.couponCategory] || [];
                const newWinners = jsonData.winners || [];
        
                // 새로운 유저가 추가되었는지 확인
                if (newWinners.length > 0 && currentWinners.length !== newWinners.length) {
                    setShowConfetti(true); // 폭죽 효과 활성화
                    setTimeout(() => setShowConfetti(false), 3000); // 3초 후 폭죽 효과 종료
                }
        
                if (selectedCategory === "ALL") {
                    const { couponCategory, winners, entryTime } = jsonData;
                    const formattedWinners = (winners || []).map(winner => ({
                        userId: winner,
                        entryTime: new Date(entryTime).toLocaleString()
                    }));
                    setLeaderboards(prevLeaderboards => ({
                        ...prevLeaderboards,
                        [couponCategory]: formattedWinners
                    }));
                } else if (jsonData.couponCategory === selectedCategory) {
                    const winnersArray = (jsonData.winners || []).map(winner => ({
                        userId: winner,
                        entryTime: new Date(jsonData.entryTime).toLocaleString()
                    }));
                    setLeaderboards({ [selectedCategory]: winnersArray });
                }
            } catch (error) {
                console.error("Failed to parse JSON:", error);
            }
        };
        

        source.onerror = (error) => {
            console.error("EventSource failed:", error);
            setMessage("리더보드 업데이트를 받을 수 없습니다.");
            if (source.readyState === EventSource.CLOSED) {
                console.log("EventSource closed, attempting to reconnect...");
                setEventSource(null);
                setTimeout(createEventSource, 3000); // 재연결 시도
            }
        };
    };

    const handleCategoryChange = (event) => {
        if (eventSource) {
            eventSource.close(); // 카테고리 변경 시 기존 SSE 연결 종료
        }
        setSelectedCategory(event.target.value); // 선택한 카테고리 업데이트
    };

    // 이미지 매핑 객체 추가
    const categoryImages = {
        CHICKEN: chicken,
        HAMBURGER: hamburger,
        COFFEE: coffee,
        PIZZA: pizza
    };

    return (
        <div className={styles.leaderboardContainer}>
            {showConfetti && (
                <ConfettiExplosion
                    force={0.8} // 폭죽의 힘 조정
                    duration={3000} // 폭죽 지속 시간
                    particleCount={100} // 폭죽 입자 수
                />
            )}
            <div className={styles.titleContainer}>
                <img src={trophy} alt="Winner Icon" className={styles.logo} />
                <img src={Winner} alt="Winner" className={styles.logo} />
            </div>

            {/* <div className={styles.formControlContainer}>
                <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className={styles.select}
                >
                    <option value="ALL">ALL</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div> */}

            <div className={styles.scrollContainer}>
                <div className={styles.cardContainer}>
                    {selectedCategory === "ALL" ? (
                        Object.keys(leaderboards).map((category) => (
                            <div key={category} className={styles.categoryCard}>
                                <div className={styles.categoryHeader}>
                                    {categoryImages[category] && (
                                        <img src={categoryImages[category]} alt={`${category} 이미지`} className={styles.categoryImage} />
                                    )}
                                    <h2>{category}</h2>
                                </div>
                                <div className={styles.cardsContainer}>
                                    {(leaderboards[category] || []).length > 0 ? (
                                        leaderboards[category].map((winner, index) => (
                                            <div key={index} className={styles.winnerCard}>
                                                <h3>
                                                    {index === 0 && <img src={goldTrophy} alt="Gold Trophy" className={styles.trophyIcon} />}
                                                    {index === 1 && <img src={silverTrophy} alt="Silver Trophy" className={styles.trophyIcon} />}
                                                    {index === 2 && <img src={bronzeTrophy} alt="Bronze Trophy" className={styles.trophyIcon} />}
                                                    {winner.userId} 님
                                                </h3>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.winnerCard}>아직 당첨자가 없습니다.</div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.categoryCard}>
                            <div className={styles.categoryHeader}>
                                {categoryImages[selectedCategory] && (
                                    <img src={categoryImages[selectedCategory]} alt={`${selectedCategory} 이미지`} className={styles.categoryImage} />
                                )}
                                <h2>{selectedCategory}</h2>
                            </div>
                            <div className={styles.cardsContainer}>
                                {leaderboards[selectedCategory]?.length > 0 ? (
                                    leaderboards[selectedCategory].map((item, index) => (
                                        <div key={index} className={styles.winnerCard}>
                                            <h3>
                                                {index === 0 && <img src={goldTrophy} alt="Gold Trophy" className={styles.trophyIcon} />}
                                                {index === 1 && <img src={silverTrophy} alt="Silver Trophy" className={styles.trophyIcon} />}
                                                {index === 2 && <img src={bronzeTrophy} alt="Bronze Trophy" className={styles.trophyIcon} />}
                                                {item.userId} 님
                                            </h3>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.winnerCard}>아직 당첨자가 없습니다.</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {message && (
                    <div className={styles.message}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );

};

export default LeaderboardScreen;
