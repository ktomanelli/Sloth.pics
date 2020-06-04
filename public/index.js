window.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('#slothcontainer');
  const image = fetch('/api')
    .then(res => res.json())
    .then(data => {
      container.textContent = '';
      const imgLink = document.createElement('a');
      const imgTag = document.createElement('img');
      imgLink.href = data.url;
      imgTag.id = 'sloth';
      imgTag.src = data.url;
      imgTag.alt = 'A Random Sloth Picture!';
      imgLink.append(imgTag);
      container.append(imgLink);
    });
});
