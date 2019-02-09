const lent = 784;
const total_lent = 10000;
const CAT = 0;
const APPLE = 1;
const RAINBOW = 2;

let cats_data;
let apples_data;
let rainbows_data;

let cats = {};
let apples = {};
let rainbows = {};


let training = [];
let testing = [];
let trainingNum = 0;



let brain;

function preload() {
    cats_data = loadBytes('./datajs/cat1000.bin');
    apples_data = loadBytes('./datajs/apple1000.bin');
    rainbows_data = loadBytes('./datajs/rainbow1000.bin');
}


function dataPrep(datasetName , data , label) {
    datasetName.training = [];
    datasetName.testing  = [];

    for(let i = 0 ; i < total_lent ; i++) {
        let offset = i * lent;
        division = total_lent * 0.8;
        if( i < division) {
            datasetName.training[i] = data.bytes.subarray(offset , offset + lent); 
            datasetName.training[i].label = label;
        }
        else {
            datasetName.testing[i - division] = data.bytes.subarray(offset , offset + lent); 
            datasetName.testing[i - division].label = label;
        }
    }
}

function trainNet(training , numOfCycles) {
    shuffle(training , true);

    for(let i = 0; i < numOfCycles ; i++) {

        
        let data = training[i];
        let inputs = Array.from(data).map(x => x/255);
        let label = training[i].label;

        let expected = [0,0,0];
        expected[label] = 1;

        brain.train(inputs , expected);
    }
}

function test(testing) {
    shuffle(testing , true);
    let correct = 0;

    for(let i = 0; i < testing.length ; i++) {

        
        let data = testing[i];
        let inputs = Array.from(data).map(x => x/255);
        let label = testing[i].label;

        let ans = brain.forwardProp(inputs);
        let classify = ans.indexOf(max(ans));
        // console.log(classify);
        // console.log(label); 

        if(classify === label) {
            correct++;
        }
        
    }
    let percentage = 100 * correct / testing.length;
    return percentage;
}

function clickedTrain() {
    trainingNum++;
    trainNet(training , training.length);
    console.log("Done training for : " + trainingNum);
}
function clickedTest() {
    let percent = test(testing);
    console.log(nf(percent,2,2) + "%");
}
function clickedReset() {
    document.getElementById("result").innerHTML = "";
    createCanvas(280,280);
    background(255);
}
function clickedGuess() {
    let inputs = [];
    let img = get();
    // console.log(img);
    img.loadPixels();
    for(let i = 0 ; i < lent ; i++ ) {
        let brightness = img.pixels[i*4];
        inputs[i] = (255.0 - brightness) / 255.0
    }
    let prediction = brain.forwardProp(inputs);
    let classify = prediction.indexOf(max(prediction));

    console.log(prediction);
    if(classify == 0) {
        document.getElementById("result").innerHTML = "It is a Cat!!";
    } else if(classify == 1) {
        document.getElementById("result").innerHTML = "It is an Apple!!";
    } else {
        document.getElementById("result").innerHTML = "It is a rainbow!!";
    }
}

function setup() {


    let myCanvas = createCanvas(280,280);
    myCanvas.parent('container');
    background(255);

    dataPrep(cats , cats_data , CAT);
    dataPrep(apples , apples_data , APPLE);
    dataPrep(rainbows , rainbows_data , RAINBOW);

    training = [];
    testing = [];

    brain = new NeuralNetwork(784 , 3 , 70);
    training =  training.concat(cats.training);
    training =  training.concat(apples.training);
    training =  training.concat(rainbows.training);

    testing =  testing.concat(cats.testing);
    testing =  testing.concat(apples.testing);
    testing =  testing.concat(rainbows.testing);

    
    
    // trainNet(training , training.length);
    // console.log("trained for one cycle")
    // let percent = test(testing);
    // console.log(percent);
    

    // View images
    // let total  = 100;
    // for(let n = 0 ; n < total ; n++) {
    //     let img =  createImage(28,28);
    //     img.loadPixels();
    //     let offset = n * lent
    //     for(let j = 0 ; j < lent  ; j++) {
    //         let value = 255 - cats_data.bytes[ j + offset];
    //         img.pixels[j * 4] = value;
    //         img.pixels[j * 4 + 1] = value;
    //         img.pixels[j * 4 + 2] = value;
    //         img.pixels[j * 4 + 3] = 255;
    //    }
    //    img.updatePixels();
    //    let x = (n % 10) * 28;
    //    let y = Math.floor((n / 10)) * 28;
    //    image(img , x , y);
    // }

}

function draw() {
    strokeWeight(8);
    stroke(0);
    if(mouseIsPressed) {
        line(pmouseX,pmouseY,mouseX,mouseY);
    }
}