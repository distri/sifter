Sift through Images and Junx
============================

    require "./duct_tape"

    {applyStylesheet} = require "util"
    applyStylesheet require "./style"

    # async = require "./lib/async"

    S3Trinket = require "./lib/s3-trinket"

    trinket = S3Trinket(JSON.parse localStorage.TRINKET_POLICY)

Post edited images.

>     trinket.post "images", imgBlob, (namespacedSha) ->

After sifting post image sets.

>     trinket.post "image_sets", json, (namespacedSha) ->
