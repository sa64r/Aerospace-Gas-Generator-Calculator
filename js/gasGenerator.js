
let data = {};
let newValueCalculated = true;


document.getElementById("calculateButton").onclick = function () { //when "calculate" is pressed the program executes
    newValueCalculated = true;
    let inputs = document.getElementById("inputs");

    let inputElements = inputs.querySelectorAll("input");

    for (let input of inputElements) {
        data[input.name] = input.value;
    }

    assumptions()

    //Calculate Values
    let i = 1;
    while (newValueCalculated === true) { //loops continuously until no more can be calculated with inputed data
        newValueCalculated = false;
        calculateP_02P_01Ratio()
        calculateP_04P_03Ratio()
        calculateCombustionPressureDrop()
        calculateT_021()
        calculateT_034()
        calculateC_pa()
        calculateT_03T_01Ratio()
        calculateP_01()
        calculateT_01()
        calculateP_02()
        calculateT_02()
        calculateP_03()
        calculateT_03()
        calculateP_04()
        calculateT_04()



        console.log(i)
        i++
    }
    return false // so page does not refresh
}

// ============================== ASSUMPTIONS ======================================

function assumeAtmosphereIsCompressorInlet() {
    if (data["P_01"] === "" && data["P_0a"] !== "") {
        data["P_01"] = parseFloat(data["P_0a"]);

        showNewData("P_01")
    }

    if (data["T_01"] === "" && data["T_0a"] !== "") {
        data["T_01"] = parseFloat(data["T_0a"]);
        showNewData("T_01")
    }
}

function assumeIsentropicFlow() {
    data["eta_c"] = 1;
    data["eta_t"] = 1;

    showNewData("eta_c")
    showNewData("eta_t")
}

// function to check and handle any assumptions
function assumptions() {
    // checks if ambient environment is asssumed to be same as compressor inlet 
    if (document.getElementsByName("assumeAtmosphereIsCompressorInlet")[0].checked === true) {
        assumeAtmosphereIsCompressorInlet()
    }
    if (document.getElementsByName("assumeIsentropicFlow")[0].checked === true) {
        assumeIsentropicFlow()
    }
}
// =======================================================================================


// ========================== CALCULATING VALUES ===========================================

// calculates P_02/P_01
function calculateP_02P_01Ratio() {
    if (data["P_02/P_01"] === "") {
        if (data["T_021"] !== "" && data["gamma_a"] !== "" && data["T_01"] !== "" && data["eta_c"]) {
            newValueCalculated = true;
            data["P_02/P_01"] = (data["T_021"] * (data["eta_c"] / data["T_01"]) + 1) ** (data["gamma_a"] / (data["gamma_a"] - 1));
        } else if (data["P_01"] !== "" && data["P_02"] !== "") {
            newValueCalculated = true;
            data["P_02/P_01"] = data["P_02"] / data["P_01"];
        }
        showNewData("P_02/P_01")
    }
}

// calculates P_04/P_03
function calculateP_04P_03Ratio() {
    if (data["P_04/P_03"] === "") {
        if (data["T_034"] !== "" && data["gamma_g"] !== "" && data["T_03"] !== "" && data["eta_t"]) {
            newValueCalculated = true;
            data["P_04/P_03"] = (1 - data["T_034"] / (data["eta_t"] * data["T_03"])) ** (data["gamma_g"] / (data["gamma_g"] - 1));
        } else if (data["P_03"] !== "" && data["P_04"] !== "") {
            newValueCalculated = true;
            data["P_04/P_03"] = data["P_04"] / data["P_03"];
        }
        showNewData("P_04/P_03")
    }
}

// calculates P_02 - P_03
function calculateCombustionPressureDrop() {
    if (data["P_02-P_03"] === "") {
        if (data["P_02"] !== "" && data["P_03"] !== "") {
            newValueCalculated = true;
            data["P_02-P_03"] = data["P_02"] - data["P_03"];
        }
        showNewData("P_02-P_03")
    }
}

// calculates T_021 = T_02 - T_01
function calculateT_021() {

    if (data["T_021"] === "") {
        if (data["T_01"] !== "" && data["T_02"] !== "") {
            newValueCalculated = true;
            data["T_021"] = data["T_02"] - data["T_01"]

        } else if (data["T_01"] !== "" && data["eta_c"] !== "" && data["P_02/P_01"] !== "" && data["gamma_a"] !== "") {
            newValueCalculated = true;
            data["T_021"] = (data["T_01"] / data["eta_c"]) * ((data["P_02/P_01"] ** ((data["gamma_a"] - 1) / data["gamma_a"])) - 1);
        } else if (data["eta_m"] !== "" && data["C_pg"] !== "" && data["C_pa"] !== "" && data["T_034"]) {
            newValueCalculated = true;
            data["T_021"] = data["eta_m"] * (data["C_pg"] / data["C_pa"]) * data["T_034"];
        }
        showNewData("T_021")
    }

}

// calculate T_034
function calculateT_034() {
    if (data["T_034"] === "") {
        if (data["T_03"] !== "" && data["T_04"] !== "") {
            newValueCalculated = true;
            data["T_034"] = data["T_03"] - data["T_04"];
        } else if (data["eta_t"] !== "" && data["T_03"] !== "" && data["P_04/P_03"] !== "" && data["gamma_g"] !== "") {
            newValueCalculated = true;
            data["T_034"] = data["eta_t"] * data["T_03"](1 - data["P_04/P_03"] ** ((data["gamma_g"] - 1) / data["gamma_g"]));
        } else if (data["eta_m"] !== "" && data["C_pg"] !== "" && data["C_pa"] !== "" && data["T_021"]) {
            newValueCalculated = true;
            data["T_034"] = (1 / data["eta_m"]) * (data["C_pa"] / data["C_pg"]) * data["T_021"];
        }
        showNewData("T_034")
    }
}

