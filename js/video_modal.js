document.addEventListener('click', function(e) {
  if (e.target.classList.contains('open-video-modal')) {
    const btn = e.target;
    const videoId = btn.getAttribute('data-id');
    const youtubeId = btn.getAttribute('data-youtube');
    const title = btn.getAttribute('data-title');
    const description = btn.getAttribute('data-description');

    // Set modal content
    document.getElementById('modal-video').src = `https://www.youtube.com/embed/${youtubeId}`;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-description').textContent = description;
    document.getElementById('modal-video-id').value = videoId;

    // Fetch comments
    fetch(`ajax/video_get_comments.php?video_id=${videoId}`)
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('modal-comments');
        container.innerHTML = '';
        if (data.comments) {
          data.comments.forEach(c => {
            container.innerHTML += `<p><strong>${c.user_name}</strong><br>${c.comment}</p>`;
          });
        }
      });

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('videoModal'));
    modal.show();
  }
});

// Handle comment submission
document.addEventListener('submit', function(e) {
  if (e.target && e.target.id === 'modal-comment-form') {
    e.preventDefault();
    const form = e.target;
    const videoId = document.getElementById('modal-video-id').value;
    const comment = form.comment.value;

    fetch('ajax/video_save_comment.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `video_id=${videoId}&comment=${encodeURIComponent(comment)}`
    })
    .then(res => res.json())
    .then(data => {
      if (data.user_name && data.comment) {
        const c = document.createElement('p');
        c.innerHTML = `<strong>${data.user_name}</strong><br>${data.comment}`;
        document.getElementById('modal-comments').prepend(c);
        form.reset();
      }
    });
  }
});