"use client";

import React, { useState, useEffect, useRef } from 'react';

const TOPIC_CATEGORIES = {
  "プライベート": [
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
  ],
  "仕事": [
    "最近仕事で面白かった発見は？",
    "入社した頃の自分に一つだけアドバイスするなら？",
    "もし今の仕事をしていなかったら、どんな職業に就いていたと思う？",
    "仕事でいちばんテンションが上がる瞬間は？",
    "最近新しく覚えたスキルや知識は？",
    "チームメンバーの意外な一面を発見したエピソードは？",
    "「これは自分の隠れた才能かも？」と思う業務は？",
    "仕事中に欠かせない飲み物やおやつは？",
    "リモートワーク（またはオフィスワーク）の好きなところは？",
    "もし自分が会社の新しい制度を作るなら、どんな制度にする？",
    "最近感謝したいチームのメンバーとその理由は？",
    "過去の仕事で一番「焦った！」瞬間は？（今だから言える話）",
    "仕事のやる気を出すためのマイルーティンは？",
    "これから仕事で挑戦してみたい領域は？",
    "今のチームのここが好き！というポイントは？",
  ]
};

type CategoryType = "すべて" | "プライベート" | "仕事";

const INITIAL_MEMBERS = [
  "山田 太郎",
  "佐藤 花子",
  "鈴木 一郎",
  "高橋 美咲",
  "田中 健太",
  "伊藤 さくら"
];

type DrawnItem = {
  member: string;
  topic: string;
};

