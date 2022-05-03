
let device;
let bColor;

//enter utc offset integer value here: -5, 1, ect
function showTime(offset) {
    adjust = 5;
    //this code for the showTime function is from  https://codepen.io/afarrar/pen/JRaEjP
    //I kind of dont know how this works, but keep in mind that when using date.getHours() and such, that it might use your computer's hours and time
    //in short, it might return the time of your location instead of chicago time 
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var hour = date.getHours();//get 24 hr format for other things used later (backround colour)
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var session = "AM";

    //local hour is the current hour in chicago, adusts it into UTC time by adding 5 hours bc 5 hours behind, the add the offset of desired location
    LOCAL_hour = (h + adjust + offset);
    if ( (LOCAL_hour) > 24) {
        LOCAL_hour = LOCAL_hour - 24;
    }
    if (LOCAL_hour > 12){
        LOCAL_hour = LOCAL_hour - 12;
    }

    if (h == 0) {
        h = 12;
    }
    if (h > 12) {
        h = h - 12;
        session = "PM";
    }

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    var LOCALtime = (LOCAL_hour) + ":" + m + ":" + s + " " + session;

    //chicago utc time is 5 hours behind so add 5
    UTC_hour = (hour + adjust);
    if ( (UTC_hour) > 24) {
        UTC_hour = UTC_hour - 24
    }

    UTCtime = [UTC_hour, m, s]

    output = [LOCALtime, LOCAL_hour]
    return (output);
}
showTime();
//log local time
//console.log( showTime(1) );
//console.log( showTime(-5) );
//remember, it outputs UTC time vv
//console.log( showTime(1)[0] );
//console.log( showTime(-5)[0] );




//cities lat, lon, UTC offest    I now relize I could put these in objects but it's too late now

chicago = ['41.8781', '-87.6298', -5];
london = ['51.5072', '-0.1276', 1];
tokyo = ['35.6762', '139.6503', 9] ; //for some reason tokyo shows up as Horinouchi in the API
delhi = ['28.7041', '77.1025', 3];


