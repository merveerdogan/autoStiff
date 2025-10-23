/** Merve Erdogan **/
// Automatic Stiffness Perception - PLC //
/*

/*
================================================================================
            EXPERIMENT-SPECIFIC INSTRUCTIONS
================================================================================
/*=================================================
INSTRUCTIONS FOR INTRODUCING THE EXPERIMENT
===================================================
*/
instr_page_0 = ['<p>Hello! Thank you for volunteering to help out with our study. Please take a moment to adjust your seating so that you can comfortably watch the monitor and use the keyboard. Feel free to dim the lights as well.</p><p>Close the door or do whatever is necessary to <b>minimize disturbance during the experiment</b>. Please also take a moment to silence your phone so that you are not interrupted by any messages mid-experiment. Do <i>not</i> switch to any other tabs or windows until you are complete.</p><p>We will now go over the instructions.  Please <strong>read these carefully,</strong> as you will not be able to complete this experiment without following them precisely.  <br> <br> A “Next” button will appear at the bottom of the screen on each page. This button will be greyed out at the beginning and will be activated after a few seconds (giving you time to read the instructions on each page). Please read everything on each page carefully before clicking on the "Next" button to continue to the next page. </p>'];

instr_page_1 = ["<p>This experiment will be pretty quick, lasting only about 3 minutes. You will see two short videos, one after the other — each only about 7 seconds long — and then you will be asked a question about them. For now, just focus on watching the videos carefully. Each video will play only once, so please pay close attention — you’ll need to watch both in order to answer the question. You’ll start the videos by pressing the “Space” key. Since they are very short, make sure you’re ready before starting. Click “Next” to continue.</p>"];


/*=================================================
INSTRUCTIONS DURING THE EXPERIMENT
===================================================
*/
/* these are used in the html file when running the experiment */

video_1_start = ['As soon as you press the "Space" key, the first video will begin. The video is very short, so be ready to watch carefully before pressing "Space".  After the first video is done playing, there will be a brief blank screen (for only about 1-2 seconds), after which the second video will start playing.<p> You can start the first video by pressing the "Space" key.'];


test_question = ['You just saw two videos in which there were many white dots moving. The movements of  these dots create a pattern that looks to many people like a sheet on a clothesline is waving in the wind. One video showed a <i>stiffer</i> cloth, and the other showed a <i>less stiff</i> one. Which cloth seemed stiffer to you?<p>Click <strong>"First Cloth"</strong> below if the first cloth (the one you watched earlier) seemed stiffer, or click <strong>"Second Cloth"</strong> if the second cloth (the one you watched later) seemed stiffer.</p>'];

video_1_start_instr = standard_instr_style(video_1_start);

test_question_instr = standard_instr_style(test_question);

/*===================================================
INSTRUCTION PROCEDURE
=====================================================
*/
var insert_instr_page_0 = {
    type: 'instructions',
    pages: standard_instr_style(instr_page_0),
    allow_keys: false,
    show_clickable_nav: true,
    button_delay: delay,
    allow_backward: false,
    data: { trial_category: 'Other' },
};

var insert_instr_page_1 = {
    type: 'instructions',
    pages: standard_instr_style(instr_page_1),
    allow_keys: false,
    show_clickable_nav: true,
    button_delay: delay,
    allow_backward: false,
    data: { trial_category: 'Other' },
};

instructions = [insert_instr_page_0, cursor_on, insert_instr_page_1, cursor_off]

/*================================================================================
               GENERAL INTRO/CLOSING INSTRUCTIONS
----------------------------------------------------------------------------
These are shared across experiments and use params from params.js
(study_title, estTotalRunTime, exp_compensation, completion_code, text_color)
-----------------------------------------------------------------------------
==================================================================================
*/

// Intro: Device check text (laptop/computer message)
intro_device_check = [
    "<div style='display: inline-block; color: " + text_color + "; margin: 0 auto; padding: 10px 200px 10px 200px; text-align: left'> Please note that this experiment is only designed to work from a computer or laptop.  Please <strong> do not </strong> continue if you are using a phone, tablet, or other mobile device.  If you are on a phone, tablet or other mobile device you will need to return to Prolific and click \"stop without completing\".  <br> <br> If you are currently seeing this page from a laptop or computer, please click on the \"Continue\" button.<br><br>"
];

