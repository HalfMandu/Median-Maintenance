/*
	Median Maintenance
	Stephen Rinkus
	
		Given a sequence of numbers x1, x2, ...xn, return the median of the elements at each interval.
		Stays in linear time.
		
		Uses 2 heaps: a MinHeap and a MaxHeap. At all times the median is either the max of the MaxHeap or the min of the MinHeap.
			-If i is even, both are medians. If i is odd, then median is on side of heap with more elements.
			-If one heap size greater than other by > 1, extract from larger side and add it to other to re-balance.
		
		
		MaxHeap			     MinHeap		Final Median -> 7 or 8 
		   7				    8	
		 /   \				  /   \	
		5	  6				9	   10	
	  /  \   / \          /  \    /  \
	3    2  4   1       11   13  12  14
*/
import { MinHeap } from "./MinHeap.js";
import { MaxHeap } from "./MaxHeap.js";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { performance } = require('perf_hooks');
const util = require('util');
const fs = require('fs');



class MedianMaintenance {

	constructor(){
		this.minHeap = new MinHeap();			
		this.maxHeap = new MaxHeap();			
		this.median = null;
		this.sum = 0;
	}
	
	//add the incoming number, make sure it arrives at correct heap 
	insert(value){
		
		//first insert, empty heaps...default to left side insert
 		if (!this.maxHeap.getMax()){
			this.median = value;
			return this.maxHeap.insert(value);
		}
		
		//compare to left and right heap...if value in-between, default to left
		if (value < this.maxHeap.getMax()){
			this.maxHeap.insert(value);
		} else {
			this.minHeap.insert(value);
		}

		//check if one side got too large, if so move one over
		if (this.maxHeap.size() - this.minHeap.size() > 1){
			this.minHeap.insert(this.maxHeap.extractMax());
		}
		else if (this.minHeap.size() - this.maxHeap.size() > 1){
			this.maxHeap.insert(this.minHeap.extractMin());
		}
		
		//set the current median
		if (this.maxHeap.size() < this.minHeap.size()){
			this.median = this.minHeap.getMin();
		} else {
			this.median = this.maxHeap.getMax();   //or this.minHeap.getMin()
		}
		
		/* console.log("Left MaxHeap: " + this.maxHeap.heap);
		console.log("Right MinHeap: " + this.minHeap.heap);
		console.log("Median: " + this.median); */
		
	}

}

//Take input file and perform median maintenance after each line parsed
const parseFile = async (file) => {

	const medianMaintenance = new MedianMaintenance();
	const nums = (await util.promisify(fs.readFile)(file)).toString().split('\r\n');
	const startTime = performance.now();
	
	//each line is a single number
	nums.map(num => {
		if (!num) { return null; }
		medianMaintenance.insert(Number(num));
		medianMaintenance.sum += medianMaintenance.median;
	});
	
	const endTime = performance.now();
	
	console.log(`Median Maintenance took ${endTime - startTime} milliseconds`);   // ~23.84  milliseconds
	
	return medianMaintenance;
}; 


////////////////////////////////////////////////////////////////////////////////////////////////
//Driver

console.log("Beginning MedianMaintenance...");

parseFile('./Median.txt').then((medianMaintenance) => {

	console.log("Sum: " + medianMaintenance.sum);
	console.log("Sum modulo 1000 : " + medianMaintenance.sum % 10000);
	
});

/*
Left MaxHeap: 5,4,2,1,3
Right MinHeap: 6,8,7,10,9
Median: 5 

Final Median: 5000
Sum: 46831213
Sum modulo 1000 : 1213
*/






















