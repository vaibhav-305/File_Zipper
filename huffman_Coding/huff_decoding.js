export {HuffmanDecoding};

class Node{
    constructor(Char) {  
        this.char = Char; // character to be encoded  
        this.left = null;  
        this.right = null;  
    }
}

const INTERNAL_NODE_CHARACTER = String.fromCharCode(36),
    HEADER_TEXT_SEPERATOR = String.fromCharCode(132);

class HuffmanDecoding{

    decimal_to_binary_leavingLSB(n)            //leaving lsb(leftmost set bit)
    {
        let binarystring='';
        while (n > 1) {
 
            // storing remainder in binary array
            binarystring = (n % 2)+binarystring;
            n = Math.floor(n / 2);
        }
        return binarystring;
    }
    decimal_to_7bit_binary(n)
    {
        let binarystring='';
        while (n > 0) {
 
            // storing remainder in binary array
            binarystring = (n % 2)+binarystring;
            n = Math.floor(n / 2);
        }
        let extrazeros = 7 - binarystring.length;
        for(let i=1;i<=extrazeros;i++)
            binarystring='0'+binarystring;

        return binarystring;
    }

    rebuiltHuffmanTree(chr,str)
    {
        let head = this.root, newNode=null;
        let i=0;
        while(i<str.length-1)
        {
            if(str[i]==='0')
            {
                if(head.left===null)
                {
                    newNode = new Node(INTERNAL_NODE_CHARACTER);
                    head.left = newNode;
                    head = newNode;
                }
                else
                    head = head.left;
            }
            else             //str[i]==='1'
            {
                if(head.right===null)
                {
                    newNode = new Node(INTERNAL_NODE_CHARACTER);
                    head.right = newNode;
                    head = newNode;
                }
                else
                    head=head.right;
            }
            i++;
        }
        newNode = new Node(chr);
        if(str[i]==='0')
        {
            head.left=newNode;
            head=newNode;
        }
        else          //if(str[i]==='1')
        {
            head.right=newNode;
            head=newNode;
        }
    }
    dispaly_Inorder(treenode)
    {
        if(treenode!=null)
        {
            this.dispaly_Inorder(treenode.left);
            //console.log(treenode.char);
            this.ss+=`${treenode.char}-`;
            this.dispaly_Inorder(treenode.right);
        }
    }
    decode(data)
    {
        //console.log("In huffdecde mate");
        let sz = data[0].charCodeAt();             //first byte was the size of map at time of encoding
        let i=1,chr='',temp=0;
        this.root = new Node(INTERNAL_NODE_CHARACTER);
        //let obj = {}
        /******************************************Re-Building Huffman tree***************************************** */
        for(let j=1;j<=sz;j++)
        {
            chr = data[i];
            i++;
            temp=0;
            while(true)
            {
                if(data[i]===HEADER_TEXT_SEPERATOR)
                {
                    i++;
                    break;
                }
                temp= temp*10 + (data[i].charCodeAt() - '0'.charCodeAt());
                i++;
            }
            //obj[chr]=this.decimal_to_binary_leavingLSB(temp)
            this.rebuiltHuffmanTree(chr,this.decimal_to_binary_leavingLSB(temp));
        }
        //console.log(i+" "+data[i]);
        //console.log(obj);
        //this.ss=""
        //this.dispaly_Inorder(this.root);
        //const obb={txt: this.ss};
        //console.log(obb);
        
        /***********************************************Converting string data to binary string ********************************************************* */
        let decodedOutput ='',binarystring='';
        while(i<data.length-2)
        {
            binarystring+=this.decimal_to_7bit_binary(data[i].charCodeAt());
            i++;
        }
        let lastencodedchar = data[i], zeroes=data[i+1].charCodeAt()-'0'.charCodeAt();
        lastencodedchar = this.decimal_to_7bit_binary(data[i].charCodeAt());
        binarystring+=lastencodedchar.substr(0, lastencodedchar.length-zeroes);
        //console.log(binarystring);

        /**************************************************Decoding from binary string********************************************************** */
        let head=this.root;
        for(let j=0;j<binarystring.length;j++)
        {
            if(binarystring[j]==='0')
                head = head.left;
            else 
                head = head.right;

            if(head===null)
            {
                console.log('errorrrrr')
                throw 'error'
            }

            if(head.left===null && head.right===null)          //leaf node
            {
                decodedOutput+=head.char;
                head=this.root;
            }
        }
        //let objjjj={decodedOutput};
        //console.log(objjjj);
        //console.log(decodedOutput.length);
        return decodedOutput;
    }
}