// Calculates C_pa
function calculateC_pa() {
    if (data["C_pa"] === "") {
        temperature = data["T_0a"];
        if (data["T_0a"] !== "") {
            newValueCalculated = true;
            // polynomial 10 regression graph calculated using standard air table data and using: https://arachnoid.com/polysolve/ [Correlation coefficient = 0.9999997712630977,Standard error = 0.00004113312976375276]
            data["C_pa"] = 1.5977604627674646 * (10 ** -31) * temperature ** 10 - 1.5934017435368798 * 10 ** (-27) * temperature ** 9 + 6.7065935250062225 * 10 ** (-24) * temperature ** 8 - 1.5299296681984513 * 10 ** (-20) * temperature ** 7 +
                1.9912255120409541 * 10 ** (-17) * temperature ** 6 - 1.3494191937646560 * 10 ** (-14) * temperature ** 5 + 2.0819739539495109 * 10 ** (-12) * temperature ** 4 + 2.9674130283816789 * 10 ** (-9) * temperature ** 3 - 1.5748983930422449 * 10 ** (-6) * temperature ** 2 +
                2.9144971170035245 * 10 ** (-4) * temperature + 9.8336198511704698 * 10 ** (-1);
        }
        showNewData("C_pa")
    }
}

// calculate T_03/T_01
function calculateT_03T_01Ratio() {
    if (data["T_03/T_01"] === "") {
        if (data["T_03"] !== "" && data["T_01"] !== "") {
            newValueCalculated = true;
            data["T_03/T_01"] = data["T_03"] / data["T_01"];
        }
        showNewData("T_03/T_01")
    }
}

// calculate P_01
function calculateP_01() {
    if (data["P_01"] === "") {
        if (data["P_02"] !== "" && data["P_02/P_01"] !== "") {
            newValueCalculated = true;
            data["P_01"] = data["P_02"] / data["P_02/P_01"];
        }
        showNewData("P_01")
    }
}

// Calculate T_01
function calculateT_01() {
    if (data["T_01"] === "") {
        if (data["T_02"] !== "" && data["T_021"] !== "") {
            newValueCalculated = true;
            data["T_01"] = data["T_02"] - data["T_021"];
        }
        showNewData("T_01")
    }
}

// Calculate P_02
function calculateP_02() {
    if (data["P_02"] === "") {
        if (data["P_01"] !== "" && data["P_02/P_01"] !== "") {
            newValueCalculated = true;
            data["P_02"] = data["P_01"] * data["P_02/P_01"];
        } else if (data["P_02-P_03"] !== "" && data["P_03"] !== "") {
            newValueCalculated = true;
            data["P_02"] = data["P_02-P_03"] + data["P_03"];
        }
        showNewData("P_02")
    }
}

// calculates T_02
function calculateT_02() {

    if (data["T_02"] === "") {
        // if (data["T_01"] !== "" && data["eta_c"] !== "" && data["P_02/P_01"] !== "" && data["gamma_a"] !== "") {
        //     newValueCalculated = true;

        //     data["T_02"] = (data["T_01"] / data["eta_c"]) * ((data["P_02/P_01"] ** ((data["gamma_a"] - 1) / data["gamma_a"])) - 1) + parseFloat(t1);

        // } else 
        if (data["T_01"] !== "" && data["T_021"] !== "") {
            newValueCalculated = true;
            data["T_02"] = parseFloat(data["T_021"]) + parseFloat(data["T_01"]);
        }
        showNewData("T_02")
    }
}

// calcualte P_03
function calculateP_03() {
    if (data["P_03"] === "") {
        if (data["P_04"] !== "" && data["P_04/P_03"] !== "") {
            newValueCalculated = true;
            data["P_03"] = data["P_04"] / data["P_04/P_03"];
        } else if (data["P_02-P_03"] !== "" && data["P_02"] !== "") {
            newValueCalculated = true;
            data["P_03"] = - data["P_02-P_03"] + data["P_02"];
        }
        showNewData("P_03")
    }
}

// calculates T_03
function calculateT_03() {
    if (data["T_03"] === "") {
        if (data["T_04"] !== "" && data["T_034"] !== "") {
            newValueCalculated = true;
            data["T_03"] = data["T_04"] + data["T_034"];
        }
        showNewData("T_03")
    }
}

// calculate P_04
function calculateP_04() {
    if (data["P_04"] === "") {
        if (data["P_03"] !== "" && data["P_04/P_03"] !== "") {
            newValueCalculated = true;
            data["P_04"] = data["P_03"] * data["P_04/P_03"];
        }
        showNewData("P_04")
    }
}

// calculate T_04
function calculateT_04() {
    if (data["T_04"] === "") {
        if (data["T_03"] !== "" && data["T_034"] !== "") {
            newValueCalculated = true;
            data["T_04"] = data["T_03"] - data["T_034"];
        }
        showNewData("T_04")
    }
}
// =======================================================================================


// shows the calculated data in the relevant input field and colors field green to emphasise calculation
function showNewData(elementName) {
    let calculatedValueIndicatorColor = "#20dc9d";
    let calculatedValueIndicatorShadow = "inset 5px 5px 10px #1bbb85, inset -5px -5px 10px #25fdb5";
    let elementBeingChanged;

    if (data[elementName] !== "") {
        elementBeingChanged = document.getElementsByName(elementName)[0]; //the [0] is there to denote it is the first element with said name despite the name is unique
        elementBeingChanged.style.backgroundColor = calculatedValueIndicatorColor;
        elementBeingChanged.style.boxShadow = calculatedValueIndicatorShadow;
        elementBeingChanged.value = data[elementName];
    }
}