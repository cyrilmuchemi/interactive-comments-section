const comments_box = document.querySelector('.wrapper');
const send_button = document.querySelector('.send-btn');
const comment_input = document.querySelector('.text-input');
let all_comments = [];
let current_user = {};
const LOCAL_STORAGE_KEY = "comment_data";
const modalOverlay = document.querySelector('.modal-overlay');
const modalTextarea = document.querySelector('.modal-textarea');
const cancelBtn = document.querySelector('.cancel-btn');
const saveBtn = document.querySelector('.save-btn');
const deleteModalOverlay = document.getElementById('deleteModalOverlay');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
let itemToDelete = null; 

function openDeleteModal() {
  deleteModalOverlay.style.display = 'flex';
}

function closeDeleteModal() {
  deleteModalOverlay.style.display = 'none';
}


const save_comments_to_local = () => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all_comments));
}

const load_comments_from_local = () => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

fetch('./data.json')
    .then(response => response.json())
    .then(data => {
      current_user = data.currentUser;
      const local_comments = load_comments_from_local();
        all_comments = local_comments || data.comments;
        display_comments(all_comments);
    })
    .catch(error => console.log("Error loading JSON:", error));

    const display_comments = (displayed_comments) => {
        let comments_HTML = '';
      
        displayed_comments.forEach(comment => {
          comments_HTML += generate_comment_html(comment);
      
          if (comment.replies && comment.replies.length > 0) {
            comments_HTML += '<div class="replies-wrapper">';
            comment.replies.forEach(reply => {
              comments_HTML += generate_reply_html(reply);
            });
            comments_HTML += '</div>';
          }
        });
      
        comments_box.innerHTML = comments_HTML;
    };
      
    const generate_comment_html = (comment) => {
      const isCurrentUser = comment.user.username === current_user.username;
    
      return `
        <div class="comment ${isCurrentUser ? ' current-user' : ''}" data-id="${comment.id}"  data-type="comment">
          <div class="comment-top pt-2">
            <img class="avatar" src="${comment.user.image.webp}" alt="avatar">
            <p class="font-bolder text-name fs-2">${comment.user.username}</p>
            ${isCurrentUser ? '<span class="you-badge">You</span>' : ''}
            <p class="font-bold text-date">${comment.createdAt}</p>
          </div>
          <p class="font-bold pt-2">
            ${comment.replyingTo ? `<span class="replying-to">@${comment.replyingTo}</span> ` : ''}${comment.content}
          </p>
          <div class="comment-bottom pt-2">
            <div class="vote">
              <button class="add"><img src="./assets/images/icon-plus.svg" alt="icon plus"></button>
              <span class="score font-bold text-blue">${comment.score}</span>
              <button class="subtract"><img src="./assets/images/icon-minus.svg" alt="icon minus"></button>
            </div>
            ${isCurrentUser ? `
              <div class="delete-edit">
                <button class="delete-btn" data-id=${comment.id} data-type="comment">
                  <img src="./assets/images/icon-delete.svg" alt="delete icon"/>
                </button>
                <button class="edit-btn" data-id=${comment.id} data-type="comment">
                  <img src="./assets/images/icon-edit.svg" alt="edit icon"/>
                </button>
              </div>
            ` : `
              <button class="reply text-blue font-bolder">
                <img src="./assets/images/icon-reply.svg" alt="reply icon">
                <p>Reply</p>
              </button>
            `}
          </div>
        </div>
      `;
    };
    
    const generate_reply_html = (reply) => {
      const isCurrentUser = reply.user.username === current_user.username;
    
      return `
        <div class="comment${isCurrentUser ? ' current-user' : ''}" data-id="${reply.id}" data-type="reply">
          <div class="comment-top pt-2">
            <img class="avatar" src="${reply.user.image.webp}" alt="avatar">
            <p class="font-bolder text-name fs-2">${reply.user.username}</p>
            ${isCurrentUser ? '<span class="you-badge">You</span>' : ''}
            <p class="font-bold text-date">${reply.createdAt}</p>
          </div>
          <p class="font-bold pt-2">
            ${reply.replyingTo ? `<span class="replying-to">@${reply.replyingTo}</span> ` : ''}${reply.content}
          </p>
          <div class="comment-bottom pt-2">
            <div class="vote">
              <button class="add"><img src="./assets/images/icon-plus.svg" alt="icon plus"></button>
              <span class="score font-bold text-blue">${reply.score}</span>
              <button class="subtract"><img src="./assets/images/icon-minus.svg" alt="icon minus"></button>
            </div>
            ${isCurrentUser ? `
              <div class="delete-edit">
                <button class="delete-btn"  data-id=${reply.id} data-type="reply" data-comment-id="${reply.commentId}">
                  <img src="./assets/images/icon-delete.svg" alt="delete icon"/>
                </button>
                <button class="edit-btn"  data-id=${reply.id} data-type="reply" data-comment-id="${reply.commentId}">
                  <img src="./assets/images/icon-edit.svg" alt="edit icon"/>
                </button>
              </div>
            ` : `
              <button class="reply text-blue font-bolder">
                <img src="./assets/images/icon-reply.svg" alt="reply icon">
                <p>Reply</p>
              </button>
            `}
          </div>
        </div>
      `;
    };
    
    send_button.addEventListener('click', () => {
      const comment_text = comment_input.value.trim();

      if(comment_text === "") return;

      const new_commment = {
        id: Date.now(),
        content: comment_text,
        createdAt: "Just now",
        score: 0,
        user: current_user,
        replies: []
      }

      all_comments.push(new_commment);
      display_comments(all_comments);
      save_comments_to_local();
      comment_input.value = "";
    });

    comments_box.addEventListener('click', (e) => {
      if (e.target.closest('.add') || e.target.closest('.subtract')) {
        const scoreEl = e.target.closest('.vote').querySelector('.score');
        let currentScore = parseInt(scoreEl.textContent);
    
        if (e.target.closest('.add')) {
          scoreEl.textContent = currentScore + 1;
        } else if (e.target.closest('.subtract') && currentScore > 0) {
          scoreEl.textContent = currentScore - 1;
        }
    
        update_scores_from_DOM();
        save_comments_to_local();
        return;
      }
    
      if (e.target.closest('.delete-btn')) {
        const commentEl = e.target.closest('.comment');
        if (!commentEl) return;
      
        const id = parseInt(commentEl.dataset.id);
        const type = commentEl.dataset.type;
        const commentId = parseInt(commentEl.dataset.commentId); // for a reply
        itemToDelete = { id, type, commentId };
        openDeleteModal();
        return;
      }
      
    
      if (e.target.closest('.edit-btn')) {
        const btn = e.target.closest('.edit-btn');
        const id = parseInt(btn.dataset.id);
        const type = btn.dataset.type;
        const commentId = parseInt(btn.dataset.commentId);
    
        let comment_to_edit = null;
    
        if (type === 'comment') {
          comment_to_edit = all_comments.find(comment => comment.id === id);
        } else if (type === 'reply') {
          const parent = all_comments.find(comment => comment.id === commentId);
          if (parent) {
            comment_to_edit = parent.replies.find(reply => reply.id === id);
          }
        }
    
        if (comment_to_edit) {
          openEditModal(comment_to_edit);
        }
    
        return;
      }
    });
    

    function openEditModal(comment) {
      modalOverlay.style.display = 'flex';
      modalTextarea.value = comment.content;

      saveBtn.onclick = function() {
        const new_content = modalTextarea.value.trim();
        if (new_content !== '') {
          comment.content = new_content;
          display_comments(all_comments);
          save_comments_to_local();
        }
        closeModal();
      };
    
      cancelBtn.onclick = function() {
        closeModal();
      };
    }
    
    function closeModal() {
      modalOverlay.style.display = 'none';
    }

    const update_scores_from_DOM = () => {
      const allCommentEls = document.querySelectorAll('.comment');
    
      allCommentEls.forEach((el, index) => {
        const username = el.querySelector('.text-name').textContent.trim();
        const content = el.querySelector('p.font-bold.pt-2')?.textContent.trim();
        const score = parseInt(el.querySelector('.score').textContent.trim());
    
        all_comments.forEach(comment => {
          if (comment.user.username === username && comment.content.trim() === content) {
            comment.score = score;
          }
          comment.replies.forEach(reply => {
            if (reply.user.username === username && reply.content.trim() === content) {
              reply.score = score;
            }
          });
        });
      });
    }

    confirmDeleteBtn.onclick = function() {
      if (!itemToDelete) return;
    
      const { id, type, commentId } = itemToDelete;
    
      if (type === 'comment') {
        all_comments = all_comments.filter(comment => comment.id !== id);
      } else if (type === 'reply') {
        all_comments.forEach(comment => {
          comment.replies = comment.replies.filter(r => r.id !== id);
        });
      }
    
      display_comments(all_comments);
      save_comments_to_local();
    
      closeDeleteModal();
      itemToDelete = null;
    };

    cancelDeleteBtn.onclick = function() {
      closeDeleteModal();
      itemToDelete = null;
    };
    
    
    


      
      