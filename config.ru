require "catapult"

map "/assets" do
  run Catapult.environment
end

use Rack::Static,
  root: Catapult.root.join("public"),
  urls: %w[/],
  index: ["index.html"]

run lambda {|env|
  [404, {}, ["Not found"]]
}
