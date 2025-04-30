<?php
include '../db.php';
session_start();

$id = $_POST['id'] ?? 0;
$nickname = $_SESSION['nickname'] ?? '';

if (!$id || !$nickname) {
    echo json_encode(['success' => false, 'error' => '권한이 없습니다.']);
    exit;
}

// 댓글 작성자 확인
$stmt = $pdo->prepare("SELECT user_name FROM video_comments WHERE id = ?");
$stmt->execute([$id]);
$comment = $stmt->fetch();

if (!$comment || $comment['user_name'] !== $nickname) {
    echo json_encode(['success' => false, 'error' => '삭제 권한이 없습니다.']);
    exit;
}

// 삭제 실행
$stmt = $pdo->prepare("DELETE FROM video_comments WHERE id = ?");
$stmt->execute([$id]);

echo json_encode(['success' => true]);
