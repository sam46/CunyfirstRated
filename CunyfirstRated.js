console.log("CunyfirstRated Loaded!!");
$(document).ready(function(){
    setTimeout(function(){
    try{
        var srch = $('#ptifrmtgtframe').contents().find('a#CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH');
        if(srch.length) {
            console.log(srch);
        // var currentURL = window.location.href.toUpperCase();
        // if (currentURL.includes('HC_CLASS_SEARCH') ||
        //     currentURL.includes("home.cunyfirst.cuny.edu/psp/cnyepprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL?FolderPath=PORTAL_ROOT_OBJECT.HC_SSS_STUDENT_CENTER&IsFolder=false&IgnoreParamTempl=FolderPath%2cIsFolder".toUpperCase()) ) {
            window.setInterval(exe, 1500);
            console.log("IS MATCHING PAGE!!");
        }
    } catch (err) {

    }
    }, 1000);

// else {
//     var ifrm = null;
//     try{
//          ifrm = document.getElementById('ptifrmtgtframe').contentDocument;
//     } catch (err) {}
//     if(ifrm){
//         ifrm.
//     }
// }

function getGrade(instr, colg) {
    colg = colg.toLowerCase();
    var search = "https://www.ratemyprofessors.com/search.jsp?query=";
    if (instr.name.trim().toLowerCase() == 'staff') return;
    var tokens = instr.name.split(' ');
    for (var i = 0; i < tokens.length; i++) {
        search += tokens[i];
        if (i != tokens.length - 1) search += '+';
    }

    try {
        $.ajax({
            url: search,
            type: 'GET',
            colg: colg,
            instructor: instr,
            error: function(data, err, errThrown) {
                console.log("CunyfirstRated ajax Error1: " + "\n\t" + this + "\n\t" + data);
            },
            success: function(data) {
                var results = $(data).find('.listings li a');
                var tidHREF = null;
                if (results) {
                    for (var i = 0; i < results.length; i++) {
                        var resultColg = $(results[i]).find('.sub').html().toLowerCase();
                        if (resultColg.includes(this.colg)) {
                            tidHREF = $(results[i]).attr('href');
                            break;
                        }
                    }

                    if (tidHREF) {
                        var profURL = 'https://www.ratemyprofessors.com' + tidHREF;
                        $.ajax({
                            url: profURL,
                            instructor: this.instructor,
                            type: 'GET',
                            error: function(data, err, errThrown) {
                                console.log("CunyfirstRated ajax Error2: " + this.url);
                                this.instructor.updateDOM(this.url);
                            },

                            success: function(data) {
                                var rating = null;
                                try {
                                    rating = $(data).find('.grade')[0].innerHTML;
                                } catch (err) {}

                                if (rating) {
                                    this.instructor.rating = rating;
                                    this.instructor.updateDOM(this.url);
                                } else
                                    console.log("CunyfirstRated: rating undefined " + this.instructor.name);
                            }
                        });
                    } else if (results.length) this.instructor.updateDOM(this.url);
                }
            }
        });
    } catch (err) {}
}

function Instructor(N, d, slctColg) {
    this.name = N.trim();
    this.rating = '';
    this.doms = d;
    this.newHTML = '';

    // this.updateDOMinstr = function(other) {
    //  if (this.name != other.name) {
    //      console.log("CRITICAL ERROR: instructors don't match");
    //      return;
    //  }
    //  this.rating = other.rating;
    //  this.newHTML = other.newHTML;

    //  console.log(other);
    //  if (this.newHTML != '')
    //      this.dom.innerHTML = this.dom.innerHTML.replace(this.name, this.newHTML);
    // };

    this.updateDOM = function(url) {
        var newHTML = null;
        if (this.rating == '')
            newHTML = '<span class="cfrNoMatch"><a href="' + url + '">' + this.name + '</a></span>';
        else {
            var colors = ['red', 'orange', '#949c00', 'forestGreen', 'darkCyan'];
            var rating = Math.round(parseFloat(this.rating)) - 1;
            newHTML = '<span class="cfr" style="background-color: ' + colors[rating] +
                '; color:white;"><a class="cfr" href="' + url + '">' + this.name +
                '</a></span> <span style="color:' + colors[rating] + ';">' + this.rating + '</span>';
        }

        for (var i = 0; i < this.doms.length; i++)
            this.doms[i].innerHTML = this.doms[i].innerHTML.replace(this.name, newHTML);
        //this.newHTML = newHTML;
    };

    getGrade(this, slctColg);
}

var isTargetfrm = done = appendedStyle = false;
var selectedCollege = collegeCode = selectedTerm = null;

function fromCollegeCode(colgCode) {
    colgCode = colgCode.toUpperCase();
    if (colgCode.includes('CTY')) return "City College of New York";
    if (colgCode.includes('QNS')) return "Queens College";
    if (colgCode.includes('BAR')) return "Baruch College";
    if (colgCode.includes('HTR')) return "Hunter College";
    if (colgCode.includes('BKL')) return "Brooklyn College";
    if (colgCode.includes('LEH')) return "Lehman College";
    if (colgCode.includes('LAW')) return "CUNY School of Law";
    if (colgCode.includes('GRD')) return "Graduate Center--CUNY";
    if (colgCode.includes('JJC')) return "John Jay College";
    if (colgCode.includes('YRK')) return "York College";
    if (colgCode.includes('MEC')) return "Medgar Evers College";
    if (colgCode.includes('NYT')) return "New York City College of Technology";
    if (colgCode.includes('BMC')) return "Borough of Manhattan Community College";
    if (colgCode.includes('BCC')) return "Bronx Community College";
    if (colgCode.includes('CSI')) return "College of Staten Island";
    if (colgCode.includes('NCC')) return "Guttman Community College ";
    if (colgCode.includes('HOS')) return "Hostos Community College";
    if (colgCode.includes('KCC')) return "Kingsborough Community College";
    if (colgCode.includes('LAG')) return "Laguardia Community College";
    if (colgCode.includes('QCC')) return "Queensborough Community College";
    if (colgCode.includes('SPS')) return "CUNY School of Professional Studies ";
    //if(colgCode.includes('MED')) return ''
    //if(colgCode.includes('SPH')) return ''
}

function shouldRun() {
    var ifrm = document.getElementById('ptifrmtgtframe').contentDocument;
    isTargetfrm = ifrm.body.innerHTML.includes('class section(s) found');
    if (!isTargetfrm) {
        done = false;
        collegeCode = ifrm.getElementById('CLASS_SRCH_WRK2_INSTITUTION$31$').value;
        selectedCollege = fromCollegeCode(collegeCode);

        selectedTerm = ifrm.getElementById('CLASS_SRCH_WRK2_STRM$35$').value;
    }
    return (!done) & isTargetfrm;
}

function timeInRange(t, t0, t1) {
    t0f = +(t0.substring(0, t0.length - 5)) + (t0.substring(t0.length - 4, t0.length - 2)) / 60.0;
    t0f += (t0.includes('PM') && t0f < 11.99) ? 12 : 0;
    t1f = +(t1.substring(0, t1.length - 5)) + (t1.substring(t1.length - 4, t1.length - 2)) / 60.0;
    t1f += (t1.includes('PM') && t1f < 11.99) ? 12 : 0;
    tf = +(t.substring(0, t.length - 5)) + (t.substring(t.length - 4, t.length - 2)) / 60.0;
    tf += (t.includes('PM') && tf < 11.99) ? 12 : 0;
    return tf > t0f && tf < t1f;
}

function cmprDate(d1, d2) { // d1 > d2 ---> 1
    if (d1.year > d2.year) return 1;
    if (d1.year < d2.year) return -1;
    if (d1.month > d2.month) return 1;
    if (d1.month < d2.month) return -1;
    if (d1.day > d2.day) return 1;
    if (d1.day < d2.day) return -1;
    return 0;
}

function dateInRange(d, d0, d1) {
    var dTok = d.split('/'),
        d0Tok = d0.split('/'),
        d1Tok = d1.split('/');
    d0 = {
        month: +d0Tok[0],
        day: +d0Tok[1],
        year: +d0Tok[2]
    };
    d1 = {
        month: +d1Tok[0],
        day: +d1Tok[1],
        year: +d1Tok[2]
    };
    d = {
        month: +dTok[0],
        day: +dTok[1],
        year: +dTok[2]
    };
    return (cmprDate(d, d0) > -1) && (cmprDate(d1, d) > -1);
}

function intersect(range1, range2, type) { // check if two ranges (date or time) conflict
    // - CAN'T HANDLE TIME RANGES OVER 2 DAYS e.g. [11pm-1am]
    // - Assumes ['1:00PM','2:00PM'] and ['2:00PM','3:00PM'] are NOT conflicting 
    var inRange = (type == "time") ? timeInRange : dateInRange;
    var ans = inRange(range2[0], range1[0], range1[1]) ||
        inRange(range2[1], range1[0], range1[1]) ||
        inRange(range1[0], range2[0], range2[1]) ||
        inRange(range1[1], range2[0], range2[1]) ||
        (range1 + '' == range2 + '');
    return ans;
}

function Class(name, t, d) {
    this.t = t;
    this.title = name;
    var separateDays = t.split('<br>');
    var separateDates = d.split('<br>');
    this.dates = []; // [[start Date1,finish Date1], [start Date2,finish Date2], ...]
    this.daytimes = []; // [[day1,start,end] , [day2,start,end], ...]

    for (var elem in separateDates) {
        separateDates[elem] = separateDates[elem].trim();
        var tokens = separateDates[elem].split('-');
        this.dates.push([tokens[0].trim(), tokens[1].trim()])
    }

    for (var elem in separateDays) {
        var day = null; // [day,start,end]
        separateDays[elem] = separateDays[elem].trim();
        var tokens = separateDays[elem].split(' ');
        tokens[0] = tokens[0].trim();
        var numDays = tokens[0].length / 2;
        for (var i = 0; i < numDays; i++) {
            day = [tokens[0].substring(2 * i, 2 * i + 2), tokens[1], tokens[3]];
            this.daytimes.push(day);
        }
    }

    this.conflicts = function(other) {
        var datesConflict = false;
        for (var date in this.dates) {
            if (datesConflict) break;
            for (var oDate in other.dates)
                datesConflict = datesConflict || intersect(this.dates[date], other.dates[oDate], 'date');
        }
        if (!datesConflict) return false;

        for (var dt = 0; dt < this.daytimes.length; dt++) {
            for (var oDt = 0; oDt < other.daytimes.length; oDt++) {
                if (this.daytimes[dt][0] == other.daytimes[oDt][0]) { // same day of week
                    if (intersect([this.daytimes[dt][1], this.daytimes[dt][2]], [other.daytimes[oDt][1], other.daytimes[oDt][2]], 'time')) // time conflict
                        return true;
                }
            }
        }

        return false;
    }

}

function handleSchedule(ifrm, sectsNUM, colg, trm) {
    $.ajax({
        ifrm: ifrm,
        sectsNUM: sectsNUM,
        url: 'https://hrsa.cunyfirst.cuny.edu/psc/cnyhcprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSR_SSENRL_LIST.GBL?Page=SSR_SSENRL_LIST&Action=A&ACAD_CAREER=UGRD&ENRL_REQUEST_ID=&INSTITUTION='+colg+'&STRM='+trm,
        type: 'GET',
        success: function(data) {
            /* Extract schedule from page */
            var scheds = [];
            for (var i = 0,c =0;; i++) {
                var listing = $(data).find('#win0divDERIVED_REGFRM1_DESCR20\\$' + i);
                if (!listing[0]) break;
                var title = listing.find('.PAGROUPDIVIDER').html();
                var status = listing.find('#STATUS\\$' + i).html().toLowerCase();
                if (!status.includes('enrolled')) continue;
                var classes = listing.find('#CLASS_MTG_VW\\$scroll\\$' + i+' tbody tr').length -1;
                for(var j = 0; j < classes; j++){
                    var times = listing.find('#MTG_SCHED\\$' + (c+j)).html(); 
                    var dates = listing.find('#MTG_DATES\\$' + (c+j)).html();
                    scheds.push(new Class(title, times, dates));   
                }
                c += classes;
            }

            /* Modify conflicting sections's DOM */
            var ifrm = this.ifrm;
            var clkURL = chrome.extension.getURL('clk.png');
            for (var i = 0; i < this.sectsNUM; i++) {
                var times = ifrm.getElementById("MTG_DAYTIME$" + i).innerHTML;
                var dates = ifrm.getElementById("MTG_TOPIC$" + i).innerHTML;
                if (times.toLowerCase().includes('tba')) continue;

                var conflicts = false;
                for (var cls = 0; cls < scheds.length; cls++) // check if this section conflicts with sched     
                    if (conflicts = scheds[cls].conflicts(new Class('Unnamed', times, dates)))
                        break;
                if (!conflicts) continue; // no confliction

                var $img = $('<img>', {
                    src: clkURL,
                    'alt': 'Time Conflict with schedule',
                    'width': '16',
                    'height': '16',
                    'class': 'SSSIMAGECENTER'
                });
                var $div = $('#ptifrmtgtframe').contents().find('#win0divDERIVED_CLSRCH_SSR_STATUS_LONG\\$' + i + ' div');
                $div.append($img);
            }
        }
    });
}

function exe() {
    try {
        if (!shouldRun()) return;
        var instructorsDOMs = [];
        var ifrm = document.getElementById('ptifrmtgtframe').contentDocument;

        var css = ' .cfr a{ text-decoration: none; color: white; } .cfr a:hover{ background-color: #02288e; }';
        css += ' .cfrNoMatch a{ text-decoration: none; color:inherit; } .cfrNoMatch a:visited{ text-decoration: none; color:inherit; }';
        css += ' .cfrNoMatch a:hover{ background-color: #02288e; color:white; }';
        var style = document.createElement('style');
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        if (!appendedStyle) {
            appendedStyle = true;
            ifrm.getElementsByTagName('head')[0].appendChild(style);
        }

        var sectsNUM = 0;
        for (var i = 0;; i++) {
            var sectDOM = ifrm.getElementById("MTG_INSTR$" + i);
            if (!sectDOM) break;
            var instrs = sectDOM.innerHTML.split("<br>");
            for (var j = 0; j < instrs.length; j++) {
                if (instrs[j].trim().toLowerCase() == 'staff') continue;
                if (instructorsDOMs[instrs[j]]) instructorsDOMs[instrs[j]].push(sectDOM);
                else instructorsDOMs[instrs[j]] = [sectDOM];
            }

            sectsNUM++;
        }

        try {
            handleSchedule(ifrm, sectsNUM,collegeCode,selectedTerm);
        } catch(err) {
            console.log("handleSchedule() FAILED:\n\t" + err.message);
        }

        for (var instr in instructorsDOMs)
            new Instructor(instr, instructorsDOMs[instr], selectedCollege);

        done = true;
    } catch (err) {
        console.log("CunyfirstRated Error: " + err.message);
    }
}


/*******************************************************/
/*  Tests */
function testIntersect() {
    var tCases = [
        [
            ['9:00AM', '11:50AM'],
            ['10:00AM', '11:40AM'], true
        ],        
        [
            ['10:00AM', '1:00PM'],
            ['11:00AM', '12:00PM'], true
        ],
        [
            ['10:00AM', '11:59AM'],
            ['12:00PM', '12:50PM'], false
        ],
        [
            ['10:00AM', '12:00PM'],
            ['12:00PM', '12:50PM'], false
        ],
        [
            ['10:00PM', '11:50PM'],
            ['11:00PM', '11:59PM'], true
        ],
        [
            ['1:00PM', '2:00PM'],
            ['2:00PM', '3:00PM'], false
        ],
        [
            ['1:00PM', '2:00PM'],
            ['1:00PM', '2:00PM'], true
        ],

    ]

    for (var i = 0; i < tCases.length; i++) {
        if (intersect(tCases[i][0], tCases[i][1], 'time') == tCases[i][2])
            console.log('Case ' + (i + 1) + ':  OK');
        else
            console.log('Case ' + (i + 1) + ':  FAILED');
    }
} 

});
/*******************************************************/