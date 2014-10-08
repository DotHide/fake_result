# Gemfile
source 'https://rubygems.org'

# 基础必要的
gem 'rails', '4.1.6'
gem 'mysql2'
gem 'sass-rails'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.0.0'
gem 'jquery-rails'
gem 'turbolinks'
gem 'jbuilder', '~> 2.0'
gem 'sdoc', '~> 0.4.0',          group: :doc

# 开发必要的
group :development do
    gem 'spring'
    gem 'better_errors' # 更好地显示错误
    gem 'binding_of_caller' # 配合better_errors更好地调试变量

    # 测试专用组件 RSpec
    gem 'rspec-rails', '~> 2.14.0'
    gem 'factory_girl_rails', '~> 4.2.1'
end

# 测试必要的
group :test do
    gem 'faker', '~> 1.1.2'
    gem 'capybara', '~> 2.1.0'
    gem 'database_cleaner', '~> 1.0.1'
    gem 'launchy', '~> 2.3.0'
    gem 'selenium-webdriver', '~> 2.39.0'
end

# 生产时必要的
group :production do
    gem 'unicorn', '~> 4.8.3'
end

# 部署时必要的
gem 'mina', '~> 0.3.0'

# 常用组件
gem 'simple_form', '3.1.0.rc2' # 表单
gem 'bootstrap-sass', '~> 3.2.0' # CSS Style

# 辅助工具
gem 'high_voltage', '~> 2.2.1' # 静态页面助手
gem 'settingslogic', '~> 2.0.9' # 全局配置文件
gem 'bootstrap_helper' # Bootstrap搭配Rail时的帮助工具类（支持 will_paginate 和 simple_form 模板）