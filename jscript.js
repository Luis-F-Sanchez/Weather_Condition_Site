let R;
let G;
let B;
let bColor;



function getValue(value) {
    let lat = '41.8781';
    let lon = '-87.6298';
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

            if (value === "R") {
                R = (out.responseJSON.main.temp) - 100;
                console.log(`${R}`);
                return (R);
            }
            // if (value === "G") {
            //     G = (out.responseJSON.main.temp_max) - 100;
            //     console.log(G);
            //     return (`${G}`);
            // }
            // if (value === "B") {
            //     B = (out.responseJSON.main.temp_min) - 100;
            //     return (`${B}`);
            // }


        }

    });

}


if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(success, failure);
}

function success(midiAccess) {
    //console.log(midiAccess);
    midiAccess.addEventListener('statechange', updateDevices);

    const inputs = midiAccess.inputs;
    //console.log(inputs);

    inputs.forEach((input) => {
        //console.log(input);
        input.addEventListener('midimessage', handleInput)
    })
}

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




function noteOn(note) {
    console.log(`note${note} //on`);
    if (note === 99) {
        $(".words").html("<p>Hi!</p>");
        //console.log(document.getElementById("testelm").innerHTML = 'note 99 is on' );
    }
    if (note === 98) {
        let R = getValue("R");
        console.log(R);
        //tried `rgb(${getValue("R"), getValue("G"), getValue("B")})`
        //tried "rgb(" + getValue("R") + "," + getValue("G") + "," + getValue("B")
        $("body").css("background-color", `rgba(${R}, 0, 0, 1)`);
        
        
        //getValue("R") 

    }
    if (note === 97) {
        let p5_ = new p5();
        //console.log(p5_.map(.5, 0, 1, 0, 100))
    }
    if (note === 96) {
        $("body").css("background-color", `red`);

    }
}

function noteOff(note) {
    //console.log(`note${note} //off`);
    if (note === 99) {
        //console.log(document.getElementById("testelm").innerHTML = "back to normal");
    }
}


function failure() {
    concole.log('could not connect MIDI');
}

function updateDevices(event) {
    //console.log(event);
}


