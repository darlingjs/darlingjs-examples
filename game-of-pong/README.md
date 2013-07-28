Game of Pong
============

The game developed almost without any additional modules. Main goal of the game example
to show simple way to create modules, systems, components and combine them into the game.
It's heavily based on [CraftyJs example](http://craftyjs.com/tutorial/getting-started/how-crafty-works).

# Demo 
[![](https://lh5.googleusercontent.com/-80qp7uh3EZM/UfUXEVNq6TI/AAAAAAAAfoo/twveW1uDI2A/s0/2013-07-28_15-05-19.png)](http://darlingjs.github.io/games/game-of-pong/)

# Deps
* [darlingjs-geometry-module](https://github.com/darlingjs/darlingjs-geometry-module) - use ng2D component.

# What's Inside?

* js/game.js - main js file create darlingjs world, add all needed systems, build entities and start the game world.
* js/dom.js - renderer module, use DOM to visualize color boxes;
* js/control.js - module of paddles control, handle keydown/keyup event and control paddles;
* js/physics.js - module of physics, simulate collision of paddles with ball and result impulses;
* js/gameplay.js - module of gameplay, control wherever ball on in game, if it out recalculate players scores and render them to the DOM;
