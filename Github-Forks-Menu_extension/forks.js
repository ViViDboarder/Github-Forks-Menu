// TODO: Find another way to get this header style from Github CSS
var liHeaderStyle = 'font-weight: bold; color: #111; text-shadow: 1px 1px 0 white; padding: 8px 10px 5px 10px; background: #F6F8F8; background: -moz-linear-gradient(#F6F8F8, #E9EEEE); background: -webkit-linear-gradient(#F6F8F8, #E9EEEE); background: linear-gradient(#F6F8F8, #E9EEEE); border-bottom: 1px solid #F0F3F3; border-top-left-radius: 4px; border-top-right-radius: 4px;';

var listItemHtml = [
        '<li class="selector-item js-navigation-item js-navigation-target selected">',
            '<a href="/{0}" class="forks-repo-button">',
                '<label>',
                    '<input checked="checked" id="do_included" name="do" type="radio" value="included">',
                    '<h4>{0}</h4>',
                    '<p>{1}</p>',
                '</label>',
            '</a>',
        '</li>'
    ].join('\n');

var buttonHtml = [
        '<div class="context-menu-container js-menu-container js-context-menu">',
            '<span class="minibutton switcher bigger js-menu-target">',
                '<span class="js-context-button">',
                    '<span class="mini-icon mini-icon-fork"></span>forks',
                '</span>',
            '</span>',
            '<div class="context-pane js-menu-content">',
                '<a href="javascript:;" class="close js-menu-close"><span class="mini-icon mini-icon-remove-close"></span></a>',
                '<div class="context-title">existing forks</div>',
                '<div class="context-body pane-selector">',
                    '<ul class="js-navigation-container">',
                    '</ul>',
                '</div>',
            '</div>',
        '</div>',
        '</div>'
    ].join('\n');

String.format = function() {
  var s = arguments[0];
  for (var i = 0; i < arguments.length - 1; i++) {          
    s = s.replace(new RegExp("\\{" + i + "\\}", "gm"), arguments[i + 1]);
  }

  return s;
};

var scheme = "https";
var hostname = "api.github.com";

// Returns the repo name from the url
function getRepoName() {
    // Repo url might have more than just the repo name
    var repoParts = window.location.href.split(/[\/#]+/);
    // 0: http(s)
    // 1: Hostname
    scheme = repoParts[0];
    var repo = repoParts[2] + '/' + repoParts[3];

    return repo;
}

// Gets the repo url and makes json call for repo data
function getRepoData() {
    var repo = getRepoName();

    var repoUrl = scheme + "//" + hostname + "/repos/" + repo;
    $.getJSON(repoUrl, repoResults);
}

// Callback with repo data
function repoResults(data) {
    console.log(data);
    console.log("num forks: " + data.forks);
    
    // Create the button
    $('ul.pagehead-actions').prepend('<li class="fork-list">' + buttonHtml + '</li>');
    
    // Add item for this repo
    $('li.fork-list ul.js-navigation-container').append('<li style="' + liHeaderStyle + '">This Fork</li>');
    $('li.fork-list ul.js-navigation-container').append(String.format(listItemHtml, data.full_name, "Has " + data.watchers_count + " watchers and " + data.forks_count + " forks"));
    $('li.fork-list ul.js-navigation-container').append('<li style="' + liHeaderStyle + '">Parent Repo</li>');
    if (data.parent) {
        // Add parent repo
        $('li.fork-list ul.js-navigation-container').append(String.format(listItemHtml, data.parent.full_name, "Has " + data.parent.watchers_count + " watchers and " + data.parent.forks_count + " forks"));
    } else {
        // No parent repo
        var noParent = $(String.format(listItemHtml, "No Parent", "This repo has no parent"));
        // remove the class so this doesn't function as a button
        $('a.forks-repo-button', noParent).removeClass('forks-repo-button');
        $('li.fork-list ul.js-navigation-container').append(noParent);
    }

    $('li.fork-list ul.js-navigation-container').append('<li style="' + liHeaderStyle + '">Forks</li>');
    
    if (data.forks > 0) {
        // If we have forks, we go get fork data
        getForkData();
    } else {
        // No forks
        var noForks = $(String.format(listItemHtml, "No forks", "This repo has no forks"));
        // remove the class so this doesn't function as a button
        $('a.forks-repo-button', noForks).removeClass('forks-repo-button');
        $('li.fork-list ul.js-navigation-container').append(noForks);
    }

    // Click action ot open fork since default function of a seems to be blocked
    $('li.fork-list ul.js-navigation-container').on('click', 'li a.forks-repo-button', function(event){
        window.open($(this).attr('href'), '_self');
    });

    // Hover effects
    $('li.fork-list ul.js-navigation-container').on('mouseover', 'li', function(event){
        // Mouse over
        $(this).addClass("navigation-focus");
    });
    $('li.fork-list ul.js-navigation-container').on('mouseout', 'li', function(event){
        // Mouse out
        $(this).removeClass("navigation-focus");
    });
}

// Gets fork data from fork api
function getForkData() {
    var repo = getRepoName();
    var forksUrl = scheme + "//" + hostname + "/repos/" + repo + "/forks?sort=watchers";
    console.log(forksUrl);
    $.getJSON(forksUrl, forksResults);
}

// Callback with fork data
function forksResults(data) {
    console.log(data);
    $.each(data, function() {
        // Add each item to the button dropdown
        $('li.fork-list ul.js-navigation-container').append(String.format(listItemHtml, this.full_name, "Has " + this.watchers_count + " watchers and " + this.forks_count + " forks"));
    });
}

getRepoData();
