fetch('http://localhost:8080/api/reviews')
  .then(res => res.json().catch(() => null))
  .then(data => {
    console.log("All Reviews:", data);
  })
  .catch(err => console.error(err));
