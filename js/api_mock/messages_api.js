let conversations = []; // Store conversations
let friends = []; // Store friends

// Simulate fetching conversations and friends from an API
function getConversations() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(conversations);
        }, 500); // Simulate a delay
    });
}

// Simulate fetching friends
function getFriends() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(friends);
        }, 500); // Simulate a delay
    });
}

// Simulate adding a new message to a conversation
function addMessage(recipient, content) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const message = {
                sender: "Vous",
                content: content,
                timestamp: new Date().toLocaleString()
            };
            let conversation = conversations.find(conv =>
                conv.participants.map(p => p.toLowerCase()).includes(recipient.toLowerCase()) &&
                conv.participants.map(p => p.toLowerCase()).includes("vous")
            );

            if (conversation) {
                conversation.messages.push(message); // Add the new message
            } else {
                conversation = {
                    participants: [recipient, "Vous"],
                    messages: [message]
                };
                conversations.push(conversation); // Add the new conversation
            }

            resolve(conversation);
        }, 500); // Simulate a delay
    });
}

// Initial load of conversations and friends
fetch('data/data.json')
    .then(response => response.json())
    .then(data => {
        conversations = data.conversations; // Load conversations
        friends = data.friends; // Load friends with avatars
    });

export { getConversations, getFriends, addMessage };
