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
 * potato per second (a.k.a. pps) and the buttons responsible for users interaction with the game. This file acts as the Button's abstract class
 * and uses Javascript hierarchy and polymorphism to handle clicking action processes, simulating user's interaction with the game itself.
 */

/**
 * Abstract class for all buttons in the Potato-clicking game.
 * This class is responsible for the clicking interaction between the user and our game. 
 * It consists of logics mostly in terms of oerforming actions to updating the given text once clicked by the user.
 * 
 * @author Student name: Duc Cam Thai, Student number: 7851908
 */
class Button
{
	//
	//Instance variables
	//
	#name;
	#counter;
	#htmlButton;
	
	//
	//Class constants
	//
	static get TEXT_ATTRIBUTE() { return "-text"; }
	
	//
	//Constructor
	//
	constructor(name, counter)
	{	

		//Throws the error, indicating that this class is not meant to be instantiated (simulating abstract class constructors):
		if (this.constructor.name === "Button")
			throw new Error("This class is abstract and cannot be instantiated!");

		this.#name = name;
		this.#counter = counter;
		this.#htmlButton = document.getElementById(name);
		// Add a click event listener to the button
		this.#htmlButton.addEventListener('click', this.clickAction.bind(this)); //this has a different meaning in this context, so I need to bind my method to it
	}
	
	//Updating the innerHTML text of the button 
	//(note that not all types of buttons have text, but I placed this here to give that code to you)
	updateText(newText)
	{
		document.getElementById(this.name + Button.TEXT_ATTRIBUTE).innerHTML = newText;
	}

	/**
	 * Updates the information. This method acts as a short-handed version for the updateText method as to fix certain informations.
	 * 
	 * @implNote The default updateInformation in the Button class will throw an error, as it is abstract by default.
	 * Subclasses of this class therefore must implement their own logic for this method.
	 */
	updateInfomation() 
	{
		throw new Error("The updateInformation method must be overridden");
	}

	/**
	 * Performs certain action once clicked by the user.
	 * 
	 * @throws {Error} Always throws to indicate unsupported behavior.
	 * 
	 * @implNote The default clickAction in the Button class will throw an error, as it is abstract by default.
	 * Subclasses of this class therefore must implement their own logic for this method.
	 */
	clickAction()
	{
		throw new Error("The clickAction method must be overridden");
	}
	
	//
	//Accessors below that you might find useful
	//
	get name()
	{
		return this.#name;
	}
	
	get counter()
	{
		return this.#counter;
	}
	
	get htmlButton()
	{
		return this.#htmlButton;
	}
}

/**
 * Subclass of the Button abstract class. This class is responsible for adding 1 potato to the total potato count 
 * per click. 
 * 
 * @class ClickingButton
 * @extends {Button}
 * 
 * @author Student name: Duc Cam Thai, Student number: 7851908
 */
class ClickingButton extends Button {

	/**
	 * Indicates the default display time for any messages in this class.
	 * @returns {number} The display time for every message (i.e., 0.1 in this case).
	 */
	static get #DISPLAY_TIME() { return 0.1;}


	/**
	 * Constructs a ClickingButton with the name found in the HTML file and the game's counter.
	 * @param {string} name The name associating with this button (can be found in the HTML file).
	 * @param {number} counter The Counter object associating with this button.
	 */
	constructor(name, counter) {
		super(name, counter);
	}

	/**
	 * Increases the count of potatoes by 1 every time it is clicked.
	 * 
	 * @implSpec The button will generate 1 potato each time it is clicked, and a "+1" message is displayed onto the screen.
	 */
	clickAction() {
		this.counter.incrementCount();
		this.counter.showMessage("+1", ClickingButton.#DISPLAY_TIME);
	}

	/**
	 * Does not actually updates any information as this button only updates the counter directly. Will always throw error if invoked. 
	 * 
	 * @throws {Error} Always throws to indicate unsupported behavior
	 */
	updateInfomation() {
		throw new Error("updateInformation is not supported for this class");
	}
	
}

/**
 * Subclass of the Button abstract class. This class is responsible for generating a building that increases the pps rate in the Counter class
 * permanently, making it generates faster. The cost of each building (i.e., the price) for this button is also increased by 1.5 per building.
 * 
 * @class BuildingButton
 * @extends {Button}
 * 
 * @author Student name: Duc Cam Thai, Student number: 7851908
 */
class BuildingButton extends Button {

