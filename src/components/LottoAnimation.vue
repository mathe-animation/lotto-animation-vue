<template>

  <div id="app2" :key="renderComponent.value"></div>

</template>

<script setup lang="js">
import { ref, onMounted, render } from 'vue'
import { nextTick } from 'vue'
import Matter from "matter-js"
import { simulation_running } from '../assets/store'
import { renderComponent } from '../assets/store'

/*var intervalID = window.setInterval(myCallback, 500);
let simulation_running_guess = simulation_running.value;

async function myCallback() {
    if (simulation_running.value != simulation_running_guess) {
      simulation_running_guess = simulation_running.value;
      forceRender();

    }
}*/

/*let animation_size_adjusted = false;

addEventListener("resize", (event) => { })

onresize = (event) => { 
  animation_size_adjusted = false;
  setTimeout(() => {
  console.log("this is the third message");
}, 1000);
}

// Will execute myCallback every 0.5 seconds 
var intervalID = window.setInterval(myCallback, 1000);

function myCallback() {
 if (animation_size_adjusted == false) {
  setup();
  animation_size_adjusted = true;
 }
}*/

onMounted(() => {
  setup();
})



let { Engine, Render, World, Bodies, Body, Events, Runner, Vector } = Matter;
let engine = Engine.create();
let wheel;
let runner = Runner.create();

const counter_bubbles = ref(0);
const circles = [];

const k_slider = ref(49);

/*const forceRender = async () => {
  // Here, we'll remove MyComponent
  renderComponent.value = false;

  // Then, wait for the change to get flushed to the DOM
  await nextTick();

  // Add MyComponent back in
  renderComponent.value = true;
};*/

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getWidth() {
  if (window.innerWidth > 900) {
    return window.innerWidth / 2;
  }
  if (window.innerWidth <= 900) {
    return window.innerWidth / 4;
  }
}

function getHeight() {
  if (window.innerWidth > 900) {
    return 360;
  }
  if (window.innerWidth <= 900) {
    return 360;
  }
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

async function setup() {
  const width = 300;//getWidth();
  const height = getHeight(); //window.innerHeight/2;
  // create an engine

  // create a renderer
  let render = Render.create({
    element: document.getElementById('app2'),
    engine: engine,
    options: {
      width: width,
      height: height,
      wireframes: false,
      background: "#2d0030",
      showAngleIndicator: true,
    }
  });
  
  let parts = [];
  let bodies = [];
  for (let i = 0; i < 93; i++) {
    let a = Bodies.rectangle(
      width / 2 + Math.cos(i * 4 * Math.PI / 180) * 120,
      height / 2 + Math.sin(i * 4 * Math.PI / 180) * 120 -35,
      9,
      12,
      {
        isStatic: true,
        friction: 5,
        angle: Math.PI / 180 * i * 4,
        render: {
          fillStyle: i !== 0 ? "#ff9999" : '#ff0000',
          strokeStyle: "#ff9999",
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
        height / 2 + Math.sin(i * 4 * Math.PI / 180) * 120 -35,
        30,
        30,
        {
          isSensor: true,
          isStatic: true,
          friction: 0,
          label: 'addSpeedSensor',
          angle: Math.PI / 180 * i * 4,
          render: {
            strokeStyle: '#6e9fc1',
            fillStyle: 'transparent',
            lineWidth: 1
          }
        }
      );
      World.add(engine.world, a);
    }
  

  //stand for wheel
  for (let i = 0; i < 3; i++) {
    let b = Bodies.trapezoid(
      150,
      320,
      180,
      50,
      0.6,
      {
        isStatic: true,
        friction: 0.5,
        angle: 0,
        render: {
          fillStyle: "#ff9999",
          strokeStyle: "#ff9999",
          lineWidth: 5
        }
      }
    );
    bodies.push(b);
    World.add(engine.world, b);
  }


  Events.on(engine, 'collisionStart', function (event) {
    var pairs = event.pairs;
    for (let i = 0, j = pairs.length; i != j; ++i) {
      let pair = pairs[i];
      let { bodyA, bodyB } = pair;

      if (bodyA.label === 'addSpeedSensor') {
        Body.setVelocity(bodyB, { x: -2.5, y: -2.5 })
        // Body.applyForce(bodyB, {x: bodyB.position.x, y: bodyB.position.y}, {x: custForceX, y: custForceY})
      } else if (bodyB.label === 'addSpeedSensor') {
        // Body.applyForce(bodyA, {x: bodyA.position.x, y: bodyA.position.y}, {x: -0.1, y: -0.05})
      }
    }
  });

  draw();
  let min = -50;
  let max = 50;
  for (let i = 0; i < 9; ++i) {
    addCircle({
      x: width / 2 + i * 1.5 + getRandomArbitrary(min, max),
      y: height / 2 + i * 1.5 -35 + getRandomArbitrary(min, max),
      r: 18,
      options: {
        mass: 1 + i * 2,
        friction: 0,
        frictionStatic: 0,
        // frictionStatic: 5,
        label: 'ball',
        render: {
          opacity: 1,
          fillStyle: '#ff9999',
          strokeStyle: '#000',
        },
        collisionFilter: {
          category: 0x0002,
          mask: 0x0002 | 0x0001
        }
      }
    });
  }


for (let i = 15; i < 22; ++i) {
    addCircle({
      x: width / 2 + i * 1.5 + getRandomArbitrary(min, max),
      y: height / 2 + i * 1.5 -35 + getRandomArbitrary(min, max),
      r: 18,
      options: {
        mass: 1 + i * 2,
        friction: 0,
        frictionStatic: 0,
        // frictionStatic: 5,
        label: 'ball',
        render: {
          opacity: 1,
          fillStyle: '#ee0',
          strokeStyle: '#000',
        },
        collisionFilter: {
          category: 0x0004,
          mask: 0x0004 | 0x0001
        }
      }
    });
}


  // add all of the bodies to the world
  World.add(engine.world, bodies);

// run the renderer
Render.run(render);

// create runner

// run the engine
Runner.run(runner, engine);
}

function addBody(...bodies) {
  World.add(engine.world, bodies);
}

async function addCircle({ x = 0, y = 0, r = 10, options = {} } = {}) {
  let body = Bodies.circle(x, y, r, options);
  addBody(body);
  //circles.push(Matter.Bodies.circle(200, 50, 5));
  //counter_bubbles.value = counter_bubbles.value + 1;
  return body;
  //return Matter.Bodies.circle(200, 50, 5);
}

function draw() {
  if (simulation_running.value == true) { 
  Body.rotate(wheel, Math.PI / 120);
  engine.gravity.scale = 0.001
  engine.timing.timeScale = 1

  } else {
   Body.rotate(wheel, Math.PI / 1800);
   //engine.gravity = Vector.create(0,0);
   engine.gravity.scale = -0.000005
   engine.timing.timeScale = 0.9
  }
  window.requestAnimationFrame(draw);
}

</script>