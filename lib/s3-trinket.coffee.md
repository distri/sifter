S3 Trinket
==========

    base = "http://trinket.s3.amazonaws.com/"

    S3 = require "s3"
    SHA1 = require "sha1"

    module.exports = (policy) ->
      uploader = S3.uploader(policy)

      user = getUserFromPolicy(policy)

Post a blob to S3 using the given namespace as a content addressable store.

      post: (namespace, blob) ->
        blobToS3 uploader, "#{user}#{namespace}", blob

      get: (namespace="") ->
        namespace = "#{namespace}"

        url = "#{base}#{user}#{namespace}"

        $.get(url).then (data) ->
          $(data).find("Key").map ->
            this.innerHTML
          .get()

To get a census of all the items we need to list them, then perform a HEAD
request to get the Content-Type.

This will let us partition the items into images, and json data.

      census: (namespace="") ->
        namespace = "/#{namespace}"

        url = "#{base}#{userId}#{namespace}"

        $.get(url).then (data) ->
          $(data).find("Key").map ->
            this.innerHTML
          .get()

Helpers
-------

    blobToS3 = (uploader, namespace, blob) ->
      SHA1 blob, (sha) ->
        key = "#{namespace}/#{sha}"

        uploader.upload
          key: key
          blob: blob

    getUserFromPolicy = (policy) ->
      conditions = JSON.parse(atob(policy.policy)).conditions.filter ([a, b, c]) ->
        a is "starts-with" and b is "$key"

      conditions[0][2]
