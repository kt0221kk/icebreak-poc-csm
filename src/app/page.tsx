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

  const membersList = membersText.split('\n').map(m => m.trim()).filter(m => m !== '');

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
    if (isDrawing || membersList.length === 0) return;

    // Remaining members based on current input and drawnList
    const drawnMembers = drawnList.map((d) => d.member);
    const remainingMembers = membersList.filter((m) => !drawnMembers.includes(m));

    if (remainingMembers.length === 0) {
      alert("全員引き終わりました！");
      return;
    }

    setIsDrawing(true);
    setCurrentItem(null); // trigger fade animation again

    // Get random member
    const randomIdx = Math.floor(Math.random() * remainingMembers.length);
    const resultMember = remainingMembers[randomIdx];

    // Get topic (replenish if empty)
    let currentTopics = [...availableTopics];
    if (currentTopics.length === 0) {
      currentTopics = shuffleArray([...INITIAL_TOPICS]);
    }
    const resultTopic = currentTopics.pop() || "自由に自己紹介してください！";
    setAvailableTopics(currentTopics);

    setTimeout(() => {
      const newItem = { member: resultMember, topic: resultTopic };
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

  const handleManualDraw = (member: string) => {
    if (isDrawing || drawnList.some((d) => d.member === member)) return;

    setIsDrawing(true);
    setCurrentItem(null);

    let currentTopics = [...availableTopics];
    if (currentTopics.length === 0) {
      currentTopics = shuffleArray([...INITIAL_TOPICS]);
    }
    const resultTopic = currentTopics.pop() || "自由に自己紹介してください！";
    setAvailableTopics(currentTopics);

    setTimeout(() => {
      const newItem = { member: member, topic: resultTopic };
      setCurrentItem(newItem);
      setDrawnList([...drawnList, newItem]);
      setIsDrawing(false);
    }, 400);
  };

  const remainingCount = membersList.length - drawnList.length;

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
            <div className="top-controls" style={{ alignItems: 'flex-start' }}>
              <div className="control-group" style={{ flex: 1 }}>
                <label htmlFor="membersInput">参加メンバー (1行に1名)</label>
                <textarea 
                  id="membersInput"
                  value={membersText}
                  onChange={(e) => {
                    setMembersText(e.target.value);
                    // Handle case where a member is removed while selected
                  }}
                  className="input-field"
                  rows={4}
                  style={{ resize: 'vertical', width: '100%', minHeight: '100px' }}
                  placeholder="山田 太郎&#10;佐藤 花子"
                />
              </div>
              <button className="btn-secondary" onClick={handleReset} style={{ marginTop: '1.5rem' }}>
                リセット
              </button>
            </div>
          </section>

          <section className="card glass-panel animate-fade-in" style={{ animationDelay: "0.2s", flex: 1 }}>
            <div className="result-display">
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
