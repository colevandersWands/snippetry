var wants_a_compliment = confirm('do you want a compliment?');

compliment: {
  insult: {
    if (wants_a_compliment) break insult;
    alert('you own a store');
  }
  if (!wants_a_compliment) break compliment;
  alert('well done, good work');
}

// tags: the fun parts
