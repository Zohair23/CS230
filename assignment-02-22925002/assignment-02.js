//references
//https://www.w3schools.com/jsref/met_document_getelementbyid.asp
//https://www.w3schools.com/jsref/met_document_queryselector.asp
//https://www.w3schools.com/js/js_arrays.asp
//https://www.w3schools.com/jsref/met_document_addeventlistener.asp
//https://www.w3schools.com/jsref/met_win_settimeout.asp
//https://www.w3schools.com/jsref/jsref_push.asp
//https://www.w3schools.com/jsref/met_console_error.asp
//https://lucymarmitchell.medium.com/using-then-catch-finally-to-handle-errors-in-javascript-promises-6de92bce3afc
//https://www.w3schools.com/jsref/jsref_object_keys.asp
//https://www.tutorialspoint.com/how-to-delay-a-loop-in-javascript-using-async-await-with-promise
//https://www.w3schools.com/jsref/prop_node_innertext.asp
//https://www.w3schools.com/js/js_promise.asp
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
//https://www.w3schools.com/jsref/jsref_foreach.asp
//https://www.w3schools.com/jsref/event_target.asp
//https://www.w3schools.com/jsref/prop_html_style.asp
//https://www.w3schools.com/jsref/jsref_join.asp
//color picker from google


//initialisation
const countValue = document.getElementById("count");
const colorPart = document.querySelectorAll(".circle");
const contain = document.querySelector(".contain");
const startButton = document.querySelector("#start");
const highestScoreElement = document.getElementById("highestScore");
const highestScoreValueElement = document.getElementById("highestScoreValue");

//colors with bright and and dark variations
const colors = {
  greencolor: {
    current: "#068e0f",
    new: "#18e711",
  },
  redcolor: {
    current: "#950a03",
    new: "#fd3f2a",
  },
  bluecolor: {
    current: "#01118a",
    new: "#2069fc",
  },
  yellowcolor: {
    current: "#839102",
    new: "#e7fa18",
  },
};

let randomColors = []; //array to store random colors
let mySequenceBool = false; //computer sequence flag
let count, //variables to go up in count
  clickCount = 0;
let highestScore = 0; // variable to store the highest score

let timer; // variable to store the timer

// start game button
startButton.addEventListener("click", () => {
  //reset variables(refresh)
  count = 0;
  clickCount = 0;
  randomColors = [];
  mySequenceBool = false;

  //change the indicator to green(running)
  updateColorCircleLight("lime");

  // 3 second delay after you hit start
  setTimeout(() => {
    mySequence();
  }, 3000);
});


// function to decide sequence
const mySequence = () => {
  //add color to array
  randomColors.push(myRandomValue(colors));
  count = randomColors.length;
  mySequenceBool = true;

  // calculate the flash duration and interval
  let flashDuration = 500;
  let flashInterval = 600;

  if (count >= 5) {
    // reduce flash duration and interval by 40%
    flashDuration *= 0.6;
    flashInterval *= 0.6;
  }

  if (count >= 9) {
    // reduce flash duration and interval by an additional 40%
    flashDuration *= 0.6;
    flashInterval *= 0.6;
  }

  if (count >= 13) {
    // reduce flash duration and interval by an additional 40%
    flashDuration *= 0.6;
    flashInterval *= 0.6;
  }

  // start the sequence and set a timer for 5 seconds after the sequence finishes
  playSequence(count, flashDuration, flashInterval)
    .then(() => {
      timer = setTimeout(() => {
        lose();
      }, 5000);
    })
    .catch((error) => {
      console.error(error);
    });
};

//function to get a random value from object
const myRandomValue = (obj) => {
  let arr = Object.keys(obj);
  return arr[Math.floor(Math.random() * arr.length)];
};

//function to play the sequence
const playSequence = async (count, flashDuration, flashInterval) => {
  countValue.innerText = addZeros(count - 1, 2);
  for (let i of randomColors) {
    let currentColor = document.querySelector(`.${i}`);
    await delay(flashDuration);
    currentColor.style.backgroundColor = `${colors[i]["new"]}`;
    await delay(flashInterval);
    currentColor.style.backgroundColor = `${colors[i]["current"]}`;
    await delay(flashInterval);
  }
  mySequenceBool = false;
};

//delay for flash effect
async function delay(time) {
  return await new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// if user click on the colors
colorPart.forEach((element) => {
  element.addEventListener("click", async (e) => {
    // if user clicks the same color then continue
    if (mySequenceBool) {
      return false;
    }

    // clear the timer when the user clicks a color (5 second reset)
    clearTimeout(timer);

    if (e.target.classList[0] == randomColors[clickCount]) {
      // color flash effect on click
      e.target.style.backgroundColor = `${colors[randomColors[clickCount]]["new"]}`;
      await delay(500);

      e.target.style.backgroundColor = `${colors[randomColors[clickCount]]["current"]}`;

      // user click
      clickCount += 1;

      // continue if the number of valid clicks == count
      if (clickCount == count) {
        clickCount = 0;
        mySequence();
      }
    } else {
      lose();
    }
  });
});

//function when player executes wrong sequence or user doesnt click in time(lose function)
const lose = () => {
  startButton.innerText = "START";
  
  if (count > highestScore) {
    highestScore = count;
    setTimeout(() => {
      highestScoreValueElement.innerText = addZeros(highestScore-1, 2);
    }, 2400);
  }

  // reset the count to 0
  count = 0;

  //flash the colors 5 times
  flashAllColors();

  // stop the game and change color back to original
  setTimeout(() => {
    updateColorCircleLight("rgba(255, 0, 0, 0.936)");
  }, 2400);
};

//function to update the indicating light
const updateColorCircleLight = (color) => {
  const colorCircleLight = document.getElementById("colorCircleLight");
  colorCircleLight.style.backgroundColor = color;
};

//function to add 0's in front of the score
const addZeros = (number, width) => {
  const numberString = number.toString();
  return numberString.length >= width ? numberString : new Array(width - numberString.length + 1).join('0') + numberString;
};

//function to flash all colors after you lose
const flashAllColors = async () => {
  const flashDuration = 300;
  const flashInterval = 200;

  // create an array of promises for each color
  const flashPromises = Object.keys(colors).map(async (colorKey) => {
    const currentColor = document.querySelector(`.${colorKey}`);

    for (let i = 0; i < 5; i++) {
      currentColor.style.backgroundColor = `${colors[colorKey]["new"]}`;
      await delay(flashDuration);
      currentColor.style.backgroundColor = `${colors[colorKey]["current"]}`;
      await delay(flashInterval);
    }
  });

  // wait for all color flashes to complete
  await Promise.all(flashPromises);
};