export default Ember.Route.extend({
  model: function() {
    return {
      ship: {
        sprite: "img/ship.png",
        booster: "img/flames.png",
        maxThrust: 14,
        fuel: 10,
        engine: "sounds/jet_loop_rq87086.mp3"
      },
      levels: [
      {
        name: "The first level",
        planets: [
          {
            location: {x: 700, y: -200},
            radius: 50,
            mass: 900,
            image: "img/planet.png"
          },
          {
            location: {x: 1200, y: -300},
            radius: 50,
            mass: 900,
            image: "img/planet.png"
          },
          {
            location: {x: 400, y: 200},
            radius: 50,
            mass: 900,
            image: "img/planet.png"
          },
          {
            location: {x: 650, y: 440},
            radius: 25,
            mass: 1200,
            image: "img/planet3.png"
          },
          {
            location: {x: 1300, y: 600},
            radius: 50,
            mass: 800,
            image: "img/planet2.png"
          },
          {
            location: {x: -500, y: 30},
            radius: 50,
            mass: 800,
            image: "img/planet2.png"
          },
          {
            location: {x: -200, y: -600},
            radius: 50,
            mass: 800,
            image: "img/planet2.png"
          }
        ],
        waypoints: [
          {x: 780,  y: 440, fuel: 4},
          {x: 1050, y: 30,  fuel: 3},
          {x: 1190, y: 400, fuel: 2},
          {x: -190, y: -400, fuel: 2}
        ]
      },
      {
        name: "The Second level",
        planets: [
          {
            location: {x: 200, y: 200},
            radius: 50,
            mass: 900,
            image: "img/planet.png"
          },
          {
            location: {x: 650, y: 440},
            radius: 25,
            mass: 1200,
            image: "img/planet3.png"
          },
          {
            location: {x: 1300, y: 600},
            radius: 50,
            mass: 800,
            image: "img/planet2.png"
          }
        ],
        waypoints: [
          {x: 780,  y: 440, fuel: 4},
          {x: 1050, y:  30, fuel: 3},
          {x: 1190, y: 400, fuel: 2}
        ]
      }
      ]
    };
  }
})