const spellingAdjustments = {
    "armor": "armour", "color": "colour", "behavior": "behaviour", "flavor": "flavour", 
    "honor": "honour", "neighbor": "neighbour", "labor": "labour", "humor": "humour", 
    "rumor": "rumour", "splendor": "splendour", "valor": "valour", "vigor": "vigour", 
    "endeavor": "endeavour", "favorite": "favourite", "gray": "grey", "defense": "defence",
    "license": "licence", "center": "centre", "theater": "theatre", "fiber": "fibre",
    "liter": "litre", "meter": "metre", "traveling": "travelling", "traveler": "traveller",
    "canceled": "cancelled", "modeling": "modelling", "fueled": "fuelled", "jewelry": "jewellery", "sulfur": "sulphur", "finalizing": "finalising"
};

const charMap = {
    'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ᵷ', 'h': 'ɥ', 'i': 'ᴉ', 
    'j': 'ɾ', 'k': 'ʞ', 'l': 'ꞁ', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 
    's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
    'A': 'Ɐ', 'B': 'ᗺ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': '⅁', 'H': 'H', 'I': 'I', 
    'J': 'Ր', 'K': 'Ʞ', 'L': 'Ꞁ', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ', 'Q': 'Ꝺ', 'R': 'ᴚ', 
    'S': 'S', 'T': '⟘', 'U': '∩', 'V': 'Ʌ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
    '!': '¡', '.': '˙', '?': '¿', '&': '⅋', ':': ':', ';': '⸵', '*': '*', 
    '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{',
    "'": ',', '’': ',', ',': "'",
    '1': '⥝', '2': 'ᘔ', '3': 'Ɛ', '4': '߈', '5': 'ϛ', '6': '9', '9': '6', '7': 'ㄥ', '8': '8', '0': '0'
};

function applySpellingRefinement(text) {
    return text.replace(/\b[a-zA-Z]+\b/g, (word) => {
    let lower = word.toLowerCase();
                
    if (spellingAdjustments[lower]) {
        let conv = spellingAdjustments[lower];
    if (word === word.toUpperCase()) return conv.toUpperCase();
    if (word[0] === word[0].toUpperCase()) return conv.charAt(0).toUpperCase() + conv.slice(1);
        return conv;
    }
                
    if (lower.endsWith('ize') && lower.length > 4) {
        let conv = lower.slice(0, -3) + 'ise';
        return word[0] === word[0].toUpperCase() ? conv.charAt(0).toUpperCase() + conv.slice(1) : conv;
    }
                
        return word;
    });
    }

function flipWithProtection(text) {
    const paramRegex = /(%\d+\$s|%s)/g;
    const parts = text.split(paramRegex);
            
    let flippedParts = parts.map(part => {
    if (part.match(paramRegex)) return part; 
        return part.split('').reverse().map(char => charMap[char] || char).join('');
    });

        return flippedParts.reverse().join('');
    }

    const input = document.getElementById('userInput');
    const output = document.getElementById('flippedOutput');
    const copyBtn = document.getElementById('copyBtn');

    input.addEventListener('input', () => {
        const refinedText = applySpellingRefinement(input.value);
        output.innerText = flipWithProtection(refinedText);
    });

    async function copyText() {
        if (!output.innerText) return;
        try {
            await navigator.clipboard.writeText(output.innerText);
            const original = copyBtn.innerText;
            copyBtn.innerText = "COPIED! ✓";
            copyBtn.style.background = "#52b788";
            setTimeout(() => {
                copyBtn.innerText = original;
                copyBtn.style.background = "";
            }, 2000);
        } catch (err) { console.error(err); }
    }

async function getBritishValidation(text) {
    const response = await fetch('SUA_ENDPOINT_DE_IA', {
    method: 'POST',
    body: JSON.stringify({
    prompt: `Translate this Minecraft string to strict British English spelling (Oxford standard), keeping all placeholders like %s or %1$s intact: "${text}"`,
    temperature: 0
    })
});
        const data = await response.json();
        return data.refinedText;
}

document.addEventListener('contextmenu', event => event.preventDefault());

document.onkeydown = function(e) {
    if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0))) {
    return false;
}
}
