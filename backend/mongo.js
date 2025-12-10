// mongo.js
require("dotenv").config();
const mongoose = require("mongoose");

// 👉 .env의 값 우선, 없으면 로컬 DB로 연결
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fcbayern_community";

// 최신 mongoose는 옵션 제거
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected:", MONGO_URI);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

/**
 * 게시글(Post) 스키마
 */
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: Number, required: true },
    authorNickname: { type: String, required: true },
    mediaUrl: { type: String, default: null },
    mediaType: { type: String, default: null }, // "image" | "video" | null
  },
  { timestamps: true }
);

/**
 * 댓글(Comment) 스키마
 */
const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    authorId: { type: Number, required: true },
    authorNickname: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

/**
 * 모델 중복 생성 방지
 */
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);

module.exports = {
  mongoose,
  Post,
  Comment,
};
