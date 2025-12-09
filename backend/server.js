// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');        // MySQL 연결
const { Post, Comment } = require('./mongo'); // MongoDB 연결 + 모델

const app = express();

app.use(cors());
app.use(express.json());

// 모든 요청 로깅
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

// ================= 기본 =================
app.get('/', (req, res) => {
  res.send('FC Bayern backend running...');
});

// ================= MySQL: 유저 관련 =================

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

// 회원가입
app.post('/signup', async (req, res) => {
  try {
    console.log('POST /signup:', req.body);

    const { username, password, nickname } = req.body;

    if (!username || !password || !nickname) {
      return res.status(400).json({
        success: false,
        message: '모든 필드를 입력하세요.',
      });
    }

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

// 로그인
app.post('/login', async (req, res) => {
  try {
    console.log('POST /login:', req.body);

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

// ================= MongoDB: 커뮤니티 게시글 =================

// 게시글 목록 가져오기 (최신순)
app.get('/community/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    res.json({
      success: true,
      posts,
    });
  } catch (err) {
    console.error('GET /community/posts ERROR:', err);
    res.status(500).json({
      success: false,
      message: '게시글 목록 조회 중 오류',
    });
  }
});

// 게시글 하나 상세
app.get('/community/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    if (!post) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.',
      });
    }
    res.json({
      success: true,
      post,
    });
  } catch (err) {
    console.error('GET /community/posts/:id ERROR:', err);
    res.status(500).json({
      success: false,
      message: '게시글 조회 중 오류',
    });
  }
});

// 게시글 작성
app.post('/community/posts', async (req, res) => {
  try {
    console.log('POST /community/posts:', req.body);

    const { title, content, authorId, authorNickname } = req.body;

    if (!title || !content || !authorId || !authorNickname) {
      return res.status(400).json({
        success: false,
        message: '제목, 내용, 작성자 정보가 필요합니다.',
      });
    }

    const newPost = await Post.create({
      title,
      content,
      authorId,
      authorNickname,
    });

    res.status(201).json({
      success: true,
      message: '게시글이 등록되었습니다.',
      post: newPost,
    });
  } catch (err) {
    console.error('POST /community/posts ERROR:', err);
    res.status(500).json({
      success: false,
      message: '게시글 작성 중 서버 오류',
    });
  }
});

// (선택) 게시글 삭제
app.delete('/community/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: '게시글이 삭제되었습니다.',
    });
  } catch (err) {
    console.error('DELETE /community/posts/:id ERROR:', err);
    res.status(500).json({
      success: false,
      message: '게시글 삭제 중 서버 오류',
    });
  }
});

// ================= 서버 실행 =================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.post("/community/post", async (req, res) => {
  try {
    const {
      title,
      content,
      authorId,
      authorNickname,
      mediaUrl,
      mediaType,
    } = req.body;

    if (!title || !content || !authorId || !authorNickname) {
      return res.json({ success: false, message: "데이터 누락" });
    }

    const post = await Post.create({
      title,
      content,
      authorId,
      authorNickname,
      mediaUrl: mediaUrl || null,
      mediaType: mediaType || null,
    });

    res.json({ success: true, post });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "DB 오류" });
  }
});
