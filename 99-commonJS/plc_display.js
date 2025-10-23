// Merve Erdogan - 14.10.2025
/*
=======================================================================
MAIN PLCDISPLAY CREATOR PLUGIN FOR 
=======================================================================
Table of Contents
1) Parameters (what you can control in html file)
2) Setup (canvas, import cloth data, setup the cloth)
3) Optional Grid Selection for downsampling cloth dots
4) Speed adjusment (optional for the stiffness experiment)
5) Display Loop
7) Trial End and Save Data
8) Helpers
===============================================================
*/
jsPsych.plugins["plcDisplayCreator"] = (function () {
    var plugin = {};
    plugin.info = {
        name: "plcDisplayCreator",
        parameters: {
            //--- General Cloth Setup --- //
            clothData: {
                type: jsPsych.plugins.parameterType.FUNCTION, pretty_name: 'dot_pos', default: 0,
                description: 'function to get the processed cloth data'
            },
            dotSize: {
                type: jsPsych.plugins.parameterType.INT, pretty_name: 'dotSize', default: 3,
                description: 'dot radius in px'
            },
            fps: {
                type: jsPsych.plugins.parameterType.FLOAT, pretty_name: 'fps', default: 60,
                description: 'source data frame rate'
            },
            cycleNum: {
                type: jsPsych.plugins.parameterType.INT, pretty_name: 'cycleNum', default: 1,
                description: 'repeat underlying motion cycles'
            },
            trial_duration: {
                type: jsPsych.plugins.parameterType.FLOAT, pretty_name: 'trial_duration',
                default: null,
                description: 'optional hard stop in seconds (affects the total display duration)'
            },
            gridX: {
                type: jsPsych.plugins.parameterType.INT, pretty_name: 'gridX', default: 4,
                description: 'number of rows in the grid'
            },
            gridY: {
                type: jsPsych.plugins.parameterType.INT, pretty_name: 'gridY', default: 4,
                description: 'number of columns in the grid'
            },

            //--- Speed Adjustment Parameters (for the stiffness experiment) --- //
            speedRate: {
                type: jsPsych.plugins.parameterType.FUNCTION, pretty_name: 'speedRate', default: 1,
                description: 'function to get the speed rate'
            },
            equalizeSpeed: {
                type: jsPsych.plugins.parameterType.BOOL, pretty_name: 'Equalize Speed', default: false,
                description: 'whether to equalize the speed of the cloth'
            },

        }
    }

    plugin.trial = function (display_element, trial) {
        trial_startTime = performance.now();

        /* ============================================================
        3) GENERALSETUP (canvas, import, scaling, centering)
        ================================================================ */
        /* ================
        3.1) Canvas Setup
        =================== */
        var html = '<canvas id="myCanvas"></canvas>';
        display_element.innerHTML = html;
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext("2d");
        var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        var screenCenter = [w / 2, h / 2];
        const screenDiagonal = Math.sqrt(w * w + h * h);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.scrollTop = 0;
        document.body.style.overflow = 'hidden';
        document.body.style.cursor = 'none';


        /* ======================
        3.2) Variables
        ====================== */
        // Scale based on screen diagonal, as reference, 13.3" laptop (1280x800 - 1509px diagonal)
        let referenceScreenDiagonal = 1509;
        let clothScaleFactorBasedOnScreenSize = screenDiagonal / referenceScreenDiagonal;

        //to save display details
        let frameDetails = {
            displayFrameNumber: [], timeInCurrentDisplayFrame: [], dotPosX: [], dotPosY: [], clothDimensions: [],
        };
        let totalFrameCount = 0;


        /* ======================
        3.3) Use Pre-processed Cloth Data
        ====================== */
        // Get the processed cloth data from the function parameter
        thisClothData = trial.clothData();
        var originalFrameNum = thisClothData.frameNum;
        var selectedDotPosX = thisClothData.selectedDotPosX.slice();
        var selectedDotPosY = thisClothData.selectedDotPosY.slice();
        if (trial.cycleNum > 1) {
            for (let c = 1; c < trial.cycleNum; c++) {
                for (let i = 0; i < selectedDotPosX.length; i++) {
                    selectedDotPosX[i] = selectedDotPosX[i].concat(thisClothData.selectedDotPosX[i]);
                    selectedDotPosY[i] = selectedDotPosY[i].concat(thisClothData.selectedDotPosY[i]);
                }
            }
        }
        totalFrameNum = originalFrameNum * trial.cycleNum;
        clothCenter = [calculateClothDimensionsAt(0, selectedDotPosX, selectedDotPosY).center[0], calculateClothDimensionsAt(0, selectedDotPosX, selectedDotPosY).center[1]];

        /* ============================================================
        4) SPEED ADJUSTMENT (FOR THE STIFFNESS EXPERIMENT)
        ================================================================ */
        speedRate = typeof trial.speedRate !== 'undefined' ? trial.speedRate() : 1;
        let displayFPS = speedRate * trial.fps;
        let displayDuration = (totalFrameNum / displayFPS)

        /* ============================================================
        5) START DISPLAY LOOP
        ================================================================ */
        let start_time = performance.now();
        let time_elapsed = 0;
        let time_elapsed_prev = 0;
        move_disc();

        function move_disc() {
            context.clearRect(0, 0, canvas.width, canvas.height);

            let current_time = performance.now();
            time_elapsed = (current_time - start_time) / 1000;
            if (time_elapsed < displayDuration) {
                let percent_time = time_elapsed / displayDuration;
                let idx = parseInt(percent_time * totalFrameNum);

                for (let i = 0; i < selectedDotPosX.length; i++) {
                    if (frameDetails.dotPosX[i] === undefined) { frameDetails.dotPosX[i] = []; frameDetails.dotPosY[i] = []; }

                    let orig = [selectedDotPosX[i][idx], selectedDotPosY[i][idx]];
                    let dotPosX = orig[0] + ((clothCenter[0] - screenCenter[0]) * clothScaleFactorBasedOnScreenSize);
                    let dotPosY = orig[1] + ((clothCenter[1] - screenCenter[1]) * clothScaleFactorBasedOnScreenSize);

                    frameDetails.dotPosX[i].push(dotPosX); frameDetails.dotPosY[i].push(dotPosY);
                    drawDots(dotPosX, dotPosY);
                }
                frameDetails.timeInCurrentDisplayFrame.push(round(time_elapsed - time_elapsed_prev));
                time_elapsed_prev = time_elapsed;
                frameDetails.clothDimensions.push(calculateClothDimensionsAt(idx, selectedDotPosX, selectedDotPosY));
                totalFrameCount++; //for refresh rate calculation
                requestAnimationFrame(function () { move_disc() })
            } else {
                end_trial();
            }
        }

        /* ============================================================
        8) END TRIAL AND SAVE DATA
        ================================================================ */
        function end_trial() {
            let timeElapsed = performance.now() - start_time;

            /* Calculate Speed Stats */
            var overallSpeed = calculateClothSpeed(frameDetails.dotPosX, frameDetails.dotPosY);

            /* Save Data */
            var trial_data = {
                clothType: thisClothData.clothType,
                stiffnessLevel: trial.stiffnessLevel,
                equalizeSpeed: trial.equalizeSpeed,
                clothOriginalSpeedPxSec: round(thisClothData.overallSpeed),
                speedRate: (trial.equalizeSpeed === true) ? trial.speedRate() : 1,
                plannedSpeedPxSec: (trial.equalizeSpeed === true) ? (round(thisClothData.overallSpeed * speedRate)) : null,
                actualizedSpeedPxSec: round(overallSpeed),
                displayDurationBeforeSpeedEquating: (trial.equalizeSpeed === true) ? round((totalFrameNum / trial.fps)) : null,
                displayDurationActualized: round(timeElapsed / 1000),
                cycleNum: trial.cycleNum,
                displayFrameNumber: frameDetails.dotPosX[0].length,
                displayFrameDurationAvr: round(mean(frameDetails.timeInCurrentDisplayFrame)),

                clothWidthMinPx: round(Math.min(...frameDetails.clothDimensions.map(dimension => dimension.width))),
                clothWidthMaxPx: round(Math.max(...frameDetails.clothDimensions.map(dimension => dimension.width))),
                clothWidthAvrPx: round(mean(frameDetails.clothDimensions.map(dimension => dimension.width))),
                clothHeightMinPx: round(Math.min(...frameDetails.clothDimensions.map(dimension => dimension.height))),
                clothHeightMaxPx: round(Math.max(...frameDetails.clothDimensions.map(dimension => dimension.height))),
                clothHeightAvrPx: round(mean(frameDetails.clothDimensions.map(dimension => dimension.height))),
                clothDiagonalMinPx: round(Math.min(...frameDetails.clothDimensions.map(dimension => dimension.diagonal))),
                clothDiagonalMaxPx: round(Math.max(...frameDetails.clothDimensions.map(dimension => dimension.diagonal))),
                clothDiagonalAvrPx: round(mean(frameDetails.clothDimensions.map(dimension => dimension.diagonal))),

                clothOriginalDiagonalPx: round(calculateClothDimensionsAt(0, thisClothData.selectedDotPosX, thisClothData.selectedDotPosY).diagonal),
                dotCount: thisClothData.dotNum,
                dotSizePx: trial.dotSize,
                clothScaleFactorBasedOnScreenSize: round(clothScaleFactorBasedOnScreenSize),
                referenceScreenDiagonal: referenceScreenDiagonal,
                participantScreenDiagonal: round(screenDiagonal),
                participantScreenSize: [w, h],
                participantRefreshRate: round(totalFrameCount / (timeElapsed / 1000)),
                displayFPSSet: displayFPS,
            };

            display_element.innerHTML = '';
            document.body.style.cursor = 'default';
            jsPsych.finishTrial(trial_data);
        };

        /* ============================================================
        9) HELPER FUNCTIONS
        ================================================================ */
        function drawDots(x, y) {
            context.fillStyle = 'white';
            context.beginPath();
            context.arc(x, y, trial.dotSize, 0, 2 * Math.PI);
            context.fill();
            context.lineWidth = '2';
            context.strokeStyle = 'white';
            context.stroke();
        }

        function calculateClothDimensionsAt(frameIdx, dotPosX, dotPosY) {
            var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            for (var i = 0; i < dotPosX.length; i++) {
                var x = dotPosX[i][frameIdx];
                var y = dotPosY[i][frameIdx];
                if (x < minX) minX = x; if (x > maxX) maxX = x;
                if (y < minY) minY = y; if (y > maxY) maxY = y;
            }
            var cw = maxX - minX; var ch = maxY - minY;

            return { width: cw, height: ch, center: [minX + cw / 2, minY + ch / 2], minX: minX, minY: minY, maxX: maxX, maxY: maxY, diagonal: Math.sqrt(cw * cw + ch * ch) };
        }

        function calculateClothSpeed(shownDotPosX, shownDotPosY) {
            var ind_speed = [];
            var all_speed_sumX = 0;
            var all_speed_sumY = 0;
            for (var i = 0; i < shownDotPosX.length; i++) {
                var tx = shownDotPosX[i];
                var ty = shownDotPosY[i];
                var dot_length = tx.length;
                var diff_sumX = 0;
                var diff_sumY = 0;

                for (var ii = 1; ii < dot_length; ii++) {
                    var changeX = tx[ii] - tx[ii - 1];
                    var changeY = ty[ii] - ty[ii - 1];
                    var frameSpeed = Math.sqrt(changeX * changeX + changeY * changeY);
                    diff_sumX += frameSpeed;
                    diff_sumY += frameSpeed;
                }

                var x_sep = (diff_sumX / (totalFrameNum - 1)) * displayFPS;
                var y_sep = (diff_sumY / (totalFrameNum - 1)) * displayFPS;
                ind_speed[i] = [x_sep, y_sep];
                all_speed_sumX += x_sep;
                all_speed_sumY += y_sep;
            }

            var meanXY_speed = [
                all_speed_sumX / shownDotPosX.length,
                all_speed_sumY / shownDotPosY.length
            ];
            var overallSpeed = Math.sqrt(meanXY_speed[0] * meanXY_speed[0] + meanXY_speed[1] * meanXY_speed[1]);
            return round(overallSpeed)
        }

        function round(value, decimals = 2) {
            return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
        }
        function mean(arr) { return arr.reduce((a, b) => a + b, 0) / arr.length; }

    }

    return plugin;
})()