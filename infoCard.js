function createInfoCard() {
    const card = document.createElement('div');
    card.style.position = 'fixed';
    card.style.bottom = '20px';
    card.style.left = '20px';
    card.style.width = '300px';
    card.style.padding = '15px';
    card.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    card.style.color = '#fff';
    card.style.borderRadius = '8px';
    card.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    card.style.fontFamily = 'Arial, sans-serif';
    card.style.fontSize = '14px';
    card.style.zIndex = '9999';
  

    const message = document.createElement('p');
    message.innerText = 'To test other models in this setup, you can drag and drop any GLB file on the scene.';
    card.appendChild(message);
  

    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.style.backgroundColor = '#f44336';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.padding = '5px 10px';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.float = 'right';
  
    closeButton.addEventListener('click', function () {
      card.style.display = 'none';
    });
  
    card.appendChild(closeButton);
  
    document.body.appendChild(card);
  }
  

export default createInfoCard
  