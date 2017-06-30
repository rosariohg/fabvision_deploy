
## Update

Despues de entrenar, sacamos los archivos:
 - retrained_graph.pb
 - retrained_labels.txt

## Run

```
docker build -t rosariohg/fabvision-tf .
docker run -d --name fabvision-tf -p 5000:5000 rosariohg/fabvision-tf
```