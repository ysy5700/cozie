import document from "document";
import {user} from "user-profile";
import {vibration} from "haptics";
import {BodyPresenceSensor} from "body-presence";

import {hrm, bodyPresence} from './sensors';
import {sendEventIfReady} from "./send";
import './clock'
import './buzz'

import questionsFlow from "../resources/flows/activity-flow";

// Import GUI elements
const clockface = document.getElementById("clockface");
const thankyou = document.getElementById("thankyou");
const svg_stop_survey = document.getElementById("stopSurvey");
const clockblock = document.getElementById("clockblock");

// home screen buttons
const comfy = document.getElementById("comfy");
const notComfy = document.getElementById("not-comfy");

// flow buttons
const flow_back = document.getElementById("flow_back");
const flow_stop = document.getElementById("flow_stop");

// flow buttons json
const centerButton = document.getElementById("new-button-center");
const rightButton = document.getElementById("new-button-right");
const leftButton = document.getElementById("new-button-left");

const jsonFlow = document.getElementById("json-flow");

// Used to set all views to none when switching between screens
const allViews = [clockface, thankyou, clockblock, svg_stop_survey, jsonFlow];

let currentView = 0; //current view of flow
let feedbackData; // Global variable for handling feedbackData

let buttons = [
    {
        value: 10,
        obj: comfy,
        attribute: "startSurvey",
    },
    {
        value: 9,
        obj: notComfy,
        attribute: "startSurvey",
    },
    {
        value: "flow_back",
        obj: flow_back,
        attribute: "flow_control",
    },
    {
        value: "flow_stop",
        obj: flow_stop,
        attribute: "flow_control",
    },
    {
        value: 9,
        obj: centerButton,
        attribute: "question",
    },
    {
        value: 10,
        obj: rightButton,
        attribute: "question",
    },
    {
        value: 11,
        obj: leftButton,
        attribute: "question",
    },
];

// show thank you message at the end of survey, add more info to message to be sent and send message
function endSurvey(reasonEnd) {
    allViews.map((v) => (v.style.display = "none"));
    clockface.style.display = "inline";

    //Find out how many seconds has passed to give response
    const endFeedback = new Date();
    const startFeedback = new Date(feedbackData['startFeedback']);
    feedbackData['responseSpeed'] = (endFeedback - startFeedback) / 1000.0;
    feedbackData['endFeedback'] = endFeedback.toISOString();

    if (reasonEnd === 'EndSurvey') {
        thankyou.style.display = "inline";

        // send feedback to companion
        sendEventIfReady(feedbackData);
    } else {
        svg_stop_survey.style.display = "inline";
    }

    feedbackData = {};

    setTimeout(() => {
        allViews.map(v => v.style.display = "none");
        clockface.style.display = "inline";
        currentView = 0
    }, 2000);

}

for (const button of buttons) {
    button.obj.addEventListener("click", () => {
        /** Constantly monitors if any buttons have been pressed */

        console.log(`${button.value} clicked`);

        // if any of the two buttons in the main view have been pressed initiate the loop through the selected
        if (button.attribute === 'startSurvey') {

            // Initiate feedbackData object
            feedbackData = {
                startFeedback: new Date().toISOString(),
                heartRate: hrm.heartRate,
            };

            if (BodyPresenceSensor) {
                try {
                    feedbackData['bodyPresence'] = bodyPresence.present;
                } catch (e) {
                    console.log("No body presence data");
                }
            }

            try {
                feedbackData['restingHR'] = user.restingHeartRate;
            } catch (e) {
                console.log("No resting heart rate data available");
            }

            try {
                feedbackData['BMR'] = user.bmr;
            } catch (e) {
                console.log("No resting basal metabolic rate data available");
            }
        } else if (button.attribute === 'flow_control') { // if any of the two buttons (back arrow or cross) have been selected

            if (button.value === "flow_back") {
                // decrease the value of currentView by 2 to go to previous view
                currentView--;
                currentView--;

                if (currentView < 0) {
                    // if user pressed back button in first question survey
                    endSurvey("StoppedSurvey");
                } else {
                    showFace(true);
                }
            } else if (button.value === "flow_stop") {
                // stop_flow button was pressed
                endSurvey("StoppedSurvey");
            }
        }

        if (button.attribute !== "flow_control") {
            if (button.attribute !== "startSurvey" && questionsFlow[currentView-1].name.indexOf("confirm") === -1) {
                console.log(currentView);
                //need to associate it to the previous view
                feedbackData[questionsFlow[currentView - 1].name] = button.value;
            }
            console.log(JSON.stringify(feedbackData));

            if (questionsFlow.length === currentView) {
                // if all the views have already been shown
                endSurvey("EndSurvey");
            } else {
                console.log("next question");
                showFace();
            }
        }
    });
}

function showFace(flowback = false) {
    let skipQuestion = false;

    // go through all views and set to none
    allViews.map((v) => {
        v.style.display = "none";
    });

    jsonFlow.style.display = "inline";

    //Does current flow have any requirements?
    if (questionsFlow[currentView].requiresAnswer.length !== 0) {
        //if so, see if the current feedback meets those requirements
        questionsFlow[currentView].requiresAnswer.map((req) => {
            if (feedbackData[req.question] !== req.value) {
                //requirements not met, skipping question
                skipQuestion = true;
            }
        });
    }

    if (skipQuestion === false) {
        // Set title of question
        document.getElementById("question-text").text = questionsFlow[currentView].questionText;
        document.getElementById("question-second-text").text = questionsFlow[currentView].questionSecondText;
        if (questionsFlow[currentView].name.indexOf("confirm")!==-1) {
            document.getElementById("question-text").text = questionsFlow[currentView].questionText.replace("xxxx",feedbackData[questionsFlow[currentView-1].name]);
        }
        // set buttons
        const buttonLocations = ["left", "right", "center"];
        // hide all buttons
        buttonLocations.forEach((location) => {
            document.getElementById("new-button-" + location).style.display =
                "none";
        });

        // map through each text element in flow and map to button
        questionsFlow[currentView].iconText.forEach((text, ii) => {
            // first show the button
            document.getElementById(
                "new-button-" + buttonLocations[ii]
            ).style.display = "inline";

            // then map the circle color, image, and text
            document.getElementById(
                "circle-" + buttonLocations[ii]
            ).style.fill = questionsFlow[currentView].iconColors[ii];
            document.getElementById("image-" + buttonLocations[ii]).href =
                questionsFlow[currentView].iconImages[ii];
            document.getElementById("button-text-" + buttonLocations[ii]).text =
                questionsFlow[currentView].iconText[ii];
        });
        // move onto next flow
        currentView++;
    }

    // skipping question
    else if (skipQuestion === true) {
        // if we arrived here through the back button, then skip backwards
        if (flowback === true) {
            currentView--;
            showFace(true);
            // if we arrived here through the normal flow, skip forwards
        } else {
            currentView++;
            showFace();
        }
    }

    vibration.start("bump");
}


