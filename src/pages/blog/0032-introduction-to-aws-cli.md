---
layout: base.webc
tags: posts
date: 2022-05-17
---
# AWS cli introduction

Everything* you can do from web aws management console you can do from the
command line.

In this article we'll talk about aws cli and what does it can do.

## Installing

Follow [these instructions](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

For linux, as present in docs, just unzip the contents and execute the script:

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

After that, login using your [AWS credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-creds-create).

Issue the following command on terminal and provide *username*, *access key* and
*secret key*. And your default region too.

```bash
aws configure
```

Now this part is important, add the following line into your *.bashrc* file:

```bash
# bashrc file
complete -C '/usr/local/bin/aws_completer' aws
```

Without that, the terminal will be unable to autocomplete the hundreds of
commands and subcommands that aws cli has to offer.

If you don't user bash, where are the
[detailed instructions](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-completion.html).

## What to do with that?

Pretty much everything.

For example, you can perform S3 operations:

```bash
[sombriks@ignis Documentos]$ aws s3api create-bucket --bucket my-sample-bucket

An error occurred (BucketAlreadyExists) when calling the CreateBucket operation: The requested bucket name is not available. The bucket namespace is shared by all users of the system. Please select a different name and try again.
[sombriks@ignis Documentos]$ aws s3api create-bucket --bucket my-sample-bucket-xpto
{
    "Location": "/my-sample-bucket-xpto"
}
[sombriks@ignis Documentos]$ aws s3 cp ./file.out.txt s3://my-sample-bucket-xpto/file.out.txt
upload: ./file.out.txt to s3://my-sample-bucket-xpto/file.out.txt
[sombriks@ignis Documentos]$ 
```

The you can visit the
[aws management console](https://s3.console.aws.amazon.com/s3/buckets/my-sample-bucket-xpto?region=us-east-1&tab=objects)
and see your file:

![post-0032-aws-management-console](/assets/post-pics/0032-introduction-to-aws-cli/s3-buckets.png)

Remember to not keep unnecessary resources draining your credit card on aws.
Delete the file and the bucket, either using the web console or the cli.

## Further steps

You can manage the
[static site publishing](https://github.com/sombriks/sample-static-site-on-s3-example) easily.

The advantage to use the cli tool instead of web panel is the script creation.

With enough practice and docs reading you can automate your production pipeline
entirely.

[*] unless there is a nasty bug.
