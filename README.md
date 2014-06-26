hex-map
=======

This project is my first attempt at doing javascript or canvas coding.  

I've always been intrigued by turn-based games like Risk, and have always dreamt of doing hexagonal maps if I were to learn enough javascript.  Well, here is that project.

Ongoing Experiments:
- Trying to render 30x30 hex grid in ocanvas.js
	- comparing performance to 30x30 grid using native canvas commands (native is much faster). 
	- More than likely going to abandon ocanvas.js

To-do Experiments:
- Try Kinetic.js to use layering to "highlight" hexes on click events

Overall features to-do list:
- Highlight a given hex
	- Unhighlight on another click
- Add a "properties" object to track various properties for each hex
	- Terrain type
		- Terrain bonuses?
	- Player ownership
	- Amount/Type of units occupying
- Basic combat mechanics
	- Dice rolling
		- combat modifiers
	- Track amount of units for each hex
		- Save in mySQL DB
