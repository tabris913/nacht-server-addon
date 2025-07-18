#!/bin/bash -e

usage_exit() {
  echo "Usage $0 [-h] [-b, --behavior] [-d, --dist] [-s, --src] [-r, --resource]" 1>&2
  echo
  echo optional arguments:
  echo "  -h, --help            show this help message and exit"
  echo "  -b, --behavior        build behavior pack"
  echo "  -d, --dist            only make dist directory"
  echo "  -s, --s               build ts source"
  echo "  -r, --resource        build resource pack"
  exit 1
}

# default
BEHAVIOR=
SOURCE=
RESOURCE=

echo $1

if [ "$1" = "" -o "$1" = "-d" -o "$1" = "--dist" ]; then
  BEHAVIOR=1
  SOURCE=1
  RESOURCE=1
fi

OPTIONS=`getopt -o hbdsr -l help,behavior,dist,source,resource -- "$@"`
eval set -- "$OPTIONS"
while true
do
  case $1 in
    -h|--help)
      usage_exit
      ;;
    -b|--behavior)
      BEHAVIOR=1
      shift
      ;;
    -d|--dist)
      DIST=1
      shift
      ;;
    -s|--source)
      SOURCE=1
      shift
      ;;
    -r|--resource)
      RESOURCE=1
      shift
      ;;
    --)
      shift
      break
      ;;
  esac
done

# remove dir
if [ "$BEHAVIOR" = 1 -a "$SOURCE" = 1 -a "$RESOURCE" = 1 ]; then
  rm -rf dist/*
  mkdir dist/nacht_server_BP dist/nacht_server_RP
  if [ "$DIST" != "1" ]; then
    rm -rf ../development_behavior_packs/nacht_server_BP ../development_resource_packs/nacht_server_RP
    mkdir ../development_behavior_packs/nacht_server_BP ../development_resource_packs/nacht_server_RP
  fi
elif [ "$BEHAVIOR" = 1 -a "$SOURCE" = 1 ]; then
  rm -rf dist/nacht_server_BP
  mkdir dist/nacht_server_BP
  if [ "$DIST" != "1" ]; then
    rm -rf ../development_behavior_packs/nacht_server_BP
    mkdir ../development_behavior_packs/nacht_server_BP
  fi
else
  if [ "$BEHAVIOR" = 1 ]; then
    for d in `ls dist/nacht_server_BP`; do
      if [ -d "dist/nacht_server_BP/$d" -a "$d" != "scripts" ]; then
        rm -rf dist/nacht_server_BP/$d
        if [ "$DIST" != "1" ]; then
          rm -rf ../development_behavior_packs/nacht_server_BP/$d
        fi
      fi
    done
  fi
  if [ "$SOURCE" = 1 ]; then
    rm -rf dist/nacht_server_BP/scripts
    if [ "$DIST" != "1" ]; then
      rm -rf ../development_behavior_packs/nacht_server_BP/scripts
    fi
  fi
  if [ "$RESOURCE" = 1 ]; then
    rm -rf dist/nacht_server_RP
    if [ "$DIST" != "1" ]; then
      rm -rf ../development_resource_packs/nacht_server_RP
    fi
  fi
fi

# build or copy
if [ "$SOURCE" = 1 ]; then
  rm -rf nacht_server_BP/scripts/
  npx tsc
  mkdir nacht_server_BP/scripts/types
  cp node_modules/@minecraft/vanilla-data/lib/index.js nacht_server_BP/scripts/types/

  cp -r nacht_server_BP/scripts dist/nacht_server_BP/
  if [ "$DIST" != "1" ]; then
    cp -r dist/nacht_server_BP ../development_behavior_packs
  fi
fi

if [ "$BEHAVIOR" = 1 ]; then
  for d in `ls nacht_server_BP`; do
    if [ -d "nacht_server_BP/$d" -a "$d" != "scripts" -a "$d" != "src" ]; then
      cp -r nacht_server_BP/$d dist/nacht_server_BP/
    fi
  done

  if [ "$DIST" != "1" ]; then
    cp -r dist/nacht_server_BP ../development_behavior_packs
  fi
fi

if [ "$SOURCE" = 1 -o "$BEHAVIOR" = 1 ]; then
  cp nacht_server_BP/manifest.json nacht_server_BP/pack_icon.png dist/nacht_server_BP/
  if [ "$DIST" != "1" ]; then
    cp -r dist/nacht_server_BP ../development_behavior_packs
  fi
fi

if [ "$RESOURCE" = 1 ]; then
  cp -r nacht_server_RP dist/

  if [ "$DIST" != "1" ]; then
    cp -r dist/nacht_server_RP ../development_resource_packs
  fi
fi
