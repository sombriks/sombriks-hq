---
layout: blog.pug
tags: 
  - posts
  - aws
  - aws-cli
  - ec2
date: 2022-06-21
---
# Simple ec2 management from command line

Launch [EC2 instances](https://aws.amazon.com/ec2/) is the level zero for cloud
computing. You can manage most of it using online console, but of course there
is a way to handle it from command line.

## Make sure you have a default vpc

First of all, make sure you have a default vpc:

```bash
aws ec2 create-default-vpc
```

You will need it in order to add firewall exceptions
[among other things](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html).

## Create an ssh key

In order to access your computers in the cloud, a ssh key is needed. You can
create it from command line too:

```bash
aws ec2 create-key-pair --key-name default-key > default-key.json
```

It's a bit trickier than doing it from web console because the key content comes
encoded inside the json output. So you can use a few command line tools to
proper extract the key from it:

```bash
X=$(cat default-key.json | jq .KeyMaterial) ; echo -e $X > default-key.pem
sed -i 's/"//g' default-key.pem
chmod 400 default-key.pem
```

While [jq](https://stedolan.github.io/jq/) extracts the raw key content from
json file, `echo -e`  interprets the line breakers and finally sed removes the
dangling double quotes. Finally, key files should have read-only permissions.

## Launch an EC2 instance

```bash
aws ec2 run-instances --image-id ami-0cff7528ff583bf9a --region us-east-1 --instance-type t2.small --key-name default-key
```

It's very important to provide a key otherwise you won't be able to log in into
the new machine.

The instance type tells which resources you want to provide to this computer
(cpu, memory, etc).

You must provide an image id so EC2 knows which kind of operating system you
want.

For a complete list of image ids try `aws ec2 describe-images` (a little slow).

## Connecting into the machine

First figure out the machine name:

```bash
aws ec2 describe-instances | jq ".Reservations[].Instances[].PublicDnsName"
"ec2-3-219-31-221.compute-1.amazonaws.com"
```

Then connect into it using your key file:

```bash
ssh -i default-key.pem ec2-user@ec2-3-219-31-221.compute-1.amazonaws.com
```

Important note, the selected image is amazon linux which comes with this handy
user pre-configured, some other images might not come with it.

Also, your security group might not have ssh port open,
[add the rule if needed](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/authorizing-access-to-an-instance.html#add-rule-authorize-access).

## Clean up

```bash
aws ec2 terminate-instances --instance-ids i-00491fb41d556a2bd
```

The machine might be listed for a while, but eventually it will disappear.
