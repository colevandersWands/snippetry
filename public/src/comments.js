import { state } from './state.js';

// -- initialize comments section ---

const commentsSection = document.getElementById('leave-a-comment');

for (const comment of state.comments) {
  commentsSection.innerHTML += comment;
}

if (localStorage.getItem('comments')) {
  for (const comment of JSON.parse(localStorage.getItem('comments'))) {
    commentsSection.innerHTML += comment;
  }
}

// -- enable comments section --

const comment = document.getElementById('comment');

commentsSection.addEventListener('keypress', function leaveAComment(e) {
  if (e.key !== 'Enter') return;

  const newComment = `<!--

${comment.value.replaceAll('-->', '-=>')}

-->`;

  commentsSection.innerHTML += newComment;

  const localComments = localStorage.getItem('comments')
    ? JSON.parse(localStorage.getItem('comments'))
    : [];
  localComments.push(newComment);
  localStorage.setItem('comments', JSON.stringify(localComments));
});
