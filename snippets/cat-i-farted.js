const chatGPT = new SpeechSynthesisUtterance('chat, GPT');
chatGPT.lang = 'fr-FR';
chatGPT.rate = 0.9;
speechSynthesis.speak(chatGPT); // cat, I farted
