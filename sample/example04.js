var cars = []

var car1 = {
	name : "sonata",
	ph : "500ph",
	start : function () {
		console.log("engine is starting " + car1.ph);
	},
	stop : function () {
		console.log("engine is stoped");
	}
}

var car2 = {
	name : "bmw",
	ph : "800ph",
	start : function () {
		console.log("engine is starting " + car2.ph);
	},
	stop : function () {
		console.log("engine is stoped");
	}
}

cars[0] = car1;
cars[1] = car2;

console.log(cars[0].name);
console.log(cars[1].name);