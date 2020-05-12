// Work2 반복문을 통해서 소나타라는 자동차가 배열에 존재하면 '존재합니다!' 라는 구문을 출력 (for / if)

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

var car3 = {
	name : "audi",
	ph : "800ph",
	start : function () {
		console.log("engine is starting " + car3.ph);
	},
	stop : function () {
		console.log("engine is stoped");
	}
}

var car4 = {
	name : "sm7",
	ph : "600ph",
	start : function () {
		console.log("engine is starting " + car4.ph);
	},
	stop : function () {
		console.log("engine is stoped");
	}
}

var car5 = {
	name : "k9",
	ph : "700ph",
	start : function () {
		console.log("engine is starting " + car5.ph);
	},
	stop : function () {
		console.log("engine is stoped");
	}
}

var cars = [car1, car2, car3, car4, car5];

for(i=0; i<cars.length; i++) {
    if(cars[i].name == 'sonata') {
        console.log("존재합니다!");
        return;
    }
}

console.log('존재하지 않습니다.');
