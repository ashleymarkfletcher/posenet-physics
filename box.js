// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/urR596FsU68
const possibleColours = ['#77F09B', '#77F09B', '#F5B862', '#F55F5F', '#F55F5F']

function Box(x, y, w, h, World) {
  var options = {
    friction: 0.3,
    restitution: 0.6
  }
  this.body = Bodies.circle(x, y, w / 2, options)
  // this.body = Bodies.rectangle(x, y, w, h, options)
  this.w = w
  this.h = h
  World.add(world, this.body)

  this.colour = possibleColours[Math.floor(Math.random() * possibleColours.length)]

  this.show = function() {
    var pos = this.body.position
    var angle = this.body.angle
    push()
    translate(pos.x, pos.y)
    rotate(angle)
    rectMode(CENTER)
    strokeWeight(1)
    stroke(255)
    noStroke()
    fill(this.colour)
    // rect(0, 0, this.w, this.h)

    circle(0, 0, this.w)
    pop()
  }
}
