// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const db = require("./db");                // ✅ MySQL 풀
const { Post, Comment } = require("./mongo"); // MongoDB 모델들

const app = express();
const PORT = process.env.PORT || 3000;

// CORS + JSON 파서
app.use(
  cors({
    origin: true,
    credentials: false,
  })
);
app.use(express.json());

// 헬스 체크
app.get("/", (req, res) => {
  res.send("FC Bayern backend running...");
});

//
// 0) MySQL 연결 테스트용 라우트
//
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json({
      status: "ok",
      data: rows,
    });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

//
// 1) MySQL: 회원가입 / 로그인 / 유저 목록
//

// 회원가입
app.post("/signup", async (req, res) => {
  try {
    const { nickname, username, password } = req.body;
    console.log("POST /signup", req.body);

    if (!nickname || !username || !password) {
      return res.json({ success: false, message: "필수 값 누락" });
    }

    const [exist] = await db.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );
    if (exist.length > 0) {
      return res.json({
        success: false,
        message: "이미 존재하는 아이디입니다.",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (username, password, nickname) VALUES (?, ?, ?)",
      [username, hashed, nickname]
    );

    return res.json({
      success: true,
      user: {
        id: result.insertId,
        username,
        nickname,
      },
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "서버 오류(회원가입)",
    });
  }
});

// 로그인
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("POST /login", req.body);

    if (!username || !password) {
      return res.json({
        success: false,
        message: "아이디/비밀번호 입력 필요",
      });
    }

    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (rows.length === 0) {
      return res.json({
        success: false,
        message: "존재하지 않는 아이디입니다.",
      });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({
        success: false,
        message: "비밀번호가 일치하지 않습니다.",
      });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "서버 오류(로그인)",
    });
  }
});

// 유저 목록
app.get("/users", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, username, nickname, created_at FROM users"
    );
    res.json(rows);
  } catch (err) {
    console.error("USERS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "서버 오류(유저 목록)",
    });
  }
});

//
// 2) MongoDB: 커뮤니티 글 / 댓글
//

// 글 작성
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

    console.log("POST /community/post", req.body);

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

    return res.json({ success: true, post });
  } catch (err) {
    console.error("COMMUNITY POST ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "서버 오류(게시글 작성)",
    });
  }
});

// 글 목록
app.get("/community/posts", async (req, res) => {
  try {
    console.log("GET /community/posts");
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, posts });
  } catch (err) {
    console.error("COMMUNITY LIST ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "서버 오류(게시글 목록)",
    });
  }
});

// 댓글 작성
app.post("/community/:postId/comment", async (req, res) => {
  try {
    const { postId } = req.params;
    const { authorId, authorNickname, content } = req.body;

    console.log("POST /community/:postId/comment", { postId, ...req.body });

    if (!content || !authorId || !authorNickname) {
      return res.json({ success: false, message: "데이터 누락" });
    }

    const comment = await Comment.create({
      postId,
      authorId,
      authorNickname,
      content,
    });

    res.json({ success: true, comment });
  } catch (err) {
    console.error("COMMENT CREATE ERROR:", err);
    res.json({ success: false, message: "DB 오류(댓글 작성)" });
  }
});

// 댓글 목록
app.get("/community/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    console.log("GET /community/:postId/comments", postId);

    const comments = await Comment.find({ postId })
      .sort({ createdAt: 1 })
      .lean();

    res.json({ success: true, comments });
  } catch (err) {
    console.error("COMMENT LIST ERROR:", err);
    res.json({ success: false, message: "DB 오류(댓글 목록)" });
  }
});

// 게시글 삭제
app.delete("/community/post/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Post.findByIdAndDelete(id);
    await Comment.deleteMany({ postId: id });

    res.json({ success: true, message: "게시글 및 댓글 삭제 완료" });
  } catch (err) {
    console.error("POST DELETE ERROR:", err);
    res.json({ success: false, message: "게시글 삭제 실패" });
  }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
