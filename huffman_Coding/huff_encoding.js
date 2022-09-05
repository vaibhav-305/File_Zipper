import { MinHeap } from './minHeap.js';

class HuffmanNode {  
    constructor(Char,Value) {  
        this.char = Char; // character to be encoded
        this.freq = Value; // number of character occurrences    
        this.left = null;  
        this.right = null;  
    }  
}

const INTERNAL_NODE_CHARACTER = String.fromCharCode(129),
    HEADER_TEXT_SEPERATOR = String.fromCharCode(132);

export {HuffmanEncoding};

class HuffmanEncoding {


    binary_to_decimal(binarystring)
    {
        let result = 0;
	    for (let i=0;i<binarystring.length;i++)
		    result = result*2 + (binarystring[i].charCodeAt() - '0'.charCodeAt());
	    return result;
    }

    getCodes(treenode,path)
    {
        if(treenode === null)
            return;

        if(treenode.left===null && treenode.right===null){
            this.mappings[treenode.char] = path;
            return;
        }

        this.getCodes(treenode.left, path+"0");
        this.getCodes(treenode.right, path+'1');
    }
    
    encode(data)
    {
        let minHeap = new MinHeap();

        const mp = new Map();

        //*************************************frequency counting***************************************
        for(let i=0;i<data.length;i++){
            if(mp.has(data[i])){
                //mp[data[i]] = mp[data[i]] + 1;
                mp.set(data[i],mp.get(data[i])+1);
            } else{
                //mp[data[i]] = 1;
                mp.set(data[i],1)
            }
        }

        for (const [key, value] of mp) {
            let huff_node = new HuffmanNode(key, value);
            //console.log(huff_node);
            minHeap.insert(huff_node);
        }

        //********************************creating huffman tree**************************************
        while(minHeap.size()>1)
        {
            let a = minHeap.extractMin();
            let b = minHeap.extractMin();

            let internalNode = new HuffmanNode(INTERNAL_NODE_CHARACTER,a.freq+b.freq);
            internalNode.left = a;
            internalNode.right = b;
            
            minHeap.insert(internalNode);
        }

        //**************************************************getting huffman codes*****************************
        let root = minHeap.extractMin();
        this.mappings = {};
        this.getCodes(root, "");
        //console.log(this.mappings);

        //*********************************************encoding*********************************************
        let encodedOutput =String.fromCharCode(Object.keys(this.mappings).length);   //first byte stores length of map/object
        
        //storing characters with their huffman codes for tree formation while decoding
        for(let c in this.mappings)
        {
            let lsb = Math.pow(2,this.mappings[c].length)           //lsb=leftmost set bit
            encodedOutput+=c+(lsb+this.binary_to_decimal(this.mappings[c]))+HEADER_TEXT_SEPERATOR;
        }
        //let obj1={encodedOutput}
        //console.log(obj1);
        //console.log(encodedOutput.length)

        //encoding data in form of binary string
        let binarystring="";
        for(let i=0;i<data.length;i++)
        {
            //console.log(this.mappings[data[i]]);
            binarystring+=this.mappings[data[i]];
        }
        //console.log(binarystring);
        //console.log(binarystring.length);
        let winsize=7;
        const extrazeros = winsize - (binarystring.length - winsize*Math.floor(binarystring.length/winsize));
        for(let i=1;i<=extrazeros;i++)
            binarystring+='0';
        
        for(let i=0;i<binarystring.length;i+=winsize)
        {
            //console.log(binarystring.substr(i,7)+"->"+this.binary_to_decimal(binarystring.substr(i,7)));
            encodedOutput+=String.fromCharCode(this.binary_to_decimal(binarystring.substr(i,winsize)));
        }
        encodedOutput+=extrazeros;
        //let obj={encodedOutput};
        //console.log(obj);
        //console.log(encodedOutput.length);

        return encodedOutput;
    }
}