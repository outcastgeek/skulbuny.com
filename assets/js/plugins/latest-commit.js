// Written by Sean Clayton
// 2013-10-08
// http://github.com/skulbuny/latest-commit.js
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
        '<p>Changed File: <a class="commit-file" href="#" target="_blank"></a></p>' +
        '<span>Commit Message: </span><span class="commit"></span>' +
        '<p><a class="btn btn-info commit-link" href="#" target="_blank"></a></p>' +
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
        $commit.find('.commit-file').attr('href',fileUrl).text(file).append(" <i class='icon-file-text'></i>"); //
        $commit.find('.commit-link').attr('href',commitUrl).text(sha).append(" <i class='icon-large icon-circle-arrow-right'></i>");
      }
    });
  });
});