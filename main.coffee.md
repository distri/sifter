Sift through Images and Junx
============================

    require "./duct_tape"

    {applyStylesheet} = require "util"
    applyStylesheet require "./style"

    # async = require "./lib/async"

    S3Trinket = require "./lib/s3-trinket"

    trinket = S3Trinket(JSON.parse localStorage.TRINKET_POLICY)

    trinket.loadWorkspace("master")
    .then (data) ->
      console.log "loaded workspace", data

Post edited images.

>     trinket.post "images", imgBlob, (namespacedSha) ->

After sifting post image sets.

>     trinket.post "image_sets", json, (namespacedSha) ->
