function updateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    const scores = JSON.parse(localStorage.getItem('scores') || '[]');
    
    // 定义奖牌图标
    const medals = {
        0: '🥇',
        1: '🥈',
        2: '🥉'
    };
    
    leaderboardList.innerHTML = scores
        .slice(0, 3) // 只取前三名
        .map((score, index) => {
            const date = new Date(score.date).toLocaleDateString();
            return `
                <div class="leaderboard-item">
                    <span>${medals[index]} ${score.score}分</span>
                    <span>${date}</span>
                </div>
            `;
        })
        .join('');
    
    // 如果没有记录，显示提示信息
    if (scores.length === 0) {
        leaderboardList.innerHTML = `
            <div class="leaderboard-empty">
                <p>还没有游戏记录</p>
                <p>开始游戏创造记录吧！</p>
            </div>
        `;
    }
}

// 初始化排行榜
updateLeaderboard(); 