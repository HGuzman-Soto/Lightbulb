$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover({
        trigger: 'focus hover',
        html: true,
        placement: 'top'
    });

    if(onPage("quizzes") || onPage("classrooms"))
    {
        var accountTable = $('#account-tables').DataTable( {
            columnDefs: [
                { orderable: false, targets: [3, 4] },
                { responsivePriority: 10001, targets: 2 },
                { responsivePriority: 10002, targets: 1 }
            ],
            lengthMenu: [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "All"] ],
            tabIndex: -1,
            retrieve: true
        });
    }
    else if(onPage("results"))
    {
    console.log("on results page");
        var classResults = $('#classroom-results').DataTable( {
            retrieve: true
        });
    }
    else if(onPage("home") || location.pathname == '/')
    {
        var classroomsTable = $('#classrooms-table, #quizzes-table').DataTable({
            searching: false,
            info: false,
            autoWidth: true,
            lengthMenu: [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "All"] ],
            columnDefs: [{ type: 'date', 'targets': [1] }],
            ordering: false,
            tabIndex: -1,
            retrieve: true
        });
    } else if(onPage("classroom"))
    {
        var input = $("#classroom-title-display > input");
        input.attr('size', input.attr('placeholder').length);

        $("#added-quizzes-table").DataTable({
            columnDefs: [
                { orderable: false, targets: 3 }
            ],
            info: false,
            autoWidth: true,
            lengthMenu: [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "All"] ],
            retrieve: true
        });
    }
});

function onPage(page) {
    return document.URL.indexOf(page) != -1;
}

function getEditorContent() {
    var editor = ace.edit("editor");
    var code = editor.getValue();
    console.log(code);
}

$('.navTrigger').click(function () {
    $(this).toggleClass('active');
    console.log("Clicked hamburger");
});

$(window).scroll(function () {
    smoothnav = document.getElementsByClassName("navbar")[0];
    if ($(document).scrollTop() > 30) {
        $(smoothnav).addClass('affix').animate();
    } else {
        $(smoothnav).removeClass('affix').animate();
    }
});

// this colors the current page's link in the navbar white
currentLinks = document.querySelectorAll('a[href="'+ document.URL.substr(document.URL.lastIndexOf("/")) +'"].nav-link');
    currentLinks.forEach(function(link) {
        link.className += ' current-page';
        var newSpan = document.createElement('span');
        newSpan.className += 'sr-only';
        newSpan.innerHTML = "(current)";
        link.appendChild(newSpan);
    });

function dropDown() {
    var x = document.getElementById("navlistofcontents");
    if (x.className === "listofcontents") {
        x.className += " responsive ";
    }
    else {
        x.className = "listofcontents";
    }
}

function goBack() {
    window.history.back();
    console.log("Going back to previous page");
}

setTimeout(function () {
    $(".alert").fadeTo(300, 0).slideUp(300, function () {
        $(this).remove();
    });
}, 1500);

function openLatexAlert() {
    modal = document.getElementById("modalPopUp");
    modalText = document.getElementById("modalText");
    modalTitle = document.getElementById("modalTitle");
    modalButton = document.getElementById("modalButton");
    cancelButton = document.getElementById("cancelButton");
    modalTitle.innerHTML = "Did you know?";
    modalText.innerHTML = "We have LaTeX Integration! </br> Simply type anything in LaTeX into your question or answer, and we will convert it for you!";
    modalButton.innerHTML = "Got it!";
    modalButton.onclick = function() {modal.style.display="none"};
    cancelButton.style.display = "none";
    modal.style.display = "block";
}

function showAccountEditForm() {
    document.getElementById("account-info-container").style.display = "none";
    document.getElementById("user-stats").style.display = "none";
    document.getElementById("account-form").style.display = "block";
}

function reverse_icon(element) {
    // get decendant that has <i>
    var itag = element.getElementsByTagName("i")[0];
    var direction;
    // changes the direction of ordering 
    if(itag.classList.contains('sort-descending')) {
        itag.className = ('fas fa-arrow-up sort-ascending');
        direction = false;
    } else {
        itag.className = ('fas fa-arrow-down sort-descending');
        direction = true;
    }

    //refresh page
    refresh("#quizListings");
}

$('#theme-toggle').click(function() {
    var theme;
    if(this.textContent === "Dark Theme") {
        theme = "vibrant_ink";
        this.textContent = "Light Theme";
    } else {
        theme = "iplastic";
        this.textContent = "Dark Theme";
    }
    editor.setTheme("ace/theme/" + theme);
    $(this).toggleClass("btn-secondary btn-dark");
});

function refresh(section)
{
    console.log("Beginning Refresh")
    // $(section).load(document.URL + section);
    $.ajax({
        type: "GET",
        url: document.URL,
        contentType: "text",
        success: function(data) {
            var result = $('<div />').append(data).find(section).html();
            if(typeof $(section)[0] !== 'undefined')
            {
                $(section)[0].innerHTML = result;
            }
            if(document.URL.indexOf("quizzes"))
            {
                $('#account-tables').DataTable();
            }
            MathJax.typeset();
            console.log("Refreshed");
        }
    })
};