const comments_box = document.querySelector('.wrapper');
let all_comments = [];

fetch('./data.json')
    .then(response => response.json())
    .then(data => {
        all_comments = data.comments;
        display_comments(all_comments);
    })
    .catch(error => console.log("Error loading JSON:", error));

    const display_comments = (displayed_comments) => {
        let comments_HTML = '';
      
        displayed_comments.forEach(comment => {
          comments_HTML += generate_comment_html(comment); // top-level comment
      
          if (comment.replies && comment.replies.length > 0) {
            // Replies are grouped but not squished
            comments_HTML += '<div class="replies-wrapper">';
            comment.replies.forEach(reply => {
              comments_HTML += generate_comment_html(reply);
            });
            comments_HTML += '</div>';
          }
        });
      
        comments_box.innerHTML = comments_HTML;
    };
      
      
    const generate_comment_html = (comment) => {
        return `
          <div class="comment">
            <div class="comment-top pt-2">
              <img class="avatar" src="${comment.user.image.webp}" alt="avatar">
              <p class="font-bolder text-name fs-2">${comment.user.username}</p>
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
              <button class="reply text-blue font-bolder">
                <img src="./assets/images/icon-reply.svg" alt="reply icon">
                <p>Reply</p>
              </button>
            </div>
          </div>
        `;
    };
      
      