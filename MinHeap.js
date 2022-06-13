/* 
	Min Heap
	Stephen Rinkus 
	
			  (1)
			/    \
		 (2)     (4)
		/  \     / 
	  (5) (3)  (6)       
	  
	Insert - O(logn)
	Extract-min - O(logn)
*/

class MinHeap {

	//Storing heap structure in an array
	constructor(){
		this.heap = [];			
	}
	
	//Insert an array of ints one at a time into Heap
	buildMinHeap(){
		let values = [3, 1, 6, 5, 2, 4]   				    // 1,2,4,5,3,6
		values.forEach(val => this.insert(Number(val)));
	}
	
	//Swap two nodes
	swap(node1, node2){
		[this.heap[node1], this.heap[node2]] = [this.heap[node2], this.heap[node1]];
	}
	
	//Add a new value to the heap then restore heap property
	insert(val){
	
		//create a new node at the end of the heap, then start moving it upwards	
		this.heap.push(val);
		this.bubbleUp();
	}
	
	//Work a node upwards to a valid spot...starts at bottom by default, optionally takes a starting location
	bubbleUp(node){
		
		let index;    
		
		//if a param was passed, use that node as the starting point, otherwise start at the end
		node ? index = node : index = this.heap.length - 1;  	

		let parentIndex = Math.floor((index + 1) / 2) - 1; 
		
		//while the node still has parents which are greater, keep bubbling up
		while(index > 0 && this.heap[parentIndex] > this.heap[index]){
			this.swap(index, parentIndex);
			index = parentIndex;
			parentIndex = Math.floor((index + 1) / 2) - 1;  
		} 
	}
	
	//Sink a node down...extractMin is followed by a bubbleDown, after last element is placed at top...
	bubbleDown(index = 0){
	
		let swap = true;					//boolean swap status, so code knows when to exit loop
		let leftChildIndex, rightChildIndex;
		const length = this.heap.length;
		
		//while downward swaps are still possible
		while (swap) {
						
			swap = false;		//code will need to swap in order to re-enter loop				
						
			let min = index;
			leftChildIndex = (2 * index) + 1;
			rightChildIndex = (2 * index) + 2;
			
			if (leftChildIndex < length && this.heap[leftChildIndex] < this.heap[index]) {
				min = leftChildIndex;
			}

			if (rightChildIndex < length && this.heap[rightChildIndex] < this.heap[min]){
				min = rightChildIndex;	
			}
						
			//if new min was detected, do the needed swap
			if (min != index) {
				this.swap(index, min);	//swap heap spots
				index = min;			//advnace downwards
				swap = true;
			} 
		}
	};
	
	//Bubble up or down for a node takin in a new value 
	bubble(delVal, newVal, index){

		//push the new node up or down the tree, depending on how it compares to the deleted node
		delVal < newVal ? this.bubbleDown(index) : this.bubbleUp(index);
	}
	
	//Recursive search - find the index of a value...takes a start location as arg also (assuming no dupes)
	search(val, index = 0, isFound = false){
		
		let leftChildIndex = (2 * index) + 1;
		let rightChildIndex = (2 * index) + 2;
		const length = this.heap.length;
		
		//base case - value found
		if (this.heap[index] == val){
			//console.log("Found target val " + val + " at index " + index);
			isFound = true;
			return index;
		}
		
		//if target not yet found, and left child exists and is less than or equal to target, recurse on it 
		if (!isFound && leftChildIndex < length && this.heap[leftChildIndex] <= val){
			return this.search(val, leftChildIndex);
		}
		
		//if target not yet found, and right child exists and is less than or equal to target, recurse on it 
		if (!isFound && rightChildIndex < length && this.heap[rightChildIndex] <= val){
			return this.search(val, rightChildIndex);
		}
		
		//if code made it this far, then target is not present in the heap
		return null;
		
	}
	
	//Return the minimum value within the heap...the min is the first element in the array
	getMin(){
		if (!this.isEmpty()) {
			return this.heap[0];
		}
		return null;
	}
	
	//Return the highest value within the heap
	getMax(){
		if (!this.isEmpty()) {
			return Math.max(...this.heap);
		}
		return null;
	}
	
	//Remove and return the minimum element in the heap, and re-settle the remaining heap to valid state 
	extractMin(){
		
		const min = this.heap[0];			//minimum value in heap, to be returned at the end
		this.heap[0] = this.heap.pop();		//override first element with last
		this.bubbleDown();					//push the new-found root node downwards till its in place
		
		return min;
	}
	
	//Remove and return the maximum element in the heap
	extractMax(){
		return this.deleteValue(this.getMax());
	}
	
	//Decrease value of key at index (new val should be smaller)
	decreaseKey(index, newVal){
	
		//overwrite the node with new, lesser value, then bubble it up from that location
		this.heap[index] = newVal;
		this.bubbleUp(index);
	}
	
	//Update a key's value with a new value and re-establish heap property
	changeKey(index, newVal){
		
		//overwrite target node then bubble() does a comp to see which direction new node needs to bubble
		let delVal = this.heap[index];
		this.heap[index] = newVal;
		this.bubble(delVal, newVal, index);
	}
	
	//Delete a given index from the heap and return the value, making sure heap property restored after
	deleteKey(index){
		
		//replace node with last node, then bubble
		let delVal = this.heap[index];
		let end = this.heap.pop();
		this.heap[index] = end;
		this.bubble(delVal, end, index);
		
		return delVal;
	}
	
	//Alternative delete approach
	deleteKey2(index){
	
		//plummet a key's value, then bubble it up to the top of the tree, then extract min
		let delValue = this.heap[index];
		this.heap[index] = Number.NEGATIVE_INFINITY;
		this.bubbleUp(index);
		this.extractMin();
		
		return delValue;
	}	
	
	//Find and delete a given value, then restore heap property (assuming no dupes)
	deleteValue(val){
		
		//search and destroy
		return this.deleteKey(this.search(val));
		
	}
	
	//Boolean check if the heap is empty
	isEmpty(){
		return this.heap.length < 1;
	}
	
	//Returns the number of elements in the heap
	size(){
		return this.heap.length;
	}
	
}

export { MinHeap };



