var listItemHtml = '\
		<li class="selector-item js-navigation-item js-navigation-target selected"> \
            <a href="/{0}" onclick="function(){console.log(\'clicked\');}> \
                <label> \
                  <input checked="checked" id="do_included" name="do" type="radio" value="included"> \
                  <h4>{0}</h4> \
                  <p>{1}</p> \
                </label> \
            </a> \
          </li> \
	';

var buttonHtml = ' \
<div class="context-menu-container js-menu-container js-context-menu"> \
	<span class="minibutton switcher bigger js-menu-target"> \
      <span class="js-context-button"> \
          <span class="mini-icon mini-icon-fork"></span>Forks \
      </span> \
    </span> \
    <div class="context-pane js-menu-content"> \
      <a href="javascript:;" class="close js-menu-close"><span class="mini-icon mini-icon-remove-close"></span></a> \
      <div class="context-title">Existing forks</div> \
      <div class="context-body pane-selector"> \
        <ul class="js-navigation-container"> \
        </ul> \
      </div> \
    </div> \
  </div> \
</div> \
	';

String.format = function() {
  var s = arguments[0];
  for (var i = 0; i < arguments.length - 1; i++) {          
    s = s.replace(new RegExp("\\{" + i + "\\}", "gm"), arguments[i + 1]);
  }

  return s;
}

// Gets the repo url and makes json call for repo data
function getRepoData() {
	var repo = window.location.href.substr(window.location.href.indexOf(".com/") + 5);
	var repoUrl = "https://api.github.com/repos/" + repo;
	$.getJSON(repoUrl, repoResults);
}

// Callback with repo data
function repoResults(data) {
	console.log(data);
	console.log("num forks: " + data.forks);
	
	// Create the button
	$('ul.pagehead-actions').prepend('<li class="fork-list">' + buttonHtml + '</li>');
	
	// Add item for this repo
	$('li.fork-list ul.js-navigation-container').append(String.format(listItemHtml, data.full_name, "Has " + data.watchers_count + " watchers and " + data.forks_count + " forks"));
	
	if (data.forks > 0) {
		// If we have forks, we go get fork data
		getForkData();
	} else {
		// No forks
		$('li.fork-list ul.js-navigation-container').append(String.format(listItemHtml, "No forks", "This repo has no forks"));
	}
}

// Gets fork data from fork api
function getForkData() {
	var repo = window.location.href.substr(window.location.href.indexOf(".com/") + 5);
	var forksUrl = "https://api.github.com/repos/" + repo + "/forks?sort=watchers";
	$.getJSON(forksUrl, forksResults);
}

// Callback with fork data
function forksResults(data) {
	//console.log(data);
	$.each(data, function() {
		console.log(this);
		// Add each item to the button dropdown
		$('li.fork-list ul.js-navigation-container').append(String.format(listItemHtml, this.full_name, "Has " + this.watchers_count + " watchers and " + this.forks_count + " forks"));
	});
}

getRepoData();
