const chatGPT = new SpeechSynthesisUtterance('Chat, GPT');
chatGPT.lang = 'fr-FR';
chatGPT.rate = 0.9;
speechSynthesis.speak(chatGPT); // cat, I farted
