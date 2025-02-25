# 优雅贪吃蛇游戏

一个简洁优雅的贪吃蛇网页游戏，具有现代化的界面设计和丰富的游戏功能。

## 主要特性

### 基础功能
- 纯HTML/CSS/JavaScript实现，无需安装，打开网页即可游玩
- 响应式设计，适配不同屏幕尺寸
- 美观的界面设计，包含页眉和页脚

### 游戏控制
- 使用方向键或WASD控制蛇的移动
- 空格键控制游戏暂停/继续
- 长按方向键可以1.5倍速移动
- 可通过滑块调节蛇的移动速度

### 游戏机制
- 彩色食物系统：食物随机呈现不同颜色
- 变色蛇身：蛇吃到不同颜色的食物后，身体会相应变色
- 加速机制：长按方向键可以临时提升移动速度
- 实时分数显示
- 最高分记录系统

### 排行榜系统
- 记录前三名最高分
- 显示金、银、铜奖牌图标
- 自动记录得分时间
- 本地存储保证数据持久化

### 视觉设计
- 半透明游戏遮罩层
- 网格化游戏背景
- 流畅的动画效果
- 现代简约的界面风格

## 技术特点
- 模块化的代码结构
- 本地存储实现数据持久化
- 优雅的错误处理
- 清晰的代码注释

## 使用方法
1. 打开index.html文件
2. 点击"开始游戏"按钮
3. 使用方向键或WASD控制蛇的移动
4. 使用空格键暂停/继续游戏
5. 通过滑块调节游戏速度

## 文件结构
```
snake-game/
├── index.html          # 游戏主页面
├── README.md           # 项目说明文档
├── styles/
│   └── style.css      # 样式文件
├── scripts/
│   ├── game.js        # 游戏核心逻辑
│   └── leaderboard.js # 排行榜逻辑
└── assets/
    └── favicon.svg    # 网站图标
```