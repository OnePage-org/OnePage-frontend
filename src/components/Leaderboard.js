import React, { useState, useEffect } from "react";
import { DOMAIN } from "../common/common";
import trophy from "./trophy.svg";
import Winner from "./Winner.svg";
import styles from '../css/leaderboard.module.css'; // CSS 모듈 import

const LeaderboardScreen = () => {
    const [categories, setCategories] = useState([]); 
    const [leaderboards, setLeaderboards] = useState({}); 
    const [selectedCategory, setSelectedCategory] = useState("");
    const [message, setMessage] = useState("");
    const [eventSource, setEventSource] = useState(null);

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
                setSelectedCategory("ALL");
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                setMessage("카테고리를 불러오는 데 문제가 발생했습니다.");
            });
    };

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
                    setLeaderboards(newLeaderboards);
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
                    setLeaderboards({ [selectedCategory]: winnersArray });
                })
                .catch(error => {
                    console.error("Error fetching leaderboard:", error);
                    setLeaderboards({});
                    setMessage("아직 당첨자가 없습니다.");
                });
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchLeaderboard();
            createEventSource();
        }

        return () => {
            if (eventSource) {
                eventSource.close();
                console.log("EventSource closed");
            }
        };
    }, [selectedCategory]);

    const createEventSource = () => {
        const source = new EventSource(`${DOMAIN}/sse/leaderboard/stream?couponCategory=${selectedCategory}`, { withCredentials: true });
        console.log("EventSource created:", source);
        setEventSource(source);

        source.onopen = () => {
            console.log("EventSource connection opened, readyState:", source.readyState);
            setMessage("");
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
                setTimeout(createEventSource, 3000);
            }
        };
    };

    const handleCategoryChange = (event) => {
        if (eventSource) {
            eventSource.close();
        }
        setSelectedCategory(event.target.value);
    };

    return (
        <div className={styles.leaderboardContainer}>
            <div className={styles.titleContainer}>
                <img src={trophy} alt="Winner Icon" className={styles.logo} />
                <img src={Winner} alt="Winner" className={styles.logo} />
            </div>

            <div className={styles.formControlContainer}>
                <label htmlFor="category-select" className={styles.label}>카테고리 선택</label>
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
            </div>

            <div className={styles.scrollContainer}>
                <div className={styles.cardContainer}>
                    {selectedCategory === "ALL" ? (
                        Object.keys(leaderboards).map((category) => (
                            <div key={category} className={styles.categoryCard}>
                                <h2>{category}</h2>
                                <div className={styles.cardsContainer}>
                                    {(leaderboards[category] || []).length > 0 ? (
                                        leaderboards[category].map((winner, index) => (
                                            <div key={index} className={styles.winnerCard}>
                                                <h3>{winner.userId}</h3>
                                                <p>축하합니다! {winner.userId} 님께서 {category} 응모에 당첨되셨습니다!</p>
                                                <p>응모 시간: {winner.entryTime}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.winnerCard}>아직 당첨자가 없습니다.</div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        leaderboards[selectedCategory]?.length > 0 ? (
                            leaderboards[selectedCategory].map((item, index) => (
                                <div key={index} className={styles.winnerCard}>
                                    <h3>{item.userId}</h3>
                                    <p>축하합니다! {item.userId} 님께서 {selectedCategory} 응모에 당첨되셨습니다!</p>
                                    <p>응모 시간: {item.entryTime}</p>
                                </div>
                            ))
                        ) : (
                            <div className={styles.winnerCard}>아직 당첨자가 없습니다.</div>
                        )
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