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
        '<span>Latest change: </span><span class="commit"></span>' +
        '<p><a class="btn btn-info commit-link" href="#"></a></p>' +
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
        if(! results.data.commit) {
          $widget.find('.commit').attr('class','commit warning').text('API limit exceeded!');
          $widget.find('.commit-link').remove();
        }
        else {
          $widget.find('.commit').text(repo.commit.message);
          $widget.find('.commit-link').attr('href',commitUrl).attr('target',"_blank").text(sha).append(" <i class='icon-circle-arrow-right'></i>");
        }
      }
    });
  });
});