# librechat-mermaid-plugin
Provide the required service and plugin to create mermaid images within Librechat

## Build
docker build -t mermaid-api .
or
docker compose build

## Run
docker compose up -d

## Testing

### PNG Test

``` bash
curl -X POST -H "Content-Type: application/json" -d '{
  "code": "graph LR\n  A-->B;\n  B-->C;"
}' http://localhost:3000/png -o output.png
```

### SVG Test

``` bash
curl -X POST -H "Content-Type: application/json" -d '{
  "code": "graph LR\n  A-->B;\n  B-->C;"
}' http://localhost:3000/svg -o output.svg
```

### Wellknown Test

``` bash
curl http://localhost:3333/.well-known/ai-plugin.json
```
