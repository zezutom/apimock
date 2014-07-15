# export NODE_CONFIG_DIR=~/workspace/nodejs/apimock-config/

# path to the configuration directory
export NODE_CONFIG_DIR="$1"

# script working directory
swd="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $swd

# start express
npm start
