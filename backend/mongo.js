// mongo.js
const mongoose = require("mongoose");

const MONGO_URI = "mongodb://127.0.0.1:27017/fcbayern_community";

// ⚠ 최신 Mongoose에서는 useNewUrlParser, useUnifiedTopology 옵션이 필요 없고,
// 넣으면 지금처럼 MongoParseError가 뜨니까 그냥 URI만 넘겨서 연결하면 된다.
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
  { timestamps: true } // createdAt, updatedAt 자동 추가
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
 * OverwriteModelError 방지용: 이미 있으면 재사용
 */
const Post =
  mongoose.models.Post || mongoose.model("Post", postSchema);

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

module.exports = {
  mongoose,
  Post,
  Comment,
};
