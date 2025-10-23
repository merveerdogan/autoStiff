/*     
Merve Erdogan - 10.13.2025 
Automatic Stiffness Perception - PLC  
2 Versions: Speed not equated across PLCs (v1) and equated (v2)
-------------------------------------
Experiment details:
Single Trial
2 videos back to back
Retro question: Which one is stiffer?
-------------------------------------
*/

//Experiment Mode// 
debug = true;
var runIntro = true;
var runInstr = true;
//instruction delays
if (debug == false) {
    delay = true;
} else {
    delay = false;
    // runIntro = false;
    // runInstr = false;
}


/*===============================================================
        EXPERIMENT-SPECIFIC PARAMETERS & FUNCTIONS
===============================================================*/




/*=============================
PLC PARAMETERS
=============================*/
version = 'p1.5';
// Equalization flag from filename: ...-v1 => false, ...-v2 => true
//thisEqualizeSpeed = /-v2$/i.test(expt_name);
thisEqualizeSpeed = true;

// test cloths
clothNames = [wind_m1_s003125, wind_m1_s05];
stiffnessLevels = [0, 1, 0, 1, 0, 1];
stiffness_cloth1 = shuffle(stiffnessLevels)[0];
if (stiffness_cloth1 == 0) {
    stiffness_cloth2 = 1;
} else {
    stiffness_cloth2 = 0;
}
thisCloth_1 = clothNames[stiffness_cloth1] //clothNames are in the order of stiffness level
thisCloth_2 = clothNames[stiffness_cloth2] //clothNames are in the order of stiffness level
clothType_1 = getVariableName(thisCloth_1); //name of the less stiff cloth
clothType_2 = getVariableName(thisCloth_2); //name of the more stiff cloth
// get cloth types
clothTypes = [];
for (c = 0; c < clothNames.length; c++) {
    clothTypes.push(getVariableName(clothNames[c]));
}
expSpecificParams = {
    gridX: 4,
    gridY: 4,
    fps: 30,
    scalingFactor: 1,
    gridOffSet: 0,
    equalizeSpeed: true,
    conversionFactor: 3,
}

/*=============================
ONLINE EXPERIMENT PARAMETERS
=============================*/
let estTotalRunTime = 3;
let exp_compensation = "$" + (estTotalRunTime * .14).toFixed(2).toString();
let completion_code = 'C17FAMG9';
let study_title = 'Which one?'

/*=============================
SCREEN FEATURES
=============================*/
var screen_color = "black";
var text_color = "white";
w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var screenCenter = [w / 2, h / 2];

/*=============================
DATE & SAVE FOLDERS
=============================*/
var path = window.location.pathname;
var page = path.split("/").pop();
expt_name = page.replace(".html", "");
save_folder_full = 'data/full/' + version + '';
save_folder_filtered = 'data/filtered/' + version + '';

var today = new Date();
var exp_date = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

/*=============================
FUNCTIONS
=============================*/
function shuffle(array) {
    // Create a copy of the original array
    let shuffledArray = array.slice();
    // Iterate over the array in reverse order
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        // Generate a random index from 0 to i
        const randomIndex = Math.floor(Math.random() * (i + 1));
        // Swap elements at randomIndex and i
        [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
    }
    return shuffledArray;
}

// Function to get the variable name based on its value
function getVariableName(value) {
    for (const key in window) {
        if (window[key] === value) {
            return key;
        }
    }
    return null;
}


