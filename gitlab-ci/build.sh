#!/bin/bash

registry="172.16.1.5:5000"

commit_sha=$1
tag=$2


if [ "$tag" != "" ]; then
    echo "tag: $tag"

    image_with_tag="$registry/voxwex/voxwex_websocket:$tag"
    latest="$registry/voxwex/voxwex_websocket:latest"
    if docker build --network host --cache-from $latest -f gitlab-ci/Dockerfile -t $image_with_tag . ; then
        docker tag $image_with_tag $latest
        docker push $image_with_tag
        docker push $latest
    fi

else
    latest="$registry/voxwex/voxwex_websocket:latest"
    if docker build --network host --cache-from $latest -f gitlab-ci/Dockerfile -t $latest . ; then
        docker push $latest
    fi
fi