	//Instance variables
    #price; //The price for purchasing this building
    #increaseRate; //The increase rate of pps in counter
	#numberOfBuildings; //Total number of buildings bought 

	//Class constants
	/**
	 * Indicates the increase rate per building purchase made by clicking this button.
	 * @returns Rate of update per building bought.
	 */
 	static get #RATE_PER_BUILDING() { return 1.5 };

	/**
	 * Creates a BuildingButton based on with the name found in the HTML file, the game's counter combined with the 
	 * initial price and increase rate for the counter every time a building is bought.
	 * @param {string} name The name of the building for this button.
	 * @param {Counter} counter The Counter object associating with this button.
	 * @param {number} initialPrice The initial price for the first building bought.
	 * @param {number} increaseRate The pps increase rate for the counter per building.
	 */
    constructor(name, counter, initialPrice, increaseRate) {
        super(name, counter);
        this.#price = initialPrice;
        this.#increaseRate = increaseRate;
		this.#numberOfBuildings = 0;
    }

	/**
	 * Buys a building that improves the pps, updates the text and increases this button's price when clicked if there are sufficient 
	 * potatoes. Otherwise displays the error message.
	 * 
	 * @implSpec The button will increase the amount of buildings by 1, updates the pps rate and the new price for this building every
	 * time it is clicked.
	 */
    clickAction() {

        if (this.counter.count >= this.#price) {

			//Reduces the amount of potatoes to buy the building:
			this.counter.reduce(this.#price);

			//Increases the potato production rate after buying:
			this.counter.increaseRate(this.#increaseRate);

			//Increases the price of the next building by 1.5 each time it is purchased:
			this.#price = Math.round(this.#price * BuildingButton.#RATE_PER_BUILDING); 

			//Increases the number of buildings currently in place:
			this.#numberOfBuildings++;

			//Updates the message confirming the building was bought and updates the button's information to match the confirmation:
			this.counter.showMessage("Building bought!");
			this.updateInfomation();

		} else {

			//Shows this message if there is not enough potatoes to buy this building:
			this.counter.showMessage("Insufficient potatoes!");

		}
    } 

	/**
	 * Updates the information. The format of the updated text can be found in the HTML file.
	 * 
	 * @implNote The following format is used to update the text for this button:
	 * 		`${this.#numberOfBuildings} ${this.name}<br>Cost: ${this.#price}<br> Adds: ${this.#increaseRate} pps`
	 */
	updateInfomation() {

		//Generates the updated label that matches the format in the HTML file, then updates it:
		const label = `${this.#numberOfBuildings} ${this.name}<br>Cost: ${this.#price}<br> Adds: ${this.#increaseRate} pps`;
		super.updateText(label); 

	}

	/**
	 * Returns the current increase rate of the building, which determines how much this building
	 * adds to the potatoes per second (PPS) rate in the Counter.
	 *
	 * @returns {number} The increase rate of this building.
	 */
	get increaseRate() {
		return this.#increaseRate;
	}

	/**
	 * Multiplies the current PPS increase rate by a given value. This is typically used by
	 * UpgradeButton to double the production rate of this building.
	 *
	 * @param {number} rate The multiplier to apply to this building's PPS rate.
	 */
	multiplier(rate) {
		this.#increaseRate *= rate;
	}

	/**
	 * Returns the total number of buildings that have been purchased so far using this button.
	 * This is useful when calculating total PPS contribution or upgrade impact.
	 *
	 * @returns {number} Number of buildings bought.
	 */
	get numberOfBuildings() {
		return this.#numberOfBuildings;
	}

	/**
	 * Returns a string representation of the building button for debugging or display purposes.
	 * Includes the name of the building followed by the word "Button".
	 *
	 * @returns {string} A string describing this BuildingButton.
	 */
	toString() {
		return this.name + " Button";
	}
	
}

/**
 * Subclass of the Button abstract class. This class is responsible for upgrading the buildings from the BuildingButton associating with it.
 * Each upgrade bought increases the buildings' improve rate, which can be reflected in the Counter class if the buildings themselves are 
 * already bought. The cost of each upgrade (i.e., the price) for this button is also increased by 5 per purchase.
 * 
 * @class BuildingButton
 * @extends {Button}
 * 
 * @author Student name: Duc Cam Thai, Student number: 7851908
 */
class UpgradeButton extends Button {

	//Instance variables
	#buildingButton; //The building button associated with this upgrade button
	#price; //The price to buy this upgrade
	#improveRate; //The improve rate for the buildings 
	#upgradesCount; //Keeps track the number of upgrades bought

	//Class constants
	/**
	 * Indicates the increase rate per upgrade made by clicking this button.
	 * @returns Rate of update per upgrade bought.
	 */
	static get #UPGRADE_COST() { return 5; }

	/**
	 * Creates an UpgradeButton based on with the name found in the HTML file, the game's counter combined with the 
	 * initial price, the improve rate each upgrade and the BuildingButton that this button associates with.
	 * @param {string} name The name of the upgrade for this button.
	 * @param {Counter} counter The Counter object associating with this button.
	 * @param {number} initialPrice The initial price for the first upgrade bought.
	 * @param {number} improveRate The multiplier for the buildings after each upgrade is bought.
	 * @param {BuildingButton} buildingButton The BuildingButton that this button is responsible with upgrading.
	 */
	constructor(name, counter, initialPrice, improveRate, buildingButton) {
		super(name, counter);
		this.#price = initialPrice;
		this.#improveRate = improveRate;
		this.#buildingButton = buildingButton;
		this.#upgradesCount = 0;
	}

	/**
	 * Upgrades the building class that improves its pps increase rate, updates both texts for this button and the associating building, then
	 * increases the rate of pps for these buildings when clicked if there are sufficient potatoes. Otherwise displays the error message.
	 * 
	 * @implSpec The button will increase the pps rate of the given building button by the improveRate amount. This is distributed evenly to all
	 * buildings. On the side note, the pps rate in counter will not updated automatically if there are no buildings built. Both texts in this
	 * button and the building button will also be updated accordingly.
	 */
	clickAction() {
		
		if (this.counter.count >= this.#price) {

			//Reduces the amount of potatoes to upgrade the buildings:
			this.counter.reduce(this.#price);

			//Increases the pps rate of all buildings by a multiple of this improve rate:
			this.#buildingButton.multiplier(this.#improveRate);

			// Calculates the new price for the next upgrade (i.e., the price will be 5 times higher):
			this.#price *= UpgradeButton.#UPGRADE_COST;

			//Calculates the improvement rate per building:
			let improvementPerBuilding = this.#buildingButton.increaseRate/this.#improveRate;

			//Calculates the new pps rate and updates it in the counter (depends on the number of buildings built in BuildingButton):
			let counterUpdate = this.#buildingButton.numberOfBuildings * improvementPerBuilding;
			this.counter.increaseRate(counterUpdate);

			//Increases the number of upgrades:
			this.#upgradesCount++;

			//Updates the message confirming the building was bought, then updates both this button's and the 
			//associating BuildingButton's information to match the confirmation:
			this.counter.showMessage("Building upgraded!");
			this.#buildingButton.updateInfomation();
			this.updateInfomation();

		} else {

			//Shows this message if there is not enough potatoes to buy this building:
			this.counter.showMessage("Insufficient potatoes!");

		}
	}	

	/**
	 * Updates the information. The format of the updated text can be found in the HTML file.
	 * 
	 * @implNote The following format is used to update the text for this button:
	 * 		`${this.#upgradesCount} ${this.name}<br>Cost: ${this.#price}<br>${this.#buildingButton} x ${this.#improveRate}}`
	 */
	updateInfomation() {

		//Generates the updated label that matches the format in the HTML file, then updates it:
		const label = `${this.#upgradesCount} ${this.name}<br>Cost: ${this.#price}<br>${this.#buildingButton} x ${this.#improveRate}}`;
		super.updateText(label);

	}

	/**
	 * Returns the price of this upgrade button.
	 * 
	 * @returns {number} The price of this button.
	 */
	get price() {
		return this.#price;
	}

}

/**
 * Subclass of the Button abstract class. This class is responsible for managing temporary bonuses that 
 * multiply the potato production rate (PPS) for a fixed duration when clicked. A bonus will appear on 
 * the screen every 90 seconds, and if clicked, it will apply a multiplier to the current PPS rate for 
 * a defined amount of time (e.g., 10 seconds), after which the bonus expires and the rate returns to normal.
 *
 * The bonus button hides itself after being clicked and shows a message about the bonus activation and expiration.
 *
 * @class BonusButton
 * @extends {Button}
 * 
 * @author Student name: Duc Cam Thai, Student number: 7851908
 */
class BonusButton extends Button {

	//Instance variables
	#multiplier; //The multiplier value (e.g., 2x, 3x, etc.)
	#duration; //The duration of the bonus effect in seconds

	// Class constants
	/**
	 * Duration (in seconds) for how long the message will appear on screen when a bonus is activated.
	 * @returns {number} Seconds the message is shown.
	 */
	static get #ON_SCREEN() { return 5; }

	/**
	 * Number of milliseconds in one second, used for timeouts.
	 * @returns {number} 1000
	 */
	static get #SECOND_IN_MS() { return 1000; }
    
	/**
	 * Constructs a BonusButton instance that appears on the screen and boosts PPS temporarily when clicked.
	 *
	 * @param {string} name The name associating with this button (can be found in the HTML file).
	 * @param {Counter} counter The Counter object associated with this button.
	 * @param {number} multiplier The multiplier to apply to the PPS (e.g., 2 for double).
	 * @param {number} duration Indicates long (in seconds) the bonus lasts
	 */
	constructor(name, counter, multiplier, duration) {
		super(name, counter);
		this.#multiplier = multiplier;
		this.#duration = duration;
	}

	/**
	 * Applies the bonus effect to the game. Multiplies the pps by the multiplier and displays a message
	 * indicating the bonus is active. After the duration expires, resets the pps multiplier and shows a message.
	 * 
	 * @implSpec This method handles the click event for the bonus button. It applies the bonus immediately
	 * and schedules a timeout to revert it after the specified duration.
	 */
	clickAction() {

		//Applies the multiplier to the Counter's multiplier
		this.counter.multiplier *= this.#multiplier;

		//Displays the bonus activation message once this is clicked:
		const message = `${this.name} started!<br>${this.#multiplier} x pps for ${this.#duration} seconds!`;
		this.counter.showMessage(message, BonusButton.#ON_SCREEN);

		//Hides the bonus button immediately after it is clicked:
		this.htmlButton.classList.add("hidden");

		//Schedules the bonus expiration after the duration (in milliseconds):
		setTimeout(() => {
			this.counter.multiplier /= this.#multiplier; //Reverts the multiplier
			this.counter.showMessage(`${this.name} ended`, 2); //Shows the expiration message
		}, this.#duration * BonusButton.#SECOND_IN_MS);

	}

	/**
	 * Does not actually updates any information as this button only updates the counter directly. Will always throw error if invoked. 
	 * 
	 * @throws {Error} Always throws to indicate unsupported behavior
	 */
	updateInfomation() {
		throw new Error("updateInformation is not supported for this class");
	}
}