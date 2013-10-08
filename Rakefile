require 'rubygems'
require 'rake'
require 'yaml'
require 'time'

task :default => :preview

#
# Set the values of
#
# $deploy_url = "http://www.example.com/somedir"    # where the system will live
# $deploy_dir = "user@host:~/some-location/"        # where the sources live
# $post_dir   = "_posts/"                           # where posts are created
#
# ... or load them from a file, e.g.:
#
load '_rake-configuration.rb'

#
# Tasks start here
#

desc 'Clean up generated site'
task :clean do
  cleanup
end

desc 'Preview on local machine (server with --auto)'
task :preview => :clean do
  set_url('http://localhost:4000')
  jekyll('serve --watch')
end

desc 'Static build (build using filesystem)'
task :build_static => :clean do
  set_url(Dir.getwd + "/_site")
  jekyll('build')
end

desc 'Build for deployment (but do not deploy)'
task :build => :clean do
  set_url($deploy_url)
  jekyll('build')
end

desc 'Build and deploy to remote server'
task :deploy => :build do
  sh "rsync -avz --delete _site/ #{$deploy_dir}"
  File.open("_last_deploy.txt", 'w') {|f| f.write(Time.new) }
end

#
# support functions for generating list of changed files
#
def myprocess(filename)
  new_filename = filename[0, filename.length - 1]
  if file_matches(new_filename) then
    puts new_filename
    "<li><a href=\"{{site.url}}/#{file_change_ext(new_filename, ".html")}\">#{new_filename}</a></li>\n"
  else
    ""
  end
end

EXCLUSION_REGEXPS = [/.*~/, /_.*/, /javascripts/, /stylesheets/, /Rakefile/, /Gemfile/, /s[ca]ss/, /.*\.css/, /.*.js/]

def file_matches(filename)
  output = EXCLUSION_REGEXPS.each.collect { |x| filename.index(x) != nil }.include?(true)
  not output
end

def file_change_ext(filename, newext)
  if File.extname(filename) == ".textile" or File.extname(filename) == ".md" then
    filename.sub(File.extname(filename), newext)
  else
    filename
  end
end

desc 'Check links for site already running on localhost:4000'
task :check_links do
  begin
    require 'anemone'
    root = 'http://localhost:4000/'
    Anemone.crawl(root, :discard_page_bodies => true) do |anemone|
      anemone.after_crawl do |pagestore|
        broken_links = Hash.new { |h, k| h[k] = [] }
        pagestore.each_value do |page|
          if page.code != 200
            referrers = pagestore.pages_linking_to(page.url)
            referrers.each do |referrer|
              broken_links[referrer] << page
            end
          end
        end
        broken_links.each do |referrer, pages|
          puts "#{referrer.url} contains the following broken links:"
          pages.each do |page|
            puts "  HTTP #{page.code} #{page.url}"
          end
        end
      end
    end

  rescue LoadError
    abort 'Install anemone gem: gem install anemone'
  end
end

def cleanup
  sh 'rm -rf _site'
end

def jekyll(directives = '')
  sh 'jekyll ' + directives
end

# set the url in the configuration file
def set_url(url)
  config_filename = "_config.yml"

  text = File.read(config_filename)
  url_directive = Regexp.new(/url: .*$/)
  if text.match(url_directive)
    puts = text.gsub(url_directive, "url: #{url}")
  else
    puts = text + "\nurl: #{url}"
  end
  File.open(config_filename, "w") { |file| file << puts }
end

SOURCE = "."
CONFIG = {
  'layouts' => File.join(SOURCE, "_layouts"),
  'posts' => File.join(SOURCE, "_posts"),
  'post_ext' => "md"
}

# Path configuration helper
module Paths
  class Path
    SOURCE = "."
    Paths = {
      :layouts => "_layouts",
      :posts => "_posts"
    }

    def self.base
      SOURCE
    end

    # build a path relative to configured path settings.
    def self.build(path, opts = {})
      opts[:root] ||= SOURCE
      path = "#{opts[:root]}/#{Paths[path.to_sym]}/#{opts[:node]}".split("/")
      path.compact!
      File.__send__ :join, path
    end

  end
end

# Usage: rake post title="A Title" [date="2012-02-09"] [tags=tag1,tag2] [category="category"]
desc "Begin a new post in #{CONFIG['posts']}"
task :post do
  abort("rake aborted: '#{CONFIG['posts']}' directory not found.") unless FileTest.directory?(CONFIG['posts'])
  title = ENV["title"] || "new-post"
  tags = ENV["tags"] || "[]"
  category = ENV["category"] || ""
  slug = title.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')
  begin
    date = (ENV['date'] ? Time.parse(ENV['date']) : Time.now).strftime('%Y-%m-%d')
  rescue => e
    puts "Error - date format must be YYYY-MM-DD, please check you typed it correctly!"
    exit -1
  end
  filename = File.join(CONFIG['posts'], "#{date}-#{slug}.#{CONFIG['post_ext']}")
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end

  puts "Creating new post: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: post"
    post.puts "title: \"#{title.gsub(/-/,' ')}\""
    post.puts "subtitle: "
    post.puts "description: "
    post.puts "link: "
    post.puts "date: #{date}"
    post.puts "tags: #{tags}"
    post.puts "category: #{category.gsub(/-/,' ')}"
    post.puts "image: "
    post.puts "  feature: "
    post.puts "  thumb: "
    post.puts "  credit: "
    post.puts "  creditlink: "
    post.puts "share: true"
    post.puts "---"
  end
end # task :post

# Usage: rake page name="about.html"
# You can also specify a sub-directory path.
# If you don't specify a file extention we create an index.html at the path specified
desc "Create a new page."
task :page do
  name = ENV["name"] || "new-page.md"
  filename = File.join(SOURCE, "#{name}")
  filename = File.join(filename, "index.html") if File.extname(filename) == ""
  title = File.basename(filename, File.extname(filename)).gsub(/[\W\_]/, " ").gsub(/\b\w/){$&.upcase}
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end

  mkdir_p File.dirname(filename)
  puts "Creating new page: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: page"
    post.puts "title: \"#{title}\""
    post.puts 'description: ""'
    post.puts "---"
    post.puts "{% include JB/setup %}"
  end
end # task :page