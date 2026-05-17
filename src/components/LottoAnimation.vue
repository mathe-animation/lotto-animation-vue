<template>

  <div id="app" class="box" style="grid-area: box2;">
</div>

</template>

<script setup lang="js">
import { ref } from "vue"

const counter_bubbles = ref(0);

let { Engine, Render, World, Bodies, Body, Events, Runner} = Matter;
let engine = Engine.create();
let wheel;
let runner = Runner.create();

// Will execute myCallback every 0.5 seconds 
var intervalID = window.setInterval(myCallback, 2000);

function myCallback() {
 if (k_slider.value > counter_bubbles) {
	let number_missing = k_slider.value - counter_bubbles;
	if (number_missing > 0) {
		for (let i = 0; i < number_missing; ++i) {
			addCircle({
			x: width / 2 + i * 1.5,
			y: height / 2 + i * 1.5,
			r: 5,
			options: {
				mass: 1 + i * 2,
				friction: 0,
				frictionStatic: 0,
				// frictionStatic: 5,
				label: 'ball',
				render: {
				opacity: 0.6,
				},
				collisionFilter: {
				category: 0x0002,
				mask: 0x0002 | 0x0001
				}
			}
			});
		}
	}
 }

 if (k_slider.value < counter_bubbles) {
	let number = k_slider.value - counter_bubbles;
	if (number_missing > 0) {
		for (let i = 0; i < number_missing; ++i) {
			addCircle({
			x: width / 2 + i * 1.5,
			y: height / 2 + i * 1.5,
			r: 5,
			options: {
				mass: 1 + i * 2,
				friction: 0,
				frictionStatic: 0,
				// frictionStatic: 5,
				label: 'ball',
				render: {
				opacity: 0.6,
				},
				collisionFilter: {
				category: 0x0002,
				mask: 0x0002 | 0x0001
				}
			}
			});
		}
	}
 }
}


function setup () {
  const width = window.innerWidth/4;
  const height = window.innerHeight/2;
  // create an engine

  // create a renderer
  let render = Render.create({
      element: document.getElementById('app'),
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: "#fff",
        showAngleIndicator: true,
      }
  });

  let parts = [];
  let bodies = [];
  for (let i = 0; i < 90; i++) {
    let a = Bodies.rectangle(
      width / 2 + Math.cos(i * 4 * Math.PI / 180) * 120, 
      height / 2 + Math.sin(i * 4 * Math.PI / 180) * 120 , 
      10, 
      12, 
      {
        isStatic: true, 
        friction: 0.5,
        angle: Math.PI / 180 * i * 4,
        render: {
          fillStyle: i !== 0 ? "#000" : '#fff',
          strokeStyle: "#fff",
          lineWidth: 0
        }
      }
    );
    parts.push(a);
    World.add(engine.world, a);
  }

  wheel = Body.create({ parts, isStatic: true });

  for (let i = 20; i < 45; i++) {
    let a = Bodies.rectangle(
      width / 2 + Math.cos(i * 4 * Math.PI / 180) * 120, 
      height / 2 + Math.sin(i * 4 * Math.PI / 180) * 120, 
      30, 
      30, 
      {
        isSensor: true,
        isStatic: true, 
        friction: 0,
        label: 'addSpeedSensor',
        angle: Math.PI / 180 * i * 4,
        render: {
          strokeStyle: '#C44D58',
          fillStyle: 'transparent',
          lineWidth: 1
        }
      }
    );
    World.add(engine.world, a);
  }

  Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs;
    for (let i = 0, j = pairs.length; i != j; ++i) {
        let pair = pairs[i];
        let { bodyA, bodyB } = pair; 

        if (bodyA.label === 'addSpeedSensor') {
          Body.setVelocity(bodyB, {x: -2.5, y: -2.5})
          // Body.applyForce(bodyB, {x: bodyB.position.x, y: bodyB.position.y}, {x: custForceX, y: custForceY})
        } else if (bodyB.label === 'addSpeedSensor') {
          // Body.applyForce(bodyA, {x: bodyA.position.x, y: bodyA.position.y}, {x: -0.1, y: -0.05})
        }
    }
  });

  draw();

  for (let i = 0; i < 49; ++i) {
    addCircle({
      x: width / 2 + i * 1.5,
      y: height / 2 + i * 1.5,
      r: 5,
      options: {
        mass: 1 + i * 2,
        friction: 0,
        frictionStatic: 0,
        // frictionStatic: 5,
        label: 'ball',
        render: {
          opacity: 0.6,
        },
        collisionFilter: {
          category: 0x0002,
          mask: 0x0002 | 0x0001
        }
      }
    });
  }

  /*for (let i = 15; i < 25; ++i) {
    addCircle({
      x: width / 2 + i * 1.5,
      y: height / 2 + i * 1.5,
      r: 18,
      options: {
        mass: 1 + i * 2,
        friction: 0,
        frictionStatic: 0,
        // frictionStatic: 5,
        label: 'ball',
        collisionFilter: {
          category: 0x0004,
          mask: 0x0004 | 0x0001
        }
      }
    });
  }*/
  

  // add all of the bodies to the world
  World.add(engine.world, bodies);

  // run the engine
  //Engine.run(engine);
  Matter.Runner.run(engine);

  // run the renderer
  Render.run(render);
  Runner.run(runner, engine);
}

function addBody (...bodies) {
  World.add(engine.world, bodies);
}

function addCircle ({ x = 0, y = 0, r = 10, options = {} } = {}) {
  let body = Bodies.circle(x, y, r, options);
  addBody(body);
  counter_bubbles.value = counter_bubbles.value + 1;
  return body;
}

function draw () {
  Body.rotate(wheel, Math.PI/120);
  window.requestAnimationFrame(draw);
}

setup();
</script>