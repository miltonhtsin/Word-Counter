document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const textInput = document.getElementById('text-input');
    const wordCount = document.getElementById('word-count');
    const charCount = document.getElementById('char-count');
    const sentenceCount = document.getElementById('sentence-count');
    const paragraphCount = document.getElementById('paragraph-count');
    const keywordsList = document.getElementById('keywords-list');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');

    function countWords(text) {
        if (!text.trim()) return 0;
        return text.trim().split(/\s+/).length;
    }

    function countChars(text) {
        return text.length;
    }

    function countSentences(text) {
        if (!text.trim()) return 0;
        const matches = text.match(/[.!?]+(\s|$)/g);
        return matches ? matches.length : 0;
    }

    function countParagraphs(text) {
        if (!text.trim()) return 0;
        const paragraphs = text.split(/\n+/).filter(para => para.trim() !== '');
        return paragraphs.length;
    }

    function findTopKeywords(text, limit = 5) {
        if (!text.trim()) return [];
        
        const cleanText = text.toLowerCase().replace(/[^\w\s]/g, '');
        
        const words = cleanText.split(/\s+/);
        
        const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'it', 'its', 'that', 'this', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they'];
        const filteredWords = words.filter(word => word.length > 1 && !stopWords.includes(word));
        
        const wordFrequency = {};
        filteredWords.forEach(word => {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        });
        
        const sortedWords = Object.entries(wordFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit);
            
        return sortedWords;
    }

    function updateStats() {
        const text = textInput.value;
        
        wordCount.textContent = countWords(text);
        charCount.textContent = countChars(text);
        sentenceCount.textContent = countSentences(text);
        paragraphCount.textContent = countParagraphs(text);
        
        const topKeywords = findTopKeywords(text);
        keywordsList.innerHTML = '';
        
        if (topKeywords.length > 0) {
            topKeywords.forEach(([word, count]) => {
                const keywordItem = document.createElement('div');
                keywordItem.className = 'keyword-item';
                keywordItem.textContent = `${word} (${count})`;
                keywordsList.appendChild(keywordItem);
            });
        } else {
            keywordsList.textContent = 'No keywords found';
        }
    }

    textInput.addEventListener('input', updateStats);
    
    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        updateStats();
    });
    
    copyBtn.addEventListener('click', () => {
        const stats = `
            Word Count: ${wordCount.textContent}
            Character Count: ${charCount.textContent}
            Sentence Count: ${sentenceCount.textContent}
            Paragraph Count: ${paragraphCount.textContent}
        `;
        
        navigator.clipboard.writeText(stats.trim())
            .then(() => {
                alert('Statistics copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy statistics to clipboard.');
            });
    });

    updateStats();
}); 