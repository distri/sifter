Sift through Images and Junx
============================

    require "./duct_tape"

    {applyStylesheet} = require "util"
    applyStylesheet require "./style"

    # async = require "./lib/async"

    S3Trinket = require "s3-trinket"
    Storage = require "storage"
    storage = Storage.new("sifter")

    trinket = S3Trinket(JSON.parse localStorage.TRINKET_POLICY)

    # trinket.loadWorkspace("master").then (data) ->
    #   console.log data

    $("body").on "click", "img", ->
      $(this).toggleClass "selected"
    
    urlForKey = (key) ->
      n = parseInt key.slice(-1), 0x10
      if isNaN(n)
        n = 0
      else
        n = n % 4

      "http://t#{n}.pixiecdn.com/#{key}"

    $("body").append $ "<button>",
      text: "Save"
      click: ->
        if name = prompt "yolo"
          data = $("img.selected").map ->
            $(this).attr("src")
          .get()
  
          trinket.saveWorkspace name, data
          console.log name, data

    template = require "./templates/main"
    view = template
      url: urlForKey

      keys: storage.get("recentImages") or []

    document.body.appendChild(view)

    appendRecentImage = (key) ->
      recentImages = storage.get("recentImages") or []
      if recentImages.indexOf(key) is -1
        recentImages.push key

      storage.set "recentImages", recentImages

    addEventListener "message", (event) ->
      {data, origin, source} = event

      if data.key
        appendRecentImage data.key

      # Send back info for debugging
      source.postMessage
        data: data
        origin: origin
      , "*"

    loadAll = ->
      $.get("http://trinket.s3.amazonaws.com/?prefix=18894/data").then (data) ->
        $(data).find("Key").map ->
          this.innerHTML
        .get()
      .then (data) ->
        console.log data
        data.map (datum) ->
          urlForKey(datum)
      .then (data) ->
        console.log data
        data.forEach (src) ->
          $(".images").append $ "<img>",
            src: src

    trinket.loadWorkspace("stuff")
    .then (data) ->
      data.forEach (src) ->
        $(".images").append $ "<img>",
          src: src
