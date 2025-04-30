function initGalleryPopup(galleryId) {
  const likeCountEl = document.getElementById('like-count');
  const commentSection = document.getElementById('comment-section');

  new Swiper(".mySwiper", {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    }
  });

  function loadEngagement() {
    fetch('ajax/load_likes_comments.php?id=' + galleryId)
      .then(res => res.json())
      .then(data => {
        likeCountEl.textContent = data.likes;
        commentSection.innerHTML = data.comments_html;

        // 🗑 Bind delete buttons
        document.querySelectorAll('.btn-delete-comment').forEach(btn => {
          btn.addEventListener('click', () => {
            if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
              const commentId = btn.getAttribute('data-id');

              fetch('ajax/delete_comment.php', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'id=' + commentId
              })
              .then(res => res.json())
              .then(response => {
                if (response.success) {
                  loadEngagement(); // refresh after delete
                } else {
                  alert('삭제 실패: ' + (response.error || '알 수 없는 오류'));
                }
              });
            }
          });
        });
      });
  }

  document.getElementById('like-btn').addEventListener('click', () => {
    fetch('ajax/like_gallery.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'id=' + galleryId
    }).then(res => res.text()).then(count => likeCountEl.textContent = count);
  });

  document.getElementById('comment-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const form = new FormData(this);
    fetch('ajax/post_comment.php', {
      method: 'POST',
      body: form
    }).then(() => {
      this.reset();
      loadEngagement();
    });
  });

  loadEngagement();
}
