currentPage = null;
pageArr = [];
// change visual theme
function changeTheme() {
    document.styleSheets[1].disabled = !document.styleSheets[1].disabled;
    var s = document.getElementById("slider");
    s.innerHTML = s.innerHTML == "Dark" ? "Light" : "Dark";
    localStorage.setItem("theme", s.innerHTML);
}
// add tab behaviour to textareas
$(document).delegate('textarea', 'keydown', function(e) {
    if(e.keyCode === 9) { // tab was pressed
        // get caret position/selection
        var start = this.selectionStart;
            end = this.selectionEnd;

        var $this = $(this);

        // set textarea value to: text before caret + tab + text after caret
        $this.val($this.val().substring(0, start)
                    + "\t"
                    + $this.val().substring(end));

        // put caret at right position again
        this.selectionStart = this.selectionEnd = start + 1;

        // prevent the focus lose
        return false;
    }
});
// set font
function setFont(name) {
    $("<style>* { font-family: '" + name + "'; }</style>").appendTo("head");
    document.getElementById("font").innerHTML = name;
    localStorage.setItem("font", name);
}
// new page
function resetPage() {
    var clearAnim = document.getElementById("clearAnim");
    var newClearAnim = clearAnim.cloneNode(true);
    clearAnim.parentNode.replaceChild(newClearAnim, clearAnim);
    newClearAnim.style.animationPlayState = "running";
    // clear inputs
    var inputs = document.getElementsByTagName("input");
    for (k of inputs) {
        k.value = "";
    }
    // clear textareas
    var inputs = document.getElementsByTagName("textarea");
    for (k of inputs) {
        k.value = "";
    }
}
// load cookie data
function loadData() {
    localStorage.clear(); // DEBUG
    if (!localStorage.getItem("count")) {
        localStorage.setItem("theme", "light");
        localStorage.setItem("font", "Helvetica");
        localStorage.setItem("open", "-1");
        localStorage.setItem("count", "0");
    }
    console.log(localStorage.getItem("theme"));
    console.log(localStorage.getItem("font"));
    console.log(localStorage.getItem("open"));
    console.log(localStorage.getItem("count"));
    // load settings
    if (localStorage.getItem("theme") == "Dark")
        changeTheme();
    setFont(localStorage.getItem("font"));
    // load pages
    loadPagesFromStorage();
    // load current page
    if (localStorage.getItem("count") == 0) {
        // create new page
        newPage();
    }else {
        // reopen last open page
        openPageId(localStorage.getItem("open"));
    }
}
// load pages from local storage
function loadPagesFromStorage() {
    Object.keys(localStorage).forEach(function(key){
        // console.log("key=" + key + "\t\tvalue=" + localStorage.getItem(key));
        if (key.indexOf("page") != -1) {
            // extract data
            var id = key.substr(8);
            // console.log("INDEX: " + id);
            var pageName = localStorage.getItem("pageName" + id);
            var courseName = localStorage.getItem("courseName" + id);
            var points = localStorage.getItem("points" + id);
            var body = localStorage.getItem("body" + id);
            var sum = localStorage.getItem("sum" + id);
            // build object
            var page = new Page(id, -1, points, body, sum, pageName, courseName);
            pageArr.push(page);
        }
    });
    loadPagesIntoBar();
}
// save page
function savePage(title_changed) {
    // console.log("SAVE");
    if (currentPage != null) {
        // update object
        currentPage._pageName = document.getElementById("title").value;
        currentPage._courseName = document.getElementById("course").value;
        currentPage._points = document.getElementById("notes_points").value;
        currentPage._body = document.getElementById("notes_body").value;
        currentPage._sum = document.getElementById("notes_sum").value;
        // update local storage
        updateLocal(currentPage);
        if (title_changed) {
            loadPagesIntoBar();
        }
    }else {
        // console.log("current page is null");
    }
}
// update local storage with current page data
function updateLocal(page) {
    var id = page._pageId;
    localStorage.setItem("pageName" + id, document.getElementById("title").value);
    localStorage.setItem("courseName" + id, document.getElementById("course").value);
    localStorage.setItem("points" + id, document.getElementById("notes_points").value);
    localStorage.setItem("body" + id, document.getElementById("notes_body").value);
    localStorage.setItem("sum" + id, document.getElementById("notes_sum").value);
}
// create new page
function newPage() {
    var count = localStorage.getItem("count");
    localStorage.setItem("count", parseInt(count) + 1);
    var p = new Page(count, -1);
    pageArr.push(p);    // add new page to obj list
    savePage();         // save current(old) page
    resetPage();
    currentPage = p;    // replace
    savePage();         // save new page
    loadPagesIntoBar(); // reload sidebar
    localStorage.setItem("open", currentPage._pageId);
}
// open page object, set html
function openPageId(id) {
    for (p of pageArr) {
        if (p._pageId == id) {
            // console.log("Open Page with id=" + id);
            document.getElementById("notes_points").value = p._points;
            document.getElementById("notes_body").value = p._body;
            document.getElementById("notes_sum").value = p._sum;
            document.getElementById("title").value = p._pageName;
            document.getElementById("course").value = p._courseName;
            currentPage = p;
            localStorage.setItem("open", currentPage._pageId);
            break;
        }
    }
}
function openPageObj(obj) {
    // console.log("Open Page with id=" + id);
    document.getElementById("notes_points").value = p._points;
    document.getElementById("notes_body").value = p._body;
    document.getElementById("notes_sum").value = p._sum;
    document.getElementById("title").value = p._pageName;
    document.getElementById("course").value = p._courseName;
    currentPage = p;
    localStorage.setItem("open", currentPage._pageId);
}
// put pages in sidebar
function loadPagesIntoBar() {
    var sidebar = document.getElementById("pages");
    // check for missing pages
    for (p of pageArr) {
        if (document.getElementById("open" + p._pageId) == null) {
            // add element
            console.log("ADD: " + p._pageName);
            var newPage = document.createElement('LI');
            newPage.classList.add('course-page');
            newPage.id = 'open' + p._pageId;
            var removePage = document.createElement('LI');
            removePage.classList.add('page-remove');
            removePage.id = 'delete' + p._pageId;
            removePage.innerHTML = "-";
            var displayText = document.createElement('H4');
            displayText.innerHTML = p._pageName == "" ? "Untitled" : p._pageName;
            // insert elements into page
            newPage.appendChild(removePage);
            newPage.appendChild(displayText);
            sidebar.appendChild(newPage);
        }
    }
    // check for pages that need to be deleted
    for (p of sidebar.children) {
        var found = false;
        for (p2 of pageArr) {
            if (p._pageId == p2._pageId) {
                found = true;
                break;
            }
        }
        if (!found) {
            // remove element event listeners
            $(p.getElementsByTagName('LI')[1]).off('click', function(e){openPageId(parseInt(e.target.id.substr(4)));});
            $(p.getElementsByTagName('LI')[0]).off('click', function(e){deletePage(parseInt(e.target.id.substr(6)));e.stopPropagation();});
            // remove element
            sidebar.removeChild(p);
        }
    }
}
// delete page
function deletePage(id) {
    console.log("delete id=" + id.toString());
    localStorage.removeItem("pageName" + id);
    localStorage.removeItem("courseName" + id);
    localStorage.removeItem("points" + id);
    localStorage.removeItem("body" + id);
    localStorage.removeItem("sum" + id);
    localStorage.setItem("count", localStorage.getItem("count") - 1);
    var current = currentPage._pageId == id;
    for (p of pageArr) {
        if (p._pageId == id) {
            pageArr.pop(p);
            console.log("removed element from page array");
        }
    }
    loadPagesIntoBar();
    if (current) {
        if(pageArr.length > 0) {
            openPageObj(pageArr[0]);
        }else {
            newPage();
        }
    }
}
// page object
class Page {
    constructor(pageId, courseId, points="", body="", sum="", pageName="", courseName="") {
        this._pageId = pageId;
        this._courseId = courseId;
        this._points = points;
        this._body = body;
        this._sum = sum;
        this._pageName = pageName;
        this._courseName = courseName;
    }
    set points(points) {
        this._points = points;
    }
    set notes(notes) {
        this._notes = notes;
    }
    set sum(sum) {
        this._sum = sum;
    }
    set courseId(id) {
        this._courseId = id;
    }
    set courseName(name) {
        this._courseName = name;
    }
    set pageId(id) {
        this._pageId = id;
    }
    set pageName(name) {
        this._pageName = name;
    }
    get points() {
        return this._points;
    }
    get notes() {
        return this._notes;
    }
    get sum() {
        return this._sum;
    }
    get pageId() {
        return this._pageId;
    }
    get courseId() {
        return this._courseId;
    }
    get courseName() {
        return this._courseName;
    }
    get pageName() {
        return this._pageName;
    }
}