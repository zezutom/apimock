echo "Stopping all node instances .."
killall node

cwd=$(pwd)
echo "Starting apimock.."
nohup ../../start.sh $cwd/client/config  > $cwd/logs/apimock.log 2>&1 &

echo "Starting authentication service .."
cd $cwd/service
nohup npm start > $cwd/logs/service.log 2>&1 &

echo "Starting the client .."
cd $cwd/client
nohup npm start > $cwd/logs/client.log 2>&1 &

cd $cwd
echo "Done"
