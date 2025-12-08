-- 데이터베이스 생성 (없으면)
CREATE DATABASE IF NOT EXISTS football
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 이 데이터베이스를 사용
USE football;

-- 회원정보 테이블
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,   -- 내부용 PK (숫자)
  login_id VARCHAR(50) NOT NULL UNIQUE,         -- 사용자가 쓰는 ID
  password VARCHAR(255) NOT NULL,               -- 비밀번호(나중에 해시 저장)
  nickname VARCHAR(50) NOT NULL,                -- 닉네임
  created_at DATETIME NOT NULL                  -- 가입일시
    DEFAULT CURRENT_TIMESTAMP
);