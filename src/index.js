const comments_box = document.querySelector('.wrapper');
const send_button = document.querySelector('.send-btn');
const comment_input = document.querySelector('.text-input');
let all_comments = [];
let current_user = {};

fetch('./data.json')
    .then(response => response.json())
    .then(data => {
      current_user = data.currentUser;
        all_comments = data.comments;
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
        <div class="comment ${isCurrentUser ? ' current-user' : ''}">
          <div class="comment-top pt-2">
            <img class="avatar" src="${comment.user.image.webp}" alt="avatar">
            <p class="font-bolder text-name fs-2">${comment.user.username}</p>
            ${isCurrentUser ? '<span class="you-badge">You</span>' : ''}
            <p class="font-bold">${comment.createdAt}</p>
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
                <button><img src="./assets/images/icon-delete.svg" alt="delete icon"/></button>
                <button><img src="./assets/images/icon-edit.svg" alt="edit icon"/></button>
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
        <div class="comment${isCurrentUser ? ' current-user' : ''}">
          <div class="comment-top pt-2">
            <img class="avatar" src="${reply.user.image.webp}" alt="avatar">
            <p class="font-bolder text-name fs-2">${reply.user.username}</p>
            ${isCurrentUser ? '<span class="you-badge">You</span>' : ''}
            <p class="font-bold text-sm">${reply.createdAt}</p>
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
                <button><img src="./assets/images/icon-delete.svg" alt="delete icon"/></button>
                <button><img src="./assets/images/icon-edit.svg" alt="edit icon"/></button>
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
      comment_input.value = "";
    });
      
      