export {MinHeap}

class MinHeap {

    constructor() {
        // Initialing the array heap and adding a dummy element at index 0 
        this.heap = [];
    }

    size() {
        return this.heap.length;
    }

    empty() {
        return (this.heap.length === 0);
    }
    insert(value) {
        this.heap.push(value);
        let indx = this.heap.length - 1, parent, temp;
        if (this.heap.length == 1)
            return;
        while (indx > 0) {
            parent = Math.floor((indx - 1) / 2.0);
            if (this.heap[parent].freq > this.heap[indx].freq) {
                temp = this.heap[parent];
                this.heap[parent] = this.heap[indx];
                this.heap[indx] = temp;
                indx = parent;
            }
            else
                break;
        }
    }

    targetChild(indx) {
        let Lchildindx = -1, Rchildindx = -1;
        if ((2 * indx) + 1 < this.heap.length)
            Lchildindx = (2 * indx) + 1;
        if ((2 * indx) + 2 < this.heap.length)
            Rchildindx = (2 * indx) + 2;
        if (Lchildindx != -1 && Rchildindx != -1) {
            if (this.heap[Lchildindx].freq <= this.heap[Rchildindx].freq)
                return Lchildindx;
            else
                return Rchildindx;
        }
        else if (Lchildindx == -1 && Rchildindx != -1)
            return Rchildindx;
        else if (Lchildindx != -1 && Rchildindx == -1)
            return Lchildindx;
        else
            return -1;
    }

    extractMin() {
        let indx = 0, child, temp;
        if (this.heap.length == 0) {
            console.log("Heap is empty");
            return -1;
        }
        let top = this.heap[0];
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.pop();
        while (true) {
            child = this.targetChild(indx);
            if (child == -1 || this.heap[child].freq > this.heap[indx].freq)
                break;
            temp = this.heap[indx];
            this.heap[indx] = this.heap[child];
            this.heap[child] = temp;
            indx = child;
        }
        return top;
    }
}