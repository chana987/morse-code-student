const BSTree = require('./BinarySearch')
const alphabet = require('./alphabet')

class ScoreTree extends BSTree {
    constructor(value, score) {
        super(value)
        this.score = score
    }
    insertNode(key, score) { 
        if (!this.value) {
            this.value = key
            this.score = score
        }
        else if (score > this.score && this.rightChild) {
            this.rightChild.insertNode(key, score)
        }
        else if(score <= this.score && this.leftChild) {
            this.leftChild.insertNode(key, score)
        }
        else if (score <= this.score) {
            this.leftChild = new ScoreTree(key, score)
        }
        else {
            this.rightChild = new ScoreTree(key, score)
        }
    }
    findLetter(letter, code = '') {
        if (letter === ' ') {
            code += '/ '
            return code
        } 
        let score = alphabet[letter.toUpperCase()]
        let currentScore = this.score || 50
        if (score < currentScore && this.leftChild) {
            code += '. '
            return this.leftChild.findLetter(letter, code)
        } else if (score > currentScore && this.rightChild) {
            code += '- '
            return this.rightChild.findLetter(letter, code)
        } else if (score === currentScore) {
            return code
        }
    }
    translateWord(string) {
        let array = string.split('')
        let codedString = ''
        for (let letter of array) {
            codedString += this.findLetter(letter, ' ')
        }
        console.log(codedString)
    }
    translateMorseLetter(code, node, parent) {
        let array = code.split('')
        for (let i = 0; i < array.length; i++) {
            if (i === array.length - 1) {
                if (array[i] === '.') {
                    return node.leftChild.value
                } else if (array[i] === '-') {
                    return node.rightChild.value
                }                
            }
            if (array[i] === '.') {
                code = array.slice(1).join('')
                node.leftChild.translateMorseLetter(code, node.leftChild, node)
            } else if (array[i] === '-') {
                code = array.slice(1).join('')
                node.rightChild.translateMorseLetter(code, node.rightChild, node)
            }
        }
    }
    translateMorseWord(code, node) {
        let word = ''
        let codedLettersArray = code.split(' ')
        for (let letter of codedLettersArray) {
            word += this.translateMorseLetter(letter, node)
        }
        return word
    }
    translateMorseSentence(code, node) {
        let sentence = ''
        let codedWordsArray = code.split(' / ')
        for (let word of codedWordsArray) {
            sentence += this.translateMorseWord(word, node) + ' '
        }
        console.log(sentence)
    }
}
//initializing the MorseCode tree
const morseCode = new ScoreTree("TOP", 50)
Object.keys(alphabet).forEach(l => {
    morseCode.insertNode(l, alphabet[l])
})

// morseCode.findLetter('X')

// morseCode.translateWord("welcome") // should print .-- . .-.. -.-. --- -- . 
// morseCode.translateWord("elevation is cool") // should print . .-.. . ...- .- - .. --- -. /.. ... /-.-. --- --- .-.. 
morseCode.translateMorseSentence("... --- ...", morseCode)
// morseCode.translateMorse("-. .. -.-. . / .--- --- -... / --- -. / - .... . / .-.. . ... ... --- -.")
