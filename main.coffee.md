Sift through Images and Junx
============================

    require "./duct_tape"

    {applyStylesheet} = require "util"
    applyStylesheet require "./style"

    # async = require "./lib/async"

    S3Trinket = require "s3-trinket"

    trinket = S3Trinket(JSON.parse localStorage.TRINKET_POLICY)

    trinket.loadWorkspace("master").then (data) ->
      console.log data
