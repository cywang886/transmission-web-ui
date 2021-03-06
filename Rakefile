require 'rubygems'
begin
  require 'rake'
rescue LoadError
  puts 'This script should only be accessed via the "rake" command.'
  puts 'Installation: gem install rake -y'
  exit
end
require 'rake'
require 'rake/clean'

$:.unshift File.dirname(__FILE__) + "/lib"

APP_VERSION  = '0.0.1'
APP_NAME     = 'transmission-web-ui'
RUBYFORGE_PROJECT = APP_NAME
APP_TEMPLATE = "#{APP_NAME}.js.erb"
APP_FILE_NAME= "#{APP_NAME}.js"

APP_ROOT     = File.expand_path(File.dirname(__FILE__))
APP_SRC_DIR  = File.join(APP_ROOT, 'src')
APP_DIST_DIR = File.join(APP_ROOT, 'dist')
APP_PKG_DIR  = File.join(APP_ROOT, 'pkg')


unless ENV['rakefile_just_config']

task :default => [:dist, :package, :clean_package_source]

desc "Builds the distribution"
task :dist do
  $:.unshift File.join(APP_ROOT, 'lib')
  require 'protodoc'
  require 'fileutils'
  require 'sprockets'
  require 'json'
  FileUtils.mkdir_p APP_DIST_DIR
  
  secretary = Sprockets::Secretary.new(
    :root => APP_SRC_DIR,
    :asset_root => APP_DIST_DIR,
    :load_path => [ File.join(APP_SRC_DIR, '**/*') ],
    :source_files => [ File.join(APP_SRC_DIR, 'controllers/web_ui.js') ]
  )
  secretary.environment.constants.merge!('CONFIG_JSON' => secretary.environment.constants.to_json)
  Dir.chdir(APP_DIST_DIR) do
    secretary.concatenation.save_to(APP_FILE_NAME)
    FileUtils.copy_file APP_FILE_NAME, "#{APP_NAME}-#{APP_VERSION}.js"
  end
  FileUtils.copy_file "dist/#{APP_FILE_NAME}", "public/#{APP_FILE_NAME}"
  if File.directory?("website")
    FileUtils.mkdir_p "website/dist"
    FileUtils.copy_file "dist/#{APP_FILE_NAME}",       "website/dist/#{APP_FILE_NAME}"
    FileUtils.copy_file "dist/#{APP_FILE_NAME}",       "website/dist/#{APP_NAME}-#{APP_VERSION}.js"
  end
end
task :dist => :compress_script_loader

desc "Builds the distribution, runs the JavaScript unit + functional tests and collects their results."
task :test => [:dist, :test_units, :test_functionals]

require 'jstest'
desc "Runs all the JavaScript unit tests and collects the results"
JavaScriptTestTask.new(:test_units, 4711) do |t|
  testcases        = ENV['TESTCASES']
  tests_to_run     = ENV['TESTS']    && ENV['TESTS'].split(',')
  browsers_to_test = ENV['BROWSERS'] && ENV['BROWSERS'].split(',')

  t.mount("/dist")
  t.mount("/src")
  t.mount("/test")

  Dir["test/unit/*_test.html"].sort.each do |test_file|
    tests = testcases ? { :url => "/#{test_file}", :testcases => testcases } : "/#{test_file}"
    test_filename = test_file[/.*\/(.+?)\.html/, 1]
    t.run(tests) unless tests_to_run && !tests_to_run.include?(test_filename)
  end

  %w( safari firefox ie konqueror opera ).each do |browser|
    t.browser(browser.to_sym) unless browsers_to_test && !browsers_to_test.include?(browser)
  end
end

desc "Runs all the JavaScript functional tests and collects the results"
JavaScriptTestTask.new(:test_functionals, 4712) do |t|
  testcases        = ENV['TESTCASES']
  tests_to_run     = ENV['TESTS']    && ENV['TESTS'].split(',')
  browsers_to_test = ENV['BROWSERS'] && ENV['BROWSERS'].split(',')

  t.mount("/dist")
  t.mount("/src")
  t.mount("/test")

  Dir["test/functional/*_test.html"].sort.each do |test_file|
    tests = testcases ? { :url => "/#{test_file}", :testcases => testcases } : "/#{test_file}"
    test_filename = test_file[/.*\/(.+?)\.html/, 1]
    t.run(tests) unless tests_to_run && !tests_to_run.include?(test_filename)
  end

  %w( safari firefox ie konqueror opera ).each do |browser|
    t.browser(browser.to_sym) unless browsers_to_test && !browsers_to_test.include?(browser)
  end
end

task :clean_package_source do
  rm_rf File.join(APP_PKG_DIR, "#{APP_NAME}-#{APP_VERSION}")
end


task :compress_script_loader do
  root = File.dirname(__FILE__)
  src = File.join(root, 'src/lib/script_loader.js')
  jar = File.join(root, 'vendor/yuicompressor-2.4.2.jar')
  out = File.join(root, 'public/sl.js')
  pub = File.join(root, 'public/script_loader.js')
  
  system('java', '-jar', jar, '--type', 'js', '-o', out, src)
  FileUtils.cp(src, pub)
end



Dir['tasks/**/*.rake'].each { |rake| load rake }
end
