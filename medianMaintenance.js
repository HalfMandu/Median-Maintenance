/*
	Median Maintenance
	Stephen Rinkus
	
		Given a sequence of numbers x1, x2, ...xn, return the median of the elements at each interval.
		Stays in linear time.
		
		Uses 2 heaps: a MinHeap and a MaxHeap. At all times the median is either the max of the MaxHeap or the min of the MinHeap.
			-If i is even, both are medians. If i is odd, then lies on side whichever heap has more elements.
			-If one heap has more than 1 than other, extract from larger side and add it to other to rebalance.
		
		
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

//Take input file and output an array of numbers
const parseFile = async (file) => {

	const lines = (await util.promisify(fs.readFile)(file)).toString().split('\r\n');
	const nums = [];
	
	//each line is a single number
	lines.map(num => {
		if (!num) { return null; }
		nums.push(Number(num));
	});

	return nums;
}; 


////////////////////////////////////////////////////////////////////////////////////////////////
//Driver

const medianMaintenance = new MedianMaintenance();
//const nums2 = [6,3,1,9,2,4,10,8,5,7];

console.log("Beginning MedianMaintenance...");

parseFile('./Median.txt').then((nums) => {
	
	let sum = 0;
	const startTime = performance.now();
	
	for (let num of nums){
		medianMaintenance.insert(num);
		sum += medianMaintenance.median;
	}

	const endTime = performance.now();
	
	console.log("Final Median: " + medianMaintenance.median);
	console.log("Sum: " + sum);
	console.log("Sum modulo 1000 : " + sum % 10000);
	
	console.log(`MedianMaintenance took ${endTime - startTime} milliseconds`);   // ~26.84  milliseconds
	
});

/*
Left MaxHeap: 5,4,2,1,3
Right MinHeap: 6,8,7,10,9
Median: 5 

Final Median: 5000
Sum: 46831213
Sum modulo 1000 : 1213
*/






















