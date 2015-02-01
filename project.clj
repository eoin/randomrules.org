(defproject application "0.0.1"
  :description "randomrules.org"
  :url "http://randomrules.org"
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/clojurescript "0.0-2725"]]
  :plugins [[lein-cljsbuild "1.0.4"]]
  :source-paths ["src"]
  :clean-targets ["public/assets/js/application.js" "target"]
  :cljsbuild {
    :builds [{:source-paths ["src"]
              :compiler {
                :output-to "public/assets/js/application.js"}}]})
