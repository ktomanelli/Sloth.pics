window.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('#slothcontainer');
  const image = fetch('/api')
    .then(res => res.json())
    .then(data => {
      container.textContent = '';
      const imgLink = document.createElement('a');
      const figCapLink = document.createElement('a');
      const imgTag = document.createElement('img');
      const fig = document.createElement('figure');
      const figCap = document.createElement('figcaption');
      console.log(data);
      imgLink.href = data.url;
      imgTag.id = 'sloth';
      imgTag.src = data.url;
      imgTag.alt = 'A Random Sloth Picture!';
      figCap.textContent = `Photo by ${data.creator}`;
      figCapLink.href = data.creator_url;
      imgLink.append(imgTag);
      figCapLink.append(figCap);
      fig.append(imgLink);
      fig.append(figCapLink);
      container.append(fig);
    });
});