// Intro: Consent content with dynamic fields
intro_consent = [
    "<div style='display: inline-block; color: " + text_color + "; margin: 0 auto; padding: 10px 200px 10px 200px; text-align: left'><h5>In order to run this study, we need to include the standard consent form below.<br> <br><strong>***Please Read and press the 'Y' key to consent to this study*** </strong><br> <br></'></h5><div style='display: inline-block; color: " + text_color + "; ><h1>Consent for Participation in a Research Study</h1><div style='display: inline-block; color: " + text_color + "; margin: 0 auto; padding: 10px 200px 10px 200px; text-align: left'><h5>STUDY TITLE</h5><p>" + study_title + "</p>" +
    "<h5>RESEARCH STUDY SUMMARY, RISKS, AND BENEFITS</h5><p>Thank you for volunteering to participate in this research study. The purpose of this study is to better understand how we see and how we think. Study activities will include examining simple displays and then responding by answering questions, pressing some keys, or using a computer mouse. Because these are activities that many people already experience hundreds or thousands of times every day, there are no risks involved in this study. The study may have no benefits to you, but it may help the scientific community come to better understand how the human mind works. Taking part in this study is your choice. You can choose to take part, or you can choose not to take part in this study. You can also change your mind at any time, with no penalty.</p><h5>DURATION</h5><p>If you agree to take part, the study will last approximately <strong> " + String(estTotalRunTime) + " minutes</strong>.</p>" +
    "<h5>COSTS AND COMPENSATION</h5><p>There are no costs associated with participation in this study. You will receive <strong>" + String(exp_compensation) + " dollars</strong> for participating.</p><h5>CONFIDENTIALITY</h5><p>No personally identifying information will be collected, so your participation will be anonymous. The survey is anonymous. We will not know your name. We will not be able to connect any identifying information to your survey answers. However, we will know your Prolific number in order to pay you for your time. Your Prolific number could possibly be connected to your public profile, which could, in theory, be searched. We want to stress that we will not be looking at anyone's public profiles. We will keep the information about your participation in this research confidential. Your data will be pooled with those from other participants, and may be included in scientific publications and uploaded to public data repositories.</p>" +
    "<h5>LEARNING MORE</h5><p>If you have questions about this study, you may contact your experimenter Merve Erdogan at merve.erdogan@yale.edu. If you have questions about your rights as a research participant, or you have complaints about this research, you can contact the Yale Institutional Review Boards at 203-785-4688 or hrpp@yale.edu.</p><h5>INFORMED CONSENT</h5><p>Your participation indicates that you have read and understood this consent form and the information presented and that you agree to be in this study.</p></div></div>"
];

// Intro: Survey heads-up
intro_survey = [
    "<div style='width: 100%; color: " + text_color + "; text-align: center'><div style='display: inline-block; margin: 0 auto; padding: 10px 200px 10px 200px; text-align: left'>" +
    "<p>We wanted to provide a heads-up that the end of the experiment will consist of an anonymous survey with multiple questions. " +
    "A few questions are open-ended questions where you need to type 1-2 sentences. Sometimes participants do not like answering open-ended questions and tend to quit a survey once they see such questions. " +
    "If a sizable number of people quit a survey halfway, the responses will no longer be useful. Our research depends on good quality responses. Thus, please make sure you do not mind open-ended questions before continuing with experiment.</p>" +
    "<p><i><strong>Press 'y'</strong> on your keyboard if you agree to answer the open-ended questions at the end of the experiment.</i><br>" +
    "</div>"
];

// Intro: Fullscreen message
intro_fullscreen = [
    `<p><div style='display: inline-block; color:${text_color}; margin: 0 auto; padding: 10px 200px 10px 200px; text-align: left'>This experiment needs to be completed in full-screen mode. <br><br> Clicking on the "Continue" button should bring the experiment to full-screen mode.<br> (Don't worry, we'll take you out of full-screen mode when the experiment is over.)<br><br>Once you are in full-screen mode, please do not exit full-screen mode or minimize this screen until the experiment is completed.<br>(Additionally, do not press your browser's "back" button as this will end the experiment without giving you credit.)<br><br>`
];

