---
layout: post
title: "jquery.latest commit.js"
subtitle:
description: "A lightweight jQuery plugin to display your latest commit."
link:
date: 2013-10-08
tags: [code jquery GitHub]
category: post
image:
  feature:
  thumb:
  credit:
  creditlink:
share: true
---

Here's a bit of code I wrote these past few days. [Check out the GitHub Repo](http://github.com/skulbuny/jquery.latest-commit.js)

<!--more-->

{% highlight javascript %}
// Written by Sean Clayton
// 2013-10-08
// http://github.com/skulbuny/jquery.latest-commit.js
jQuery(document).ready(function($){
  $('.latest-commit').each(function(){ // Attach to any div/section/whatever with this class
    var $container = $(this), $commit,
      repo = $container.data('github'),
      username = repo.split('/')[0],
      repoName = repo.split('/')[1],
      userUrl = "http://github.com/" + username, // Gets your user url
      repoUrl = "http://github.com/" + username + '/' + repoName; // Gets your repo url
      $commit = $(
        '<div>' + // Needs to be wrapped.
        // ADD DESIRED CLASSES TO HTML TAGS BELOW!
        '<a class="commit-file" href="#" target="_blank"></a></p>' + // Link to commit file
        '<span>Commit Message: </span><span class="commit"></span>' + // Displays commit message
        '<p><a class="commit-link" href="#" target="_blank"></a></p>' + // Creates link to commit
        '</div>'
      );
    $commit.appendTo($container);
    $.ajax({
      url: 'https://api.github.com/repos/' + repo + '/commits/master', // Sets url to your commit index
      dataType: 'jsonp',
      success: function(results) {
        var repo = results.data, date, pushed_at = 'unknown';
        var commitUrl = repo.html_url; // Grabs URL of the commit
        var fullsha = repo.sha; // Grabs SHA of Commit
        var sha = fullsha.substring(0,10); // Truncates SHA to 10 characters, just like GitHub does
        var file = repo.files[0].filename; // Grabs the first filename
        var fileUrl = repo.files[0].blob_url; // URL to the aforementioned file
        $commit.find('.commit').text(repo.commit.message); // Outputs commit message
        $commit.find('.commit-file').attr('href',fileUrl).text(file); // Adds file url to the changed file, and displays the file path/name
        $commit.find('.commit-link').attr('href',commitUrl).text(sha); // Adds link to commit and commit SHA
      }
    });
  });
});
{% endhighlight %}