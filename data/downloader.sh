#!/bin/sh

curl -i http://ichart.yahoo.com/table.csv?s=${1}.HK -o ${1}.csv