import { getConversations, getFriends, addMessage } from './api_mock/messages_api.js';

let conversations = []; // Store conversations
let friends = []; // Store friends

// Load conversations and friends
Promise.all([getConversations(), getFriends()])
    .then(([loadedConversations, loadedFriends]) => {
        conversations = loadedConversations; // Load conversations
        friends = loadedFriends; // Load friends
        populateFriendDropdown(); // Populate dropdown after loading friends
        displayConversations(); // Display conversations after loading
        setInitialRecipient(); // Set the initial recipient if provided in the URL
    })
    .catch(error => console.error('Erreur de chargement des messages :', error));

// Function to populate the dropdown with friends
function populateFriendDropdown() {
    const recipientSelect = document.getElementById('recipient');
    friends.forEach(friend => {
        const option = document.createElement('option');
        option.value = friend.name;
        option.textContent = friend.name;
        recipientSelect.appendChild(option);
    });
}

// Function to set the initial recipient from URL parameters
function setInitialRecipient() {
    const urlParams = new URLSearchParams(window.location.search);
    const friendName = urlParams.get('friend');
    if (friendName && friends.some(friend => friend.name.toLowerCase() === friendName.toLowerCase())) {
        const recipientSelect = document.getElementById('recipient');
        recipientSelect.value = friendName; // Set the dropdown to the friend's name
    }
}

// Function to display conversations
function displayConversations() {
    const conversationsList = document.getElementById('conversations-list');
    conversationsList.innerHTML = ''; // Clear the list

    conversations.forEach(conversation => {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        const conversationName = getConversationName(conversation.participants);
        const avatar = getFriendAvatar(conversationName); // Get friend's avatar

        const conversationElement = createConversationElement(lastMessage, conversationName, avatar);
        conversationElement.onclick = () => showConversationDetails(conversation);
        conversationsList.appendChild(conversationElement); // Add conversation to the container
    });
}

// Function to create a conversation element
function createConversationElement(lastMessage, conversationName, avatar) {
    const conversationElement = document.createElement('div');
    conversationElement.classList.add('conversation');

    conversationElement.innerHTML = `
        <img src="${avatar}" alt="${conversationName}" class="avatar"> <!-- Use friend's avatar -->
        <div class="conversation-info">
            <strong>${conversationName}</strong>
            <p><strong>${lastMessage.sender}:</strong> ${lastMessage.content}</p> <!-- Show sender name -->
            <small>${lastMessage.timestamp}</small>
        </div>
    `;

    return conversationElement;
}


// Function to get the conversation name
function getConversationName(participants) {
    return participants.filter(participant => participant.toLowerCase() !== "vous").join(", ") || "Conversation";
}

// Function to get the friend's avatar
function getFriendAvatar(friendName) {
    const friend = friends.find(f => f.name.toLowerCase() === friendName.toLowerCase());
    return friend ? friend.avatar : null;
}

// Function to show conversation details
function showConversationDetails(conversation) {
    const messageDetails = document.getElementById('message-details');
    const participantName = conversation.participants.find(p => p.toLowerCase() !== "vous"); // Get the other participant's name
    const avatar = getFriendAvatar(participantName) || 'images/avatar/utilisateur.png'; // Get friend's avatar

    messageDetails.innerHTML = `<h4>Votre conversation avec ${participantName}</h4>`; // Add title and avatar

    conversation.messages.forEach(message => {
        const messageAvatar = getFriendAvatar(message.sender) || 'images/avatar/utilisateur.png'; // Get friend's avatar
        const senderName = message.sender; // Store sender name

        messageDetails.innerHTML += `
            <div class="message-detail">
                <img src="${messageAvatar}" alt="${senderName}" class="avatar"> 
                <div class="message-info">
                    <strong>${senderName}:</strong> ${message.content}
                    <small>${message.timestamp}</small>
                </div>
            </div>
        `;
    });

    messageDetails.classList.remove('hidden'); // Show the details
}


// Add a new message to the active conversation
document.getElementById('message-form').onsubmit = function(event) {
    event.preventDefault(); // Prevent page reload

    const recipient = document.getElementById('recipient').value.trim();
    const content = document.getElementById('message-content').value.trim();

    if (!recipient || !content) {
        alert("Veuillez choisir un ami et entrer un message.");
        return;
    }

    addMessage(recipient, content).then(conversation => {
        displayConversations();
        showConversationDetails(conversation);
        document.getElementById('message-form').reset(); // Reset the form
    });
};

// Display conversations on page load
document.addEventListener('DOMContentLoaded', displayConversations);
