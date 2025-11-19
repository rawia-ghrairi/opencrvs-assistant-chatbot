document.addEventListener("DOMContentLoaded", function() {
    const inputField = document.getElementById("user-input");
    const sendButton = document.getElementById("send-btn");
    const chatMessages = document.getElementById("chat-messages");

    function addMessage(content, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
        messageDiv.textContent = content;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const message = inputField.value.trim();
        if (message === "") return;

        addMessage(message, "user");
        inputField.value = "";

        const response = await fetch("/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        });
        const data = await response.json();
        addMessage(data.answer, "bot");
    }

    sendButton.addEventListener("click", sendMessage);
    inputField.addEventListener("keyup", (e) => {
        if (e.key === "Enter") sendMessage();
    });
});
