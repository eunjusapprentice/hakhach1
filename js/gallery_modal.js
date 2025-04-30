document.addEventListener('DOMContentLoaded', function () {
  const modal = new bootstrap.Modal(document.getElementById('galleryViewModal'));
  const modalContent = document.getElementById('gallery-modal-content');

  document.querySelectorAll('.open-gallery-modal').forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const id = this.getAttribute('data-id');

      modalContent.innerHTML = `
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-3">갤러리를 불러오는 중입니다...</p>
        </div>`;

      fetch('gallery_view.php?id=' + id)
        .then(res => res.text())
        .then(html => {
          modalContent.innerHTML = html;

          // Now that HTML is in the DOM, call the dynamic logic
          if (typeof initGalleryPopup === 'function') {
            initGalleryPopup(id);
          } else {
            console.error("initGalleryPopup() is not defined");
          }
        })
        .catch(() => {
          modalContent.innerHTML = `<div class="text-center p-5 text-danger">불러오기 실패</div>`;
        });

      modal.show();
    });
  });
});