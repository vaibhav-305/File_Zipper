export {HuffmanNode}

class HuffmanNode {  
    constructor(Char,Value) {  
        this.char = Char; // character to be encoded
        this.freq = Value; // number of character occurrences    
        this.left = null;  
        this.right = null;  
    }  
}