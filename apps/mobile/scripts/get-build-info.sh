#!/bin/bash

PLATFORM=$1
IOS_BUILD_ID=$2
ANDROID_BUILD_ID=$3

if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "all" ]]; then
    IOS_DATA=$(eas build:view $IOS_BUILD_ID --json)
    IOS_BUILD_NUMBER=$(echo $IOS_DATA | jq -r '.ios.buildNumber')
    IOS_ID=$(echo $IOS_DATA | jq -r '.id')
    IOS_URL="https://expo.dev/accounts/chewybytes/projects/cuurly/builds/$IOS_ID"
    echo "ios_build_number=$IOS_BUILD_NUMBER" >> $GITHUB_OUTPUT
    echo "ios_url=$IOS_URL" >> $GITHUB_OUTPUT
fi

if [[ "$PLATFORM" == "android" || "$PLATFORM" == "all" ]]; then
    ANDROID_DATA=$(eas build:view $ANDROID_BUILD_ID --json)
    ANDROID_BUILD_NUMBER=$(echo $ANDROID_DATA | jq -r '.android.versionCode')
    ANDROID_ID=$(echo $ANDROID_DATA | jq -r '.id')
    ANDROID_URL="https://expo.dev/accounts/chewybytes/projects/cuurly/builds/$ANDROID_ID"
    echo "android_build_number=$ANDROID_BUILD_NUMBER" >> $GITHUB_OUTPUT
    echo "android_url=$ANDROID_URL" >> $GITHUB_OUTPUT
fi