//call API w ajax
function getValue(value, city) {
    let lat = city[0];
    let lon = city[1];
    let API_key = 'eaed8f7795a60065d306d697c6cd843a';
    let units = 'metric'

    $.ajax({
        //always use this format when calling on a API
        type: "GET",
        dataType: 'json',
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&$units=${units}`,
        async: false,
        crossDomain: true,

        complete: function (out) {
            console.log(out);
            //console.log(out.responseJSON.wind.speed);
            //console.log(out.responseJSON.weather[0].main);
            //console.log(out.responseJSON.timezone);
            //console.log( ((out.responseJSON.timezone) / (-60 * 60)) );

            if (value === "weather") {
                currWeath = (out.responseJSON.weather[0].main);
                return (currWeath);
            }
            if (value === "wind") {
                wSpeed = (out.responseJSON.wind.speed);
                return (wSpeed);
            }
            if (value === "temp") {
                temperature = ((out.responseJSON.main.temp) - 273.15) * (9 / 5) + 32;
                return (temperature);
            }
            if (value === "R") {
                R = (out.responseJSON.main.temp) / ((out.responseJSON.timezone) / (-60 * 60));
                //console.log(`${R}`);
                return (R);
            }
            if (value === "G") {
                G = (out.responseJSON.main.temp_max) / ((out.responseJSON.timezone) / (-60 * 60));
                //GG = G * (((showTime(5)[1][0] - 5)/24)+1);
                //console.log(G);
                //console.log(GG);
                return (G);
            }
            if (value === "B") {
                B = (out.responseJSON.main.temp_min) / ((out.responseJSON.timezone) / (-60 * 60));
                return (B);
            }
        }

    });

}

//find which timezone it is
// if (out.responseJSON.timezone = -18000) {
//     timezone = "Central Time"
// }

$(".snowing").hide();
$(".raining").hide();
$(".dusting").hide();
$(".Chicago").hide();
$(".London").hide();
$(".Tokyo").hide();
$(".Delhi").hide();




//all of below is to make the midi work. lines 72-135
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(success, failure);
}
function success(midiAccess) {
    //console.log(midiAccess);
    midiAccess.addEventListener('statechange', updateDevices);
    const inputs = midiAccess.inputs;
    //console.log(inputs);

    for (var output of midiAccess.outputs.values()) {
        device = output;
        console.log('out dev selected')
    }

    inputs.forEach((input) => {
        //console.log(input);
        input.addEventListener('midimessage', handleInput)
    })
}
function failure() {
    concole.log('could not connect MIDI');
}
function updateDevices(event) {
    //console.log(event);
}
/*
function color(key, clr) {
    device && device.send([0x90, key, clr]); //note on
}
function noteOn(note) {
    if (note === 64) {
        document.getElementById("testelm").innerHTML = "note 64 is on";
        color(65, 45);
    }
}
function colorAll() {
    for (let i = 0; i < 100; i++) {

    }
}
*/

function handleInput(input) {
    //console.log(input);

    const command = input.data[0];
    const note = input.data[1];
    const velocity = input.data[2];
    // console.log(command);
    // console.log(note);
    // console.log(velocity);

    switch (command) {
        //144 is just standard buttion not setting buttion
        case 144:
            if (velocity > 0) {
                noteOn(note);
            } else {
                noteOff(note);
            }
            break;
    }

}

//the input here should be the city (list city, string the city), chicago is one
//example:  scenario(chicago, "Chicago")
function scenario(place, location) {
    //show city out of function in respective note
    //$(".Chicago").show();


    //sets background color to retrived RGB values
    getValue("R", place);
    getValue("G", place);
    getValue("B", place);
    getValue("wind", place);
    getValue("weather", place);
    getValue("temp", place);
    //console.log(R);
    //console.log(G);
    //console.log(B);
    //console.log(wSpeed);
    //console.log(currWeath);
    $("body").css("background-color", `rgba(${R + 15}, ${G + 15}, ${B * ( ( showTime(place[2])[1] / 24) + 1 )}, 1)`);
    //add details here
    $(".words").html(`City: ${location} \u00A0\u00A0\u00A0 Weather: ${currWeath} \u00A0\u00A0\u00A0 Wind speed: ${wSpeed} m/s \u00A0\u00A0\u00A0 Temperature: ${temperature - 0.00000000000006}\u00B0F \u00A0\u00A0\u00A0 Time: ${showTime(place[2])[0]}`)
    $(".clouds").html(`<marquee scrollamount="${wSpeed}"> <img class="cloud"
    src="https://www.pngmagic.com/product_images/cloud-png-vector-PSD-clipart-with-transparent-background-photo-for-free-download.png"> </marquee>`);

    if (currWeath === "Rain") {
        $(".raining").show();
    }
    if (currWeath === "Snow") {
        $(".snowing").show();
    }
    if (currWeath === "Dust"){
        $(".dusting").show();
    }
}




function noteOn(note) {

    console.log(`note${note} //on`);
    if (note === 99) {
        $(".words").html("<p>Hi!</p>");
        //console.log(document.getElementById("testelm").innerHTML = 'note 99 is on' );
    }

    if (note === 98) {
        $(".Chicago").show();
        $(".intro").hide();
        $(".London").hide();
        $(".Tokyo").hide();
        $(".Delhi").hide();
        scenario(chicago, "Chicago");

    }

    if (note === 97) {
        $(".London").show();
        $(".intro").hide();
        $(".Chicago").hide();
        $(".Tokyo").hide();
        $(".Delhi").hide();
        scenario(london, "London");
        getValue("R", london);
        getValue("G", london);
        getValue("B", london);
        $("body").css("background-color", `rgba(${R + 350}, ${G + 350}, ${(B * ( ( showTime(london[2])[1] / 24) + 1 ) + 450)}, 1)`);
    }

    if (note === 96) {
        $(".Tokyo").show();
        $(".intro").hide();
        $(".Chicago").hide();
        $(".London").hide();
        $(".Delhi").hide();
        scenario(tokyo, "Tokyo");
        getValue("R", tokyo);
        getValue("G", tokyo);
        getValue("B", tokyo);
        $("body").css("background-color", `rgba(${R + 150}, ${G + 150}, ${(B * ( ( showTime(tokyo[2])[1] / 24) + 1 ) + 250)}, 1)`);


    }

    if (note === 67) {
        $(".Delhi").show();
        $(".intro").hide();
        $(".Chicago").hide();
        $(".London").hide();
        $(".Tokyo").hide();
        scenario(delhi, "Delhi");
        getValue("R", delhi);
        getValue("G", delhi);
        getValue("B", delhi);
        $("body").css("background-color", `rgba(${R + 250}, ${G + 150}, ${(B * ( ( showTime(delhi[2])[1] / 24) + 1 ) + 250)}, 1)`);


    }



}






function noteOff(note) {
    //console.log(`note${note} //off`);
    if (note === 99) {
        //console.log(document.getElementById("testelm").innerHTML = "back to normal");
    }
}

