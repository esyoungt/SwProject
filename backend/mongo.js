// mongo.js
const mongoose = require('mongoose');

const MONGO_URL = 'mongodb://127.0.0.1:27017/fcbayern_community';

// 쓸데없어진 옵션 제거 → 최신 방식
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('MongoDB connected:', MONGO_URL);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// ===== 게시글 스키마 =====
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: Number, required: true },
    authorNickname: { type: String, required: true },

    // 첨부 미디어
    mediaUrl: { type: String, default: null },
    mediaType: { type: String, enum: ["image", "video", null], default: null },
  },
  { timestamps: true }
);


// ===== 댓글 스키마 =====
const commentSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    authorId: { type: Number, required: true },
    authorNickname: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
  mongoose,
  Post,
  Comment,
};
