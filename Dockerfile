FROM node:18 as build

WORKDIR /app

# Install Angular CLI 14 instead of 13
RUN npm install -g @angular/cli@14

# Accept build arguments
ARG BUILD_VERSION
ARG SKIP_LIB_CHECK=false

COPY package*.json ./
RUN npm install

COPY . .

RUN if [ "$SKIP_LIB_CHECK" = "true" ]; then \
        echo "Enabling skipLibCheck in tsconfig.json"; \
        # Find all tsconfig.json files and add skipLibCheck: true to their compilerOptions
        find . -name "tsconfig*.json" -type f -exec \
            sed -i 's/"compilerOptions": {/"compilerOptions": {\n    "skipLibCheck": true,/g' {} \; ;\
    else \
        echo "Building with default TypeScript configuration"; \
    fi

# Build the Angular application
RUN ng build --configuration=production --optimization=true

FROM nginx:alpine
LABEL description="Angular SynthETA Application"

RUN rm -rf /etc/nginx/conf.d/*

COPY nginx/default.conf /etc/nginx/conf.d/

COPY --from=build /app/dist/syntheta/ /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O /dev/null http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
