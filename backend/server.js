// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// 🔹 모든 요청 로깅 (어디까지 오는지 확인용)
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

// 서버 동작 확인용
app.get('/', (req, res) => {
  res.send('FC Bayern backend running...');
});

// 전체 사용자 조회
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, nickname, created_at FROM users');
    res.json(rows);
  } catch (err) {
    console.error('DB ERROR:', err);
    res.status(500).json({
      success: false,
      message: 'DB 조회 오류',
    });
  }
});

// ===================== 회원가입 ===================== //
app.post('/signup', async (req, res) => {
  try {
    console.log('📌 POST /signup body:', req.body);

    const { username, password, nickname } = req.body;

    if (!username || !password || !nickname) {
      return res.status(400).json({
        success: false,
        message: '모든 필드를 입력하세요.',
      });
    }

    // 같은 아이디 이미 있는지 확인
    const [exist] = await db.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );
    if (exist.length > 0) {
      return res.status(400).json({
        success: false,
        message: '이미 존재하는 아이디입니다.',
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (username, password, nickname) VALUES (?, ?, ?)',
      [username, hashed, nickname]
    );

    return res.status(201).json({
      success: true,
      message: '회원가입 완료',
    });

  } catch (err) {
    console.error('SIGNUP ERROR:', err);
    res.status(500).json({
      success: false,
      message: '서버 오류 (회원가입 처리 중)',
    });
  }
});

// ===================== 로그인 ===================== //
app.post('/login', async (req, res) => {
  try {
    console.log('📌 POST /login body:', req.body);

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '아이디와 비밀번호를 입력하세요.',
      });
    }

    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: '아이디 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '아이디 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    return res.json({
      success: true,
      message: '로그인 성공',
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
      },
    });

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({
      success: false,
      message: '서버 오류 (로그인 처리 중)',
    });
  }
});

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
