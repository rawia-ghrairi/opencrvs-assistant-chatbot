class Chatbox {
    constructor() {
        //Récupère les éléments HTML (bouton d’ouverture, fenêtre de chat, bouton d’envoi)
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

       //indique si la boîte est ouverte ou fermée
        this.state = false;
        //tableau qui stocke les messages échangés
        this.messages = [];
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        //Quand on clique sur le bouton flottant → ajoute/retire la classe chatbox--active (qui montre ou cache la boîte)
        openButton.addEventListener('click', () => this.toggleState(chatBox))

        //Quand on clique sur Send ou tape Enter, onSendButton est déclenché.
        sendButton.addEventListener('click', () => this.onSendButton(chatBox))
        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        //Envoi des messages
        //Récupère le texte saisi.
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }
        //Ajoute le message de l’utilisateur (msg1) dans this.messages.
        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);
        //Envoie une requête POST à l’API 
        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          //Attend une réponse JSON du type { answer: "réponse du bot" }
          //Ajoute la réponse (msg2) à la liste this.messages.
          .then(r => {
            let msg2 = { name: "Sam", message: r.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
    }
   //Affichage des messages
    updateChatText(chatbox) {
        var html = '';
        //Parcourt this.messages (du plus récent au plus ancien)
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Sam")
                //Crée du html:
            //messages__item--operator → messages de l’utilisateur.
             //messages__item--visitor → messages du bot.
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
          });
         // Injecte ce HTML dans .chatbox__messages
        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}


const chatbox = new Chatbox();
chatbox.display();