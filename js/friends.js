let friends = [
    { name: "Jean Dupont", status: "En ligne", avatar: "images/avatar/avatar1.png" },
    { name: "Marie Curie", status: "Hors ligne", avatar: "images/avatar/avatar2.png" },
    { name: "Luc Martin", status: "En ligne", avatar: "images/avatar/avatar1.png" }
];

// Show friends list
function displayFriends(friendsToDisplay) {
    const friendsList = document.getElementById('friends-list');
    friendsList.innerHTML = ''; // Init list

    friendsToDisplay.forEach((ami, index) => {
        const friendElement = document.createElement('li');
        friendElement.classList.add('friend');
        friendElement.draggable = true;

        friendElement.innerHTML = `
            <img src="${ami.avatar}" alt="${ami.name}" class="avatar">
            ${ami.name} (${ami.status})
            <a href="messages.html?friend=${encodeURIComponent(ami.name)}">Message</a>
            <button class="remove-friend" aria-label="Supprimer ${ami.name}">Supprimer</button>
        `;

        // Remove a friend
        friendElement.querySelector('.remove-friend').addEventListener('click', () => {
            friends.splice(index, 1);
            displayFriends(friends);
        });

        // Drag and drop
        friendElement.addEventListener('dragstart', () => {
            friendElement.classList.add('dragging');
        });

        friendElement.addEventListener('dragend', () => {
            friendElement.classList.remove('dragging');
        });

        friendsList.appendChild(friendElement);
    });

    // Enable drag-and-drop reordering
    enableDragAndDrop(friendsList);
}

// Function to enable drag-and-drop functionality
function enableDragAndDrop(list) {
    const items = list.querySelectorAll('.friend');

    items.forEach(item => {
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingItem = document.querySelector('.dragging');

            if (item !== draggingItem) {
                const bounding = item.getBoundingClientRect();
                const offset = bounding.y + bounding.height / 2; // Center of the item

                // Insert before or after based on position
                if (e.clientY < offset) {
                    item.parentNode.insertBefore(draggingItem, item);
                } else {
                    item.parentNode.insertBefore(draggingItem, item.nextSibling);
                }
            }
        });
    });
}

// Filter friends list by first or last name
document.getElementById('friend-filter').addEventListener('input', (event) => {
    const filterValue = event.target.value.toLowerCase();
    const filteredFriends = friends.filter(fr => fr.name.toLowerCase().includes(filterValue));
    displayFriends(filteredFriends);
});

// Show friends list on page load
document.addEventListener('DOMContentLoaded', () => {
    displayFriends(friends);
});