export default function Home() {
  const [membersText, setMembersText] = useState<string>(INITIAL_MEMBERS.join('\n'));
  const [drawnList, setDrawnList] = useState<DrawnItem[]>([]);
  const [currentItem, setCurrentItem] = useState<DrawnItem | null>(null);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("すべて");

  // Timer states
  const [timerDuration, setTimerDuration] = useState<number>(60); // in seconds
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const membersList = membersText.split('\n').map(m => m.trim()).filter(m => m !== '');

  const getTopicsByCategory = (category: CategoryType) => {
    if (category === "すべて") {
      return [...TOPIC_CATEGORIES["プライベート"], ...TOPIC_CATEGORIES["仕事"]];
    }
    return [...TOPIC_CATEGORIES[category]];
  };

  useEffect(() => {
    // Initialize topics based on category
    setAvailableTopics(shuffleArray(getTopicsByCategory(selectedCategory)));
  }, [selectedCategory]);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Optional: Play sound or visual alert when time is up
      if (currentItem) {
        alert("時間が終了しました！");
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeRemaining, isTimerRunning, currentItem]);

  const shuffleArray = (array: string[]) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeRemaining(timerDuration);
  };

  const toggleTimer = () => {
    if (timeRemaining > 0) {
      setIsTimerRunning(!isTimerRunning);
    }
  };

  const startDrawProcess = (resultMember: string, resultTopic: string) => {
    setTimeout(() => {
      const newItem = { member: resultMember, topic: resultTopic };
      setCurrentItem(newItem);
      setDrawnList(prev => [...prev, newItem]);
      setIsDrawing(false);
      
      // Auto-start timer when new topic is drawn
      setTimeRemaining(timerDuration);
      setIsTimerRunning(true);
    }, 400); // Wait for animation
  };

  const drawRandom = () => {
    if (isDrawing || membersList.length === 0) return;

    // Remaining members based on current input and drawnList
    const drawnMembers = drawnList.map((d) => d.member);
    const remainingMembers = membersList.filter((m) => !drawnMembers.includes(m));

    if (remainingMembers.length === 0) {
      alert("全員引き終わりました！");
      return;
    }

    setIsDrawing(true);
    setCurrentItem(null);
    setIsTimerRunning(false);

    // Get random member
    const randomIdx = Math.floor(Math.random() * remainingMembers.length);
    const resultMember = remainingMembers[randomIdx];

    // Get topic (replenish if empty)
    let currentTopics = [...availableTopics];
    if (currentTopics.length === 0) {
      currentTopics = shuffleArray(getTopicsByCategory(selectedCategory));
    }
    const resultTopic = currentTopics.pop() || "自由に自己紹介してください！";
    setAvailableTopics(currentTopics);

    startDrawProcess(resultMember, resultTopic);
  };

  const handleReset = () => {
    if (confirm("本当にリセットしますか？")) {
      setDrawnList([]);
      setCurrentItem(null);
      setIsTimerRunning(false);
      setAvailableTopics(shuffleArray(getTopicsByCategory(selectedCategory)));
    }
  };

  const handleManualDraw = (member: string) => {
    if (isDrawing || drawnList.some((d) => d.member === member)) return;

    setIsDrawing(true);
    setCurrentItem(null);
    setIsTimerRunning(false);

    let currentTopics = [...availableTopics];
    if (currentTopics.length === 0) {
      currentTopics = shuffleArray(getTopicsByCategory(selectedCategory));
    }
    const resultTopic = currentTopics.pop() || "自由に自己紹介してください！";
    setAvailableTopics(currentTopics);

    startDrawProcess(member, resultTopic);
  };

  const remainingCount = membersList.length - drawnList.length;
  
  // Format MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
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
            <div className="top-controls" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div className="control-group" style={{ flex: '1 1 300px' }}>
                <label htmlFor="membersInput">参加メンバー (1行に1名)</label>
                <textarea 
                  id="membersInput"
                  value={membersText}
                  onChange={(e) => setMembersText(e.target.value)}
                  className="input-field"
                  rows={4}
                  style={{ resize: 'vertical', width: '100%', minHeight: '80px' }}
                  placeholder="山田 太郎&#10;佐藤 花子"
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="control-group" style={{ width: '150px' }}>
                  <label htmlFor="timerSettings">持ち時間 (秒)</label>
                  <input 
                    id="timerSettings"
                    type="number"
                    min="10"
                    max="600"
                    step="10"
                    value={timerDuration}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 60;
                      setTimerDuration(val);
                      if (!isTimerRunning) setTimeRemaining(val);
                    }}
                    className="input-field"
                  />
                </div>
                
                <div className="control-group" style={{ width: '150px' }}>
                  <label htmlFor="categorySelect">方向性 (テーマ)</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      id="categorySelect"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as CategoryType)}
                      className="input-field"
                      style={{ width: '100%', appearance: 'none', cursor: 'pointer' }}
                    >
                      <option value="すべて">すべて (共通)</option>
                      <option value="仕事">仕事の話題</option>
                      <option value="プライベート">プライベート</option>
                    </select>
                    <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      ▼
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="btn-secondary" onClick={handleReset} style={{ marginTop: '1.5rem', alignSelf: 'flex-end' }}>
                全てリセット
              </button>
            </div>
          </section>

          <section className="card glass-panel animate-fade-in" style={{ animationDelay: "0.2s", flex: 1, position: 'relative' }}>
            
            {/* Timer Display over Result block */}
            {currentItem && (
              <div style={{ 
                position: 'absolute', top: '1rem', right: '1.5rem', 
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1rem', borderRadius: '12px',
                border: `1px solid ${timeRemaining <= 10 ? 'var(--secondary-color)' : 'var(--glass-border)'}`,
                boxShadow: timeRemaining <= 10 ? '0 0 15px rgba(236, 72, 153, 0.4)' : 'none',
                transition: 'all 0.3s'
              }}>
                <div style={{ 
                  fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-geist-mono), monospace',
                  color: timeRemaining <= 10 ? 'var(--secondary-color)' : 'var(--text-light)'
                }}>
                  {formatTime(timeRemaining)}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button onClick={toggleTimer} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                    {isTimerRunning ? "一時停止" : timeRemaining === 0 ? "終了" : "再開"}
                  </button>
                  <button onClick={resetTimer} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                    リセット
                  </button>
                </div>
              </div>
            )}

            <div className="result-display" style={{ paddingTop: currentItem ? '4rem' : '3rem' }}>
              {currentItem ? (
                <div key={currentItem.member} className="animate-pop-in">
                  <div className="result-number text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                    {currentItem.member} <span style={{ fontSize: '1.5rem', color: 'var(--text-light)' }}>さん</span>
                  </div>
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
                disabled={isDrawing || remainingCount <= 0 || membersList.length === 0}
                style={{ fontSize: '1.25rem', padding: '16px 32px' }}
              >
                ランダムに引く！
              </button>
            </div>
          </section>

          <section className="card glass-panel animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h2 className="card-title">メンバー状況 ({drawnList.length}/{membersList.length})</h2>
            <div className="grid-numbers" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
              {membersList.map((member, index) => {
                const isDrawn = drawnList.some((d) => d.member === member);
                const isActive = currentItem?.member === member;
                let btnClass = "number-chip";
                if (isActive) btnClass += " active animate-pop-in";
                else if (isDrawn) btnClass += " used";

                return (
                  <div 
                    key={`${index}-${member}`} 
                    className={btnClass}
                    onClick={() => !isDrawn && handleManualDraw(member)}
                    title={member}
                    style={{ padding: '1rem', fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {member}
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
