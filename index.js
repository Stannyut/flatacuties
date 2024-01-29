document.addEventListener('DOMContentLoaded', () => {
    const animalListContainer = document.getElementById('animal-list');
    const animalDetailsContainer = document.getElementById('animal-details');
  
    // Fetch data from the local JSON DB server
    async function fetchData(endpoint) {
      try {
        const response = await fetch(`http://localhost:3000/${endpoint}`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    // Render list of animals
    async function renderAnimalList() {
      const animals = await fetchData('characters');
      if (animals && animals.length > 0) {
        animals.forEach(animal => {
          const animalCard = document.createElement('div');
          animalCard.classList.add('animal-card');
          animalCard.innerHTML = `
            <img src="${animal.image}" alt="${animal.name}" data-animal-id="${animal.id}">
            <p>${animal.name}</p>
          `;
          animalCard.addEventListener('click', () => showAnimalDetails(animal.id));
          animalListContainer.appendChild(animalCard);
        });
      } else {
        animalListContainer.innerHTML = '<p>No animals available for voting.</p>';
      }
    }
  
    // Show details of a specific animal
    async function showAnimalDetails(animalId) {
      const animal = await fetchData(`characters/${animalId}`);
      if (animal) {
        const voteButton = document.createElement('button');
        voteButton.id = 'vote-btn';
        voteButton.textContent = 'Vote';
        voteButton.addEventListener('click', () => voteForAnimal(animalId));
  
        animalDetailsContainer.innerHTML = `
          <img src="${animal.image}" alt="${animal.name}">
          <p>${animal.name}</p>
          <p>Votes: ${animal.votes}</p>
        `;
        animalDetailsContainer.appendChild(voteButton);
      } else {
        console.error('Error fetching animal details');
      }
    }
  
    // Vote for a specific animal
    async function voteForAnimal(animalId) {
      try {
        const response = await fetch(`http://localhost:3000/characters/${animalId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ votes: 1 }),
        });
        const data = await response.json();
        if (data) {
          // Update the votes count in the UI
          const votesElement = document.querySelector('#animal-details p:last-child');
          if (votesElement) {
            votesElement.textContent = `Votes: ${data.votes}`;
          }
        } else {
          console.error('Error updating votes');
        }
      } catch (error) {
        console.error('Error submitting vote:', error);
      }
    }
  
    // Initialize the UI
    renderAnimalList();
  });
  