#!/bin/bash

# Kill all Nestly backend services script
# This script stops all running microservices on ports 5000-5006

echo "🛑 Stopping Nestly Backend Services"
echo "===================================="
echo ""

# Define service ports
ports=(5000 5001 5002 5003 5004 5005 5006)
service_names=("API Gateway" "Property Service" "Auth Service" "Booking Service" "Payment Service" "Review Service" "Notification Service")

stopped_services=0
not_running=0

# Kill processes on each port
for i in "${!ports[@]}"; do
    port=${ports[$i]}
    service_name=${service_names[$i]}
    
    echo "🔍 Checking $service_name (Port $port)..."
    
    # Find processes using the port
    pids=$(lsof -ti:$port 2>/dev/null)
    
    if [ ! -z "$pids" ]; then
        echo "  🛑 Stopping processes: $pids"
        kill -9 $pids 2>/dev/null
        if [ $? -eq 0 ]; then
            echo "  ✅ $service_name stopped successfully"
            ((stopped_services++))
        else
            echo "  ❌ Failed to stop $service_name"
        fi
    else
        echo "  ⚪ $service_name was not running"
        ((not_running++))
    fi
done

echo ""

# Also kill any tsx watch processes (development mode)
echo "🔍 Checking for tsx watch processes..."
tsx_pids=$(pgrep -f "tsx watch" 2>/dev/null)
if [ ! -z "$tsx_pids" ]; then
    echo "  🛑 Stopping tsx watch processes: $tsx_pids"
    kill -9 $tsx_pids 2>/dev/null
    echo "  ✅ All tsx watch processes stopped"
else
    echo "  ⚪ No tsx watch processes running"
fi

echo ""

# Kill any turbo dev processes
echo "🔍 Checking for turbo dev processes..."
turbo_pids=$(pgrep -f "turbo run dev" 2>/dev/null)
if [ ! -z "$turbo_pids" ]; then
    echo "  🛑 Stopping turbo dev processes: $turbo_pids"
    kill -9 $turbo_pids 2>/dev/null
    echo "  ✅ All turbo dev processes stopped"
else
    echo "  ⚪ No turbo dev processes running"
fi

echo ""
echo "📊 Summary"
echo "=========="
echo "🛑 Services stopped: $stopped_services"
echo "⚪ Services not running: $not_running"
echo ""

if [ $stopped_services -gt 0 ]; then
    echo "✅ All running services have been stopped successfully!"
else
    echo "ℹ️  No services were running"
fi

echo ""
echo "🚀 To start services again:"
echo "   pnpm dev                    # Start all services"
echo "   pnpm dev:gateway            # Start API Gateway only"
echo ""