// Closing: Finishing page
closing_finishing = [
    "You finished all displays! There is one last part left. In the following page, you will see a couple of questions and then the study will reach to the end. You will see your unique code at the last page. <p>Please click on the 'Next' button to proceed to the questions. "
].map(t => "<div style='display: inline-block; margin: 0 auto; color: " + text_color + "; padding: 10px 200px 10px 200px; text-align: left'>" + t + "</div>");

// Closing: Debrief form HTML
closing_debrief = [
    '<p>Finally, we just have a couple questions for you!<br>Please note that you must answer <strong>ALL</strong> the questions before clicking "Continue". ' +
    "<div style='width: 80%; text-align: left; margin: 0 auto'>" +
    '<p>Age: <br><input name="age" required type="number"  max="100" min="18" style="width: 80px; border-radius: 4px; padding: 10px 10px; margin: 8px 0; border: 1px solid #ccc; font-size: 15px" required>' +
    '<p>Please select your gender:<br><input type="radio" required id="male" name="gender" value="male"><label for="male">Male</label><br><input type="radio" id="female" name="gender" value="female"><label for="female">Female</label><br><input type="radio" id="other" name="gender" value="other"><label for="other">Other</label><br><input type="radio" id="not_say" name="gender" value="Prefer not to say"><label for="not_say">Prefer not to say</label>' +
    '<p>In 1-2 sentences, what do you think this experiment was testing? <br><input name="testing" type="text" size="50" style="width: 100%;  border-radius: 4px; padding: 10px 10px; margin: 8px 0; border: 1px solid #ccc; font-size: 15px" required>' +
    '<p>Using the slider below, on a scale of 1-100 (with 1 being very distracted, and 100 being very focused), how well did you pay attention to the experiment?  (This will not affect whether you receive credit or compensation.) <br> <p style="text-align:left;">Very Distracted <span style="float:right;">Very Focused</span></p> <input type="range" value="50" min="1" max="100" name = "attention" class="slider" required oninput="this.nextElementSibling.value = this.value"> <output id = "attntion_out"  style="text-align:center; font-size: 1.6vw">_</output> </p>' +
    '<p>Did you find yourself using a strategy while you were doing the experiment? If yes, please describe with 1-2 sentences.<br><input name="strategy" type="text" size="50" style="width: 100%; border-radius: 4px; padding: 10px 10px; margin: 8px 0; border: 1px solid #ccc; font-size: 15px" required></p>' +
    '<p>Is there anything else we should know (either about you or how you did the experiment) that may have had an impact on your results? <br><input name="other" type="text" size="50" style="width: 100%; border-radius: 4px; padding: 10px 10px; margin: 8px 0; border: 1px solid #ccc; font-size: 15px" required></p>' +
    '<p> We do our best to make sure this experiment displays the same for all monitor configurations. Where there any parts of the experiment where words or text were cut off or misaligned?  If so, do you remember where? <br><input name="errors" type="text" size="50" style="width: 100%; border-radius: 4px; padding: 10px 10px; margin: 8px 0; border: 1px solid #ccc; font-size: 15px" required>' +
    "</div>"
];

// Closing: Exit fullscreen message
closing_exit_fullscreen = [
    '<div style= "color:' + text_color + '">The experiment will switch out of full-screen mode when you press the button below</div>'
];

// Closing: Final thanks + completion code
closing_final = [
    "Thank you so much for your contribution to science! The experiment has concluded. Please contact merve.erdogan@yale.edu if you have any further questions." +
    '<p>Here is your <b>unique</b> code: ' + completion_code + '</p>' +
    '<p>To recieve payment for this experiment, you must take this code back to the Prolific page that directed you here. You can close the experiment by closing this page, you do not need to do anything else. If you encounter problems during this step, please contact the email above.'
];