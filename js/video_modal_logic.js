// video_modal_logic.js

function openVideoModal(youtubeId, title, description, videoId) {
  const modalVideo = document.getElementById('modal-video');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalVideoIdInput = document.getElementById('modal-video-id');

  modalVideo.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
  modalTitle.textContent = title;
  modalDescription.textContent = description;
  modalDescription.style.wordBreak = 'break-word';
  modalDescription.style.whiteSpace = 'pre-wrap';
  modalDescription.style.overflowWrap = 'break-word';

  modalVideoIdInput.value = videoId;

  const modal = new bootstrap.Modal(document.getElementById('videoModal'));
  modal.show();

  // Fetch comments
  fetch(`ajax/video_get_comments.php?video_id=${videoId}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('modal-comments');
      container.innerHTML = '';
      if (data.comments_html) {
        container.innerHTML = data.comments_html;
        bindDeleteButtons();
      }
    })
    .catch(err => {
      console.error('Failed to load comments', err);
    });
}

function bindDeleteButtons() {
  const container = document.getElementById('modal-comments');
  container.querySelectorAll('.delete-comment-btn').forEach(btn => {
    btn.innerHTML = '&times;';
    btn.style.background = 'none';
    btn.style.border = 'none';
    btn.style.color = 'red';
    btn.style.fontSize = '16px';
    btn.style.marginLeft = '8px';
    btn.style.cursor = 'pointer';

    const commentItem = btn.closest('.comment-item');
    if (commentItem) {
      commentItem.style.display = 'flex';
      commentItem.style.alignItems = 'center';
      commentItem.style.justifyContent = 'space-between';
      commentItem.style.wordBreak = 'break-word';
    }

    btn.onclick = function () {
      const commentId = btn.dataset.id;
      fetch('ajax/video_delete_comment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${commentId}`
      })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          commentItem.remove();
        } else {
          alert(result.error || '삭제 실패');
        }
      });
    };
  });
}

// Delegated event listener for dynamically added modal buttons
document.addEventListener('click', function (e) {
  const target = e.target.closest('.open-video-modal');
  if (!target) return;
  e.preventDefault();

  const videoId = target.getAttribute('data-id');
  const youtubeId = target.getAttribute('data-youtube');
  const title = target.getAttribute('data-title');
  const description = target.getAttribute('data-description');

  openVideoModal(youtubeId, title, description, videoId);
});

// Handle comment submission
const commentForm = document.getElementById('modal-comment-form');
if (commentForm) {
  commentForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const videoId = document.getElementById('modal-video-id').value;
    const comment = this.comment.value;

    fetch('ajax/video_save_comment.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `video_id=${videoId}&comment=${encodeURIComponent(comment)}`
    })
    .then(res => res.json())
    .then(data => {
      if (data.user_name && data.comment) {
        const container = document.getElementById('modal-comments');
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        commentItem.style.display = 'flex';
        commentItem.style.alignItems = 'center';
        commentItem.style.justifyContent = 'space-between';
        commentItem.style.wordBreak = 'break-word';

        const commentText = document.createElement('div');
        commentText.innerHTML = `<strong>${data.user_name}</strong><br>${data.comment}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-comment-btn';
        deleteBtn.dataset.id = data.comment_id; // Ensure this value is returned from backend if needed
        deleteBtn.innerHTML = '&times;';
        deleteBtn.style.background = 'none';
        deleteBtn.style.border = 'none';
        deleteBtn.style.color = 'red';
        deleteBtn.style.fontSize = '16px';
        deleteBtn.style.marginLeft = '8px';
        deleteBtn.style.cursor = 'pointer';

        deleteBtn.onclick = function () {
          fetch('ajax/video_delete_comment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${deleteBtn.dataset.id}`
          })
          .then(res => res.json())
          .then(result => {
            if (result.success) {
              commentItem.remove();
            } else {
              alert(result.error || '삭제 실패');
            }
          });
        };

        commentItem.appendChild(commentText);
        commentItem.appendChild(deleteBtn);
        container.prepend(commentItem);

        this.reset();
      }
    });
  });
}

// Clear video when modal closes
const modalElement = document.getElementById('videoModal');
if (modalElement) {
  modalElement.addEventListener('hidden.bs.modal', () => {
    document.getElementById('modal-video').src = '';
  });
}