S3 Trinket
==========

    S3 = require "s3"
    SHA1 = require "sha1"

    module.exports = (policy) ->
      uploader = S3.uploader(policy)

      user = getUserFromPolicy(policy)
      base = "http://#{policy.bucket}.s3.amazonaws.com/#{user}"

Post a blob to S3 using the given namespace as a content addressable store.

      post: (namespace, blob) ->
        blobToS3 uploader, "#{user}#{namespace}", blob

      loadWorkspace: (name) ->
        $.getJSON "#{base}workspaces/#{name}.json"

      saveWorkspace: (name, data) ->
        uploader.upload
          key: "#{user}workspaces/#{name}.json"
          blob: new Blob [JSON.stringify(data)], type: "application/json"
          cacheControl: 60

      list: (namespace="") ->
        namespace = "#{namespace}"

        url = "#{base}#{namespace}"

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
