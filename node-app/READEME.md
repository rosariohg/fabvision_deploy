## Run

```
docker build -t rosariohg/fabvision-app .
docker run -d --name fabvision-app -p 80:4000 rosariohg/fabvision-app
```


## Deploy

```
ecs-cli configure --region us-east-1 --cluster fabvision
ecs-cli up --keypair fabvision_kp --capability-iam --size 2 --instance-type t2.micro
```