jQuery(document).ready(function($){
  $('.latest-commit').each(function(){
    var $container = $(this), $widget,
      repo = $container.data('repo'),
      vendorName = repo.split('/')[0],
      repoName = repo.split('/')[1],
      vendorUrl = "http://github.com/" + vendorName,
      repoUrl = "http://github.com/" + vendorName + '/' + repoName;
      $widget = $(
        '<div>' +
        '<p>Changed File: <a class="commit-file" href="#" target="_blank"></a></p>' +
        '<span>Commit Message: </span><span class="commit"></span>' +
        '<p><a class="btn btn-info commit-link" href="#" target="_blank"></a></p>' +
        '</div>'
      );
    $widget.appendTo($container);
    $.ajax({
      url: 'https://api.github.com/repos/' + repo + '/commits/master',
      dataType: 'jsonp',
      success: function(results) {
        var repo = results.data, date, pushed_at = 'unknown';
        var commitUrl = repo.html_url;
        var fullsha = repo.sha;
        var sha = fullsha.substring(0,10);
        var file = repo.files[0].filename;
        var fileUrl = repo.files[0].blob_url;
        $widget.find('.commit').text(repo.commit.message);
        $widget.find('.commit-file').attr('href',fileUrl).text(file).append(" <i class='icon-file-text'></i>");
        $widget.find('.commit-link').attr('href',commitUrl).text(sha).append(" <i class='icon-large icon-circle-arrow-right'></i>");
      }
    });
  });
});