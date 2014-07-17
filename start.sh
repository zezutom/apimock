# path to the configuration directory
export NODE_CONFIG_DIR="$1"
echo "config dir: $NODE_CONFIG_DIR"

# script working directory
swd="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $swd

# start express
npm start
