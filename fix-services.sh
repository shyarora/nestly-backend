#!/bin/bash

# Fix logger configuration in all services
echo "🔧 Fixing logger configuration in all services..."

SERVICES=("auth-service" "booking-service" "payment-service" "review-service" "notification-service")

for SERVICE in "${SERVICES[@]}"; do
    echo "Fixing $SERVICE..."
    
    # Replace the problematic logger configuration
    sed -i '' '
    /logger: {/,/}/ {
        /logger: {/c\
  logger: true
        /level:/d
        /transport:/d
        /target:/d
        /}/d
    }
    ' "apps/$SERVICE/src/server.ts"
    
    # Also fix the context configuration
    sed -i '' '
    /context: async (request: any, reply: any) => {/,/},/ {
        /context: async (request: any, reply: any) => {/c\
        
        /return {/d
        /req: request,/d
        /reply: reply,/d
        /}/d
        /},/d
    }
    ' "apps/$SERVICE/src/server.ts"
    
    echo "✅ Fixed $SERVICE"
done

echo "🎉 All services fixed!"
