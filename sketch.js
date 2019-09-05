let video
let poseNet
let poses = []
let boxes = []
let lastKeypoints = [] // The most recent keypoints

// module aliases
var Engine = Matter.Engine
// Render = Matter.Render,
var World = Matter.World
var Bodies = Matter.Bodies

// create an engine
var engine = Engine.create()
var world = engine.world
let arm

function setup() {
  createCanvas(640, 480)
  video = createCapture(VIDEO)
  video.size(width, height)

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, 'single', modelReady)
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', results => {
    poses = results

    if (!arm) {
      arm = createArmBody(lastKeypoints)
      if (arm) {
        World.add(world, arm)
        randomBox()
      }
    }
  })
  // Hide the video element, and just show the canvas
  video.hide()
}

const canv = document.getElementById('defaultCanvas0')

function modelReady() {
  select('#status').html('Model Loaded')
}

function draw() {
  image(video, 0, 0, width, height)

  // We can call both functions to draw all keypoints and the skeletons
  // drawKeypoints()
  // drawSkeleton()

  Engine.update(engine) // Update the physics engine.
  drawPhysics() // Draw the physics objects.
  updateKeypoints()

  if (arm) updateArmBody(arm, lastKeypoints)
}

function drawPhysics() {
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].show()
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j]
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0)
        noStroke()
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10)
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0]
      let partB = skeleton[j][1]
      stroke(255, 0, 0)
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y)
    }
  }
}

function updateKeypoints() {
  // If there are no poses, ignore it.
  if (poses.length <= 0) {
    return
  }

  // Otherwise, let's update the lastKeypoints.
  let pose = poses[0].pose
  let keypoints = pose.keypoints
  // console.log(keypoints)

  for (let kp = 0; kp < keypoints.length; kp++) {
    lastKeypoints[kp] = keypoints[kp].position
  }
}

function getArmPoints(keypoints) {
  const leftShoulder = keypoints[5] || { x: 0, y: 0 }
  const rightShoulder = keypoints[6] || { x: 1, y: 1 }
  const leftElbow = keypoints[7] || { x: 2, y: 2 }
  const rightElbow = keypoints[8] || { x: 3, y: 3 }
  const leftWrist = keypoints[9] || { x: 4, y: 4 }
  const rightWrist = keypoints[10] || { x: 5, y: 5 }

  return [
    { x: width / 2 - 50, y: height },
    leftWrist,
    leftElbow,
    leftShoulder,
    rightShoulder,
    rightElbow,
    rightWrist,
    { x: width / 2 + 50, y: height }
  ]
}

// create a physics body with the shape of the arms
function createArmBody(keypoints) {
  const armPoints = getArmPoints(keypoints)
  // console.log(armPoints)
  // const armVectors = armPoints.map(point => point.position || point)
  // console.log(armVectors)
  let armBody
  try {
    armBody = Matter.Bodies.fromVertices(0, 0, armPoints)
    const bounds = Matter.Bounds.create(armPoints)
    Matter.Body.setPosition(armBody, {
      x: armBody.position.x - armBody.bounds.min.x + bounds.min.x,
      y: armBody.position.y - armBody.bounds.min.y + bounds.min.y
    })

    Matter.Body.setStatic(armBody, true)
  } catch (error) {}

  return armBody
}

function updateArmBody(armBody, keypoints) {
  const armPoints = getArmPoints(keypoints)

  Matter.Body.setVertices(armBody, armPoints)

  const bounds = Matter.Bounds.create(armPoints)
  Matter.Body.setPosition(armBody, {
    x: armBody.position.x - armBody.bounds.min.x + bounds.min.x,
    y: armBody.position.y - armBody.bounds.min.y + bounds.min.y
  })
}

function randomBox() {
  setInterval(() => {
    //   var x = width / 2
    //   var y = 0
    //   boxes.push(new Box(x, y, 30, 30, World))

    // for (let i = 0; i < 100; i++) {
    var x = random(0, width)
    var y = random(0, -200)
    boxes.push(new Box(x, y, 30, 30, World))
    // }
  }, 100)
}

function mousePressed() {
  // var x = width / 2
  // var y = 0
  // boxes.push(new Box(x, y, 30, 30, World))

  randomBox()
}
