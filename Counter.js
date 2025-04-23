"use strict"

/*
 * NAME:            Duc Cam Thai
 * STUDENT NUMBER:  7851908
 * COURSE:          COMP 2150   
 * INSTRUCTOR:      Heather Matheson
 * ASSIGNMENT:      4
 * QUESTION:        1
 * 
 * REMARKS: This program acts as the back-end implementation for the Potato-clicking game, which is based on famous idle game "Cookie Clicker".
 * The game's logic is divided into two parts: The counter responsible for visual updating and keeping track of the potato count and the 
 * potato per second (a.k.a. pps) and the buttons responsible for users interaction with the game. This file is the Counter implementation
 * for the game itself.
 */

/**
 * The main display class for our Potato-clicking game. It consists of logics mostly in terms of displaying the number of potatoes collected,
 * the potato rate (pps), messages and various other features for the game's UI.
 * 
 * @author Student name: Duc Cam Thai, Student number: 7851908
 */
class Counter 
{

	//
	//Instance variables
	//
	#count;  //the current amount of potatoes held
	#name;  //id of the counter in the html file
	#htmlCounter;  //the html element representing the counter
	#htmlPPS;  //the html element representing the pps
	#htmlMessage;  //the html element for showing a message
	#htmlAchievement;  //the html element for showing an achievement
	#rate;  //the pps value
	#multiplier;  //a pps multipler (1 by default)
	#bonusButtonList;  //a list of all BonusButtons
	#perSecond;
	static #timeElapsed = 0;
	#invokeCount;
	//
	//Class constants
	//
	static get #INTERVAL() { return 50; }  //setting the interval to 50 milliseconds
	static get #SECOND_IN_MS() { return 1000; }  //one second in milliseconds
	static get DEFAULT_MESSAGE_DURATION() { return 5; }  //in seconds
	static get #BONUS_APPEARANCE() { return 90; }
	//
	//Constructor
	//
	constructor(name, pps, messageBox, achievementBox)
	{
		this.#count = 0;
		this.#name = name;
		this.#htmlCounter = document.getElementById(name);
		this.#htmlPPS = document.getElementById(pps);
		this.#htmlMessage = document.getElementById(messageBox);
		this.#htmlAchievement = document.getElementById(achievementBox);
		this.#rate = 1;
		this.#multiplier = 1;
		this.#invokeCount = 0;
		this.#initCounter();
		this.#bonusButtonList = [];
	}
	
	//Top secret...
	cheatCode()
	{
		this.#count = 50000000;
	}
	
	//Method that regularly updates the counter and pps texts
	#updateCounter() 
	{
		//Calculates how many update ticks occur per second (e.g., 20 if interval is 50ms):
		this.#perSecond = Counter.#SECOND_IN_MS/Counter.#INTERVAL;

		//Calculates how many potatoes to add this tick based on rate and multiplier:
		let more = this.#rate/this.#perSecond * this.#multiplier;

		//Updates the HTML display for the counter and PPS rate:
		this.#htmlCounter.innerText = `Counter: ${Math.round(this.#count)} potatoes`;
		this.#htmlPPS.innerText = `Potatoes per second: ${(this.#rate * this.#multiplier)} pps`;

		//Shows an achievement message when total count hits a power of 10 (e.g., 10, 100, 1000, etc.):
		let multiple = Math.log10(Math.round(this.#count));
		if (Number.isInteger(multiple) && multiple > 0) {
			const reward = `Congratulations! You made a total of ${Math.round(this.#count)} potatoes`;
			this.showMessage(reward, Counter.DEFAULT_MESSAGE_DURATION, true);
		}

		//Tracks how many ticks have occurred; increment elapsed seconds every 20 ticks (i.e., 1 second):
		this.#invokeCount++;
		if (this.#invokeCount == this.#perSecond) {
			Counter.#timeElapsed++;
			this.#invokeCount = 0;
		}

		//If a multiple of BONUS_APPEARANCE seconds have passed, shows a random bonus button:
		if (Counter.#timeElapsed % Counter.#BONUS_APPEARANCE == 0 && Counter.#timeElapsed > 0) {

			//Generates a random number to fetch the button:
			let rand = Math.floor(Math.random() * this.#bonusButtonList.length);
			let bonusButton = this.#bonusButtonList[rand];

			//Shows the bonus button temporarily (will disappear after a few seconds):
			bonusButton.htmlButton.classList.remove("hidden");
			setTimeout(() => bonusButton.htmlButton.classList.add("hidden"), Counter.DEFAULT_MESSAGE_DURATION*Counter.#SECOND_IN_MS);

			//Resets internal bonus timer:
			Counter.#resetTime();
		}

		//Increments the potato count by the calculated amount for this tick:
		this.#count += more;
	}
	
	//Starting the counter and making sure that it updates every Counter.#INTERVAL milliseconds
	#initCounter()
	{
		setInterval(this.#updateCounter.bind(this), Counter.#INTERVAL);
	}

	/**
	 * Increases the potatoes count by 1. Used by the ClickingButton
	 */
	incrementCount() 
	{
		this.#count++;
	}

	/**
	 * Increases the potato generating rate by the given rate. Used by the BuildingButton.
	 * @param {number} rate The pps rate that needs to be added to the current rate.
	 */
	increaseRate(rate) {
		this.#rate += rate;
	}

	/**
	 * Reduce the amount of potatoes from the given price. Used by the BuildingButton and UpgradeButton.
	 * @param {number} price The price to be deducted from the potato count
	 */
	reduce(price) {
		this.#count -= price;
	}

	/**
	 * Helper method that reset the time back to 0.
	 */
	static #resetTime() {
		Counter.#timeElapsed = 0;
	}
	
	//Method that can be used to present a message: 
	//either a regular message (when the achievement parameter is set to false) OR
	//an achievement message (when the achievement parameter is set to true).
	showMessage(theMessage, time=Counter.DEFAULT_MESSAGE_DURATION, achievement = false)  //time is in seconds;
	{
		let theElement = this.#htmlMessage;
		if (achievement)
			theElement = this.#htmlAchievement;
		theElement.innerHTML = theMessage;
		theElement.classList.remove("hidden");
		//The following statement will make theElement invisible again after [time] seconds
		setTimeout(() => {theElement.classList.add("hidden");}, time * Counter.#SECOND_IN_MS);
	}

	/**
	 * Returns the current number of potatoes in the counter.
	 *
	 * @returns {number} The current count of potatoes.
	 */
	get count() {
		return this.#count;
	}

	/**
	 * Gets the current multiplier applied to the PPS (potatoes per second) rate.
	 * This value is typically affected by bonus buttons.
	 *
	 * @returns {number} The current PPS multiplier.
	 */
	get multiplier() {
		return this.#multiplier;
	}

	/**
	 * Sets a new multiplier to modify the PPS (potatoes per second) rate.
	 * This is usually triggered by bonus buttons during temporary events.
	 *
	 * @param {number} value The new multiplier to apply to the PPS.
	 */
	set multiplier(value) {
		this.#multiplier = value;
	}

	/**
	 * Registers a BonusButton instance to this Counter object.
	 * All registered bonus buttons will be managed internally and displayed randomly
	 * during gameplay based on the bonus appearance timing logic.
	 *
	 * @param {BonusButton} bb The BonusButton to add to the internal list.
	 */
	addBonusButton(bb) {
		this.#bonusButtonList.push(bb);
	}
}


