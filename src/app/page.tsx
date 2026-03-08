"use client";

import React, { useState, useEffect } from 'react';

const INITIAL_TOPICS = [
  "最近買ってよかったものは？",
  "今週末の予定は？",
  "最近見た映画やアニメは？",
  "100万円あったら何に使う？",
  "実は誰にも言っていない秘密は？",
  "好きな食べ物とその理由は？",
  "これまでで一番の失敗談は？",
  "最近ハマっている趣味は？",
  "生まれ変わるなら何になりたい？",
  "もし超能力が一つ使えるなら？",
  "学生時代の一番の思い出は？",
  "尊敬している人とその理由は？",
  "自分を動物に例えると？",
  "最近あったプチハッピーな出来事は？",
  "もし明日世界が終わるなら何をする？",
  "絶対に外せないストレス解消法は？",
  "子どもの頃の夢は何だった？",
  "旅行先で一番良かったところは？",
  "自分だけの小さなこだわりは？",
  "人生で一度はやってみたいことは？",
];

type DrawnItem = {
  cardNumber: number;
  topic: string;
};

export default function Home() {
  const [maxParticipants, setMaxParticipants] = useState<number>(20);
  const [drawnList, setDrawnList] = useState<DrawnItem[]>([]);
  const [currentItem, setCurrentItem] = useState<DrawnItem | null>(null);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    // Initialize topics
    setAvailableTopics(shuffleArray([...INITIAL_TOPICS]));
  }, []);

  const shuffleArray = (array: string[]) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const drawRandom = () => {
    if (isDrawing) return;

    // Remaining numbers based on maxParticipants
    const allNumbers = Array.from({ length: maxParticipants }, (_, i) => i + 1);
    const drawnNumbers = drawnList.map((d) => d.cardNumber);
    const remainingNumbers = allNumbers.filter((n) => !drawnNumbers.includes(n));

    if (remainingNumbers.length === 0) {
      alert("全員引き終わりました！");
      return;
    }

    setIsDrawing(true);
    setCurrentItem(null); // trigger fade animation again

    // Get random number
    const randomIdx = Math.floor(Math.random() * remainingNumbers.length);
    const resultNumber = remainingNumbers[randomIdx];

    // Get topic (replenish if empty)
    let currentTopics = [...availableTopics];
    if (currentTopics.length === 0) {
      currentTopics = shuffleArray([...INITIAL_TOPICS]);
    }
    const resultTopic = currentTopics.pop() || "自由に自己紹介してください！";
    setAvailableTopics(currentTopics);

    setTimeout(() => {
      const newItem = { cardNumber: resultNumber, topic: resultTopic };
      setCurrentItem(newItem);
      setDrawnList([...drawnList, newItem]);
      setIsDrawing(false);
    }, 400); // Wait for animation
  };

  const handleReset = () => {
    if (confirm("本当にリセットしますか？")) {
      setDrawnList([]);
      setCurrentItem(null);
      setAvailableTopics(shuffleArray([...INITIAL_TOPICS]));
    }
  };

  const handleManualDraw = (num: number) => {
    if (isDrawing || drawnList.some((d) => d.cardNumber === num)) return;

    setIsDrawing(true);
    setCurrentItem(null);

    let currentTopics = [...availableTopics];
    if (currentTopics.length === 0) {
      currentTopics = shuffleArray([...INITIAL_TOPICS]);
    }
    const resultTopic = currentTopics.pop() || "自由に自己紹介してください！";
    setAvailableTopics(currentTopics);

    setTimeout(() => {
      const newItem = { cardNumber: num, topic: resultTopic };
      setCurrentItem(newItem);
      setDrawnList([...drawnList, newItem]);
      setIsDrawing(false);
    }, 400);
  };

  return (
    <>
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      
      <main className="container">
        <header className="header text-center animate-fade-in">
          <h1 className="text-gradient">Icebreaker POC</h1>
          <p>会話出しシステムで、場を和ませよう！</p>
        </header>

        <div className="main-content">
          <section className="card glass-panel animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="top-controls">
              <div className="control-group">
                <label htmlFor="maxNumber">参加人数 (くじの数)</label>
                <input 
                  id="maxNumber"
                  type="number" 
                  min="1" 
                  max="100" 
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(Math.max(1, parseInt(e.target.value) || 1))}
                  className="input-field"
                  style={{ width: '150px' }}
                />
              </div>
              <button className="btn-secondary" onClick={handleReset}>
                リセット
              </button>
            </div>
          </section>

          <section className="card glass-panel animate-fade-in" style={{ animationDelay: "0.2s", flex: 1 }}>
            <div className="result-display">
              {currentItem ? (
                <div key={currentItem.cardNumber} className="animate-pop-in">
                  <div className="result-number text-gradient">{currentItem.cardNumber} 番</div>
                  <div className="result-topic">{currentItem.topic}</div>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <h2 className="result-topic" style={{ color: 'var(--text-dim)' }}>
                    {isDrawing ? "抽選中..." : "ボタンを押して次のトークテーマを引いてください"}
                  </h2>
                </div>
              )}
            </div>
            
            <div className="action-bar">
              <button 
                className="btn-primary" 
                onClick={drawRandom}
                disabled={isDrawing || drawnList.length >= maxParticipants}
                style={{ fontSize: '1.25rem', padding: '16px 32px' }}
              >
                ランダムに引く！
              </button>
            </div>
          </section>

          <section className="card glass-panel animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h2 className="card-title">くじの状況 ({drawnList.length}/{maxParticipants})</h2>
            <div className="grid-numbers">
              {Array.from({ length: maxParticipants }, (_, i) => i + 1).map((num) => {
                const isDrawn = drawnList.some((d) => d.cardNumber === num);
                const isActive = currentItem?.cardNumber === num;
                let btnClass = "number-chip";
                if (isActive) btnClass += " active animate-pop-in";
                else if (isDrawn) btnClass += " used";

                return (
                  <div 
                    key={num} 
                    className={btnClass}
                    onClick={() => !isDrawn && handleManualDraw(num)}
                  >
                    {num}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <footer className="footer animate-fade-in" style={{ animationDelay: "0.4s" }}>
          &copy; 2026 Icebreaker POC System. Hosted on Vercel.
        </footer>
      </main>
    </>
  );
}
