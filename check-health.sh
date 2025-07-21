#!/bin/bash

# Health check script for all Nestly microservices
# This script tests both REST and GraphQL health endpoints

echo "🏥 Nestly Backend Health Check"
echo "================================"
echo ""

# Define services with their ports and names
declare -A services=(
    ["5001"]="Property Service"
    ["5002"]="Auth Service"
)

# Function to test REST health endpoints
test_rest_health() {
    local port=$1
    local service_name=$2
    
    echo "🔍 Testing $service_name (Port $port)"
    echo "  REST Endpoints:"
    
    # Test livez endpoint
    livez_response=$(curl -s http://localhost:$port/livez)
    if [ $? -eq 0 ]; then
        echo "    ✅ /livez: $(echo $livez_response | jq -r '.status')"
    else
        echo "    ❌ /livez: Failed to connect"
        return 1
    fi
    
    # Test readyz endpoint
    readyz_response=$(curl -s http://localhost:$port/readyz)
    if [ $? -eq 0 ]; then
        echo "    ✅ /readyz: $(echo $readyz_response | jq -r '.status')"
    else
        echo "    ❌ /readyz: Failed to connect"
        return 1
    fi
}

# Function to test GraphQL health endpoints
test_graphql_health() {
    local port=$1
    local service_name=$2
    
    echo "  GraphQL Endpoints:"
    
    # Test GraphQL health query
    graphql_response=$(curl -s -X POST http://localhost:$port/graphql \
        -H "Content-Type: application/json" \
        -d '{"query": "{ livez readyz hello }"}')
    
    if [ $? -eq 0 ] && [[ $graphql_response == *'"data"'* ]]; then
        livez=$(echo $graphql_response | jq -r '.data.livez')
        readyz=$(echo $graphql_response | jq -r '.data.readyz')
        hello=$(echo $graphql_response | jq -r '.data.hello')
        
        echo "    ✅ GraphQL livez: $livez"
        echo "    ✅ GraphQL readyz: $readyz"
        echo "    ✅ GraphQL hello: $hello"
    else
        echo "    ❌ GraphQL: Failed to get valid response"
        return 1
    fi
}

# Test all running services
running_services=0
failed_services=0

for port in "${!services[@]}"; do
    service_name="${services[$port]}"
    
    # Check if service is running
    if curl -s http://localhost:$port/livez > /dev/null; then
        test_rest_health $port "$service_name"
        if [ $? -eq 0 ]; then
            test_graphql_health $port "$service_name"
            if [ $? -eq 0 ]; then
                echo "    🎉 $service_name is healthy!"
                ((running_services++))
            else
                ((failed_services++))
            fi
        else
            ((failed_services++))
        fi
    else
        echo "🔍 $service_name (Port $port)"
        echo "    ❌ Service not running or not responding"
        ((failed_services++))
    fi
    echo ""
done

# Test additional services that might be running
additional_ports=(5000 5003 5004 5005 5006)
additional_names=("API Gateway" "Booking Service" "Payment Service" "Review Service" "Notification Service")

for i in "${!additional_ports[@]}"; do
    port=${additional_ports[$i]}
    service_name=${additional_names[$i]}
    
    if curl -s http://localhost:$port/livez > /dev/null; then
        echo "🔍 $service_name (Port $port)"
        test_rest_health $port "$service_name"
        if [ $? -eq 0 ]; then
            test_graphql_health $port "$service_name"
            if [ $? -eq 0 ]; then
                echo "    🎉 $service_name is healthy!"
                ((running_services++))
            else
                ((failed_services++))
            fi
        else
            ((failed_services++))
        fi
        echo ""
    fi
done

# Summary
echo "📊 Health Check Summary"
echo "======================"
echo "✅ Running services: $running_services"
echo "❌ Failed services: $failed_services"
echo ""

if [ $running_services -gt 0 ]; then
    echo "🎯 GraphQL Playgrounds:"
    for port in "${!services[@]}"; do
        if curl -s http://localhost:$port/livez > /dev/null; then
            echo "   http://localhost:$port/graphql - ${services[$port]}"
        fi
    done
    
    for i in "${!additional_ports[@]}"; do
        port=${additional_ports[$i]}
        service_name=${additional_names[$i]}
        if curl -s http://localhost:$port/livez > /dev/null; then
            echo "   http://localhost:$port/graphql - $service_name"
        fi
    done
    echo ""
fi

echo "🚀 To start more services:"
echo "   pnpm dev                    # Start all services"
echo "   pnpm --filter booking-service dev  # Start specific service"
echo ""

if [ $failed_services -eq 0 ] && [ $running_services -gt 0 ]; then
    echo "🎉 All running services are healthy!"
    exit 0
else
    echo "⚠️  Some services have issues or are not running"
    exit 1
fi
